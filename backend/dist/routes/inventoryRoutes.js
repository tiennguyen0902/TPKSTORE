"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/inventory/tickets - Danh sách phiếu xuất/nhập kho (Admin, Manager, Staff)
router.get("/tickets", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER", "STAFF"]), async (req, res) => {
    try {
        const { status, type, search, mine, staff } = req.query;
        const where = {};
        if (status && status !== "ALL") {
            where.status = status;
        }
        if (type && type !== "ALL") {
            where.type = type;
        }
        if (staff && staff !== "ALL") {
            where.requestedByUserId = String(staff);
        }
        if (mine === "true" && req.user) {
            where.requestedByUserId = req.user.id;
        }
        const tickets = await db_1.db.stockTicket.findMany({
            where,
            include: {
                product: true,
                requestedByUser: {
                    select: { id: true, fullName: true, role: true, email: true }
                },
                approvedByUser: {
                    select: { id: true, fullName: true, role: true, email: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        let filtered = tickets;
        if (search && String(search).trim()) {
            const q = String(search).trim().toLowerCase();
            filtered = tickets.filter((t) => (t.product?.name && t.product.name.toLowerCase().includes(q)) ||
                (t.productName && String(t.productName).toLowerCase().includes(q)) ||
                (t.reason && t.reason.toLowerCase().includes(q)) ||
                (t.requestedByUser?.fullName && t.requestedByUser.fullName.toLowerCase().includes(q)) ||
                (t.id && t.id.toLowerCase().includes(q)));
        }
        const formattedTickets = filtered.map((t) => ({
            ...t,
            productName: t.product?.name || t.productName || "Sản phẩm",
            productThumbnail: t.product?.thumbnail || t.productThumbnail || "",
            requestedByName: t.requestedByUser?.fullName || t.requestedByName || "Nhân viên",
            requestedByRole: t.requestedByUser?.role || t.requestedByRole || "STAFF",
            approvedByName: t.approvedByUser?.fullName || t.approvedByName || null
        }));
        return res.json({
            total: formattedTickets.length,
            tickets: formattedTickets
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi lấy danh sách phiếu kho: " + err.message });
    }
});
// GET /api/inventory/summary - Thống kê kho & phiếu (Admin, Manager, Staff)
router.get("/summary", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER", "STAFF"]), async (req, res) => {
    try {
        const allTickets = await db_1.db.stockTicket.findMany({});
        const pendingCount = allTickets.filter((t) => t.status === "PENDING").length;
        const approvedCount = allTickets.filter((t) => t.status === "APPROVED").length;
        const rejectedCount = allTickets.filter((t) => t.status === "REJECTED").length;
        const allProducts = await db_1.db.product.findMany({});
        const totalStock = allProducts.reduce((sum, p) => {
            const stockNum = typeof p.stock === "number" ? p.stock : (parseInt(String(p.stock)) || 0);
            return sum + stockNum;
        }, 0);
        const lowStockCount = allProducts.filter((p) => {
            const stockNum = typeof p.stock === "number" ? p.stock : (parseInt(String(p.stock)) || 0);
            return stockNum <= 5;
        }).length;
        return res.json({
            tickets: {
                total: allTickets.length,
                pending: pendingCount,
                approved: approvedCount,
                rejected: rejectedCount
            },
            warehouse: {
                totalProducts: allProducts.length,
                totalStock,
                lowStockCount
            }
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi thống kê kho: " + err.message });
    }
});
// GET /api/inventory/movements - Nhật ký biến động tồn kho bất biến (Admin & Manager)
router.get("/movements", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER"]), async (req, res) => {
    try {
        const { productId, type } = req.query;
        const where = {};
        if (productId)
            where.productId = String(productId);
        if (type)
            where.type = String(type);
        const movements = await db_1.db.stockMovement.findMany({
            where,
            include: {
                product: { select: { id: true, name: true, thumbnail: true } },
                createdBy: { select: { id: true, fullName: true, role: true } }
            },
            orderBy: { createdAt: "desc" }
        });
        return res.json({
            total: movements.length,
            movements
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi lấy nhật ký biến động kho: " + err.message });
    }
});
// POST /api/inventory/tickets - Tạo phiếu yêu cầu nhập/xuất kho
// Quy chuẩn RBAC: STAFF chỉ được tạo yêu cầu EXPORT; MANAGER & ADMIN được tạo cả IMPORT & EXPORT
router.post("/tickets", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER", "STAFF"]), async (req, res) => {
    try {
        const user = req.user;
        const { productId, type, quantity, reason, note } = req.body;
        if (!productId || !type || !quantity || !reason) {
            return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ: Sản phẩm, Loại phiếu (Nhập/Xuất), Số lượng và Lý do." });
        }
        if (!["IMPORT", "EXPORT"].includes(type)) {
            return res.status(400).json({ error: "Loại phiếu phải là 'IMPORT' (Nhập kho) hoặc 'EXPORT' (Xuất kho)." });
        }
        // RBAC: STAFF chỉ được tạo phiếu EXPORT (Xuất kho), không được tạo IMPORT (Nhập kho)
        if (user.role === "STAFF" && type !== "EXPORT") {
            return res.status(403).json({
                error: "Quyền hạn bị từ chối: Nhân viên (STAFF) chỉ được tạo yêu cầu Xuất kho (EXPORT), không có quyền lập phiếu Nhập kho!"
            });
        }
        const qty = parseInt(quantity, 10);
        if (isNaN(qty) || qty <= 0) {
            return res.status(400).json({ error: "Số lượng phải là số nguyên dương lớn hơn 0." });
        }
        const product = await db_1.db.product.findFirst({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm trong kho." });
        }
        const currentStock = typeof product.stock === "number" ? product.stock : (parseInt(String(product.stock)) || 0);
        // Nếu là xuất kho, kiểm tra xem tồn kho hiện tại có đủ không
        if (type === "EXPORT" && currentStock < qty) {
            return res.status(400).json({
                error: `Số lượng xuất (${qty}) vượt quá số lượng tồn kho khả dụng hiện có (${currentStock} SP)!`
            });
        }
        const newTicket = await db_1.db.stockTicket.create({
            data: {
                type,
                productId,
                quantity: qty,
                reason,
                note: note || "",
                requestedByUserId: user.id,
                status: "PENDING"
            },
            include: {
                product: true,
                requestedByUser: {
                    select: { id: true, fullName: true, role: true }
                }
            }
        });
        const formattedTicket = {
            ...newTicket,
            productName: product.name,
            productThumbnail: product.thumbnail,
            requestedByName: user.fullName,
            requestedByRole: user.role
        };
        return res.status(201).json({
            message: type === "IMPORT"
                ? "Đã lập phiếu yêu cầu nhập kho thành công! Đang ở trạng thái PENDING chờ Quản lý duyệt."
                : "Đã lập phiếu yêu cầu xuất kho thành công! Đang ở trạng thái PENDING chờ Quản lý duyệt.",
            ticket: formattedTicket
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi tạo phiếu kho: " + err.message });
    }
});
// PUT /api/inventory/tickets/:id/approve - Quản lý hoặc Admin PHÊ DUYỆT phiếu kho
// Thực thi Transaction: 1. Kiểm tra tồn kho -> 2. Cập nhật Product.stock -> 3. Ghi StockMovement -> 4. Cập nhật StockTicket APPROVED
router.put("/tickets/:id/approve", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER"]), async (req, res) => {
    try {
        const ticketId = req.params.id;
        const approver = req.user;
        const ticket = await db_1.db.stockTicket.findFirst({
            where: { id: ticketId },
            include: { product: true }
        });
        if (!ticket) {
            return res.status(404).json({ error: "Không tìm thấy phiếu kho." });
        }
        if (ticket.status !== "PENDING") {
            return res.status(400).json({
                error: `Phiếu này đã được xử lý trước đó với trạng thái: ${ticket.status === "APPROVED" ? "ĐÃ DUYỆT" : "ĐÃ TỪ CHỐI"}.`
            });
        }
        const result = await db_1.db.$transaction(async (tx) => {
            const product = await tx.product.findUnique({ where: { id: ticket.productId } });
            if (!product) {
                throw new Error("Sản phẩm liên kết với phiếu này không còn tồn tại trong kho.");
            }
            const beforeStock = typeof product.stock === "number" ? product.stock : (parseInt(String(product.stock)) || 0);
            let afterStock = beforeStock;
            if (ticket.type === "EXPORT") {
                if (beforeStock < ticket.quantity) {
                    throw new Error(`Không thể duyệt xuất kho! Tồn kho hiện tại (${beforeStock} SP) nhỏ hơn số lượng yêu cầu xuất (${ticket.quantity} SP).`);
                }
                afterStock = beforeStock - ticket.quantity;
            }
            else if (ticket.type === "IMPORT") {
                afterStock = beforeStock + ticket.quantity;
            }
            // 1. Cập nhật tồn kho sản phẩm
            const updatedProduct = await tx.product.update({
                where: { id: ticket.productId },
                data: { stock: afterStock }
            });
            // 2. Ghi nhật ký bất biến StockMovement
            await tx.stockMovement.create({
                data: {
                    productId: ticket.productId,
                    quantity: ticket.quantity,
                    type: ticket.type,
                    beforeStock,
                    afterStock,
                    referenceId: ticket.id,
                    createdById: approver.id,
                    note: `Duyệt phiếu ${ticket.type === "IMPORT" ? "nhập" : "xuất"} kho: ${ticket.reason}`
                }
            });
            // 3. Cập nhật trạng thái phiếu kho
            const updatedTicket = await tx.stockTicket.update({
                where: { id: ticketId },
                data: {
                    status: "APPROVED",
                    approvedByUserId: approver.id,
                    approvedAt: new Date()
                },
                include: {
                    product: true,
                    requestedByUser: { select: { id: true, fullName: true, role: true } },
                    approvedByUser: { select: { id: true, fullName: true, role: true } }
                }
            });
            return { updatedProduct, updatedTicket };
        });
        return res.json({
            message: `Đã phê duyệt thành công phiếu ${ticket.type === "IMPORT" ? "NHẬP KHO" : "XUẤT KHO"}! Tồn kho sản phẩm "${result.updatedProduct.name}" hiện tại là ${result.updatedProduct.stock} SP.`,
            ticket: {
                ...result.updatedTicket,
                productName: result.updatedProduct.name,
                productThumbnail: result.updatedProduct.thumbnail,
                approvedByName: approver.fullName
            },
            newStock: result.updatedProduct.stock
        });
    }
    catch (err) {
        const status = err.message?.includes("Không thể duyệt xuất kho") ? 400 : 500;
        return res.status(status).json({ error: "Lỗi phê duyệt phiếu: " + err.message });
    }
});
// PUT /api/inventory/tickets/:id/reject - Quản lý hoặc Admin TỪ CHỐI phiếu kho
router.put("/tickets/:id/reject", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER"]), async (req, res) => {
    try {
        const ticketId = req.params.id;
        const { reason } = req.body;
        const ticket = await db_1.db.stockTicket.findFirst({ where: { id: ticketId } });
        if (!ticket) {
            return res.status(404).json({ error: "Không tìm thấy phiếu kho." });
        }
        if (ticket.status !== "PENDING") {
            return res.status(400).json({
                error: `Phiếu này đã được xử lý trước đó với trạng thái: ${ticket.status === "APPROVED" ? "ĐÃ DUYỆT" : "ĐÃ TỪ CHỐI"}.`
            });
        }
        const approver = req.user;
        const updatedTicket = await db_1.db.stockTicket.update({
            where: { id: ticketId },
            data: {
                status: "REJECTED",
                approvedByUserId: approver.id,
                approvedAt: new Date(),
                rejectReason: reason || "Không được Quản lý kho phê duyệt"
            },
            include: {
                product: true,
                requestedByUser: { select: { id: true, fullName: true, role: true } }
            }
        });
        return res.json({
            message: `Đã từ chối phiếu kho thành công!`,
            ticket: updatedTicket
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi từ chối phiếu: " + err.message });
    }
});
exports.default = router;

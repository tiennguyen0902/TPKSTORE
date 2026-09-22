"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/inventory/tickets - Danh sách phiếu xuất/nhập kho (Admin, Manager, Staff)
router.get("/tickets", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER", "STAFF"]), async (req, res) => {
    try {
        const { status, type, search, mine } = req.query;
        const where = {};
        if (status && status !== "ALL") {
            where.status = status;
        }
        if (type && type !== "ALL") {
            where.type = type;
        }
        if (search) {
            where.search = String(search);
        }
        if (mine === "true" && req.user) {
            where.requestedByUserId = req.user.id;
        }
        const tickets = await db_1.db.stockTicket.findMany({ where });
        return res.json({
            total: tickets.length,
            tickets
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
// POST /api/inventory/tickets - Tạo phiếu yêu cầu nhập/xuất kho (Nhân viên, Quản lý, Admin)
router.post("/tickets", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER", "STAFF"]), async (req, res) => {
    try {
        const { productId, type, quantity, reason, note } = req.body;
        if (!productId || !type || !quantity || !reason) {
            return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ: Sản phẩm, Loại phiếu (Nhập/Xuất), Số lượng và Lý do." });
        }
        if (!["IMPORT", "EXPORT"].includes(type)) {
            return res.status(400).json({ error: "Loại phiếu phải là 'IMPORT' (Nhập kho) hoặc 'EXPORT' (Xuất kho)." });
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
        const user = req.user;
        const isAutoApproved = user.role === "MANAGER" || user.role === "ADMIN";
        const newTicketData = {
            type,
            productId,
            productName: product.name,
            productThumbnail: product.thumbnail,
            quantity: qty,
            reason,
            note: note || "",
            requestedByUserId: user.id,
            requestedByName: user.fullName,
            requestedByRole: user.role,
            status: "PENDING",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const newTicket = await db_1.db.stockTicket.create({ data: newTicketData });
        return res.status(201).json({
            message: type === "IMPORT"
                ? "Đã lập phiếu yêu cầu nhập kho thành công! Đang chờ Quản lý duyệt."
                : "Đã lập phiếu yêu cầu xuất kho thành công! Đang chờ Quản lý duyệt.",
            ticket: newTicket
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi tạo phiếu kho: " + err.message });
    }
});
// PUT /api/inventory/tickets/:id/approve - Quản lý hoặc Admin PHÊ DUYỆT phiếu kho
router.put("/tickets/:id/approve", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER"]), async (req, res) => {
    try {
        const ticketId = req.params.id;
        const ticket = await db_1.db.stockTicket.findFirst({ where: { id: ticketId } });
        if (!ticket) {
            return res.status(404).json({ error: "Không tìm thấy phiếu kho." });
        }
        if (ticket.status !== "PENDING") {
            return res.status(400).json({
                error: `Phiếu này đã được xử lý trước đó với trạng thái: ${ticket.status === "APPROVED" ? "ĐÃ DUYỆT" : "ĐÃ TỪ CHỐI"}.`
            });
        }
        const product = await db_1.db.product.findFirst({ where: { id: ticket.productId } });
        if (!product) {
            return res.status(404).json({ error: "Sản phẩm liên kết với phiếu này không còn tồn tại trong kho." });
        }
        const currentStock = typeof product.stock === "number" ? product.stock : (parseInt(String(product.stock)) || 0);
        // Xử lý biến động tồn kho
        if (ticket.type === "EXPORT") {
            if (currentStock < ticket.quantity) {
                return res.status(400).json({
                    error: `Không thể duyệt xuất kho! Tồn kho hiện tại (${currentStock} SP) nhỏ hơn số lượng yêu cầu xuất (${ticket.quantity} SP).`
                });
            }
            // Giảm tồn kho
            await db_1.db.product.update({
                where: { id: ticket.productId },
                data: { stock: { decrement: ticket.quantity } }
            });
        }
        else if (ticket.type === "IMPORT") {
            // Tăng tồn kho
            await db_1.db.product.update({
                where: { id: ticket.productId },
                data: { stock: { increment: ticket.quantity } }
            });
        }
        // Cập nhật trạng thái phiếu
        const approver = req.user;
        const updatedTicket = await db_1.db.stockTicket.update({
            where: { id: ticketId },
            data: {
                status: "APPROVED",
                approvedByUserId: approver.id,
                approvedByName: approver.fullName,
                approvedAt: new Date().toISOString()
            }
        });
        const refreshedProduct = await db_1.db.product.findFirst({ where: { id: ticket.productId } });
        return res.json({
            message: `Đã phê duyệt thành công phiếu ${ticket.type === "IMPORT" ? "NHẬP KHO" : "XUẤT KHO"}! Tồn kho sản phẩm "${product.name}" hiện tại là ${refreshedProduct?.stock} SP.`,
            ticket: updatedTicket,
            newStock: refreshedProduct?.stock
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi phê duyệt phiếu: " + err.message });
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
                approvedByName: approver.fullName,
                approvedAt: new Date().toISOString(),
                rejectReason: reason || "Không được Quản lý kho phê duyệt"
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

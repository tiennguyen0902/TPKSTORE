"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
// POST /api/orders (Checkout: Support both standard web checkout & Staff counter consultation for walk-in customers)
router.post("/", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { customerName, phone, shippingAddress, note, paymentMethod, items, isCounterOrder, isWalkIn, status: requestedStatus, paymentStatus: requestedPaymentStatus, discountAmount: reqDiscount } = req.body;
        const isStaffOrAdmin = ["STAFF", "MANAGER", "ADMIN"].includes(req.user.role);
        const isCounter = Boolean(isCounterOrder || (isStaffOrAdmin && isWalkIn));
        let orderCustomerName = (customerName && String(customerName).trim()) || "";
        let orderPhone = (phone && String(phone).trim()) || "";
        let orderAddress = (shippingAddress && String(shippingAddress).trim()) || "";
        if (isCounter) {
            if (!orderPhone) {
                return res.status(400).json({ error: "Vui lòng nhập Số điện thoại khách hàng để kích hoạt bảo hành điện tử và tích điểm." });
            }
            if (!orderCustomerName) {
                orderCustomerName = "Khách lẻ";
            }
            if (!orderAddress) {
                orderAddress = "Mua trực tiếp tại quầy - TPKSTORE";
            }
        }
        else {
            if (!orderCustomerName || !orderPhone || !orderAddress) {
                return res.status(400).json({ error: "Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng." });
            }
        }
        let checkoutItems = [];
        if (items && Array.isArray(items) && items.length > 0) {
            checkoutItems = items;
        }
        else {
            // Use cart items
            const cart = await db_1.db.cart.findUnique({
                where: { userId },
                include: { items: true }
            });
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ error: "Giỏ hàng của bạn đang trống." });
            }
            checkoutItems = cart.items.map(ci => ({
                productId: ci.productId,
                quantity: ci.quantity
            }));
        }
        // Use transaction for atomic stock decrement + order creation
        const newOrder = await db_1.db.$transaction(async (tx) => {
            let targetUserId = userId;
            // Nếu là đơn hàng tại quầy / do nhân viên tư vấn, liên kết hoặc tạo nhanh tài khoản Khách lẻ theo SĐT
            if (isCounter || (isStaffOrAdmin && orderPhone)) {
                const cleanPhone = orderPhone.replace(/\D/g, "");
                const existingCustomer = await tx.user.findFirst({
                    where: {
                        OR: [
                            { phone: orderPhone },
                            { phone: cleanPhone },
                            ...(cleanPhone.length >= 9 ? [{ phone: { contains: cleanPhone.slice(-9) } }] : [])
                        ]
                    }
                });
                if (existingCustomer) {
                    targetUserId = existingCustomer.id;
                    if (orderCustomerName && orderCustomerName !== "Khách lẻ" && (!existingCustomer.fullName || existingCustomer.fullName === "Khách lẻ")) {
                        await tx.user.update({
                            where: { id: existingCustomer.id },
                            data: { fullName: orderCustomerName }
                        });
                    }
                }
                else {
                    // Tự động tạo hồ sơ khách lẻ tại quầy
                    const guestEmail = `kh_${cleanPhone || Date.now()}@tpkstore.vn`;
                    const defaultPasswordHash = bcryptjs_1.default.hashSync("WalkInCustomer123@", 10);
                    const newCust = await tx.user.create({
                        data: {
                            email: guestEmail,
                            fullName: orderCustomerName || "Khách lẻ",
                            phone: orderPhone,
                            address: orderAddress,
                            passwordHash: defaultPasswordHash,
                            role: "CUSTOMER",
                            isActive: true,
                            canChatAi: true
                        }
                    });
                    targetUserId = newCust.id;
                }
            }
            let totalAmount = 0;
            const orderItemsData = [];
            // Verify stock and compute snapshot price
            for (const item of checkoutItems) {
                const prod = await tx.product.findUnique({ where: { id: item.productId } });
                if (!prod) {
                    throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
                }
                if (prod.stock < item.quantity) {
                    throw new Error(`Sản phẩm "${prod.name}" chỉ còn ${prod.stock} trong kho`);
                }
                // Deduct stock atomically
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
                const itemTotal = prod.price * item.quantity;
                totalAmount += itemTotal;
                orderItemsData.push({
                    productId: prod.id,
                    quantity: item.quantity,
                    price: prod.price
                });
            }
            const settings = await tx.systemSettings.findFirst();
            const freeShippingThreshold = settings?.freeShippingThreshold || 500000;
            const shippingFee = isCounter ? 0 : (totalAmount >= freeShippingThreshold ? 0 : 30000);
            const discountAmount = typeof reqDiscount === "number" ? reqDiscount : 0;
            const finalAmount = Math.max(0, totalAmount + shippingFee - discountAmount);
            // Count existing orders for sequential ID
            const orderCount = await tx.order.count();
            const orderId = `#ord_${1000 + orderCount + 1}`;
            const pm = paymentMethod === "MOMO" ? "MOMO" : (paymentMethod === "VNPAY" ? "VNPAY" : "COD");
            let finalNote = note || "";
            if (isStaffOrAdmin) {
                const staffTag = `[Nhân viên tư vấn: ${req.user.fullName || req.user.email}]`;
                finalNote = finalNote ? `${finalNote} ${staffTag}` : `${isCounter ? "Mua trực tiếp tại quầy" : "Tư vấn bán hàng"} ${staffTag}`;
            }
            const orderStatusVal = isCounter ? (requestedStatus || "DELIVERED") : (requestedStatus || "PENDING");
            const paymentStatusVal = isCounter ? (requestedPaymentStatus || (pm === "COD" ? "COMPLETED" : "PENDING")) : (requestedPaymentStatus || "PENDING");
            const order = await tx.order.create({
                data: {
                    id: orderId,
                    userId: targetUserId,
                    customerName: orderCustomerName,
                    phone: orderPhone,
                    shippingAddress: orderAddress,
                    note: finalNote || null,
                    totalAmount,
                    shippingFee,
                    discountAmount,
                    finalAmount,
                    status: orderStatusVal,
                    paymentMethod: pm,
                    paymentStatus: paymentStatusVal,
                    items: {
                        create: orderItemsData
                    }
                },
                include: {
                    items: {
                        include: { product: true }
                    }
                }
            });
            // Clear customer cart only for standard online checkout (not counter POS)
            if (!isCounter) {
                const cart = await tx.cart.findUnique({ where: { userId } });
                if (cart) {
                    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
                }
            }
            return order;
        });
        return res.status(201).json({
            message: isCounter ? "Tạo đơn hàng tại quầy & kích hoạt bảo hành thành công!" : "Đặt hàng thành công!",
            order: newOrder
        });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
// POST /api/orders/pos (Specialized POS Counter Order for Staff & Admin)
router.post("/pos", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "STAFF"]), async (req, res) => {
    try {
        const { customerName, phone, shippingAddress, note, paymentMethod, items, discountAmount = 0, paymentStatus = "COMPLETED", status = "DELIVERED" } = req.body;
        if (!phone || !String(phone).trim()) {
            return res.status(400).json({ error: "Vui lòng nhập Số điện thoại khách hàng để lưu bảo hành và tích điểm." });
        }
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Đơn hàng phải có ít nhất 1 sản phẩm." });
        }
        const trimmedPhone = String(phone).trim();
        const cleanPhone = trimmedPhone.replace(/\D/g, "");
        const orderCustomerName = (customerName && String(customerName).trim()) || "Khách lẻ";
        const orderAddress = (shippingAddress && String(shippingAddress).trim()) || "Mua trực tiếp tại quầy - TPKSTORE";
        const newOrder = await db_1.db.$transaction(async (tx) => {
            // 1. Tìm hoặc tạo hồ sơ khách lẻ
            let targetUserId = "";
            const existingCustomer = await tx.user.findFirst({
                where: {
                    OR: [
                        { phone: trimmedPhone },
                        { phone: cleanPhone },
                        ...(cleanPhone.length >= 9 ? [{ phone: { contains: cleanPhone.slice(-9) } }] : [])
                    ]
                }
            });
            if (existingCustomer) {
                targetUserId = existingCustomer.id;
                if (orderCustomerName !== "Khách lẻ" && (!existingCustomer.fullName || existingCustomer.fullName === "Khách lẻ")) {
                    await tx.user.update({
                        where: { id: existingCustomer.id },
                        data: { fullName: orderCustomerName }
                    });
                }
            }
            else {
                const guestEmail = `kh_${cleanPhone || Date.now()}@tpkstore.vn`;
                const defaultPasswordHash = bcryptjs_1.default.hashSync("WalkInCustomer123@", 10);
                const newCust = await tx.user.create({
                    data: {
                        email: guestEmail,
                        fullName: orderCustomerName,
                        phone: trimmedPhone,
                        address: orderAddress,
                        passwordHash: defaultPasswordHash,
                        role: "CUSTOMER",
                        isActive: true,
                        canChatAi: true
                    }
                });
                targetUserId = newCust.id;
            }
            // 2. Trừ tồn kho & tính tiền
            let totalAmount = 0;
            const orderItemsData = [];
            for (const item of items) {
                const prod = await tx.product.findUnique({ where: { id: item.productId } });
                if (!prod) {
                    throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
                }
                if (prod.stock < item.quantity) {
                    throw new Error(`Sản phẩm "${prod.name}" chỉ còn ${prod.stock} trong kho (yêu cầu: ${item.quantity})`);
                }
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
                const itemTotal = prod.price * item.quantity;
                totalAmount += itemTotal;
                orderItemsData.push({
                    productId: prod.id,
                    quantity: item.quantity,
                    price: prod.price
                });
            }
            const orderCount = await tx.order.count();
            const orderId = `#ord_${1000 + orderCount + 1}`;
            const finalDiscount = Number(discountAmount) || 0;
            const finalAmount = Math.max(0, totalAmount - finalDiscount);
            const pm = paymentMethod === "MOMO" ? "MOMO" : (paymentMethod === "VNPAY" ? "VNPAY" : "COD");
            const staffTag = `[Nhân viên tư vấn: ${req.user.fullName || req.user.email}]`;
            const finalNote = note ? `${note} ${staffTag}` : `Mua tại quầy ${staffTag}`;
            const createdOrder = await tx.order.create({
                data: {
                    id: orderId,
                    userId: targetUserId,
                    customerName: orderCustomerName,
                    phone: trimmedPhone,
                    shippingAddress: orderAddress,
                    note: finalNote,
                    totalAmount,
                    shippingFee: 0,
                    discountAmount: finalDiscount,
                    finalAmount,
                    status: status || "DELIVERED",
                    paymentMethod: pm,
                    paymentStatus: paymentStatus || "COMPLETED",
                    items: {
                        create: orderItemsData
                    }
                },
                include: {
                    items: {
                        include: { product: true }
                    },
                    user: true
                }
            });
            return createdOrder;
        });
        // Thông tin bảo hành điện tử theo SĐT
        const loyaltyPointsEarned = Math.floor(newOrder.finalAmount / 10000);
        return res.status(201).json({
            message: "Lập đơn bán hàng tại quầy thành công!",
            order: newOrder,
            warrantyInfo: {
                warrantyPhone: trimmedPhone,
                customerName: orderCustomerName,
                policy: "Bảo hành chính hãng 12-24 tháng tại hệ thống TPKSTORE",
                loyaltyPointsEarned,
                consultant: req.user.fullName
            }
        });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
// GET /api/orders/my (Customer view own orders)
router.get("/my", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await db_1.db.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: "desc" }
        });
        return res.json({
            total: orders.length,
            orders
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi truy vấn đơn hàng: " + err.message });
    }
});
// GET /api/orders (Admin / Manager / Staff view all orders)
router.get("/", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER", "STAFF"]), async (req, res) => {
    try {
        const { status, search } = req.query;
        const where = {};
        if (status && status !== "ALL") {
            where.status = status;
        }
        if (search) {
            const q = search.toLowerCase();
            where.OR = [
                { id: { contains: q, mode: "insensitive" } },
                { customerName: { contains: q, mode: "insensitive" } },
                { phone: { contains: q } }
            ];
        }
        const orders = await db_1.db.order.findMany({
            where,
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: "desc" }
        });
        return res.json({
            total: orders.length,
            orders
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi truy vấn đơn hàng: " + err.message });
    }
});
// GET /api/orders/:id
router.get("/:id", auth_1.authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const order = await db_1.db.order.findUnique({
            where: { id: req.params.id },
            include: { items: { include: { product: true } } }
        });
        if (!order) {
            return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
        }
        // Customers can only view their own orders
        if (user.role === "CUSTOMER" && order.userId !== user.id) {
            return res.status(403).json({ error: "Bạn không có quyền xem đơn hàng này." });
        }
        return res.json(order);
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi truy vấn: " + err.message });
    }
});
// PUT /api/orders/:id/status (Admin / Manager / Staff update state machine)
router.put("/:id/status", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER", "STAFF"]), async (req, res) => {
    try {
        const order = await db_1.db.order.findUnique({
            where: { id: req.params.id },
            include: { items: true }
        });
        if (!order) {
            return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
        }
        const { status, paymentStatus } = req.body;
        const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: "Trạng thái đơn hàng không hợp lệ." });
        }
        // Handle stock refund if cancelled
        if (status === "CANCELLED" && order.status !== "CANCELLED") {
            await db_1.db.$transaction(async (tx) => {
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { increment: item.quantity } }
                    });
                }
                await tx.order.update({
                    where: { id: order.id },
                    data: { status: "CANCELLED" }
                });
            });
            const updated = await db_1.db.order.findUnique({
                where: { id: order.id },
                include: { items: { include: { product: true } } }
            });
            return res.json({ message: "Đã hủy đơn hàng và hoàn lại tồn kho.", order: updated });
        }
        const updateData = {};
        if (status)
            updateData.status = status;
        if (paymentStatus)
            updateData.paymentStatus = paymentStatus;
        if (status === "DELIVERED" && order.paymentMethod === "COD") {
            updateData.paymentStatus = "COMPLETED";
        }
        const updatedOrder = await db_1.db.order.update({
            where: { id: order.id },
            data: updateData,
            include: { items: { include: { product: true } } }
        });
        return res.json({
            message: "Cập nhật trạng thái đơn hàng thành công!",
            order: updatedOrder
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi cập nhật: " + err.message });
    }
});
// POST /api/orders/:id/cancel (Customer or Admin cancel)
router.post("/:id/cancel", auth_1.authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const whereClause = { id: req.params.id };
        if (user.role === "CUSTOMER") {
            whereClause.userId = user.id;
        }
        const order = await db_1.db.order.findFirst({
            where: whereClause,
            include: { items: true }
        });
        if (!order) {
            return res.status(404).json({ error: "Không tìm thấy đơn hàng hoặc bạn không có quyền hủy." });
        }
        if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
            return res.status(400).json({ error: "Chỉ có thể hủy đơn hàng đang ở trạng thái Chờ xử lý hoặc Đã xác nhận." });
        }
        await db_1.db.$transaction(async (tx) => {
            // Refund stock
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } }
                });
            }
            await tx.order.update({
                where: { id: order.id },
                data: { status: "CANCELLED" }
            });
        });
        const cancelledOrder = await db_1.db.order.findUnique({
            where: { id: order.id },
            include: { items: { include: { product: true } } }
        });
        return res.json({
            message: "Hủy đơn hàng thành công và đã hoàn lại số lượng tồn kho!",
            order: cancelledOrder
        });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
exports.default = router;

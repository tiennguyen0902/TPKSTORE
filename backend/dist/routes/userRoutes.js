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
// GET /api/users (Admin, Manager & Staff view customer list)
router.get("/", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER", "STAFF"]), async (req, res) => {
    try {
        const { role, search } = req.query;
        const where = {};
        if (role && role !== "ALL") {
            where.role = role;
        }
        if (search) {
            const q = search.toLowerCase();
            where.OR = [
                { fullName: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { phone: { contains: q } },
                { address: { contains: q, mode: "insensitive" } }
            ];
        }
        const users = await db_1.db.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                address: true,
                avatar: true,
                role: true,
                isActive: true,
                canChatAi: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: "desc" }
        });
        return res.json({
            total: users.length,
            users
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi truy vấn người dùng: " + err.message });
    }
});
// GET /api/users/lookup?phone=0912345678 (Staff, Manager & Admin quick lookup customer by phone)
router.get("/lookup", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER", "STAFF"]), async (req, res) => {
    try {
        const phone = req.query.phone ? String(req.query.phone).trim() : "";
        if (!phone) {
            return res.status(400).json({ error: "Vui lòng cung cấp số điện thoại khách hàng." });
        }
        const cleanPhone = phone.replace(/\D/g, "");
        const user = await db_1.db.user.findFirst({
            where: {
                OR: [
                    { phone: phone },
                    { phone: cleanPhone },
                    ...(cleanPhone.length >= 9 ? [{ phone: { contains: cleanPhone.slice(-9) } }] : [])
                ]
            },
            include: {
                orders: {
                    include: {
                        items: {
                            include: { product: true }
                        }
                    },
                    orderBy: { createdAt: "desc" }
                }
            }
        });
        if (!user) {
            return res.json({
                found: false,
                message: "Khách hàng mới (chưa có thông tin tích điểm / bảo hành)"
            });
        }
        // Calculate customer metrics for loyalty & warranty
        const completedOrders = (user.orders || []).filter((o) => o.status !== "CANCELLED");
        const totalSpent = completedOrders.reduce((sum, o) => sum + (o.finalAmount || o.totalAmount || 0), 0);
        const loyaltyPoints = Math.floor(totalSpent / 10000); // 1 điểm / 10.000đ
        return res.json({
            found: true,
            customer: {
                id: user.id,
                fullName: user.fullName,
                phone: user.phone,
                email: user.email,
                address: user.address,
                role: user.role,
                totalOrders: completedOrders.length,
                totalSpent,
                loyaltyPoints,
                recentOrders: user.orders ? user.orders.slice(0, 5) : []
            }
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi tra cứu khách hàng: " + err.message });
    }
});
// POST /api/users/quick-customer (Staff, Manager & Admin quick create walk-in customer profile)
router.post("/quick-customer", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER", "STAFF"]), async (req, res) => {
    try {
        const { fullName, phone, address } = req.body;
        if (!phone || !String(phone).trim()) {
            return res.status(400).json({ error: "Vui lòng nhập số điện thoại khách hàng." });
        }
        const trimmedPhone = String(phone).trim();
        const cleanPhone = trimmedPhone.replace(/\D/g, "");
        // Check if customer already exists
        const existing = await db_1.db.user.findFirst({
            where: {
                OR: [
                    { phone: trimmedPhone },
                    { phone: cleanPhone }
                ]
            }
        });
        if (existing) {
            if (fullName && String(fullName).trim() && existing.fullName !== String(fullName).trim()) {
                const updated = await db_1.db.user.update({
                    where: { id: existing.id },
                    data: { fullName: String(fullName).trim() }
                });
                return res.json({
                    isNew: false,
                    message: "Khách hàng thân thiết đã có trong hệ thống",
                    customer: updated
                });
            }
            return res.json({
                isNew: false,
                message: "Khách hàng đã có trong hệ thống",
                customer: existing
            });
        }
        // Auto-create walk-in customer account
        const guestEmail = `kh_${cleanPhone || Date.now()}@tpkstore.vn`;
        const defaultPasswordHash = bcryptjs_1.default.hashSync("WalkInCustomer123@", 10);
        const newCustomer = await db_1.db.user.create({
            data: {
                email: guestEmail,
                fullName: (fullName && String(fullName).trim()) || "Khách hàng vãng lai",
                phone: trimmedPhone,
                address: (address && String(address).trim()) || "Mua tại quầy - TPKSTORE",
                passwordHash: defaultPasswordHash,
                role: "CUSTOMER",
                isActive: true,
                canChatAi: true
            }
        });
        return res.status(201).json({
            isNew: true,
            message: "Tạo hồ sơ khách hàng vãng lai thành công!",
            customer: newCustomer
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi tạo khách hàng: " + err.message });
    }
});
// PUT /api/users/:id/role (Admin update role)
router.put("/:id/role", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN"]), async (req, res) => {
    try {
        const user = await db_1.db.user.findUnique({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ error: "Không tìm thấy người dùng." });
        }
        const { role } = req.body;
        if (!role || !["ADMIN", "MANAGER", "STAFF", "CUSTOMER"].includes(role)) {
            return res.status(400).json({ error: "Vai trò không hợp lệ. Chọn ADMIN, MANAGER, STAFF hoặc CUSTOMER." });
        }
        const updatedUser = await db_1.db.user.update({
            where: { id: req.params.id },
            data: { role }
        });
        return res.json({
            message: `Đã cập nhật vai trò người dùng thành ${role}!`,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                fullName: updatedUser.fullName,
                role: updatedUser.role
            }
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi cập nhật vai trò: " + err.message });
    }
});
// PUT /api/users/:id/toggle-active (Admin lock / unlock account)
router.put("/:id/toggle-active", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN"]), async (req, res) => {
    try {
        const user = await db_1.db.user.findUnique({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ error: "Không tìm thấy người dùng." });
        }
        if (user.id === req.user.id) {
            return res.status(400).json({ error: "Bạn không thể tự khóa tài khoản của chính mình." });
        }
        const updatedUser = await db_1.db.user.update({
            where: { id: req.params.id },
            data: { isActive: !user.isActive }
        });
        return res.json({
            message: updatedUser.isActive ? "Đã mở khóa tài khoản người dùng." : "Đã tạm khóa tài khoản người dùng.",
            isActive: updatedUser.isActive
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi cập nhật: " + err.message });
    }
});
// PUT /api/users/:id/toggle-chat-ai (Admin toggle AI Chat permission)
router.put("/:id/toggle-chat-ai", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN"]), async (req, res) => {
    try {
        const user = await db_1.db.user.findUnique({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ error: "Không tìm thấy người dùng." });
        }
        const currentPerm = user.canChatAi !== false;
        const updatedUser = await db_1.db.user.update({
            where: { id: req.params.id },
            data: { canChatAi: !currentPerm }
        });
        return res.json({
            message: updatedUser.canChatAi ? "Đã kích hoạt quyền Chat AI cho người dùng." : "Đã tạm dừng quyền Chat AI của người dùng.",
            canChatAi: updatedUser.canChatAi
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi cập nhật quyền Chat AI: " + err.message });
    }
});
// POST /api/users/grant-all-chat-ai (Admin grant AI Chat permission to ALL users on system)
router.post("/grant-all-chat-ai", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN"]), async (req, res) => {
    try {
        const result = await db_1.db.user.updateMany({
            data: { canChatAi: true }
        });
        return res.json({
            message: `Đã cấp quyền Chat AI thành công cho tất cả tài khoản người dùng trên hệ thống!`,
            count: result?.count || 0
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi kích hoạt quyền Chat AI toàn hệ thống: " + err.message });
    }
});
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Helper: get or create cart for user
async function getOrCreateUserCart(userId) {
    let cart = await db_1.db.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    product: {
                        include: { category: true }
                    }
                }
            }
        }
    });
    if (!cart) {
        cart = await db_1.db.cart.create({
            data: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: { category: true }
                        }
                    }
                }
            }
        });
    }
    return cart;
}
// GET /api/cart
router.get("/", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await getOrCreateUserCart(userId);
        const settings = await db_1.db.systemSettings.findFirst();
        const freeShippingThreshold = settings?.freeShippingThreshold || 500000;
        const items = cart.items;
        const subtotal = items.reduce((sum, item) => {
            return sum + (item.product?.price || 0) * item.quantity;
        }, 0);
        const isFreeShipping = subtotal >= freeShippingThreshold;
        const shippingFee = subtotal > 0 ? (isFreeShipping ? 0 : 30000) : 0;
        const total = subtotal + shippingFee;
        return res.json({
            cartId: cart.id,
            items,
            itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
            subtotal,
            shippingFee,
            isFreeShipping,
            freeShippingThreshold,
            total
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi truy vấn giỏ hàng: " + err.message });
    }
});
// POST /api/cart/items
router.post("/items", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        if (!productId) {
            return res.status(400).json({ error: "Vui lòng cung cấp productId." });
        }
        const addQty = Math.max(1, parseInt(String(quantity), 10) || 1);
        const product = await db_1.db.product.findFirst({
            where: { OR: [{ id: productId }, { slug: productId }] },
            include: { category: true }
        });
        if (!product) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại." });
        }
        const availableStock = typeof product.stock === "number" ? product.stock : (parseInt(String(product.stock)) || 0);
        if (availableStock <= 0) {
            return res.status(400).json({ error: "Sản phẩm hiện đang hết hàng." });
        }
        const cart = await getOrCreateUserCart(userId);
        // Check if product already in cart
        const existingItem = await db_1.db.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: product.id
                }
            }
        });
        let item;
        if (existingItem) {
            const newQty = existingItem.quantity + addQty;
            if (newQty > availableStock) {
                return res.status(400).json({
                    error: `Không thể thêm! Tổng số lượng trong giỏ (${newQty}) vượt quá tồn kho khả dụng (${availableStock} SP).`
                });
            }
            item = await db_1.db.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQty },
                include: { product: { include: { category: true } } }
            });
        }
        else {
            if (addQty > availableStock) {
                return res.status(400).json({
                    error: `Số lượng yêu cầu (${addQty}) vượt quá tồn kho khả dụng (${availableStock} SP).`
                });
            }
            item = await db_1.db.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: product.id,
                    quantity: addQty,
                },
                include: { product: { include: { category: true } } }
            });
        }
        return res.status(201).json({
            message: "Đã thêm sản phẩm vào giỏ hàng!",
            item
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi thêm giỏ hàng: " + err.message });
    }
});
// PUT /api/cart/items/:id
router.put("/items/:id", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { quantity } = req.body;
        if (quantity === undefined) {
            return res.status(400).json({ error: "Vui lòng cung cấp quantity." });
        }
        const cart = await getOrCreateUserCart(userId);
        const item = await db_1.db.cartItem.findFirst({
            where: { id: req.params.id, cartId: cart.id },
            include: { product: true }
        });
        if (!item) {
            return res.status(404).json({ error: "Mặt hàng không tồn tại trong giỏ." });
        }
        const qty = parseInt(String(quantity), 10);
        if (isNaN(qty) || qty <= 0) {
            await db_1.db.cartItem.delete({ where: { id: req.params.id } });
            return res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng!", result: { deleted: true } });
        }
        const prodStock = item.product?.stock ?? 999;
        if (qty > prodStock) {
            return res.status(400).json({
                error: `Số lượng cập nhật (${qty}) vượt quá số lượng tồn kho hiện có (${prodStock} SP).`
            });
        }
        const updated = await db_1.db.cartItem.update({
            where: { id: req.params.id },
            data: { quantity: qty }
        });
        return res.json({
            message: "Cập nhật số lượng thành công!",
            result: updated
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi cập nhật giỏ hàng: " + err.message });
    }
});
// DELETE /api/cart/items/:id
router.delete("/items/:id", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await getOrCreateUserCart(userId);
        const targetId = req.params.id;
        // Tìm chính xác cartItem thuộc cart của người dùng (hỗ trợ cả tìm theo item.id hoặc productId)
        const existing = await db_1.db.cartItem.findFirst({
            where: {
                cartId: cart.id,
                OR: [
                    { id: targetId },
                    { productId: targetId }
                ]
            }
        });
        if (existing) {
            await db_1.db.cartItem.delete({
                where: { id: existing.id }
            });
        }
        else {
            await db_1.db.cartItem.deleteMany({
                where: { id: targetId, cartId: cart.id }
            });
        }
        return res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng." });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi xóa item: " + err.message });
    }
});
// DELETE /api/cart
router.delete("/", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await db_1.db.cart.findUnique({ where: { userId } });
        if (cart) {
            await db_1.db.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
        return res.json({ message: "Đã làm trống giỏ hàng." });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi xóa giỏ hàng: " + err.message });
    }
});
exports.default = router;

import { Router, Response } from "express";
import { db } from "../db";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// GET /api/cart
router.get("/", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { cart, items } = db.getOrCreateUserCart(userId);

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const shippingThreshold = db.settings.freeShippingThreshold;
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingFee = subtotal > 0 ? (isFreeShipping ? 0 : 30000) : 0;
  const total = subtotal + shippingFee;

  return res.json({
    cartId: cart.id,
    items,
    itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
    subtotal,
    shippingFee,
    isFreeShipping,
    freeShippingThreshold: shippingThreshold,
    total
  });
});

// POST /api/cart/items
router.post("/items", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "Vui lòng cung cấp productId." });
  }

  const product = db.getProductByIdOrSlug(productId);
  if (!product) {
    return res.status(404).json({ error: "Sản phẩm không tồn tại." });
  }

  if (product.stock <= 0) {
    return res.status(400).json({ error: "Sản phẩm hiện đang hết hàng." });
  }

  const item = db.addToCart(userId, product.id, quantity || 1);
  return res.status(201).json({
    message: "Đã thêm sản phẩm vào giỏ hàng!",
    item: {
      ...item,
      product
    }
  });
});

// PUT /api/cart/items/:id
router.put("/items/:id", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { quantity } = req.body;

  if (quantity === undefined) {
    return res.status(400).json({ error: "Vui lòng cung cấp quantity." });
  }

  const result = db.updateCartItemQuantity(userId, req.params.id, parseInt(quantity));
  if (!result) {
    return res.status(404).json({ error: "Mặt hàng không tồn tại trong giỏ." });
  }

  return res.json({
    message: "Cập nhật số lượng thành công!",
    result
  });
});

// DELETE /api/cart/items/:id
router.delete("/items/:id", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  db.removeCartItem(userId, req.params.id);
  return res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng." });
});

// DELETE /api/cart
router.delete("/", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  db.clearCart(userId);
  return res.json({ message: "Đã làm trống giỏ hàng." });
});

export default router;

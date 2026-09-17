import { Router, Response } from "express";
import { db } from "../db";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// Helper: get or create cart for user
async function getOrCreateUserCart(userId: string) {
  let cart = await db.cart.findUnique({
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
    cart = await db.cart.create({
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
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const cart = await getOrCreateUserCart(userId);

    const settings = await db.systemSettings.findFirst();
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
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi truy vấn giỏ hàng: " + err.message });
  }
});

// POST /api/cart/items
router.post("/items", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Vui lòng cung cấp productId." });
    }

    const product = await db.product.findFirst({
      where: { OR: [{ id: productId }, { slug: productId }] },
      include: { category: true }
    });
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại." });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ error: "Sản phẩm hiện đang hết hàng." });
    }

    const cart = await getOrCreateUserCart(userId);

    // Check if product already in cart
    const existingItem = await db.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id
        }
      }
    });

    let item;
    if (existingItem) {
      item = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
        include: { product: { include: { category: true } } }
      });
    } else {
      item = await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity: Math.max(1, quantity || 1),
        },
        include: { product: { include: { category: true } } }
      });
    }

    return res.status(201).json({
      message: "Đã thêm sản phẩm vào giỏ hàng!",
      item
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi thêm giỏ hàng: " + err.message });
  }
});

// PUT /api/cart/items/:id
router.put("/items/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ error: "Vui lòng cung cấp quantity." });
    }

    const cart = await getOrCreateUserCart(userId);
    const item = await db.cartItem.findFirst({
      where: { id: req.params.id, cartId: cart.id }
    });

    if (!item) {
      return res.status(404).json({ error: "Mặt hàng không tồn tại trong giỏ." });
    }

    const qty = parseInt(quantity);
    if (qty <= 0) {
      await db.cartItem.delete({ where: { id: req.params.id } });
      return res.json({ message: "Cập nhật số lượng thành công!", result: { deleted: true } });
    }

    const updated = await db.cartItem.update({
      where: { id: req.params.id },
      data: { quantity: qty }
    });

    return res.json({
      message: "Cập nhật số lượng thành công!",
      result: updated
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi cập nhật giỏ hàng: " + err.message });
  }
});

// DELETE /api/cart/items/:id
router.delete("/items/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const cart = await getOrCreateUserCart(userId);

    await db.cartItem.deleteMany({
      where: { id: req.params.id, cartId: cart.id }
    });

    return res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng." });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi xóa item: " + err.message });
  }
});

// DELETE /api/cart
router.delete("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const cart = await db.cart.findUnique({ where: { userId } });
    if (cart) {
      await db.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return res.json({ message: "Đã làm trống giỏ hàng." });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi xóa giỏ hàng: " + err.message });
  }
});

export default router;

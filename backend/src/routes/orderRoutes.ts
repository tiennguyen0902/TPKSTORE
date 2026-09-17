import { Router, Response } from "express";
import { db } from "../db";
import { authenticateToken, authorize, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// POST /api/orders (Checkout: Create Order)
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { customerName, phone, shippingAddress, note, paymentMethod, items } = req.body;

    if (!customerName || !phone || !shippingAddress) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng." });
    }

    let checkoutItems: { productId: string; quantity: number }[] = [];

    if (items && Array.isArray(items) && items.length > 0) {
      checkoutItems = items;
    } else {
      // Use cart items
      const cart = await db.cart.findUnique({
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
    const newOrder = await db.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData: { productId: string; quantity: number; price: number }[] = [];

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
      const shippingFee = totalAmount >= freeShippingThreshold ? 0 : 30000;
      const discountAmount = 0;
      const finalAmount = totalAmount + shippingFee - discountAmount;

      // Count existing orders for sequential ID
      const orderCount = await tx.order.count();
      const orderId = `#ord_${1000 + orderCount + 1}`;

      const pm = paymentMethod === "MOMO" ? "MOMO" : (paymentMethod === "VNPAY" ? "VNPAY" : "COD");

      const order = await tx.order.create({
        data: {
          id: orderId,
          userId,
          customerName,
          phone,
          shippingAddress,
          note: note || null,
          totalAmount,
          shippingFee,
          discountAmount,
          finalAmount,
          status: "PENDING",
          paymentMethod: pm,
          paymentStatus: "PENDING",
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

      // Clear cart after checkout
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      return order;
    });

    return res.status(201).json({
      message: "Đặt hàng thành công!",
      order: newOrder
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// GET /api/orders/my (Customer view own orders)
router.get("/my", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orders = await db.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" }
    });
    return res.json({
      total: orders.length,
      orders
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi truy vấn đơn hàng: " + err.message });
  }
});

// GET /api/orders (Admin / Staff view all orders)
router.get("/", authenticateToken, authorize(["ADMIN", "STAFF"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search } = req.query;

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status as string;
    }

    if (search) {
      const q = (search as string).toLowerCase();
      where.OR = [
        { id: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } }
      ];
    }

    const orders = await db.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" }
    });

    return res.json({
      total: orders.length,
      orders
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi truy vấn đơn hàng: " + err.message });
  }
});

// GET /api/orders/:id
router.get("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const order = await db.order.findUnique({
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
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi truy vấn: " + err.message });
  }
});

// PUT /api/orders/:id/status (Admin / Staff update state machine)
router.put("/:id/status", authenticateToken, authorize(["ADMIN", "STAFF"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const order = await db.order.findUnique({
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
      await db.$transaction(async (tx) => {
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

      const updated = await db.order.findUnique({
        where: { id: order.id },
        include: { items: { include: { product: true } } }
      });
      return res.json({ message: "Đã hủy đơn hàng và hoàn lại tồn kho.", order: updated });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    if (status === "DELIVERED" && order.paymentMethod === "COD") {
      updateData.paymentStatus = "COMPLETED";
    }

    const updatedOrder = await db.order.update({
      where: { id: order.id },
      data: updateData,
      include: { items: { include: { product: true } } }
    });

    return res.json({
      message: "Cập nhật trạng thái đơn hàng thành công!",
      order: updatedOrder
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi cập nhật: " + err.message });
  }
});

// POST /api/orders/:id/cancel (Customer or Admin cancel)
router.post("/:id/cancel", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const whereClause: any = { id: req.params.id };
    if (user.role === "CUSTOMER") {
      whereClause.userId = user.id;
    }

    const order = await db.order.findFirst({
      where: whereClause,
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng hoặc bạn không có quyền hủy." });
    }

    if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
      return res.status(400).json({ error: "Chỉ có thể hủy đơn hàng đang ở trạng thái Chờ xử lý hoặc Đã xác nhận." });
    }

    await db.$transaction(async (tx) => {
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

    const cancelledOrder = await db.order.findUnique({
      where: { id: order.id },
      include: { items: { include: { product: true } } }
    });

    return res.json({
      message: "Hủy đơn hàng thành công và đã hoàn lại số lượng tồn kho!",
      order: cancelledOrder
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;

import { Router, Response } from "express";
import { db } from "../db";
import { authenticateToken, authorize, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// POST /api/orders (Checkout: Create Order)
router.post("/", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
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
      const { items: cartItems } = db.getOrCreateUserCart(userId);
      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Giỏ hàng của bạn đang trống." });
      }
      checkoutItems = cartItems.map(ci => ({
        productId: ci.productId,
        quantity: ci.quantity
      }));
    }

    const newOrder = db.createOrder({
      userId,
      customerName,
      phone,
      shippingAddress,
      note,
      paymentMethod: paymentMethod === "MOMO" ? "MOMO" : (paymentMethod === "VNPAY" ? "VNPAY" : "COD"),
      items: checkoutItems
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
router.get("/my", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const orders = db.orders.filter(o => o.userId === userId);
  return res.json({
    total: orders.length,
    orders
  });
});

// GET /api/orders (Admin / Staff view all orders)
router.get("/", authenticateToken, authorize(["ADMIN", "STAFF"]), (req: AuthenticatedRequest, res: Response) => {
  const { status, search } = req.query;
  let list = [...db.orders];

  if (status && status !== "ALL") {
    list = list.filter(o => o.status === status);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(o => 
      o.id.toLowerCase().includes(q) || 
      o.customerName.toLowerCase().includes(q) || 
      o.phone.includes(q)
    );
  }

  return res.json({
    total: list.length,
    orders: list
  });
});

// GET /api/orders/:id
router.get("/:id", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const order = db.orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
  }

  // Customers can only view their own orders
  if (user.role === "CUSTOMER" && order.userId !== user.id) {
    return res.status(403).json({ error: "Bạn không có quyền xem đơn hàng này." });
  }

  return res.json(order);
});

// PUT /api/orders/:id/status (Admin / Staff update state machine)
router.put("/:id/status", authenticateToken, authorize(["ADMIN", "STAFF"]), (req: AuthenticatedRequest, res: Response) => {
  const order = db.orders.find(o => o.id === req.params.id);
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
    try {
      db.cancelOrder(order.id);
      return res.json({ message: "Đã hủy đơn hàng và hoàn lại tồn kho.", order });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  
  if (status === "DELIVERED" && order.paymentMethod === "COD") {
    order.paymentStatus = "COMPLETED";
  }

  order.updatedAt = new Date().toISOString();

  return res.json({
    message: "Cập nhật trạng thái đơn hàng thành công!",
    order
  });
});

// POST /api/orders/:id/cancel (Customer or Admin cancel)
router.post("/:id/cancel", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  try {
    const cancelledOrder = db.cancelOrder(req.params.id, user.role === "CUSTOMER" ? user.id : undefined);
    if (!cancelledOrder) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng hoặc bạn không có quyền hủy." });
    }
    return res.json({
      message: "Hủy đơn hàng thành công và đã hoàn lại số lượng tồn kho!",
      order: cancelledOrder
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;

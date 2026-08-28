import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// POST /api/payment/create-vnpay-url
router.post("/create-vnpay-url", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { orderId, amount, bankCode } = req.body;
  if (!orderId || !amount) {
    return res.status(400).json({ error: "Thiếu thông tin đơn hàng hoặc số tiền." });
  }

  const order = db.orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
  }

  // Create simulated VNPAY sandbox redirect URL
  const paymentUrl = `/vnpay-sandbox-checkout?orderId=${encodeURIComponent(orderId)}&amount=${amount}&bankCode=${bankCode || "NCB"}`;

  return res.json({
    status: "success",
    paymentUrl,
    transactionNo: `VNPAY_${Date.now()}`
  });
});

// POST /api/payment/vnpay-ipn (Simulated Webhook)
router.post("/vnpay-ipn", (req: Request, res: Response) => {
  const { orderId, responseCode, transactionNo, bankCode } = req.body;

  const order = db.orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ RspCode: "01", Message: "Order not found" });
  }

  if (responseCode === "00") {
    // Payment success
    order.paymentStatus = "COMPLETED";
    order.status = "CONFIRMED";
    order.updatedAt = new Date().toISOString();
    return res.json({ RspCode: "00", Message: "Confirm Success" });
  } else {
    order.paymentStatus = "FAILED";
    order.updatedAt = new Date().toISOString();
    return res.json({ RspCode: "02", Message: "Payment Failed" });
  }
});

export default router;

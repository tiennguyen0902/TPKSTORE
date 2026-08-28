import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";
import { MomoPaymentService } from "../services/momoService";

const router = Router();

// ==========================================
// VNPAY PAYMENT GATEWAY
// ==========================================

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

// ==========================================
// MOMO PAYMENT GATEWAY (MoMo Gateway v2)
// ==========================================

// POST /api/payment/create-momo-url (Tạo liên kết thanh toán MoMo Sandbox)
router.post("/create-momo-url", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId, amount, orderInfo, redirectUrl } = req.body;
    if (!orderId || !amount) {
      return res.status(400).json({ error: "Thiếu thông tin đơn hàng hoặc số tiền thanh toán." });
    }

    const order = db.orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
    }

    const momoResult = await MomoPaymentService.createPayment({
      orderId,
      amount: Number(amount),
      orderInfo: orderInfo || `Thanh toan don hang ${orderId} - SHOPBEE STORE AI`,
      redirectUrl: redirectUrl || "http://localhost:3000/payment-result"
    });

    if (momoResult.success && momoResult.data) {
      order.momoPayUrl = momoResult.data.payUrl;
      order.updatedAt = new Date().toISOString();

      return res.json({
        status: "success",
        payUrl: momoResult.data.payUrl,
        deeplink: momoResult.data.deeplink,
        qrCodeUrl: momoResult.data.qrCodeUrl,
        orderId: momoResult.data.orderId,
        requestId: momoResult.data.requestId,
        amount: momoResult.data.amount,
        message: momoResult.data.message
      });
    }

    return res.status(400).json({
      status: "error",
      error: momoResult.error || "Không thể tạo liên kết thanh toán MoMo"
    });
  } catch (err: any) {
    return res.status(500).json({ error: `Lỗi xử lý MoMo: ${err.message}` });
  }
});

// POST /api/payment/momo-ipn (MoMo Instant Payment Notification Webhook)
router.post("/momo-ipn", (req: Request, res: Response) => {
  try {
    const { orderId, resultCode, message, transId, amount } = req.body;
    console.log(`[MoMo IPN] Nhận callback đơn hàng ${orderId}, ResultCode: ${resultCode}, TransId: ${transId}`);

    const order = db.orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (Number(resultCode) === 0) {
      // Giao dịch MoMo thành công
      order.paymentStatus = "COMPLETED";
      order.status = "CONFIRMED";
      order.momoTransId = String(transId || `MOMO_${Date.now()}`);
      order.updatedAt = new Date().toISOString();
      return res.status(200).json({ message: "Thành công", orderId });
    } else {
      order.paymentStatus = "FAILED";
      order.updatedAt = new Date().toISOString();
      return res.status(200).json({ message: `Giao dịch thất bại: ${message}`, orderId });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/momo-confirm (Xác nhận nhanh thanh toán MoMo trên client / simulator)
router.post("/momo-confirm", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { orderId, resultCode = 0, transId } = req.body;

  const order = db.orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
  }

  if (Number(resultCode) === 0) {
    order.paymentStatus = "COMPLETED";
    order.status = "CONFIRMED";
    order.momoTransId = transId || `MOMO_${Date.now()}`;
    order.updatedAt = new Date().toISOString();

    return res.json({
      status: "success",
      message: "Thanh toán MoMo thành công!",
      order
    });
  } else {
    order.paymentStatus = "FAILED";
    order.updatedAt = new Date().toISOString();

    return res.json({
      status: "failed",
      message: "Thanh toán MoMo không thành công.",
      order
    });
  }
});

export default router;

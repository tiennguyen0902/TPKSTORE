"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const momoService_1 = require("../services/momoService");
const router = (0, express_1.Router)();
// ==========================================
// VNPAY PAYMENT GATEWAY
// ==========================================
// POST /api/payment/create-vnpay-url
router.post("/create-vnpay-url", auth_1.authenticateToken, async (req, res) => {
    try {
        const { orderId, amount, bankCode } = req.body;
        if (!orderId || !amount) {
            return res.status(400).json({ error: "Thiếu thông tin đơn hàng hoặc số tiền." });
        }
        const order = await db_1.db.order.findUnique({ where: { id: orderId } });
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
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi tạo thanh toán VNPAY: " + err.message });
    }
});
// POST /api/payment/vnpay-ipn (Simulated Webhook)
router.post("/vnpay-ipn", async (req, res) => {
    try {
        const { orderId, responseCode } = req.body;
        const order = await db_1.db.order.findUnique({ where: { id: orderId } });
        if (!order) {
            return res.status(404).json({ RspCode: "01", Message: "Order not found" });
        }
        if (responseCode === "00") {
            // Payment success
            await db_1.db.order.update({
                where: { id: orderId },
                data: { paymentStatus: "COMPLETED", status: "CONFIRMED" }
            });
            return res.json({ RspCode: "00", Message: "Confirm Success" });
        }
        else {
            await db_1.db.order.update({
                where: { id: orderId },
                data: { paymentStatus: "FAILED" }
            });
            return res.json({ RspCode: "02", Message: "Payment Failed" });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
// ==========================================
// MOMO PAYMENT GATEWAY (MoMo Gateway v2)
// ==========================================
// POST /api/payment/create-momo-url (Tạo liên kết thanh toán MoMo Sandbox)
router.post("/create-momo-url", auth_1.authenticateToken, async (req, res) => {
    try {
        const { orderId, amount, orderInfo, redirectUrl } = req.body;
        if (!orderId || !amount) {
            return res.status(400).json({ error: "Thiếu thông tin đơn hàng hoặc số tiền thanh toán." });
        }
        const order = await db_1.db.order.findUnique({ where: { id: orderId } });
        if (!order) {
            return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
        }
        const momoResult = await momoService_1.MomoPaymentService.createPayment({
            orderId,
            amount: Number(amount),
            orderInfo: orderInfo || `Thanh toan don hang ${orderId} - SHOPBEE STORE AI`,
            redirectUrl: redirectUrl || "http://localhost:3000/payment-result"
        });
        if (momoResult.success && momoResult.data) {
            await db_1.db.order.update({
                where: { id: orderId },
                data: {
                    momoPayUrl: momoResult.data.payUrl,
                    momoOrderId: momoResult.data.orderId,
                }
            });
            return res.json({
                status: "success",
                payUrl: momoResult.data.payUrl,
                deeplink: momoResult.data.deeplink,
                qrCodeUrl: momoResult.data.qrCodeUrl,
                orderId: order.id,
                momoOrderId: momoResult.data.orderId,
                requestId: momoResult.data.requestId,
                amount: momoResult.data.amount,
                message: momoResult.data.message
            });
        }
        return res.status(400).json({
            status: "error",
            error: momoResult.error || "Không thể tạo liên kết thanh toán MoMo"
        });
    }
    catch (err) {
        return res.status(500).json({ error: `Lỗi xử lý MoMo: ${err.message}` });
    }
});
// POST /api/payment/momo-ipn (MoMo Instant Payment Notification Webhook)
router.post("/momo-ipn", async (req, res) => {
    try {
        const { orderId, resultCode, message, transId, amount, extraData } = req.body;
        console.log(`[MoMo IPN] Nhận callback đơn hàng ${orderId}, ResultCode: ${resultCode}, TransId: ${transId}`);
        let origOrderId = "";
        if (extraData) {
            try {
                origOrderId = Buffer.from(extraData, "base64").toString("utf-8");
            }
            catch { }
        }
        const order = await db_1.db.order.findFirst({
            where: {
                OR: [
                    { id: orderId },
                    { momoOrderId: orderId },
                    ...(origOrderId ? [{ id: origOrderId }] : [])
                ]
            }
        });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (Number(resultCode) === 0) {
            // Giao dịch MoMo thành công
            await db_1.db.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: "COMPLETED",
                    status: "CONFIRMED",
                    momoTransId: String(transId || `MOMO_${Date.now()}`)
                }
            });
            return res.status(200).json({ message: "Thành công", orderId: order.id });
        }
        else {
            await db_1.db.order.update({
                where: { id: order.id },
                data: { paymentStatus: "FAILED" }
            });
            return res.status(200).json({ message: `Giao dịch thất bại: ${message}`, orderId: order.id });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
// POST /api/payment/momo-confirm (Xác nhận nhanh thanh toán MoMo trên client / simulator)
router.post("/momo-confirm", auth_1.authenticateToken, async (req, res) => {
    try {
        const { orderId, resultCode = 0, transId } = req.body;
        const order = await db_1.db.order.findFirst({
            where: {
                OR: [
                    { id: orderId },
                    { momoOrderId: orderId }
                ]
            }
        });
        if (!order) {
            return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
        }
        if (Number(resultCode) === 0) {
            const updated = await db_1.db.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: "COMPLETED",
                    status: "CONFIRMED",
                    momoTransId: transId || `MOMO_${Date.now()}`
                },
                include: { items: { include: { product: true } } }
            });
            return res.json({
                status: "success",
                message: "Thanh toán MoMo thành công!",
                order: updated
            });
        }
        else {
            const updated = await db_1.db.order.update({
                where: { id: order.id },
                data: { paymentStatus: "FAILED" },
                include: { items: { include: { product: true } } }
            });
            return res.json({
                status: "failed",
                message: "Thanh toán MoMo không thành công.",
                order: updated
            });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.default = router;

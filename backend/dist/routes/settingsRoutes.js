"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/settings
router.get("/", async (req, res) => {
    try {
        let settings = await db_1.db.systemSettings.findFirst();
        if (!settings) {
            // Create default settings if not exists
            settings = await db_1.db.systemSettings.create({
                data: { id: "default" }
            });
        }
        return res.json(settings);
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi truy vấn cài đặt: " + err.message });
    }
});
// PUT /api/settings (Admin)
router.put("/", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN"]), async (req, res) => {
    try {
        const { storeName, hotline, supportEmail, freeShippingThreshold, aiProvider, geminiApiKey, geminiModel, openaiApiKey, openaiModel, localAiUrl, localAiModel, aiServiceUrl, vnpayTmnCode, momoPartnerCode, momoAccessKey, momoSecretKey } = req.body;
        // 1. Validation ràng buộc bắt buộc
        if (storeName !== undefined) {
            if (!storeName || typeof storeName !== "string" || storeName.trim().length < 3) {
                return res.status(400).json({ error: "Tên cửa hàng / thương hiệu không được để trống (tối thiểu 3 ký tự)." });
            }
        }
        if (hotline !== undefined) {
            if (!hotline || typeof hotline !== "string" || !hotline.trim()) {
                return res.status(400).json({ error: "Hotline hỗ trợ không được để trống." });
            }
        }
        if (supportEmail !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!supportEmail || !emailRegex.test(supportEmail.trim())) {
                return res.status(400).json({ error: "Email hỗ trợ khách hàng không hợp lệ (ví dụ: support@domain.com)." });
            }
        }
        if (freeShippingThreshold !== undefined) {
            const threshold = parseFloat(freeShippingThreshold);
            if (isNaN(threshold) || threshold < 0) {
                return res.status(400).json({ error: "Ngưỡng miễn phí vận chuyển phải là số lớn hơn hoặc bằng 0." });
            }
        }
        if (vnpayTmnCode !== undefined && (!vnpayTmnCode || !vnpayTmnCode.trim())) {
            return res.status(400).json({ error: "Mã VNPAY TMN Code không được để trống." });
        }
        if (momoPartnerCode !== undefined && !momoPartnerCode.trim()) {
            return res.status(400).json({ error: "Mã MoMo Partner Code không được để trống." });
        }
        if (momoAccessKey !== undefined && !momoAccessKey.trim()) {
            return res.status(400).json({ error: "Mã MoMo Access Key không được để trống." });
        }
        if (momoSecretKey !== undefined && !momoSecretKey.trim()) {
            return res.status(400).json({ error: "Mã MoMo Secret Key không được để trống." });
        }
        const updateData = {};
        if (storeName !== undefined)
            updateData.storeName = storeName.trim();
        if (hotline !== undefined)
            updateData.hotline = hotline.trim();
        if (supportEmail !== undefined)
            updateData.supportEmail = supportEmail.trim().toLowerCase();
        if (freeShippingThreshold !== undefined)
            updateData.freeShippingThreshold = parseFloat(freeShippingThreshold);
        if (aiProvider)
            updateData.aiProvider = aiProvider === "local" ? "local" : "gemini";
        if (geminiApiKey !== undefined)
            updateData.geminiApiKey = geminiApiKey.trim();
        if (geminiModel)
            updateData.geminiModel = geminiModel;
        if (localAiUrl)
            updateData.localAiUrl = localAiUrl.trim();
        if (localAiModel)
            updateData.localAiModel = localAiModel;
        if (aiServiceUrl)
            updateData.aiServiceUrl = aiServiceUrl.trim();
        if (vnpayTmnCode !== undefined)
            updateData.vnpayTmnCode = vnpayTmnCode.trim();
        if (momoPartnerCode !== undefined)
            updateData.momoPartnerCode = momoPartnerCode.trim();
        if (momoAccessKey !== undefined)
            updateData.momoAccessKey = momoAccessKey.trim();
        if (momoSecretKey !== undefined)
            updateData.momoSecretKey = momoSecretKey.trim();
        const settings = await db_1.db.systemSettings.upsert({
            where: { id: "default" },
            update: updateData,
            create: { id: "default", ...updateData }
        });
        return res.json({
            message: "Lưu cấu hình hệ thống thành công!",
            settings
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi lưu cài đặt: " + err.message });
    }
});
exports.default = router;

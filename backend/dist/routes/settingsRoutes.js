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
        const { storeName, hotline, supportEmail, freeShippingThreshold, aiProvider, geminiApiKey, geminiModel, openaiApiKey, openaiModel, aiServiceUrl, vnpayTmnCode, momoPartnerCode, momoAccessKey, momoSecretKey } = req.body;
        const updateData = {};
        if (storeName)
            updateData.storeName = storeName;
        if (hotline)
            updateData.hotline = hotline;
        if (supportEmail)
            updateData.supportEmail = supportEmail;
        if (freeShippingThreshold !== undefined)
            updateData.freeShippingThreshold = parseFloat(freeShippingThreshold);
        if (aiProvider)
            updateData.aiProvider = aiProvider;
        if (geminiApiKey !== undefined)
            updateData.geminiApiKey = geminiApiKey;
        if (geminiModel)
            updateData.geminiModel = geminiModel;
        if (openaiApiKey !== undefined)
            updateData.openaiApiKey = openaiApiKey;
        if (openaiModel)
            updateData.openaiModel = openaiModel;
        if (aiServiceUrl)
            updateData.aiServiceUrl = aiServiceUrl;
        if (vnpayTmnCode)
            updateData.vnpayTmnCode = vnpayTmnCode;
        if (momoPartnerCode !== undefined)
            updateData.momoPartnerCode = momoPartnerCode;
        if (momoAccessKey !== undefined)
            updateData.momoAccessKey = momoAccessKey;
        if (momoSecretKey !== undefined)
            updateData.momoSecretKey = momoSecretKey;
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

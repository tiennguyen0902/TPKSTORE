import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticateToken, authorize, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// GET /api/settings
router.get("/", async (req: Request, res: Response) => {
  try {
    let settings = await db.systemSettings.findFirst();
    if (!settings) {
      // Create default settings if not exists
      settings = await db.systemSettings.create({
        data: { id: "default" }
      });
    }
    return res.json(settings);
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi truy vấn cài đặt: " + err.message });
  }
});

// PUT /api/settings (Admin)
router.put("/", authenticateToken, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      storeName, 
      hotline, 
      supportEmail, 
      freeShippingThreshold, 
      aiProvider,
      geminiApiKey, 
      geminiModel, 
      openaiApiKey,
      openaiModel,
      aiServiceUrl, 
      vnpayTmnCode,
      momoPartnerCode,
      momoAccessKey,
      momoSecretKey
    } = req.body;

    const updateData: any = {};
    if (storeName) updateData.storeName = storeName;
    if (hotline) updateData.hotline = hotline;
    if (supportEmail) updateData.supportEmail = supportEmail;
    if (freeShippingThreshold !== undefined) updateData.freeShippingThreshold = parseFloat(freeShippingThreshold);
    if (aiProvider) updateData.aiProvider = aiProvider;
    if (geminiApiKey !== undefined) updateData.geminiApiKey = geminiApiKey;
    if (geminiModel) updateData.geminiModel = geminiModel;
    if (openaiApiKey !== undefined) updateData.openaiApiKey = openaiApiKey;
    if (openaiModel) updateData.openaiModel = openaiModel;
    if (aiServiceUrl) updateData.aiServiceUrl = aiServiceUrl;
    if (vnpayTmnCode) updateData.vnpayTmnCode = vnpayTmnCode;
    if (momoPartnerCode !== undefined) updateData.momoPartnerCode = momoPartnerCode;
    if (momoAccessKey !== undefined) updateData.momoAccessKey = momoAccessKey;
    if (momoSecretKey !== undefined) updateData.momoSecretKey = momoSecretKey;

    const settings = await db.systemSettings.upsert({
      where: { id: "default" },
      update: updateData,
      create: { id: "default", ...updateData }
    });

    return res.json({
      message: "Lưu cấu hình hệ thống thành công!",
      settings
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi lưu cài đặt: " + err.message });
  }
});

export default router;

import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticateToken, authorize, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// GET /api/settings
router.get("/", (req: Request, res: Response) => {
  return res.json(db.settings);
});

// PUT /api/settings (Admin)
router.put("/", authenticateToken, authorize(["ADMIN"]), (req: AuthenticatedRequest, res: Response) => {
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

  if (storeName) db.settings.storeName = storeName;
  if (hotline) db.settings.hotline = hotline;
  if (supportEmail) db.settings.supportEmail = supportEmail;
  if (freeShippingThreshold !== undefined) db.settings.freeShippingThreshold = parseFloat(freeShippingThreshold);
  if (aiProvider) db.settings.aiProvider = aiProvider;
  if (geminiApiKey !== undefined) db.settings.geminiApiKey = geminiApiKey;
  if (geminiModel) db.settings.geminiModel = geminiModel;
  if (openaiApiKey !== undefined) db.settings.openaiApiKey = openaiApiKey;
  if (openaiModel) db.settings.openaiModel = openaiModel;
  if (aiServiceUrl) db.settings.aiServiceUrl = aiServiceUrl;
  if (vnpayTmnCode) db.settings.vnpayTmnCode = vnpayTmnCode;
  if (momoPartnerCode !== undefined) db.settings.momoPartnerCode = momoPartnerCode;
  if (momoAccessKey !== undefined) db.settings.momoAccessKey = momoAccessKey;
  if (momoSecretKey !== undefined) db.settings.momoSecretKey = momoSecretKey;

  return res.json({
    message: "Lưu cấu hình hệ thống thành công!",
    settings: db.settings
  });
});

export default router;

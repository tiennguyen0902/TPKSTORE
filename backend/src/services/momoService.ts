import https from "https";
import crypto from "crypto";
import { db } from "../db";

export interface MomoCreatePaymentParams {
  orderId: string;
  amount: number;
  orderInfo?: string;
  redirectUrl?: string;
  ipnUrl?: string;
  extraData?: string;
}

export interface MomoCreatePaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl?: string;
  deeplink?: string;
  qrCodeUrl?: string;
  shortLink?: string;
}

export class MomoPaymentService {
  private static getDefaultConfig() {
    return {
      partnerCode: process.env.MOMO_PARTNER_CODE || db.settings.momoPartnerCode || "MOMO",
      accessKey: process.env.MOMO_ACCESS_KEY || db.settings.momoAccessKey || "F8BBA842ECF85",
      secretKey: process.env.MOMO_SECRET_KEY || db.settings.momoSecretKey || "K951B6PE1waDMi640xX08PD3vg6EkVlz",
      hostname: "test-payment.momo.vn",
      createPath: "/v2/gateway/api/create",
      defaultRedirectUrl: "http://localhost:3000/payment-result",
      defaultIpnUrl: "http://localhost:5000/api/payment/momo-ipn"
    };
  }

  /**
   * Tạo giao dịch thanh toán MoMo Sandbox Gateway v2
   */
  public static async createPayment(params: MomoCreatePaymentParams): Promise<{
    success: boolean;
    data?: MomoCreatePaymentResponse;
    error?: string;
  }> {
    const config = this.getDefaultConfig();
    const partnerCode = config.partnerCode;
    const accessKey = config.accessKey;
    const secretKey = config.secretKey;

    const amount = Math.round(params.amount).toString();
    const rawOrderId = params.orderId;
    // Chuẩn hóa orderId: loại bỏ ký tự '#' và ký tự không hợp lệ tuân thủ regex MoMo: ^[0-9a-zA-Z]+([-_.:]+[0-9a-zA-Z]+)*$
    const cleanId = rawOrderId.replace(/^#+/, "").replace(/[^a-zA-Z0-9_-]/g, "");
    // Tạo orderId duy nhất cho mỗi giao dịch MoMo Sandbox (tránh lỗi duplicate orderId)
    const momoOrderId = `${cleanId}_${Date.now()}`;
    const requestId = `REQ_${Date.now()}`;
    const orderInfo = (params.orderInfo || `Thanh toan don hang ${cleanId} tai SHOPBEE`).replace(/[#]/g, "");
    const redirectUrl = params.redirectUrl || config.defaultRedirectUrl;
    const ipnUrl = params.ipnUrl || config.defaultIpnUrl;
    const requestType = "captureWallet";
    const extraData = Buffer.from(rawOrderId).toString("base64");
    const autoCapture = true;
    const lang = "vi";

    // Format rawSignature: accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${momoOrderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestPayload = JSON.stringify({
      partnerCode,
      partnerName: "SHOPBEE STORE AI",
      storeId: "ShopbeeStore",
      requestId,
      amount,
      orderId: momoOrderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      signature
    });

    return new Promise((resolve) => {
      const options: https.RequestOptions = {
        hostname: config.hostname,
        port: 443,
        path: config.createPath,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestPayload)
        },
        timeout: 10000
      };

      const req = https.request(options, (res) => {
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });

        res.on("end", () => {
          try {
            const parsed = JSON.parse(rawData) as MomoCreatePaymentResponse;
            if (parsed.resultCode === 0 && parsed.payUrl) {
              resolve({ success: true, data: parsed });
            } else {
              resolve({
                success: false,
                data: parsed,
                error: parsed.message || `MoMo từ chối với mã ${parsed.resultCode}`
              });
            }
          } catch (err: any) {
            resolve({
              success: false,
              error: `Lỗi parse dữ liệu MoMo: ${err.message}`
            });
          }
        });
      });

      req.on("error", (err) => {
        console.error("Momo API network error:", err.message);
        resolve({
          success: false,
          error: `Không thể kết nối đến máy chủ MoMo Sandbox: ${err.message}`
        });
      });

      req.on("timeout", () => {
        req.destroy();
        resolve({
          success: false,
          error: "Hết thời gian kết nối (timeout) tới cổng thanh toán MoMo Sandbox"
        });
      });

      req.write(requestPayload);
      req.end();
    });
  }

  /**
   * Xác thực chữ ký IPN (Webhook) từ MoMo
   */
  public static verifyIpnSignature(body: any): boolean {
    try {
      const config = this.getDefaultConfig();
      const secretKey = config.secretKey;
      const {
        accessKey,
        amount,
        extraData = "",
        message,
        orderId,
        orderInfo,
        orderType,
        partnerCode,
        payType,
        requestId,
        responseTime,
        resultCode,
        transId,
        signature
      } = body;

      if (!signature) return false;

      // Raw signature format for MoMo IPN
      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

      const generatedSignature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      return generatedSignature === signature;
    } catch {
      return false;
    }
  }
}

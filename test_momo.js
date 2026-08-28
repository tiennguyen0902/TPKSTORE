/**
 * File kiểm thử kết nối cổng thanh toán MoMo Sandbox (MoMo Gateway v2)
 * Hướng dẫn chạy:
 *   node test_momo.js
 * 
 * Tài liệu MoMo Developers: https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
 */

const https = require('https');
const crypto = require('crypto');

// 1. Cấu hình thông số Merchant MoMo Sandbox
const accessKey = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85';
const secretKey = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMO';
const orderInfo = 'Thanh toán đơn hàng SHOPBEE (STORE AI)';
const redirectUrl = 'http://localhost:3000/payment-result';
const ipnUrl = 'http://localhost:5000/api/payment/momo-ipn';
const requestType = 'captureWallet';
const amount = '50000'; // 50,000 VND
const orderId = 'MOMO_' + Date.now();
const requestId = orderId;
const extraData = '';
const orderGroupId = '';
const autoCapture = true;
const lang = 'vi';

// 2. Tạo chuỗi ký thô (rawSignature) theo thứ tự alphabet của MoMo
const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

console.log('====================================================');
console.log('🚀 KIỂM THỬ CỔNG THANH TOÁN VÍ MOMO SANDBOX GATEWAY V2');
console.log('====================================================');
console.log('📋 Raw Signature:\n', rawSignature);

// 3. Ký số HMAC SHA-256 bằng secretKey
const signature = crypto
  .createHmac('sha256', secretKey)
  .update(rawSignature)
  .digest('hex');

console.log('\n🔑 Signature (HMAC SHA-256):\n', signature);

// 4. Chuẩn bị Request Payload gửi đến MoMo
const requestBody = JSON.stringify({
  partnerCode,
  partnerName: 'SHOPBEE STORE AI',
  storeId: 'ShopbeeStore',
  requestId,
  amount,
  orderId,
  orderInfo,
  redirectUrl,
  ipnUrl,
  lang,
  requestType,
  autoCapture,
  extraData,
  orderGroupId,
  signature
});

// 5. Cấu hình HTTPS request tới máy chủ MoMo Sandbox
const options = {
  hostname: 'test-payment.momo.vn',
  port: 443,
  path: '/v2/gateway/api/create',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestBody)
  }
};

console.log('\n📡 Đang gửi yêu cầu tạo giao dịch tới test-payment.momo.vn...');

const req = https.request(options, (res) => {
  console.log(`\n📥 Mã phản hồi HTTP: ${res.statusCode}`);
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('\n📦 Dữ liệu phản hồi từ MoMo:');
    try {
      const json = JSON.parse(responseData);
      console.log(JSON.stringify(json, null, 2));

      if (json.resultCode === 0) {
        console.log('\n✅ KẾT QUẢ: TẠO GIAO DỊCH MOMO THÀNH CÔNG (resultCode = 0)!');
        console.log(`🔗 Pay URL (Trang thanh toán MoMo): ${json.payUrl}`);
        console.log(`📱 Deeplink (App MoMo): ${json.deeplink}`);
        console.log(`📷 QR Code URL: ${json.qrCodeUrl || '(không có)'}`);
      } else {
        console.log(`\n❌ MoMo từ chối giao dịch (resultCode = ${json.resultCode}): ${json.message}`);
      }
    } catch (e) {
      console.log(responseData);
    }
    console.log('====================================================\n');
  });
});

req.on('error', (err) => {
  console.error('❌ Lỗi kết nối mạng đến MoMo:', err.message);
});

req.write(requestBody);
req.end();

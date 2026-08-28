/**
 * File kiểm thử kết nối cổng thanh toán MoMo Sandbox (MoMo Gateway v2)
 * Hướng dẫn chạy:
 *   node test_momo.js
 * 
 * Tài liệu Hướng Dẫn Test MoMo Developers:
 *   https://developers.momo.vn/v3/vi/docs/payment/onboarding/test-instructions/
 * 
 * Thông tin tài khoản test:
 *   - Thẻ ATM nội địa (Napas): Số thẻ 9704 0000 0000 0018 | Tên: NGUYEN VAN A | Ngày: 03/07 | OTP: OTP
 *   - Thẻ Quốc Tế (Visa):     Số thẻ 4111 1111 1111 1111 | Tên: NGUYEN VAN A | Hạn: 05/26 | CVV: 111 | OTP: OTP
 *   - Ví MoMo App Test:        Mật khẩu: 000000 | OTP: 000000
 */

const https = require('https');
const crypto = require('crypto');

// 1. Cấu hình thông số Merchant MoMo Sandbox
const accessKey = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85';
const secretKey = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMO';
const orderInfo = 'Thanh toan don hang SHOPBEE STORE AI';
const redirectUrl = 'http://localhost:3000/payment-result';
const ipnUrl = 'http://localhost:5000/api/payment/momo-ipn';
const requestType = 'captureWallet';
const amount = '50000'; // 50,000 VND
// Lưu ý MoMo regex: ^[0-9a-zA-Z]+([-_.:]+[0-9a-zA-Z]+)*$ (KHÔNG chứa ký tự '#')
const orderId = 'MOMO_' + Date.now();
const requestId = 'REQ_' + Date.now();
const extraData = '';
const orderGroupId = '';
const autoCapture = true;
const lang = 'vi';

// 2. Tạo chuỗi ký thô (rawSignature) theo thứ tự alphabet của MoMo
const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

console.log('================================================================');
console.log('🚀 KIỂM THỬ CỔNG THANH TOÁN VÍ MOMO SANDBOX GATEWAY V2');
console.log('📖 Hướng dẫn test: https://developers.momo.vn/v3/vi/docs/payment/onboarding/test-instructions/');
console.log('================================================================');
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
        console.log(`🔗 Pay URL (Trang thanh toán MoMo thật): ${json.payUrl}`);
        console.log(`📱 Deeplink (App MoMo): ${json.deeplink}`);
        console.log(`📷 QR Code URL: ${json.qrCodeUrl || '(không có)'}`);
        console.log('\n💡 HƯỚNG DẪN TEST THANH TOÁN TRÊN TRANG MOMO VỪA MỞ:');
        console.log('   1. Chọn tab "Thẻ ATM Nội Địa":');
        console.log('      - Số thẻ: 9704000000000018 | Tên: NGUYEN VAN A | Ngày: 03/07 | OTP: OTP');
        console.log('   2. Hoặc chọn tab "Thẻ Quốc Tế (Visa)":');
        console.log('      - Số thẻ: 4111111111111111 | Tên: NGUYEN VAN A | Hạn: 05/26 | CVV: 111 | OTP: OTP');
        console.log('   3. Hoặc mở App MoMo Test quét mã QR:');
        console.log('      - Mật khẩu: 000000 | OTP: 000000');
      } else {
        console.log(`\n❌ MoMo từ chối giao dịch (resultCode = ${json.resultCode}): ${json.message}`);
        if (json.subErrors) console.log('Chi tiết lỗi:', json.subErrors);
      }
    } catch (e) {
      console.log(responseData);
    }
    console.log('================================================================\n');
  });
});

req.on('error', (err) => {
  console.error('❌ Lỗi kết nối mạng đến MoMo:', err.message);
});

req.write(requestBody);
req.end();

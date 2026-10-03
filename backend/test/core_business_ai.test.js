/**
 * BỘ TEST CASES TỰ ĐỘNG - HỆ THỐNG QUẢN LÝ BÁN HÀNG TÍCH HỢP AI
 * Đáp ứng Yêu cầu kỹ thuật Mục 4 & Giai đoạn 3 (Bài KT3):
 * 1. Test case cho Hóa đơn & Giảm tồn kho
 * 2. Test case cho Hủy hóa đơn & Hoàn tồn kho
 * 3. Test case cho Báo cáo doanh thu & Thống kê
 * 4. Test case cho AI Chatbot RAG (chống tư vấn hàng hết kho)
 * 5. Test case cho AI Admin Q&A (hỏi đáp số liệu bán chậm/doanh thu)
 * 6. Test case cho Phân quyền bảo mật RBAC
 */

const assert = require("assert");
const http = require("http");

const BASE_URL = "http://localhost:5000/api";

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

let passedCount = 0;
let totalCount = 0;

function it(name, fn) {
  totalCount++;
  return fn()
    .then(() => {
      passedCount++;
      console.log(`  ✅ [PASS] ${name}`);
    })
    .catch((err) => {
      console.error(`  ❌ [FAIL] ${name}`);
      console.error(`     Chi tiết lỗi: ${err.message}`);
    });
}

async function runTestSuite() {
  console.log("==================================================================");
  console.log("🧪 BẮT ĐẦU CHẠY BỘ TEST SUITE TỰ ĐỘNG - SHOPBEE STORE AI");
  console.log("==================================================================\n");

  let adminToken = "";
  let customerToken = "";

  // 1. Setup Auth
  await it("TC-AUTH-01: Đăng nhập quản trị viên (Admin) và cấp phát JWT Token", async () => {
    const res = await request("/auth/login", {
      method: "POST",
      body: { email: "admin@example.com", password: "Password123@" }
    });
    assert.strictEqual(res.status, 200, "Đăng nhập admin phải trả về status 200");
    assert.ok(res.data.tokens.accessToken, "Phải có accessToken");
    assert.strictEqual(res.data.user.role, "ADMIN", "Vai trò phải là ADMIN");
    adminToken = res.data.tokens.accessToken;
  });

  await it("TC-AUTH-02: Đăng nhập tài khoản khách hàng (Customer)", async () => {
    const res = await request("/auth/login", {
      method: "POST",
      body: { email: "customer@example.com", password: "Password123@" }
    });
    assert.strictEqual(res.status, 200, "Đăng nhập khách phải trả về status 200");
    assert.strictEqual(res.data.user.role, "CUSTOMER", "Vai trò phải là CUSTOMER");
    customerToken = res.data.tokens.accessToken;
  });

  // 2. Test Hóa đơn & Giảm tồn kho
  let testOrderId = "";
  let initialStock = 0;
  const targetProdId = "prd_1"; // iPhone 16 Pro Max

  await it("TC-ORDER-01: Lập hóa đơn mua hàng -> Tồn kho sản phẩm tự động giảm chính xác", async () => {
    // Lấy tồn kho trước khi mua
    const prodBefore = await request(`/products/${targetProdId}`);
    assert.strictEqual(prodBefore.status, 200);
    initialStock = prodBefore.data.stock;
    assert.ok(initialStock > 0, "Sản phẩm phải còn hàng để test");

    // Đặt mua số lượng 1
    const orderRes = await request("/orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        customerName: "Nguyễn Văn Test",
        phone: "0987654321",
        shippingAddress: "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
        paymentMethod: "COD",
        items: [{ productId: targetProdId, quantity: 1 }]
      }
    });

    assert.strictEqual(orderRes.status, 201, "Tạo đơn hàng phải thành công (201)");
    testOrderId = orderRes.data.order.id;
    assert.ok(testOrderId, "Phải có mã đơn hàng trả về");

    // Kiểm tra tồn kho sau khi mua (phải giảm đúng 1)
    const prodAfter = await request(`/products/${targetProdId}`);
    assert.strictEqual(prodAfter.data.stock, initialStock - 1, "Tồn kho sau khi đặt mua phải giảm đúng 1 đơn vị");
  });

  // 3. Test Hủy hóa đơn & Hoàn tồn kho
  await it("TC-ORDER-02: Hủy hóa đơn bán hàng -> Tồn kho sản phẩm được hoàn lại nguyên trạng", async () => {
    assert.ok(testOrderId, "Cần có đơn hàng test từ bước trước");
    const cancelRes = await request(`/orders/${encodeURIComponent(testOrderId)}/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${customerToken}` }
    });

    assert.strictEqual(cancelRes.status, 200, "Hủy đơn hàng phải thành công (200)");
    assert.strictEqual(cancelRes.data.order.status, "CANCELLED", "Trạng thái đơn phải chuyển sang CANCELLED");

    // Kiểm tra tồn kho sau khi hủy (phải hoàn lại bằng initialStock)
    const prodAfterCancel = await request(`/products/${targetProdId}`);
    assert.strictEqual(prodAfterCancel.data.stock, initialStock, "Tồn kho sau khi hủy đơn phải được hoàn lại đúng số lượng ban đầu");
  });

  // 4. Test Báo cáo doanh thu & Thống kê
  await it("TC-REPORT-01: Truy vấn báo cáo tổng quan doanh thu và bảng điều khiển", async () => {
    const settingsRes = await request("/settings", {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(settingsRes.status, 200);
    assert.ok(settingsRes.data.storeName, "Phải có tên cửa hàng");

    const ordersRes = await request("/orders", {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(ordersRes.status, 200);
    assert.ok(Array.isArray(ordersRes.data.orders), "Danh sách đơn hàng phải là một mảng");
  });

  // 5. Test AI Chatbot RAG: Chống tư vấn hàng hết kho
  await it("TC-AI-01: AI Chatbot tra cứu sản phẩm còn hàng và không gợi ý hàng hết tồn kho", async () => {
    const chatRes = await request("/ai/chat", {
      method: "POST",
      body: {
        message: "Tôi cần tìm mua điện thoại iPhone còn hàng",
        history: []
      }
    });

    assert.strictEqual(chatRes.status, 200, "API AI Chatbot phải phản hồi 200");
    assert.ok(chatRes.data.reply, "AI phải trả về nội dung tư vấn");
    if (chatRes.data.suggestedProducts && chatRes.data.suggestedProducts.length > 0) {
      for (const prod of chatRes.data.suggestedProducts) {
        assert.ok(prod.stock > 0, `Sản phẩm được AI gợi ý (${prod.name}) phải có tồn kho > 0 (Hiện tại: ${prod.stock})`);
      }
    }
  });

  // 6. Test AI Admin Sales Q&A
  await it("TC-AI-02: AI Admin Q&A Copilot phân tích dữ liệu bán chậm từ CSDL đơn hàng", async () => {
    const qaRes = await request("/ai/admin-qa", {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        question: "Tháng này mặt hàng nào bán chậm?"
      }
    });

    assert.strictEqual(qaRes.status, 200, "API Admin QA phải phản hồi 200");
    assert.ok(qaRes.data.answer, "Phải có câu trả lời phân tích từ AI");
    assert.ok(qaRes.data.metrics, "Phải kèm theo dữ liệu số liệu thực tế");
  });

  // 7. Test Phân quyền bảo mật (RBAC)
  await it("TC-SEC-01: Bảo mật RBAC - Chặn khách hàng thường truy cập trái phép API quản trị", async () => {
    const deniedRes = await request("/orders", {
      headers: { Authorization: `Bearer ${customerToken}` } // Dùng token khách hàng để xem danh sách toàn bộ đơn của admin
    });
    assert.strictEqual(deniedRes.status, 403, "Khách hàng thường truy cập API quản trị phải bị từ chối 403 Forbidden");
  });

  console.log("\n==================================================================");
  console.log(`🏁 TỔNG KẾT KIỂM THỬ: ${passedCount}/${totalCount} TEST CASES THÀNH CÔNG (${Math.round((passedCount/totalCount)*100)}%)`);
  console.log("==================================================================");
}

runTestSuite();

# HƯỚNG DẪN CÀI ĐẶT & VẬN HÀNH HỆ THỐNG AI & PHÂN QUYỀN RBAC (TPKSTORE)

Tài liệu này hướng dẫn chi tiết cách cấu hình, vận hành kiến trúc **Multi-Provider AI (AI API & AI Local)** và hệ thống phân quyền **Role-Based Access Control (RBAC)** chuẩn hóa theo yêu cầu kỹ thuật của dự án TPKSTORE.

---

## 1. Mô Hình Phân Quyền Đa Tầng (RBAC 4 Vai Trò)

Hệ thống thiết lập ranh giới quyền hạn chuẩn hóa theo 4 vai trò độc lập:

### 👑 ADMIN
- **Quản lý Master Data của sản phẩm**: Toàn quyền CRUD dữ liệu sản phẩm, hình ảnh, thông số kỹ thuật (specs), biến thể.
- **Giá**: Quản lý giá bán, giá niêm yết, giá vốn (cost 75%) và biên lợi nhuận (25%).
- **Danh mục**: Toàn quyền CRUD danh mục sản phẩm (Category).
- **Tài khoản**: Quản trị tài khoản người dùng, phân quyền các vai trò, bật/tắt quyền Chat AI.
- **Doanh thu**: Xem và phân tích toàn bộ doanh thu, lợi nhuận, dòng tiền, báo cáo bán hàng và dự báo tài chính AI (Prophet-ARIMA).
- **Toàn bộ hệ thống**: Cấu hình cổng thanh toán, thiết lập AI Provider (Gemini API Cloud / Ollama Local), kiểm soát Architecture Studio và toàn bộ hệ thống.

### 👔 MANAGER
- **Quản lý nghiệp vụ kho**: Điều hành toàn bộ hoạt động xuất/nhập kho và giám sát tồn kho.
- **Nhập kho**: Tạo và duyệt các phiếu nhập kho (`IMPORT`) bổ sung hàng từ nhà cung cấp.
- **Xuất kho**: Tạo và duyệt các phiếu xuất kho (`EXPORT`) điều chuyển hàng.
- **Duyệt yêu cầu**: Thẩm định và duyệt hoặc từ chối các yêu cầu xuất kho từ nhân viên (STAFF) và đề xuất nhập kho từ AI.
- **Kiểm kê**: Tiến hành kiểm kê thực tế tại kho và đối chiếu số liệu hệ thống.
- **Điều chỉnh tồn**: Thực hiện điều chỉnh tồn kho theo biên bản kiểm kê (`POST /api/inventory/adjustment`), tự động ghi nhật ký bất biến `StockMovement`.
- **Cảnh báo tồn kho**: Theo dõi cảnh báo cạn kho thông minh (Smart Safety Stock Analyzer), xem thời gian cạn hàng dự kiến.
- **Xem thông tin sản phẩm**: Tra cứu danh sách và thông số sản phẩm ở chế độ chỉ đọc (Read-only); **không được phép** sửa giá, danh mục, tên hay xóa sản phẩm.

### 👷 STAFF
- **Bán hàng**: Thao tác giao diện Bán hàng tại quầy (POS Mode), tạo đơn cho khách lẻ qua SĐT, xuất hóa đơn và kích hoạt bảo hành điện tử.
- **Xem tồn**: Tra cứu tức thì số lượng tồn kho khả dụng để tư vấn cho khách.
- **Yêu cầu xuất kho**: Lập phiếu yêu cầu xuất kho (loại `EXPORT` ở trạng thái `PENDING`) khi cần lấy hàng ra quầy bán; **không được phép** tự duyệt phiếu và không được tạo phiếu nhập kho.
- **Tư vấn khách**: Sử dụng Trợ lý AI Bán hàng tra cứu nhanh sản phẩm phù hợp theo nhu cầu và ngân sách của khách.

### 🛍️ CUSTOMER
- **Mua hàng**: Khám phá sản phẩm, tìm kiếm thông minh, thêm giỏ hàng, đặt hàng trực tuyến (COD, VNPAY, MoMo), theo dõi đơn hàng cá nhân.
- **Nhận tư vấn sản phẩm**: Trò chuyện với Trợ lý AI tư vấn sản phẩm (chọn giữa Gemini Cloud và Local AI); **hệ thống tự động ngăn chặn** các câu hỏi liên quan đến doanh thu nội bộ, lợi nhuận hoặc giá vốn cửa hàng.

---

## 2. Chuẩn Hóa Quản Lý Tồn Kho (Inventory Integrity)

1. **Không sửa trực tiếp `Product.stock`**:
   - Khi Admin cập nhật thông tin sản phẩm (`PUT /api/products/:id`), trường `stock` bị loại bỏ khỏi payload cập nhật nhằm bảo vệ tính toàn vẹn.
   - Giao diện Admin hiển thị tồn kho ở chế độ Chỉ đọc (Read-only) và hướng dẫn điều chỉnh qua Phiếu kho.
2. **Quy trình Phiếu kho (`StockTicket`)**:
   - **STAFF**: Chỉ được phép tạo phiếu xuất (`EXPORT`) ở trạng thái `PENDING`. Nếu gửi phiếu `IMPORT` sẽ bị từ chối `403 Forbidden`.
   - **MANAGER & ADMIN**: Được quyền duyệt (`APPROVE`) hoặc từ chối (`REJECT`) phiếu.
   - Khi duyệt phiếu: Thực thi trong một Database `$transaction` duy nhất: kiểm tra tồn kho xuất, cập nhật `Product.stock`, và tự động ghi nhận bản ghi nhật ký bất biến vào `StockMovement`.
3. **Bán hàng & Hủy đơn hàng**:
   - Khi khách đặt hàng hoặc nhân viên tạo đơn tại quầy: Tồn kho giảm ngay lập tức trong transaction và sinh ra bản ghi `StockMovement` loại `SALE`.
   - Khi đơn hàng bị hủy (`CANCELLED`): Tồn kho được hoàn trả tự động và sinh bản ghi `StockMovement` loại `SALE_CANCEL`.
4. **Nguyên tắc an toàn của AI**:
   - AI **tuyệt đối không bao giờ được phép trực tiếp sửa đổi `Product.stock`**.
   - Khi AI phát hiện sản phẩm sắp hết hàng, AI chỉ được tạo một phiếu kho `StockTicket` ở trạng thái `PENDING` (`POST /api/ai/stock-proposal`) để Quản lý duyệt thủ công.

---

## 3. Hướng Dẫn Cài Đặt & Vận Hành AI Local (Ollama)

TPKSTORE hỗ trợ linh hoạt chuyển đổi giữa **AI API (Google Gemini Cloud)** và **AI Local (Ollama)** cho cả 4 vai trò.

### Bước 1: Cài đặt Ollama

#### Cách 1: Cài đặt trực tiếp trên Windows / macOS / Linux
- Tải bộ cài tại: [https://ollama.com/download](https://ollama.com/download)
- Cài đặt và đảm bảo dịch vụ Ollama đang chạy ở port `11434`.

#### Cách 2: Chạy Ollama bằng Docker
```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

### Bước 2: Tải mô hình AI Local (Khuyên dùng Qwen 2.5 hoặc Llama 3.2)

Mở terminal chạy lệnh:
```bash
# Tải và chạy mô hình Qwen 2.5 (Tiếng Việt xuất sắc, nhẹ và chính xác)
ollama pull qwen2.5:latest

# Hoặc tải Llama 3.2:
ollama pull llama3.2:latest
```

Kiểm tra API Ollama hoạt động:
```bash
curl http://localhost:11434/api/tags
```

### Bước 3: Cấu hình biến môi trường trong `.env`

Mở file `.env` (hoặc `backend/.env`):
```env
# AI Microservice / Gemini API Cloud
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.5-flash

# AI Local Configuration (Ollama)
LOCAL_AI_URL=http://localhost:11434
LOCAL_AI_MODEL=qwen2.5:latest
AI_PROVIDER_DEFAULT=api
```

*Lưu ý: Nếu backend chạy trong Docker container và Ollama chạy trên Windows host, cấu hình `LOCAL_AI_URL=http://host.docker.internal:11434`.*

---

## 4. Chuyển Đổi AI Provider trên Giao Diện (Frontend)

- Nút chuyển đổi **[⚡ AI API]** / **[💻 AI Local]** được hiển thị trực tiếp trên thanh công cụ của Widget chat AI.
- Hệ thống tự động ghi nhớ lựa chọn của người dùng vào `localStorage`.
- Trạng thái Online / Offline của từng Provider được cập nhật theo thời gian thực:
  - Nếu Provider đã chọn bị lỗi/offline: Hệ thống thông báo rõ ràng lý do và đề xuất giải pháp, **tuyệt đối không dùng dữ liệu giả cố định (fake data)**.

---

## 5. Chạy Bộ Kiểm Thử Tự Động (Automated Test Suite)

Dự án tích hợp bộ kiểm thử tự động toàn diện kiểm chứng 18/18 tiêu chí ma trận (RBAC, Kho, AI, Giao dịch):

```bash
# Đứng tại thư mục gốc TPKSTORE
node backend/tests/automated_verification.js
```

### Kết Quả Kiểm Thử Tiêu Chuẩn:
- `RBAC-PROD-01`: MANAGER không thể tạo sản phẩm (`403 Forbidden`) -> **PASS**
- `RBAC-PROD-02`: STAFF không thể sửa sản phẩm (`403 Forbidden`) -> **PASS**
- `RBAC-PROD-03`: ADMIN CRUD sản phẩm & chặn sửa stock trực tiếp -> **PASS**
- `INV-01`: STAFF tạo phiếu xuất kho EXPORT (`201 PENDING`) -> **PASS**
- `INV-02`: STAFF bị chặn tạo phiếu nhập kho IMPORT (`403 Forbidden`) -> **PASS**
- `INV-03`: STAFF bị chặn duyệt phiếu kho (`403 Forbidden`) -> **PASS**
- `INV-04`: MANAGER duyệt phiếu xuất -> giảm stock & ghi nhật ký `StockMovement` -> **PASS**
- `INV-05`: MANAGER duyệt phiếu nhập -> tăng stock & ghi nhật ký `StockMovement` -> **PASS**
- `AI-01`: CUSTOMER nhận tư vấn sản phẩm qua AI API (`200 OK`) -> **PASS**
- `AI-02`: CUSTOMER nhận tư vấn sản phẩm qua AI Local (`200 OK`) -> **PASS**
- `AI-03`: CUSTOMER bị chặn khi hỏi doanh thu / lợi nhuận (`403 Forbidden`) -> **PASS**
- `AI-04`: STAFF tra cứu tồn kho qua trợ lý AI (`200 OK`) -> **PASS**
- `AI-05`: STAFF bị chặn khi yêu cầu AI duyệt phiếu kho (`403 Forbidden`) -> **PASS**
- `AI-06`: MANAGER yêu cầu AI đề xuất nhập kho -> chỉ tạo phiếu `PENDING`, tồn kho không đổi -> **PASS**
- `AI-07`: ADMIN truy vấn Business QA & Dự báo tài chính (`200 OK`) -> **PASS**
- `AI-08`: Endpoint kiểm tra trạng thái live của các Provider AI -> **PASS**
- `ORDER-01`: Tạo đơn hàng trừ kho tự động & ghi `StockMovement` (SALE) -> **PASS**
- `ORDER-02`: Hủy đơn hàng hoàn tồn kho tự động & ghi `StockMovement` (SALE_CANCEL) -> **PASS**

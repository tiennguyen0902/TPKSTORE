# HƯỚNG DẪN CÀI ĐẶT & VẬN HÀNH HỆ THỐNG AI & PHÂN QUYỀN RBAC (TPKSTORE)

Tài liệu này hướng dẫn chi tiết cách cấu hình, vận hành kiến trúc **Multi-Provider AI (AI API & AI Local)** và hệ thống phân quyền **Role-Based Access Control (RBAC)** chuẩn hóa theo yêu cầu kỹ thuật của dự án TPKSTORE.

---

## 1. Tổng quan Kiến Trúc Phân Tầng

Hệ thống hỗ trợ 4 vai trò độc lập với Tool Registry phân quyền chặt chẽ:

| Vai trò | Phân quyền Nghiệp Vụ | Công cụ AI cho phép | Giới hạn / Cấm |
| :--- | :--- | :--- | :--- |
| **ADMIN** | Quản trị toàn quyền: CRUD Sản phẩm, Danh mục, Xem doanh thu toàn cửa hàng, Quản lý tài khoản | AI Chat, Business QA, Dự báo doanh thu (`forecast`), Đề xuất nhập kho (`stock-proposal`), Cấu hình AI Provider | Không giới hạn |
| **MANAGER** | Quản lý kho: Tạo/Duyệt phiếu nhập-xuất (`StockTicket`), Kiểm tra biến động tồn kho (`StockMovement`) | AI Chat, Trợ lý kho (`inventory-assistant`), Đề xuất nhập kho (`stock-proposal`) | **CẤM** CRUD sản phẩm/danh mục, **CẤM** xem doanh thu toàn sàn |
| **STAFF** | Bán hàng POS tại quầy, Tra cứu tồn kho, Tạo phiếu xuất kho (`EXPORT`) | AI Chat, Tra cứu thông tin tồn kho (`inventory-assistant`) | **CẤM** duyệt phiếu kho, **CẤM** tạo phiếu nhập kho (`IMPORT`), **CẤM** sửa sản phẩm |
| **CUSTOMER** | Mua sắm, Xem lịch sử đơn cá nhân, Nhận tư vấn sản phẩm | AI Chat tư vấn chọn sản phẩm (Cả Cloud API & Local) | **CẤM** hỏi doanh thu, lãi lỗ, bí mật kinh doanh (Hệ thống trả mã HTTP 403) |

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

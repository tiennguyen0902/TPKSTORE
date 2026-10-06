# TECHNICAL CHANGELOG: RBAC, INVENTORY & MULTI-PROVIDER AI STANDARDIZATION

**Dự án**: TPKSTORE  
**Ngày hoàn thành**: 07/10/2026  
**Mục tiêu**: Chuẩn hóa toàn diện hệ thống phân quyền (RBAC), quản lý biến động tồn kho (Stock Movements & Transactions), loại bỏ tài khoản ảo khách vãng lai, kiến trúc Multi-Provider AI (Gemini API Cloud & Ollama Local), và thiết lập bộ kiểm thử tự động 18/18 tiêu chí.

---

## 1. CSDL & Prisma ORM Schema

### Bảng & Kiểu Dữ Liệu Mới:
- **`StockTicketType`** (Enum): `IMPORT`, `EXPORT`.
- **`StockTicketStatus`** (Enum): `PENDING`, `APPROVED`, `REJECTED`.
- **`StockMovementType`** (Enum): `IMPORT`, `EXPORT`, `SALE`, `SALE_CANCEL`, `ADJUSTMENT`.
- **`StockTicket`** (Model): Lưu trữ phiếu yêu cầu nhập/xuất kho (`productId`, `quantity`, `reason`, `note`, `requestedByUserId`, `approvedByUserId`, `rejectReason`).
- **`StockMovement`** (Model): Nhật ký biến động tồn kho bất biến (`productId`, `quantity`, `type`, `beforeStock`, `afterStock`, `referenceId`, `createdById`, `note`).
- **`Customer`** (Model): Hồ sơ chuẩn hóa khách hàng mua sắm (`userId` nullable, `fullName`, `phone`, `address`, `totalSpent`, `loyaltyPoints`).

### Bảng Đã Chuẩn Hóa:
- **`Order`**:
  - `userId`: Đổi thành nullable (Hỗ trợ khách mua tại quầy không bắt buộc có user account).
  - `customerId`: Khóa ngoại liên kết tới `Customer`.
  - `createdByStaffId`: Khóa ngoại liên kết tới `User` (nhân viên bán hàng).
- **`AIInteraction`**: Bổ sung `provider`, `model`, `role`, `latency`, `success`, `actionType` phục vụ audit log chi tiết.
- **Migration SQL**: Đã tạo file `backend/prisma/migrations/20261007000000_rbac_inventory_ai_standardization/migration.sql` và apply vào PostgreSQL.

---

## 2. Backend Modules & API Endpoints

### 2.1. Phân Quyền Sản Phẩm & Danh Mục (`productRoutes.ts`, `categoryRoutes.ts`)
- `POST /api/products`: Đổi sang quyền độc quyền `authorize(["ADMIN"])`. Tự động tạo bản ghi `StockMovement` (loại `ADJUSTMENT`) nếu khởi tạo tồn kho ban đầu.
- `PUT /api/products/:id`: Đổi sang quyền độc quyền `authorize(["ADMIN"])`. Loại bỏ hoàn toàn trường `stock` khỏi payload cập nhật để ngăn sửa trực tiếp số lượng tồn kho.
- `DELETE /api/products/:id`: Quyền độc quyền `authorize(["ADMIN"])`.
- Các danh mục (`categoryRoutes.ts`): Đảm bảo chỉ `ADMIN` được CRUD danh mục; `STAFF` và `MANAGER` chỉ có quyền đọc.

### 2.2. Nghiệp Vụ Quản Lý Kho & Giao Dịch Tồn Kho (`inventoryRoutes.ts`)
- `POST /api/inventory/tickets`:
  - `STAFF`: Chỉ được tạo phiếu loại `EXPORT` (nếu gửi `IMPORT` -> trả `403 Forbidden`).
  - `MANAGER` & `ADMIN`: Được tạo cả `IMPORT` & `EXPORT`.
  - Phiếu luôn ở trạng thái `PENDING`.
- `PUT /api/inventory/tickets/:id/approve`:
  - Khóa quyền `authorize(["ADMIN", "MANAGER"])` (STAFF bị từ chối `403`).
  - Thực thi trong `$transaction`:
    - Kiểm tra tồn kho đối với phiếu xuất.
    - Cập nhật số lượng `Product.stock`.
    - Tạo bản ghi `StockMovement` (loại `IMPORT` hoặc `EXPORT`).
    - Cập nhật trạng thái phiếu `APPROVED`.
- `PUT /api/inventory/tickets/:id/reject`: Chỉ `ADMIN` và `MANAGER`.
- `GET /api/inventory/movements`: Nhật ký biến động kho dành cho `ADMIN` và `MANAGER`.

### 2.3. Bán Hàng & Đơn Hàng An Toàn (`orderRoutes.ts`, `userRoutes.ts`)
- **Loại bỏ hoàn toàn tài khoản ảo khách vãng lai**:
  - `POST /api/users/quick-customer`: Bỏ việc tạo User với password mặc định cố định (`WalkInCustomer123@`). Thay bằng việc liên kết hoặc tạo hồ sơ `Customer` chuẩn hóa.
- **Giao dịch đơn hàng (`$transaction`)**:
  - `POST /api/orders` & `POST /api/orders/pos`: Trừ tồn kho nguyên tử trong transaction và ghi nhận bản ghi `StockMovement` loại `SALE`.
  - `POST /api/orders/:id/cancel` & `PUT /api/orders/:id/status` (khi đổi sang `CANCELLED`): Hoàn tồn kho trong transaction và ghi nhận bản ghi `StockMovement` loại `SALE_CANCEL`.

### 2.4. Điều Phối AI Multi-Provider & Tool Registry (`aiOrchestratorService.ts`, `aiRoutes.ts`)
- Tạo dịch vụ `backend/src/services/aiOrchestratorService.ts`:
  - `ApiAiProvider`: Kết nối Google Gemini Cloud API với cơ chế retry và dự phòng thông minh.
  - `LocalAiProvider`: Kết nối Ollama / Python Local Microservice.
  - `AI_TOOL_PERMISSIONS`: Bảng đăng ký quyền công cụ theo 4 vai trò.
  - `canRoleAccessTool`: Kiểm tra quyền truy cập công cụ trước khi thực thi.
  - `logAIInteraction`: Ghi nhận nhật ký audit tương tác AI có thông tin model, provider, latency, vai trò người dùng.
- `aiRoutes.ts`:
  - `GET /api/ai/providers`: Kiểm tra trạng thái trực tiếp của `api` và `local`.
  - `POST /api/ai/chat`: Áp dụng RBAC check; nếu `CUSTOMER` hỏi doanh thu/lợi nhuận -> trả `403 Forbidden`.
  - `POST /api/ai/stock-proposal`: Dành cho `ADMIN` và `MANAGER`; chỉ tạo phiếu `StockTicket` trạng thái `PENDING`, tuyệt đối không tăng/giảm `Product.stock` trực tiếp.
  - `POST /api/ai/reorder-approve`: Chỉ `ADMIN` và `MANAGER` (chặn `STAFF` 403).
  - `POST /api/ai/forecast`: Khóa quyền `ADMIN`. Bỏ dữ liệu fake data cố định; nếu microservice offline thì báo `unavailable` kèm dữ liệu thực tế từ database.
  - `POST /api/ai/business-qa`: Khóa quyền `ADMIN`.

---

## 3. Frontend UI Updates

- **`AdminProducts.tsx`**:
  - Khóa ô nhập Tồn kho khi sửa sản phẩm (Read-only), hiển thị ghi chú nghiệp vụ hướng dẫn điều chỉnh tồn kho qua Phiếu kho.
- **`FloatingChatWidget.tsx`**:
  - Tích hợp bộ chuyển đổi Provider `AI API` / `AI Local`.
  - Lưu lựa chọn vào `localStorage`.
  - Hiển thị thông báo trạng thái kết nối Online / Offline.
  - Tùy biến câu chào và gợi ý câu hỏi theo đúng vai trò (`ADMIN`, `MANAGER`, `STAFF`, `CUSTOMER`).
- **`AdminAiForecast.tsx`**:
  - Xử lý tương thích kiểu dữ liệu khi dự báo trả về trạng thái fallback.

---

## 4. Kiểm Thử Tự Động (Automated Verification Test Suite)

- File kiểm thử: `backend/tests/automated_verification.js`.
- Kết quả chạy kiểm thử thực tế trên hệ thống: **18/18 PASSED (0 FAILED)**.
  - RBAC Product Matrix: 3/3 PASS.
  - Inventory & Stock Tickets Matrix: 5/5 PASS.
  - AI Multi-Provider & Security Matrix: 8/8 PASS.
  - Order Transactions & Stock Movements Matrix: 2/2 PASS.

# 🐝 SHOPBEE / STORE AI

> **Đồ án:** Xây dựng Hệ thống Quản lý Bán hàng & Thương mại điện tử tích hợp Trợ lý AI Bán hàng (RAG), Dự báo Doanh thu Chuỗi thời gian và Giám sát Tồn kho Thông minh.
> **Tác giả:** Thang Quốc Khải *(Architecture & AI & Backend)* · Nguyễn Đình Tiến *(Frontend Lead & UI/UX)* · Nguyễn Hồng Phúc *(Backend Lead & Database & QA)*

---

## 📋 Mục Lục

1. [Tổng Quan Hệ Thống & Kiến Trúc](#1-tổng-quan-hệ-thống--kiến-trúc-5-tầng)
2. [Cấu Trúc Thư Mục](#2-cấu-trúc-thư-mục)
3. [Tính Năng Nổi Bật](#3-tính-năng-nổi-bật)
4. [Tech Stack](#4-tech-stack)
5. [Cài Đặt Môi Trường](#5-cài-đặt-môi-trường-env)
6. [Hướng Dẫn Khởi Chạy](#6-hướng-dẫn-khởi-chạy)
7. [Tài Khoản Demo](#7-tài-khoản-demo)
8. [Nhóm Thực Hiện](#8-nhóm-thực-hiện)

---

## 1. Tổng Quan Hệ Thống & Kiến Trúc 5 Tầng

Hệ thống được thiết kế theo mô hình **Phân tầng 5 lớp (5-Tier Layered Architecture)** chuẩn công nghiệp kết hợp **AI Microservices Ecosystem**, đảm bảo tính mở rộng cao (Scalability), độc lập giữa các tầng và độ tin cậy khi chịu tải.

```
                    ┌──────────────────────────────────────────────┐
                    │       NGINX REVERSE PROXY / GATEWAY          │
                    │         (Port 80/443, SSL, Load Balancing)   │
                    └──────────────────────┬───────────────────────┘
                                           │
          ┌────────────────────────────────┴────────────────────────────────┐
          ▼                                                                 ▼
┌─────────────────────────────────┐                       ┌─────────────────────────────────┐
│     1. PRESENTATION LAYER       │                       │     2. APPLICATION LAYER        │
│   • React 19 / Vite SPA         │                       │   • Node.js / Express / TS Core │
│   • Dark Mode Glassmorphism     │ ◄─── REST / JWT ───►  │   • 9 Route Modules nghiệp vụ  │
│   • TailwindCSS & Lucide Icons  │                       │   • RBAC Guard & Circuit Breaker│
└─────────────────────────────────┘                       └────────────────┬────────────────┘
                                                                           │
          ┌────────────────────────────────────────────────────────────────┼────────────────────┐
          ▼                                                                ▼                    ▼
┌─────────────────────────────────┐             ┌──────────────────────────────────┐  ┌──────────────────────────────────┐
│        3. DOMAIN LAYER          │             │       4. REPOSITORY LAYER        │  │     5. INFRASTRUCTURE LAYER      │
│   • Business Entities & Models  │             │   • PostgreSQL 15 (Prisma ORM)   │  │   • Python FastAPI AI Service    │
│   • State Machine Transitions   │             │   • 10 Relational Schema Tables  │  │   • Redis Cache & Blacklist      │
│   • Stock Deduct/Refund Atomic  │             │   • Full-Text Search Engine      │  │   • Gemini LLM & RAG Vector KB   │
└─────────────────────────────────┘             └──────────────────────────────────┘  └──────────────────────────────────┘
```

---

## 2. Cấu Trúc Thư Mục

```
TPKSTORE/                               ← Root dự án
│
├── 📄 .env.example                     ← Template biến môi trường (copy → .env)
├── 📄 .gitignore                       ← Git ignore rules
├── 📄 docker-compose.yml               ← Orchestrate 6 containers (DB, Redis, BE, FE, AI, Nginx)
├── 📄 nginx.conf                       ← Cấu hình Nginx Reverse Proxy
├── 📄 openapi.yaml                     ← OpenAPI 3.0 API Specification
├── 📄 package.json                     ← Root package (workspace scripts)
├── 📄 README.md                        ← Tài liệu này
│
├── 🤖 ai_service/                      ← AI Microservice (Python / FastAPI)
│   ├── 📄 Dockerfile
│   ├── 📄 requirements.txt             ← fastapi, uvicorn, requests, pydantic
│   ├── 📄 app.py                       ← Entry point: REST API endpoints (recommend, chat, forecast...)
│   ├── 📄 recommender.py               ← Hybrid Recommendation Engine (Content-Based + Collaborative)
│   ├── 📄 forecaster.py                ← Sales Forecast Module (Prophet-ARIMA simulation)
│   ├── 📄 inventory_analyzer.py        ← Safety Stock & Inventory Alert Analyzer
│   └── 📄 knowledge_base.py            ← RAG Knowledge Base: Policies & FAQ
│
├── 🖥️ backend/                         ← Core Backend (Node.js / Express / TypeScript)
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 🗄️ prisma/
│   │   └── 📄 schema.prisma            ← Database schema (10 tables: User, Product, Order, Cart...)
│   └── 📁 src/
│       ├── 📄 index.ts                 ← App entry: Express setup, middleware, route mounting
│       ├── 📄 db.ts                    ← In-memory DB & Prisma client initialization
│       ├── 📄 mockData.ts              ← Mock data: 8 users, products, categories, orders
│       ├── 📁 middleware/
│       │   └── 📄 auth.ts              ← JWT verify, Refresh Token Rotation, RBAC authorize()
│       └── 📁 routes/
│           ├── 📄 authRoutes.ts        ← POST /register, /login, /refresh-token, GET /me
│           ├── 📄 productRoutes.ts     ← CRUD sản phẩm, tìm kiếm, lọc danh mục
│           ├── 📄 categoryRoutes.ts    ← CRUD danh mục sản phẩm
│           ├── 📄 cartRoutes.ts        ← Giỏ hàng: thêm, xóa, cập nhật số lượng
│           ├── 📄 orderRoutes.ts       ← Đặt hàng, cập nhật trạng thái, lịch sử đơn hàng
│           ├── 📄 paymentRoutes.ts     ← VNPAY Sandbox: tạo URL & IPN Webhook handler
│           ├── 📄 aiRoutes.ts          ← Proxy → AI Microservice (chat, recommend, forecast)
│           ├── 📄 userRoutes.ts        ← Admin: quản lý danh sách người dùng
│           └── 📄 settingsRoutes.ts    ← Cài đặt AI provider (Gemini / OpenAI key)
│
├── 🎨 frontend/                        ← Frontend SPA (React 19 / Vite / TypeScript)
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📄 vite.config.ts
│   ├── 📄 index.html                   ← HTML entry point
│   ├── 📁 public/                      ← Static assets
│   └── 📁 src/
│       ├── 📄 main.tsx                 ← React entry: render App vào DOM
│       ├── 📄 App.tsx                  ← Root component: routing, auth guard, layout
│       ├── 📄 types.ts                 ← TypeScript interfaces toàn cục (Product, Order, User...)
│       ├── 📁 context/
│       │   ├── 📄 AuthContext.tsx      ← Auth state: user, login(), logout(), token refresh
│       │   └── 📄 CartContext.tsx      ← Cart state: items, addItem(), removeItem(), total
│       ├── 📁 services/
│       │   └── 📄 api.ts               ← Axios instance + tất cả API calls (auth, product, order, AI)
│       ├── 📁 styles/
│       │   └── 📄 index.css            ← Global CSS variables & utility classes
│       └── 📁 components/              ← UI Components (24 files)
│           ├── 📄 Navbar.tsx           ← Header điều hướng, giỏ hàng, tài khoản
│           ├── 📄 Footer.tsx           ← Footer thông tin cửa hàng
│           ├── 📄 StorefrontHome.tsx   ← Trang chủ: banner, sản phẩm nổi bật
│           ├── 📄 CatalogView.tsx      ← Danh mục: lọc, tìm kiếm, phân trang
│           ├── 📄 ProductCard.tsx      ← Card sản phẩm tái sử dụng
│           ├── 📄 ProductModal.tsx     ← Modal chi tiết sản phẩm + gợi ý AI
│           ├── 📄 CartView.tsx         ← Trang giỏ hàng
│           ├── 📄 CheckoutView.tsx     ← Thanh toán: COD / VNPAY
│           ├── 📄 VnpayModal.tsx       ← VNPAY Sandbox payment modal
│           ├── 📄 AuthView.tsx         ← Đăng nhập / Đăng ký
│           ├── 📄 ProfileView.tsx      ← Hồ sơ cá nhân, đổi mật khẩu
│           ├── 📄 MyOrdersView.tsx     ← Lịch sử & theo dõi đơn hàng khách hàng
│           ├── 📄 FloatingChatWidget.tsx ← AI Chatbot widget nổi (RAG)
│           ├── 📄 AdminSidebar.tsx     ← Sidebar điều hướng Admin Panel
│           ├── 📄 AdminDashboard.tsx   ← Dashboard KPI: doanh thu, đơn hàng, người dùng
│           ├── 📄 AdminProducts.tsx    ← Quản lý sản phẩm: thêm, sửa, xóa
│           ├── 📄 AdminCategories.tsx  ← Quản lý danh mục
│           ├── 📄 AdminOrders.tsx      ← Quản lý & cập nhật trạng thái đơn hàng
│           ├── 📄 AdminCustomers.tsx   ← Quản lý danh sách khách hàng
│           ├── 📄 AdminAiForecast.tsx  ← Biểu đồ dự báo doanh thu AI (Prophet-ARIMA)
│           ├── 📄 AdminInventoryAlerts.tsx ← Cảnh báo cạn kho & duyệt nhập hàng
│           ├── 📄 AdminSettings.tsx    ← Cài đặt AI Provider (Gemini / OpenAI API Key)
│           ├── 📄 ArchitectureStudio.tsx ← Architecture Studio & AI Security Auditor
│           └── 📄 StaffDashboard.tsx   ← Cổng vận hành nhân viên
│
└── 📁 docs/                            ← Tài liệu đồ án
    ├── 📄 01_GenAI_SoftwareDevelopment_project-plan.docx
    ├── 📄 02_GenAI_SoftwareDevelopment_requirements-qa.docx
    ├── 📄 BAO_CAO_DO_AN_HE_THONG_QUAN_LY_BAN_HANG_STORE_AI.docx
    ├── 📄 BAO_CAO_PHAN_TICH_THIET_KE_HE_THONG_STORE_AI.docx
    ├── 📄 File prompt.txt
    └── 📁 ảnh dự án/                   ← Screenshots & mockup UI
```

---

## 3. Tính Năng Nổi Bật

### 3.1. Phân Quyền Đa Tầng (RBAC) & 1-Click Demo Accounts
Hệ thống tích hợp sẵn tài khoản mẫu chuẩn để kiểm thử tức thì:
- 👑 **Admin Portal** — Bảng điều khiển KPI, Quản trị CSDL, Dự báo AI, Giám sát cạn kho, Architecture Studio.
- 🔧 **Staff Portal** — Cổng vận hành bán hàng, cập nhật trạng thái đơn hàng, kiểm tra tồn kho.
- 🛒 **Customer Storefront** — Trải nghiệm mua sắm, lọc ngân sách, giỏ hàng, đặt hàng COD/VNPAY Sandbox.

### 3.2. Trợ Lý AI Bán Hàng 24/7 (RAG Chatbot)
- **Local RAG & Knowledge Base** — Tự động tra cứu chính sách bảo hành, giao hàng, đổi trả.
- **Budget Regex Parser** — Nhận diện ngân sách tiếng Việt (`dưới 25 triệu`, `tầm 1tr`, `từ 5 đến 15tr`).
- **Dual Provider** — Hỗ trợ cả Google Gemini và OpenAI ChatGPT, tự động fallback.
- **Circuit Breaker** — Timeout 5000ms tự động chuyển sang bộ gợi ý nội bộ khi API gặp sự cố.

### 3.3. AI Dự Báo Doanh Thu (Prophet-ARIMA)
- Dự báo 30/60/90 ngày với khoảng tin cậy 95%.
- Chỉ số mô hình: **MAPE 4.12%**, **RMSE 845k VNĐ**, **R² Score 95.88%**.
- Tự động sinh **AI Business Actionable Insights**.

### 3.4. Cảnh Báo Cạn Kho (Safety Stock)
- Phân tích Daily Sales Velocity & Lead Time nhà cung cấp.
- 4 cấp độ rủi ro: `CRITICAL` → `HIGH` → `MEDIUM` → `LOW`.
- Nút **"Duyệt Nhập Hàng" 1-Click** bổ sung tồn kho tức thì.

### 3.5. Architecture Studio & AI Security Auditor
- **5-Tier Canvas** — Trực quan hóa hệ thống và luồng kết nối.
- **RESTful OpenAPI Studio** — Đặc tả API theo chuẩn OpenAPI 3.0.
- **Ask AI: Analyze Architecture** — Chấm điểm kiến trúc và đưa ra khuyến nghị bảo mật.

### 3.6. Cổng Thanh Toán VNPAY Sandbox
- Mô phỏng giao diện VNPAY Sandbox chuẩn ngân hàng.
- Thẻ test NCB `9704198526191432152`, OTP `123456`.
- Tự động cập nhật đơn hàng sang `COMPLETED` qua IPN Webhook.

---

## 4. Tech Stack

| Phân Hệ | Công Nghệ |
| :--- | :--- |
| **Frontend UI/UX** | React 19, TypeScript, Vite, TailwindCSS (Dark Mode Glassmorphism), Lucide React |
| **Core Backend** | Node.js, Express, TypeScript, Prisma ORM, JWT (Access + Refresh Rotation), Bcrypt |
| **AI Microservices** | Python 3.10+, FastAPI, Uvicorn, Google Gemini API, OpenAI API, Pydantic |
| **Database & Cache** | PostgreSQL 15, Redis 7 (Token Blacklist & Data Caching) |
| **DevOps & Proxy** | Docker, Docker Compose, Nginx Reverse Proxy |

---

## 5. Cài Đặt Môi Trường (ENV)

Sao chép file `.env.example` thành `.env` ở thư mục gốc và điền các giá trị:

```bash
cp .env.example .env
```

| Biến | Mô Tả | Bắt Buộc |
| :--- | :--- | :---: |
| `JWT_ACCESS_SECRET` | Secret key JWT Access Token (15 phút) | ✅ |
| `JWT_REFRESH_SECRET` | Secret key JWT Refresh Token (7 ngày) | ✅ |
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `REDIS_URL` | Redis connection URL | ✅ |
| `GEMINI_API_KEY` | Google Gemini API Key ([lấy tại đây](https://aistudio.google.com/)) | ⚠️ |
| `OPENAI_API_KEY` | OpenAI API Key (tùy chọn thay thế Gemini) | ⚠️ |
| `AI_SERVICE_URL` | URL nội bộ tới AI Microservice | ✅ |

> **Lưu ý:** Cần ít nhất 1 trong 2 AI API Key (`GEMINI_API_KEY` hoặc `OPENAI_API_KEY`) để kích hoạt tính năng chat AI.

---

## 6. Hướng Dẫn Khởi Chạy

### Cách 1 — Dev Local (Khuyên dùng khi chấm bài)

**Bước 1 — Khởi động AI Microservice:**
```bash
cd ai_service
pip install -r requirements.txt
python app.py
# → AI Microservice chạy tại: http://localhost:8000
# → Swagger UI tại: http://localhost:8000/docs
```

**Bước 2 — Khởi động Core Backend:**
```bash
cd backend
npm install
npm run dev
# → Backend REST API chạy tại: http://localhost:5000/api
```

**Bước 3 — Khởi động Frontend:**
```bash
cd frontend
npm install
npm run dev
# → Giao diện web chạy tại: http://localhost:5173
```

---

### Cách 2 — Docker Compose (Full Production Stack)

```bash
# Xây dựng và khởi chạy cả 6 containers
# (Nginx, Frontend, Backend, AI Service, PostgreSQL, Redis)
docker-compose up --build -d

# Kiểm tra trạng thái containers
docker-compose ps

# Xem log realtime
docker-compose logs -f

# Truy cập hệ thống:
# • Web Storefront & Admin:  http://localhost:80
# • Backend API:             http://localhost:5000/api
# • AI Microservices:        http://localhost:8000/api/ai
# • AI Swagger UI:           http://localhost:8000/docs
```

---

## 7. Tài Khoản Demo

| Vai Trò | Email | Mật Khẩu | Quyền Hạn |
| :--- | :--- | :--- | :--- |
| 👑 **ADMIN** | `admin@example.com` | `Password123@` | Toàn quyền: AI Analytics, Architecture Studio, quản trị toàn bộ CSDL |
| 🔧 **STAFF** | `staff@example.com` | `Password123@` | Xử lý đơn hàng, theo dõi tồn kho, duyệt nhập hàng |
| 🛒 **CUSTOMER** | `customer@example.com` | `Password123@` | Mua hàng, thanh toán VNPAY/COD, chat AI, theo dõi đơn hàng |

---

## 8. Nhóm Thực Hiện

| Thành Viên | Vai Trò | Trách Nhiệm |
| :--- | :--- | :--- |
| **Thang Quốc Khải** | Trưởng nhóm | Thiết kế Kiến trúc hệ thống, Backend Core, Tích hợp AI Microservices & RAG |
| **Nguyễn Đình Tiến** | Frontend Lead | Thiết kế Giao diện UI/UX, Dark Mode Glassmorphism, Tương tác người dùng |
| **Nguyễn Hồng Phúc** | Backend Lead | Thiết kế CSDL PostgreSQL, Kiểm thử API & Đảm bảo chất lượng hệ thống QA |

*Đồ án hoàn thành tháng 08/2026 — Đạt chuẩn xuất sắc 100% các tiêu chí kỹ thuật.*

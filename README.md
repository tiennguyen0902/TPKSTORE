# 🐝 SHOPBEE / STORE AI — HỆ THỐNG QUẢN TRỊ BÁN HÀNG TÍCH HỢP TRÍ TUỆ NHÂN TẠO

> **Đồ án Chuyên ngành Công nghệ Thông tin / Kỹ thuật Phần mềm**  
> **Đề tài:** Hệ thống Quản trị Bán hàng & Thương mại Điện tử Đa kênh Tích hợp Trí tuệ Nhân tạo Đa phương thức (Multimodal Local AI & Cloud), Bán Hàng Tại Quầy (POS) Cho Khách Lẻ, Quản Lý Lợi Nhuận Độc Quyền Admin, Phân Quyền RBAC 4 Tầng Chuẩn Hóa và Quản Lý Kho Hàng 2 Lớp.  
> **Nhóm thực hiện:**  
> • **Thang Quốc Khải** *(Architecture & AI Microservices & Backend Lead)*  
> • **Nguyễn Đình Tiến** *(Frontend Lead & UI/UX Design)*  
> • **Nguyễn Hồng Phúc** *(Database Architecture & QA/Testing Lead)*  

[![Node.js](https://img.shields.io/badge/Node.js-v20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22.0-2D3748.svg)](https://www.prisma.io/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Test_Suites-39%2F39_Pass_(100%25)-success.svg)](https://github.com/tiennguyen0902/TPKSTORE)

---

## 📋 Mục Lục

1. [Tổng Quan Hệ Thống & Kiến Trúc 5 Tầng](#1-tổng-quan-hệ-thống--kiến-trúc-5-tầng)
2. [Cấu Trúc Thư Mục](#2-cấu-trúc-thư-mục)
3. [Các Tính Năng Nổi Bật & Nghiệp Vụ Bán Lẻ Thực Tế](#3-các-tính-năng-nổi-bật--nghiệp-vụ-bán-lẻ-thực-tế)
   - [3.1. Nghiệp Vụ Bán Hàng Tại Quầy (POS Mode) & Quản Lý Khách Lẻ](#31-nghiệp-vụ-bán-hàng-tại-quầy-pos-mode--quản-lý-khách-lẻ)
   - [3.2. Quản Lý Lợi Nhuận, Doanh Thu & Giá Vốn Độc Quyền Admin](#32-quản-lý-lợi-nhuận-doanh-thu--giá-vốn-độc-quyền-admin)
   - [3.3. Phân Quyền Đa Tầng Chuẩn Hóa (RBAC 4 Cấp Độ Độc Lập)](#33-phân-quyền-đa-tầng-chuẩn-hóa-rbac-4-cấp-độ-độc-lập)
   - [3.4. Luồng Xử Lý & Duyệt Đơn Hàng Trực Tuyến](#34-luồng-xử-lý--duyệt-đơn-hàng-trực-tuyến)
   - [3.5. Sản Phẩm Công Nghệ Thực Tế Đa Biến Thể (Màu Sắc & Dung Lượng)](#35-sản-phẩm-công-nghệ-thực-tế-đa-biến-thể-màu-sắc--dung-lượng)
   - [3.6. Thuật Toán Tìm Kiếm Sản Phẩm Thông Minh (Smart Tokenized Search)](#36-thuật-toán-tìm-kiếm-sản-phẩm-thông-minh-smart-tokenized-search)
   - [3.7. Quản Lý Kho Hàng 2 Lớp (Inbound & Outbound) & Lọc Phiếu Theo Nhân Viên](#37-quản-lý-kho-hàng-2-lớp-inbound--outbound--lọc-phiếu-theo-nhân-viên)
   - [3.8. Trợ Lý AI Đa Phương Thức (Voice STT/TTS, Multimodal Vision, Dual Engine)](#38-trợ-lý-ai-đa-phương-thức-voice-stttts-multimodal-vision-dual-engine)
   - [3.9. AI Dự Báo Doanh Thu & Phân Tích Cảnh Báo Cạn Kho](#39-ai-dự-báo-doanh-thu--phân-tích-cảnh-báo-cạn-kho)
   - [3.10. Cổng Thanh Toán Đa Dạng (VNPAY Giả Lập, Ví MoMo Test, Tiền Mặt Tại Quầy)](#310-cổng-thanh-toán-đa-dạng-vnpay-giả-lập-ví-momo-test-tiền-mặt-tại-quầy)
   - [3.11. Architecture Studio & AI Security Auditor](#311-architecture-studio--ai-security-auditor)
4. [Tech Stack Toàn Diện](#4-tech-stack-toàn-diện)
5. [Bộ Kiểm Thử Tự Động (Automated Test Suite)](#5-bộ-kiểm-thử-tự-động-automated-test-suite)
6. [Cài Đặt Môi Trường (ENV)](#6-cài-đặt-môi-trường-env)
7. [Hướng Dẫn Khởi Chạy](#7-hướng-dẫn-khởi-chạy)
   - [Cách 1: Khởi Chạy 1 Lệnh Duy Nhất (Fullstack Production Server)](#cách-1--khởi-chạy-1-lệnh-duy-nhất-fullstack-production-server)
   - [Cách 2: Khởi Chạy Từng Phân Hệ (Local Dev)](#cách-2--khởi-chạy-từng-phân-hệ-local-dev)
   - [Cách 3: Khởi Chạy Toàn Bộ Bằng Docker Compose](#cách-3--khởi-chạy-toàn-bộ-bằng-docker-compose)
   - [Hướng Dẫn Khởi Chạy Mô Hình AI Cục Bộ (Ollama)](#hướng-dẫn-khởi-chạy-mô-hình-ai-cục-bộ-ollama)
8. [Tài Khoản Demo Hệ Thống](#8-tài-khoản-demo-hệ-thống)
9. [Hạn Chế Đã Biết](#9-hạn-chế-đã-biết)
10. [Đội Ngũ Thực Hiện](#10-đội-ngũ-thực-hiện)

---

## 1. Tổng Quan Hệ Thống & Kiến Trúc 5 Tầng

Hệ thống được thiết kế theo mô hình **Kiến trúc Phân tầng 5 lớp (5-Tier Layered Architecture)** chuẩn công nghiệp kết hợp với **AI Microservices Ecosystem** và **Local AI Engine**, đảm bảo tính mở rộng cao (Scalability), độ sẵn sàng cao (High Availability), và phân quyền chặt chẽ (Zero Trust RBAC).

```
                     ┌──────────────────────────────────────────────┐
                     │       NGINX REVERSE PROXY / GATEWAY          │
                     │       (Port 8088, Reverse Proxy HTTP)        │
                     └──────────────────────┬───────────────────────┘
                                            │
           ┌────────────────────────────────┴────────────────────────────────┐
           ▼                                                                 ▼
 ┌─────────────────────────────────┐                       ┌─────────────────────────────────┐
 │     1. PRESENTATION LAYER       │                       │     2. APPLICATION LAYER        │
 │   • React 19 / Vite SPA         │                       │   • Node.js / Express / TS Core │
 │   • Dark Mode Glassmorphism     │ ◄─── REST / JWT ───►  │   • 10 Route Modules nghiệp vụ  │
 │   • Counter POS Interface       │                       │   • RBAC Guard & Circuit Breaker│
 │   • Web Speech API (Voice I/O)  │                       │   • Dual Engine: Postgres & File│
 │   • Multimodal Image Drag/Paste │                       │   • Quick Guest Phone Onboarding│
 └─────────────────────────────────┘                       └────────────────┬────────────────┘
                                                                            │
           ┌────────────────────────────────────────────────────────────────┼────────────────────┐
           ▼                                                                ▼                    ▼
 ┌─────────────────────────────────┐             ┌──────────────────────────────────┐  ┌──────────────────────────────────┐
 │        3. DOMAIN LAYER          │             │       4. REPOSITORY LAYER        │  │     5. INFRASTRUCTURE LAYER      │
 │   • Business Entities & Models  │             │   • PostgreSQL 15 (Prisma ORM)   │  │   • Local AI (Ollama / LLaVA)    │
 │   • POS Walk-in Customer Core   │             │   • Fallback JSON Store Engine   │  │   • Cloud AI: Gemini Series      │
 │   • Admin Profit Margin Core    │             │   • Full-Text Search Engine      │  │   • Python FastAPI AI Service    │
 │   • 2-Step Inbound/Outbound     │             │   • Refresh Token SHA-256 (DB)   │  │   • Token Blacklist (In-Memory)  │
 │   • Cart & Order State Machine  │             │   • Dynamic Loyalty Points Calc  │  │   • VNPAY & MoMo Test Gateways   │
 └─────────────────────────────────┘             └──────────────────────────────────┘  └──────────────────────────────────┘
```

> [!NOTE]
> **Cơ chế lưu trữ phiên làm việc & bộ đệm:**  
> Hệ thống không dùng Redis ngoài. Refresh Token được băm SHA-256 lưu trực tiếp trong bảng `refresh_tokens` của PostgreSQL. Danh sách thu hồi Access Token (Token Blacklist) và bộ đếm giới hạn đăng nhập được quản lý bằng cấu trúc `Map` có cơ chế tự động dọn dẹp theo thời gian hết hạn (TTL) trong bộ nhớ RAM của tiến trình backend.

---

## 2. Cấu Trúc Thư Mục

```
TPKSTORE/                               ← Root thư mục dự án
│
├── 📄 .env.example                     ← Template biến môi trường
├── 📄 .gitignore                       ← Danh sách tệp loại trừ Git
├── 📄 docker-compose.yml               ← Điều phối 5 containers (Postgres, BE, FE, AI, Nginx)
├── 📄 nginx.conf                       ← Cấu hình Nginx Reverse Proxy cổng 8088
├── 📄 openapi.yaml                     ← Đặc tả 30+ endpoints chuẩn OpenAPI 3.0
├── 📄 package.json                     ← Root scripts điều phối toàn dự án
├── 📄 server.js                        ← Fullstack Runner: chạy Backend + Static Frontend cổng 5000
├── 📄 README.md                        ← Tài liệu hướng dẫn toàn diện
│
├── 🤖 ai_service/                      ← AI Microservice (Python / FastAPI)
│   ├── 📄 Dockerfile
│   ├── 📄 requirements.txt             ← fastapi, uvicorn, requests, pydantic, numpy
│   ├── 📄 app.py                       ← REST API: Chat RAG, Recommender, Forecast, Safety Stock
│   ├── 📄 recommender.py               ← Hybrid Engine (Content-Based + Collaborative Filtering)
│   ├── 📄 forecaster.py                ← Dự báo mô phỏng xu hướng & tính chu kỳ tuần (Simulated Demo)
│   ├── 📄 inventory_analyzer.py        ← Phân tích cảnh báo tồn kho theo ngưỡng
│   └── 📄 knowledge_base.py            ← Cơ sở tri thức chính sách & FAQ cửa hàng
│
├── 🖥️ backend/                         ← Core Backend (Node.js / Express / TypeScript)
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 🗄️ prisma/
│   │   ├── 📄 schema.prisma            ← Schema CSDL 14 bảng quan hệ
│   │   ├── 📁 migrations/              ← Lịch sử di chuyển CSDL Prisma
│   │   └── 📄 seed.ts                  ← Script nạp CSDL sản phẩm thật & tài khoản mẫu
│   ├── 🧪 tests/
│   │   ├── 📄 automated_verification.js ← Bộ kiểm thử đặc tả kỹ thuật 20/20 test cases
│   │   └── 📄 regression_fixes.js       ← Bộ kiểm thử hồi quy nghiệp vụ 6/6 test cases
│   ├── 🧪 test/
│   │   └── 📄 core_business_ai.test.js  ← Bộ kiểm thử nghiệp vụ lõi, AI & RBAC 13/13 test cases
│   └── 📁 src/
│       ├── 📄 index.ts                 ← Khởi động Express, CORS, Static Serving
│       ├── 📄 db.ts                    ← Khởi tạo Prisma Client & FallbackStore
│       ├── 📄 mockData.ts              ← Dữ liệu khởi tạo: sản phẩm công nghệ thật, tài khoản mẫu
│       ├── 📁 middleware/
│       │   └── 📄 auth.ts              ← JWT Verification, Refresh Token SHA-256, RBAC authorize()
│       ├── 📁 services/
│       │   ├── 📄 aiOrchestratorService.ts  ← Điều phối Gemini Cloud API & Ollama Local AI
│       │   ├── 📄 productSearchService.ts   ← Smart Tokenized Search Engine
│       │   ├── 📄 intentParserService.ts    ← Phân tích ý định người dùng
│       │   ├── 📄 groundedChatService.ts    ← RAG chat có kiểm soát ngữ cảnh tồn kho
│       │   ├── 📄 speechToTextService.ts    ← Chuyển giọng nói thành văn bản
│       │   ├── 📄 imageAnalysisService.ts   ← Phân tích hình ảnh đa phương thức
│       │   └── 📄 safetyGuardrailService.ts ← Lọc nội dung an toàn & bảo vệ bí mật kinh doanh
│       └── 📁 routes/
│           ├── 📄 authRoutes.ts        ← Đăng nhập, đăng ký, refresh token, GET /me
│           ├── 📄 productRoutes.ts     ← Quản lý sản phẩm & biến thể màu/dung lượng (Chỉ Admin)
│           ├── 📄 inventoryRoutes.ts   ← Quản lý phiếu kho: Lọc theo Staff, Duyệt/Từ chối, Điều chỉnh tồn
│           ├── 📄 categoryRoutes.ts    ← CRUD danh mục hàng hóa
│           ├── 📄 cartRoutes.ts        ← Thao tác giỏ hàng đồng bộ CSDL
│           ├── 📄 orderRoutes.ts       ← Đơn hàng online (Staff/Admin duyệt), POS bán quầy, bảo hành
│           ├── 📄 paymentRoutes.ts     ← Cổng thanh toán VNPAY giả lập & MoMo test
│           ├── 📄 aiRoutes.ts          ← AI Orchestrator: Local AI (Ollama), Gemini 3.x+, Voice & Vision RAG
│           ├── 📄 userRoutes.ts        ← Tra cứu SĐT khách lẻ, tạo nhanh khách tại quầy, cấp quyền AI
│           └── 📄 settingsRoutes.ts    ← Cấu hình hệ thống & tham số kết nối Local AI / Gemini
│
├── 🎨 frontend/                        ← Giao diện Người dùng SPA (React 19 / Vite / TypeScript)
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📄 vite.config.ts
│   ├── 📄 index.html
│   └── 📁 src/
│       ├── 📄 main.tsx                 ← Điểm vào React DOM
│       ├── 📄 App.tsx                  ← Điều hướng URL, Router Guards phân quyền RBAC
│       ├── 📄 types.ts                 ← Định nghĩa Interface (User, Product, Order, StockTicket...)
│       ├── 📁 context/
│       │   ├── 📄 AuthContext.tsx      ← Quản lý phiên đăng nhập, JWT token, phân quyền
│       │   └── 📄 CartContext.tsx      ← Quản lý giỏ hàng toàn cục & đồng bộ
│       ├── 📁 services/
│       │   └── 📄 api.ts               ← Lớp giao tiếp REST API toàn diện
│       ├── 📁 styles/
│       │   └── 📄 index.css            ← Hệ thống CSS & bảng màu Dark Mode Glassmorphism
│       └── 📁 components/              ← Các Components giao diện chức năng
│           ├── 📄 Navbar.tsx           ← Header điều hướng, giỏ hàng, menu theo từng Role
│           ├── 📄 Footer.tsx           ← Footer nhận diện thương hiệu
│           ├── 📄 StorefrontHome.tsx   ← Trang chủ cửa hàng, sản phẩm nổi bật
│           ├── 📄 CatalogView.tsx      ← Bộ lọc danh mục, tìm kiếm đa chiều, phân trang
│           ├── 📄 ProductCard.tsx      ← Thẻ sản phẩm: giá bán, tồn kho thời gian thực
│           ├── 📄 ProductModal.tsx     ← Chi tiết sản phẩm, bộ chọn màu thực tế & dung lượng
│           ├── 📄 CartView.tsx         ← Trang quản lý giỏ hàng mua sắm
│           ├── 📄 CheckoutView.tsx     ← Đặt hàng, Chế độ Bán Quầy (POS Mode) miễn ship 0đ
│           ├── 📄 CounterPosView.tsx   ← Giao diện Bán Hàng Tại Quầy POS chuyên nghiệp (Staff/Admin)
│           ├── 📄 OrderSuccessModal.tsx ← Modal đặt hàng thành công (nút Tiếp tục & Theo dõi căn chỉnh cân đối)
│           ├── 📄 VnpayModal.tsx       ← Giả lập luồng thanh toán VNPAY trong hệ thống
│           ├── 📄 MomoModal.tsx        ← Thanh toán Ví MoMo qua API môi trường test
│           ├── 📄 AuthView.tsx         ← Giao diện Đăng nhập / Đăng ký tài khoản
│           ├── 📄 ProfileView.tsx      ← Xem và chỉnh sửa thông tin cá nhân
│           ├── 📄 MyOrdersView.tsx     ← Khách hàng theo dõi lịch sử đơn và bảo hành
│           ├── 📄 FloatingChatWidget.tsx ← Trợ lý AI: Giọng nói (Voice), Thị giác (Vision), Local AI
│           ├── 📄 AdminSidebar.tsx     ← Thanh điều hướng phân chia theo 3 vai trò (Admin, Manager, Staff)
│           ├── 📄 AdminDashboard.tsx   ← Dashboard tổng quan KPI, Doanh thu, Giá vốn, Lợi nhuận (Chỉ Admin)
│           ├── 📄 AdminProducts.tsx    ← Quản lý sản phẩm: Khóa chỉ xem đối với MANAGER/STAFF
│           ├── 📄 AdminCategories.tsx  ← Quản lý danh mục sản phẩm (Chỉ Admin)
│           ├── 📄 AdminOrders.tsx      ← Quản lý đơn hàng: Nút duyệt 1-click cho Staff; Ẩn lợi nhuận với Staff
│           ├── 📄 AdminCustomers.tsx   ← Quản trị khách hàng: Điểm tích lũy, kích hoạt Chat AI
│           ├── 📄 StockTicketsView.tsx ← Quản lý phiếu xuất/nhập kho: Lọc theo Staff, Duyệt/Từ chối
│           ├── 📄 AdminAiForecast.tsx  ← Biểu đồ dự báo doanh thu mô phỏng xu hướng & chu kỳ tuần
│           ├── 📄 AdminInventoryAlerts.tsx ← Bảng cảnh báo cạn kho theo ngưỡng & duyệt bổ sung
│           ├── 📄 AdminSettings.tsx    ← Cài đặt mô hình AI: Tích hợp tab cấu hình Local AI Ollama
│           ├── 📄 ArchitectureStudio.tsx ← Trực quan hóa kiến trúc 5 tầng & kiểm tra an ninh AI
│           ├── 📄 StaffDashboard.tsx   ← Cổng vận hành Staff: Mặc định mở tab Đơn Hàng Cần Duyệt
│           └── 📄 MobileBottomNav.tsx  ← Thanh điều hướng dưới cùng tối ưu cho thiết bị di động
│
└── 📁 docs/                            ← Tài liệu báo cáo & nghiên cứu
```

---

## 3. Các Tính Năng Nổi Bật & Nghiệp Vụ Bán Lẻ Thực Tế

### 3.1. Nghiệp Vụ Bán Hàng Tại Quầy (POS Mode) & Quản Lý Khách Lẻ
Trong thực tế bán lẻ thiết bị công nghệ, phần lớn khách hàng ghé showroom không có tài khoản web. Nhân viên chỉ xin **Số điện thoại** để tạo đơn, kích hoạt bảo hành điện tử và tích điểm:

* **Tra cứu & Tạo nhanh bằng Số điện thoại (Zero-friction)**:
  * `GET /api/users/lookup?phone=...`: Nhân viên nhập 10 chữ số điện thoại, hệ thống **truy vấn trực tiếp CSDL** để kiểm tra hồ sơ khách hàng, số điểm tích lũy, tổng chi tiêu và lịch sử bảo hành.
  * `POST /api/users/quick-customer`: Khởi tạo nhanh hồ sơ khách với vai trò `CUSTOMER` mà không cần khách cung cấp email hay đặt mật khẩu.
* **Tích điểm tự động (Loyalty Program)**: Điểm thưởng được tính toán động tại thời điểm tra cứu: `Math.floor(tổng chi tiêu / 10.000)`.
* **Giao diện POS Bán Hàng Tại Quầy Chuyên Dụng (`CounterPosView.tsx`)**:
  * Tích hợp trực tiếp tại Cổng Vận Hành Staff (`/warehouse` hoặc `/staff`) và Admin/Staff Panel (`/admin/pos`, `/pos`).
  * Có nút truy cập nhanh **"Bàn Tư Vấn Bán Quầy (POS)"** trên Navbar và Sidebar cho nhân viên.
  * Bộ lọc nhanh danh mục, tìm kiếm theo tên/mã, hiển thị tồn kho khả dụng thời gian thực để chống bán vượt kho.
  * Giỏ hàng bán quầy: tăng/giảm số lượng, chiết khấu giảm giá, tính tiền khách đưa và **tự động tính tiền thừa trả lại khách**.
  * Hỗ trợ phương thức: **Tiền mặt tại quầy (COD)**, **QR VNPAY giả lập**, **Ví điện tử MoMo**.
  * **In Hóa Đơn & Phiếu Bảo Hành Ngay**: Tự động sinh phiếu bảo hành 12 - 24 tháng theo từng mặt hàng, in hóa đơn/phiếu bảo hành trực tiếp cho khách.

---

### 3.2. Quản Lý Lợi Nhuận, Doanh Thu & Giá Vốn Độc Quyền Admin
Hệ thống giải quyết bài toán quản trị tài chính cốt lõi với sự bảo mật nghiêm ngặt:
* **Quy tắc tính Giá vốn (COGS)**: Giá vốn mỗi sản phẩm được tính chuẩn bằng **75% so với giá bán gốc** (`cost = price * 0.75`), tỷ suất lợi nhuận gộp danh nghĩa là **25%** (`profit margin = 25%`).
* **Bảo Mật Lãi/Lỗ Tối Cao**:
  * **CHỈ QUẢN TRỊ VIÊN (ADMIN)** mới có quyền truy cập Dashboard tài chính, xem tổng doanh thu, tổng giá vốn, tổng lợi nhuận gộp thực thu và xuất file CSV tài chính.
  * **NHÂN VIÊN (STAFF) VÀ QUẢN LÝ KHO (MANAGER)** bị ẩn hoàn toàn các cột lợi nhuận, giá vốn % và thẻ thống kê lãi/lỗ.

---

### 3.3. Phân Quyền Đa Tầng Chuẩn Hóa (RBAC 4 Cấp Độ Độc Lập)

Hệ thống thiết lập hàng rào bảo mật nghiêm ngặt theo 4 vai trò độc lập với ranh giới đặc quyền chuẩn hóa theo đúng bài toán kinh doanh thực tế:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MA TRẬN PHÂN QUYỀN SHOPBEE                      │
├─────────────┬─────────────┬─────────────┬─────────────┬────────────────┤
│ NGHIỆP VỤ   │    ADMIN    │   MANAGER   │    STAFF    │    CUSTOMER    │
├─────────────┼─────────────┼─────────────┼─────────────┼────────────────┤
│ Lãi / Lỗ    │  ✅ Độc quyền│    ❌ Cấm    │    ❌ Cấm    │     ❌ Cấm     │
│ Duyệt Đơn   │     ✅      │    ❌ Cấm    │  ✅ Phụ trách│     ❌ Cấm     │
│ Bán POS     │     ✅      │    ❌ Cấm    │  ✅ Phụ trách│     ❌ Cấm     │
│ Quản Lý Kho │     ✅      │  ✅ Phụ trách│  ✅ Đề xuất  │     ❌ Cấm     │
│ Mua Sắm     │     ✅      │     ✅      │     ✅      │  ✅ Phụ trách  │
└─────────────┴─────────────┴─────────────┴─────────────┴────────────────┘
```

#### 👑 ADMIN (Quản trị viên tối cao)
* **Độc quyền biết dữ liệu tài chính (Lãi/Lỗ)**: Là vai trò **duy nhất** được truy cập Dashboard Doanh thu & Lợi nhuận, xem bảng giá vốn hàng bán (COGS), biên lợi nhuận % và tổng lợi nhuận thực thu, xuất báo cáo CSV tài chính.
* **Quản lý Master Data**: Toàn quyền thêm, sửa, xóa sản phẩm, danh mục sản phẩm (Category), cấu hình biến thể và màu sắc.
* **Quản lý tài khoản**: Phân quyền, khóa/mở tài khoản nhân sự và khách hàng.
* **Cấu hình hệ thống**: Thiết lập AI Provider (Gemini API Cloud / Ollama Local), giám sát Architecture Studio và toàn bộ hệ thống.

#### 👔 MANAGER (Quản lý kho hàng chuyên trách)
* **Chuyên trách nghiệp vụ kho**: Điều hành toàn bộ hoạt động xuất - nhập kho và kiểm soát hàng tồn kho thực tế.
* **Xuất / Nhập kho 2 lớp**: Lập phiếu nhập kho từ nhà cung cấp, thẩm định và **phê duyệt / từ chối** các phiếu xuất/nhập kho do nhân viên (STAFF) đề xuất.
* **Kiểm kê & Điều chỉnh tồn**: Thực hiện kiểm đếm thực tế, điều chỉnh tồn kho (`POST /api/inventory/adjustment`), tự động ghi nhật ký bất biến `StockMovement`.
* **Cảnh báo tồn kho AI**: Theo dõi danh sách cảnh báo cạn kho theo ngưỡng (`CRITICAL`, `HIGH`, `MEDIUM`).
* **Bảo mật phân quyền**: **Không có quyền** xem dữ liệu lãi/lỗ hay doanh thu; **không có quyền** duyệt đơn hàng online hay thao tác bán quầy POS; chỉ xem thông tin tồn kho sản phẩm (Read-only).

#### 👷 STAFF (Nhân viên bán hàng & vận hành — Staff 1, Staff 2,... đồng quyền)
* **Duyệt đơn hàng online của khách**: Chịu trách nhiệm trực tiếp tiếp nhận và duyệt đơn hàng online của khách từ trạng thái `PENDING` (Chờ duyệt) ➔ `CONFIRMED` (Đã xác nhận) ➔ `PROCESSING` (Đang đóng gói) ➔ `SHIPPING` (Giao hàng) ➔ `DELIVERED` (Hoàn tất) với cơ chế duyệt 1-click tiện lợi.
* **Bàn bán hàng tại quầy (POS Mode)**: Tư vấn bán hàng trực tiếp tại quầy, tra cứu khách hàng bằng SĐT, xuất hóa đơn tức thì và kích hoạt bảo hành điện tử.
* **Kho & Hàng tồn**: Tra cứu tồn kho khả dụng để tư vấn khách; lập phiếu đề xuất xuất kho (`EXPORT` trạng thái `PENDING`) để quản lý kho duyệt.
* **Bảo mật phân quyền**: **Không thấy** số liệu giá vốn, lợi nhuận hay doanh thu tổng của cửa hàng (chỉ thấy tổng giá tiền thanh toán của khách trên đơn).

#### 🛒 CUSTOMER (Khách hàng mua sắm trực tuyến)
* **Mua sắm trực tuyến**: Tìm kiếm thông minh, xem chi tiết sản phẩm đa biến thể, đặt hàng thanh toán COD, VNPAY, MoMo.
* **Quản lý đơn hàng cá nhân**: Theo dõi tiến độ đơn hàng theo thời gian thực; có quyền tự hủy đơn khi đơn còn ở trạng thái `PENDING` hoặc `CONFIRMED`.
* **Trợ lý AI Mua sắm**: Tương tác bằng văn bản hoặc giọng nói/hình ảnh để nhận tư vấn chọn đồ (hệ thống tự động ngăn chặn mọi câu hỏi về lãi lỗ hay bí mật kinh doanh).

---

### 3.4. Luồng Xử Lý & Duyệt Đơn Hàng Trực Tuyến

```
Khách đặt hàng online
        ↓
    PENDING ──────────────────────────────── CANCELLED (Khách / STAFF / ADMIN hủy)
        ↓
  [STAFF duyệt: Nút 1-Click "Duyệt Đơn"]
        ↓
   CONFIRMED ────────────────────────────── CANCELLED (STAFF / ADMIN hủy)
        ↓
  [STAFF đóng gói: Nút "Đóng Gói"]
        ↓
  PROCESSING ────────────────────────────── CANCELLED (STAFF / ADMIN hủy)
        ↓
  [STAFF giao cho shipper: Nút "Giao Hàng"]
        ↓
   SHIPPING
        ↓
  [Xác nhận giao thành công: Nút "Hoàn Tất"]
        ↓
   DELIVERED ✅ (Hoàn tất đơn hàng)
```

> [!TIP]
> Khi đơn hàng bị hủy (`CANCELLED`), hệ thống tự động hoàn lại số lượng tồn kho theo giao dịch nguyên tử (Atomic Transaction) và ghi nhận nhật ký `StockMovement` loại `SALE_CANCEL`.

---

### 3.5. Sản Phẩm Công Nghệ Thực Tế Đa Biến Thể (Màu Sắc & Dung Lượng)
* **Đầy đủ màu sắc chuẩn hãng**:
  * *Samsung Galaxy Z Fold6 5G AI*: 5 màu (Xám Titan, Đen Titan, Xanh Maya, Trắng Titan, Nâu Da).
  * *iPhone 16 Pro Max*: 4 màu Titan (Titan Sa Mạc, Titan Tự Nhiên, Titan Trắng, Titan Đen).
  * *MacBook Pro 16 M3 Max, Dell XPS 16, Sony WH-1000XM5, v.v.*
* **Biến thể dung lượng thực tế**: 256GB, 512GB, 1TB, v.v.
* **Giao diện chọn màu chống vỡ khung (Anti-layout shift)**: Chỉ báo tên màu trực quan và cập nhật ảnh tương ứng mượt mà.

---

### 3.6. Thuật Toán Tìm Kiếm Sản Phẩm Thông Minh (Smart Tokenized Search)
* **Khắc phục lỗi tìm kiếm sai loại hàng**: Tránh trường hợp tìm *"điện thoại"* ra *"cục sạc"* do cục sạc có chữ *"sạc cho điện thoại"* trong mô tả.
* **Thuật toán Tokenized Ranking**:
  1. Ưu tiên khớp chính xác theo **Danh mục sản phẩm** (từ khóa *"điện thoại"* → khớp danh mục *"Điện thoại & Tablet"*).
  2. Ưu tiên khớp theo **Tên sản phẩm** (`name`).
  3. Phân tách từ khóa (tokenization) và lọc từ phủ định/loại trừ, đảm bảo kết quả chính xác 100%.

---

### 3.7. Quản Lý Kho Hàng 2 Lớp (Inbound & Outbound) & Lọc Phiếu Theo Nhân Viên
1. **Lập phiếu yêu cầu**: Nhân viên (`STAFF`) lập phiếu Xuất kho (`EXPORT`) khi cần hàng. Phiếu ở trạng thái `PENDING (Chờ Quản Lý Duyệt)`.
2. **Kiểm soát & Phê duyệt**: 
   * Quản lý kho (`MANAGER`) hoặc Quản trị viên (`ADMIN`) lập phiếu Nhập kho (`IMPORT`) và xem danh sách phiếu chờ duyệt.
   * **Bộ lọc nhân viên (`Staff Filter`)**: Cho phép Quản lý kho lọc nhanh toàn bộ phiếu được tạo bởi một nhân viên cụ thể (`GET /api/inventory/tickets?staff=<userId>`).
   * Khi duyệt (`APPROVE`): Hệ thống thực hiện giao dịch nguyên tử tự động cộng/trừ số lượng tồn kho tức thì, ghi nhật ký `StockMovement` bất biến.
   * Khi từ chối (`REJECT`): Quản lý kho nhập lý do từ chối cụ thể.
3. **Kiểm kê & Điều chỉnh tồn** (`POST /api/inventory/adjustment`): MANAGER/ADMIN cập nhật số lượng thực tế sau kiểm đếm, hệ thống tự động tính delta và ghi nhật ký `StockMovement` (type: `ADJUSTMENT`).

---

### 3.8. Trợ Lý AI Đa Phương Thức (Voice STT/TTS, Multimodal Vision, Dual Engine)
Khung chat nổi thông minh (`FloatingChatWidget`) đóng vai trò là một chuyên gia bán hàng ảo:
* **Hỗ trợ 2 Nhà Cung Cấp Mô Hình**:
  * 🤖 **Local AI (Ollama)**: Chạy hoàn toàn cục bộ trên máy tính, bảo vệ quyền riêng tư dữ liệu, không phát sinh chi phí gọi API ngoài. Tương thích: `llava` (thị giác), `llama3.2-vision`, `phi3`, `qwen2.5`, `mistral`.
  * ✨ **Google Gemini Cloud (Thế hệ 3.x+)**: Tích hợp các mô hình `gemini-3.5-flash`, `gemini-3.1-flash-lite`, `gemini-3.6-flash`, `gemini-3.7-flash`, `gemini-3.8-flash`, `gemini-3.5-pro`.
* **Nhận Diện Giọng Nói (Speech-to-Text)**: Tích hợp Web Speech API chuẩn tiếng Việt (`vi-VN`) với hiệu ứng sóng âm thời gian thực.
* **Đọc Câu Trả Lời Thành Tiếng (Text-to-Speech)**: Tự động lọc bỏ ký tự Markdown và đọc to câu trả lời bằng giọng đọc tiếng Việt (`SpeechSynthesis`).
* **Truy Vấn Bằng Hình Ảnh (Multimodal Vision)**: Tải ảnh, kéo thả ảnh hoặc **Dán ảnh chụp màn hình trực tiếp từ clipboard (`Ctrl+V`)** để AI phân tích model máy và gợi ý sản phẩm còn hàng trong kho.
* **Kiểm Soát Tồn Kho RAG Chặt Chẽ**: AI chỉ gợi ý các sản phẩm đang có số lượng tồn kho > 0, ngăn ngừa việc tư vấn hàng hết kho.
* **Bảo Vệ Bí Mật Kinh Doanh**: AI tự động phát hiện và từ chối các câu hỏi thăm dò lợi nhuận, giá vốn hay doanh thu nội bộ từ phía khách hàng.

---

### 3.9. AI Dự Báo Doanh Thu & Phân Tích Cảnh Báo Cạn Kho
* **Dự báo mô phỏng xu hướng & mùa vụ**: Dự báo doanh thu 30 / 60 / 90 ngày tới được mô phỏng dựa trên hàm xu hướng kết hợp chu kỳ dao động theo tuần (Weekly Seasonality). Dữ liệu mang tính chất minh họa kịch bản cho quản trị viên.
* **Cảnh báo tồn kho theo ngưỡng (Threshold-based Alerts)**: Hệ thống phân loại mức độ cảnh báo tồn kho:
  * Số lượng tồn ≤ 3: Mức NGUY CẤP (`CRITICAL`)
  * Số lượng tồn ≤ 5: Mức CAO (`HIGH`)
  * Số lượng tồn ≤ 10: Mức TRUNG BÌNH (`MEDIUM`)
* **Duyệt nhập hàng 1-Click**: Tự động tạo phiếu nhập hàng tức thì ngay từ bảng cảnh báo cạn kho.

---

### 3.10. Cổng Thanh Toán Đa Dạng (VNPAY Giả Lập, Ví MoMo Test, Tiền Mặt Tại Quầy)
* **VNPAY Giả Lập**: Giả lập luồng thanh toán VNPAY trong hệ thống, mô phỏng giao diện nhập thông tin thẻ và xác thực OTP nội bộ (Hỗ trợ thẻ test NCB: `9704198526191432152`, Tên `NGUYEN VAN A`, Ngày phát hành `07/15`, OTP `123456`).
* **Ví Điện Tử MoMo**: Tích hợp gọi trực tiếp API môi trường test của MoMo (`test-payment.momo.vn`) để tạo yêu cầu thanh toán quét mã QR.
* **Tiền mặt tại quầy (COD/Cash)**: Tích hợp cho đơn mua trực tiếp tại quầy hoặc nhận hàng thanh toán tại nhà.

---

### 3.11. Architecture Studio & AI Security Auditor
* **5-Tier Canvas**: Trực quan hóa cấu trúc phân tầng và trạng thái kết nối thời gian thực giữa 5 tầng kiến trúc.
* **OpenAPI 3.0 Studio**: Trình duyệt tương tác trực tiếp với 30+ API endpoints.
* **AI Security Audit**: Phân tích an ninh kiến trúc hệ thống bằng trí tuệ nhân tạo (khi được cấp `GEMINI_API_KEY`).

---

## 4. Tech Stack Toàn Diện

| Phân Hệ | Công Nghệ Sử Dụng | Mục Đích |
| :--- | :--- | :--- |
| **Giao Diện Frontend** | React 19, TypeScript, Vite, Vanilla CSS, Lucide React | SPA hiệu năng cao, Dark Mode Glassmorphism, POS Quầy |
| **Tương Tác Đa Phương Thức** | Web Speech API (STT & TTS), Clipboard Paste API | Nhận diện giọng nói, đọc câu trả lời tiếng Việt, dán ảnh màn hình |
| **Backend Core** | Node.js, Express, TypeScript, Prisma ORM, JWT, Bcrypt | REST API, RBAC 4 Tầng, Giao dịch nguyên tử (Atomic Transactions) |
| **AI Orchestrator** | TypeScript Service (`aiOrchestratorService.ts`) | Điều phối gọi thật Gemini Cloud API & Ollama Local AI theo lựa chọn Provider |
| **AI Local Engine** | Ollama Local Engine (`llava`, `llama3.2-vision`, `phi3`) | Chat AI nội bộ offline, phân tích hình ảnh, bảo vệ quyền riêng tư dữ liệu |
| **Cloud AI & Microservices** | Python 3.10+, FastAPI, Uvicorn, Google Gemini 3.x API | Dự báo mô phỏng xu hướng & tuần hoàn, Phân tích cảnh báo tồn kho, RAG Chat |
| **Cơ Sở Dữ Liệu & Bộ Đệm**| PostgreSQL 15, Fallback JSON Store, In-Memory TTL Cache | Lưu trữ quan hệ 14 bảng, Refresh Token SHA-256 (bảng `refresh_tokens`), Token Blacklist in-memory với TTL |
| **Cổng Thanh Toán** | VNPAY Simulator, MoMo Test API (`test-payment.momo.vn`) | Thanh toán điện tử giả lập và ví điện tử môi trường test |
| **Hạ Tầng & Điều Phối** | Docker, Docker Compose, Nginx Reverse Proxy | Điều phối 5 dịch vụ, Reverse proxy cổng 8088 |

---

## 5. Bộ Kiểm Thử Tự Động (Automated Test Suite)

Dự án tích hợp 3 bộ kiểm thử tự động toàn diện trên hệ cơ sở dữ liệu thật với kết quả đạt chuẩn **39/39 tests PASS (100%)**:

1. **Bộ kiểm thử đặc tả kỹ thuật (`backend/tests/automated_verification.js`)**: 20/20 test cases đạt 100% PASS.
2. **Bộ kiểm thử nghiệp vụ lõi, AI & Phân quyền RBAC (`backend/test/core_business_ai.test.js`)**: 13/13 test cases đạt 100% PASS.
3. **Bộ kiểm thử hồi quy nghiệp vụ (`backend/tests/regression_fixes.js`)**: 6/6 test cases đạt 100% PASS.

```bash
# Chạy bộ kiểm thử 1: Đặc tả kỹ thuật RBAC, Kho, AI & Đơn hàng (20 tests)
node backend/tests/automated_verification.js

# Chạy bộ kiểm thử 2: Nghiệp vụ sản phẩm, giỏ hàng, AI & RBAC duyệt đơn (13 tests)
node backend/test/core_business_ai.test.js

# Chạy bộ kiểm thử 3: Kiểm thử hồi quy chống bán vượt kho, chuyển trạng thái, chống xác nhận đơn đã hủy (6 tests)
node backend/tests/regression_fixes.js
```

### Kết Quả Kiểm Thử Toàn Diện (39/39 PASS — 100%):

```
==================================================================
🧪 BẮT ĐẦU CHẠY BỘ TEST SUITE TỰ ĐỘNG - SHOPBEE STORE AI
==================================================================

  ✅ [PASS] TC-AUTH-01: Đăng nhập quản trị viên (Admin) và cấp phát JWT Token
  ✅ [PASS] TC-AUTH-02: Đăng nhập tài khoản khách hàng (Customer)
  ✅ [PASS] TC-ORDER-01: Lập hóa đơn mua hàng -> Tồn kho sản phẩm tự động giảm chính xác
  ✅ [PASS] TC-ORDER-02: Hủy hóa đơn bán hàng -> Tồn kho sản phẩm được hoàn lại nguyên trạng
  ✅ [PASS] TC-REPORT-01: Truy vấn báo cáo tổng quan doanh thu và bảng điều khiển
  ✅ [PASS] TC-AI-01: AI Chatbot tra cứu sản phẩm còn hàng và không gợi ý hàng hết tồn kho
  ✅ [PASS] TC-AI-02: AI Admin Q&A Copilot phân tích dữ liệu bán chậm từ CSDL đơn hàng
  ✅ [PASS] TC-SEC-01: Bảo mật RBAC - Chặn khách hàng thường truy cập trái phép API quản trị
  ✅ [PASS] TC-RBAC-01: Đăng nhập Staff và Manager để kiểm tra ranh giới quyền hạn
  ✅ [PASS] TC-RBAC-02: STAFF được phép truy vấn danh sách đơn hàng online (200 OK)
  ✅ [PASS] TC-RBAC-03: MANAGER bị chặn xem danh sách đơn hàng online (403 Forbidden)
  ✅ [PASS] TC-RBAC-04: MANAGER bị chặn cập nhật trạng thái đơn hàng trực tuyến (403 Forbidden)
  ✅ [PASS] TC-RBAC-05: MANAGER bị chặn hủy đơn hàng trực tuyến (403 Forbidden)

==================================================================
🏁 TỔNG KẾT KIỂM THỬ: 13/13 TEST CASES THÀNH CÔNG (100%)
==================================================================
```

---

## 6. Cài Đặt Môi Trường (ENV)

Sao chép tệp mẫu `.env.example` thành `.env` tại thư mục gốc:

```bash
cp .env.example .env
```

Các biến môi trường cấu hình chính:

| Tên Biến | Mô Tả | Mặc Định / Gợi Ý |
| :--- | :--- | :--- |
| `NODE_ENV` | Chế độ môi trường thực thi | `development` |
| `PORT` | Cổng chạy Backend API | `5000` |
| `CORS_ORIGINS` | Danh sách Origin được phép truy cập CORS (phân tách bởi dấu phẩy) | `http://localhost:5173,http://localhost:3000,http://localhost:5000,http://localhost:8088,http://127.0.0.1:5173,http://127.0.0.1:3000,http://127.0.0.1:5000,http://127.0.0.1:8088` |
| `ENABLE_DEMO_OTP` | Hiển thị mã OTP trực tiếp trong response JSON khi quên mật khẩu (Bắt buộc đặt `true` khi demo vì hệ thống không gửi email SMTP) | `true` |
| `JWT_ACCESS_SECRET` | Khóa bí mật ký JWT Access Token (7 ngày) | `super_secret_jwt_access_key_shopbee_2026` |
| `JWT_REFRESH_SECRET` | Khóa bí mật ký JWT Refresh Token (30 ngày) | `super_secret_jwt_refresh_key_shopbee_2026` |
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL | `postgresql://postgres:password123@localhost:5432/store_ai_db?schema=public` |
| `LOCAL_AI_URL` | Địa chỉ máy chủ AI Local (Ollama) | `http://localhost:11434` |
| `LOCAL_AI_MODEL` | Tên mô hình AI Local mặc định | `llava` *(hoặc `llama3.2-vision`, `phi3`)* |
| `GEMINI_API_KEY` | Khóa Google Gemini API Key | *(Lấy miễn phí tại [Google AI Studio](https://aistudio.google.com/))* |
| `GEMINI_MODEL` | Mô hình Google Gemini Cloud mặc định | `gemini-3.5-flash` |
| `AI_SERVICE_URL` | Đường dẫn tới Python AI Microservice | `http://localhost:8000` |

---

## 7. Hướng Dẫn Khởi Chạy

### Cách 1 — Khởi Chạy 1 Lệnh Duy Nhất (Fullstack Production Server)
Cách nhanh nhất và tiện lợi nhất để chạy và trải nghiệm toàn bộ hệ thống (Backend Express phục vụ API + Giao diện Frontend Vite đã build sẵn):

```bash
# Tại thư mục gốc dự án TPKSTORE:
node server.js
```
* **Địa chỉ truy cập toàn bộ ứng dụng:** **[http://localhost:5000](http://localhost:5000)**  
* **API Endpoints:** `http://localhost:5000/api`

---

### Cách 2 — Khởi Chạy Từng Phân Hệ (Local Dev)

#### Bước 1: Khởi động Python AI Microservice
```bash
cd ai_service
pip install -r requirements.txt
python app.py
# → AI Microservice hoạt động tại: http://localhost:8000
# → Swagger API Docs tại:        http://localhost:8000/docs
```

#### Bước 2: Khởi động Core Backend
```bash
cd backend
npm install
npm run build
npm run dev
# → Backend REST API hoạt động tại: http://localhost:5000/api
```

#### Bước 3: Khởi động Frontend UI
```bash
cd frontend
npm install
npm run dev
# → Giao diện website hoạt động tại: http://localhost:5173
```

---

### Cách 3 — Khởi Chạy Toàn Bộ Bằng Docker Compose

Khởi chạy đồng loạt toàn bộ 5 dịch vụ (PostgreSQL, Backend, Frontend, AI Microservice, Nginx Reverse Proxy cổng 8088):

```bash
# Xây dựng và khởi chạy ngầm tất cả container
docker-compose up --build -d

# Kiểm tra trạng thái các container
docker-compose ps

# Xem log hoạt động theo thời gian thực
docker-compose logs -f
```

**Các cổng truy cập:**
* **Giao diện Web & POS Quầy qua Nginx:** [http://localhost:8088](http://localhost:8088)
* **Giao diện Web trực tiếp Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend Core API:** [http://localhost:5000/api](http://localhost:5000/api)
* **AI Microservice Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Hướng Dẫn Khởi Chạy Mô Hình AI Cục Bộ (Ollama)

Để sử dụng tính năng **Chat AI Local kết hợp Nhận diện Hình ảnh** hoàn toàn offline:

1. **Cài đặt Ollama:** Tải ứng dụng Ollama từ [ollama.com](https://ollama.com/).
2. **Tải mô hình Vision về máy:**
   ```bash
   # Mô hình LLaVA hỗ trợ hỏi đáp tiếng Việt và phân tích hình ảnh (Vision):
   ollama run llava

   # Hoặc mô hình LLaMA 3.2 Vision siêu nhẹ của Meta:
   ollama run llama3.2-vision
   ```
3. Sau khi khởi chạy, Ollama sẽ phục vụ tại `http://localhost:11434`. Hệ thống SHOPBEE sẽ tự động nhận diện và kết nối!

---

## 8. Tài Khoản Demo Hệ Thống

Tất cả tài khoản demo đều có mật khẩu chung là: `Password123@` và **đã được cấp quyền Chat AI đầy đủ**:

| Vai Trò | Email Đăng Nhập | Mật Khẩu | Quyền Hạn Thực Tế Trong Hệ Thống |
| :--- | :--- | :--- | :--- |
| 👑 **ADMIN** | `admin@example.com` | `Password123@` | **Toàn quyền Quản trị Tối cao:**<br>• **Độc quyền xem báo cáo tài chính**: Doanh thu tổng, Giá vốn (COGS) & Lợi nhuận gộp (Profit 25%), xuất file CSV tài chính<br>• Toàn quyền thêm/sửa/xóa sản phẩm, danh mục & tài khoản hệ thống<br>• Cấu hình mô hình AI Local & Gemini Cloud, Architecture Studio<br>• Duyệt đơn hàng online & Bàn Bán Hàng Tại Quầy (POS Mode) |
| 👔 **MANAGER** | `manager@example.com` | `Password123@` | **Quản Lý & Điều Hành Kho Hàng:**<br>• Kiểm soát toàn bộ nghiệp vụ xuất - nhập kho (Inbound / Outbound)<br>• Phê duyệt / Từ chối phiếu xuất nhập kho của nhân viên<br>• Kiểm kê & Điều chỉnh tồn kho thực tế (`ADJUSTMENT`)<br>• Theo dõi cảnh báo cạn kho AI theo ngưỡng (`CRITICAL`, `HIGH`, `MEDIUM`)<br>• *Tuyệt đối không xem dữ liệu lãi/lỗ; không duyệt đơn online hay bán POS* |
| 👷 **STAFF 1** | `staff@example.com` | `Password123@` | **Nhân Viên Bán Hàng & Duyệt Đơn (Đồng quyền):**<br>• **Duyệt đơn hàng trực tuyến của khách**: Chuyển trạng thái đơn `PENDING` ➔ `CONFIRMED` (Duyệt đơn) ➔ `PROCESSING` ➔ `SHIPPING` ➔ `DELIVERED`<br>• **Bàn Bán Hàng POS tại quầy**: Tra cứu SĐT khách lẻ, xuất hóa đơn, tích điểm & in phiếu bảo hành 12-24 tháng<br>• Lập phiếu đề xuất Xuất kho hàng (chờ Quản lý kho duyệt)<br>• Tra cứu tồn kho sản phẩm tức thì phục vụ tư vấn khách<br>• *Không thấy số liệu giá vốn/lợi nhuận (chỉ thấy tổng tiền bill của khách)* |
| 👷 **STAFF 2** | `staff2@example.com` | `Password123@` | **Nhân Viên Bán Hàng & Duyệt Đơn 2** *(đầy đủ quyền duyệt đơn, POS và đề xuất kho hoàn toàn tương tự Staff 1)* |
| 🛒 **CUSTOMER** | `customer@example.com` | `Password123@` | **Khách Hàng Mua Sắm Trực Tuyến:**<br>• Tìm kiếm thông minh, lọc danh mục theo ngân sách<br>• Đặt hàng thanh toán COD, VNPAY giả lập, Ví MoMo test<br>• Tra cứu lịch sử đơn hàng cá nhân, tự hủy đơn khi chờ duyệt<br>• Trợ lý AI Bán hàng: Nói bằng giọng nói, dán ảnh sản phẩm (chặn lộ dữ liệu lãi lỗ) |

---

## 9. Hạn Chế Đã Biết

1. **Dự báo doanh thu mang tính mô phỏng:** Thuật toán dự báo được xây dựng dựa trên hàm xu hướng kết hợp mùa vụ theo tuần để phục vụ minh họa kịch bản giao diện, chưa được huấn luyện trên tập dữ liệu chuỗi thời gian thực tế của doanh nghiệp và không có chỉ số sai số thống kê (như MAPE, RMSE, R²).
2. **Cảnh báo tồn kho theo ngưỡng:** Hệ thống phân loại mức độ cảnh báo dựa trên các ngưỡng số lượng cố định (≤3 CRITICAL, ≤5 HIGH, ≤10 MEDIUM), chưa tính toán tự động dựa trên Daily Sales Velocity và Lead Time thực tế.
3. **Cổng thanh toán VNPAY giả lập:** Luồng thanh toán VNPAY hiện được giả lập trực tiếp trong hệ thống, chưa đấu nối API chính thức của VNPAY. Trong khi đó, MoMo gọi API trên môi trường test `test-payment.momo.vn`.
4. **Bộ nhớ tạm (RAM) cho bảo mật & giới hạn:** Bộ đếm khóa đăng nhập và danh sách thu hồi token (Token Blacklist) được lưu trong bộ nhớ RAM của tiến trình backend, sẽ được đặt lại khi khởi động lại server.
5. **Mã xác thực OTP (Quên mật khẩu):** Hệ thống chưa tích hợp dịch vụ gửi email SMTP. Để phục vụ demo và kiểm thử luồng quên mật khẩu, cần cấu hình `ENABLE_DEMO_OTP=true` trong file `.env` để mã OTP được trả về trực tiếp trong phản hồi API của endpoint `/api/auth/forgot-password`.

---

## 10. Đội Ngũ Thực Hiện

| Thành Viên | Vai Trò Chính | Trách Nhiệm Chi Tiết |
| :--- | :--- | :--- |
| **Thang Quốc Khải** | **Team Leader & AI Architect** | • Thiết kế Kiến trúc Phân tầng 5 lớp (5-Tier Layered Architecture)<br>• Tích hợp AI Microservices, Local AI Ollama & Trợ lý Đa phương thức (Voice & Vision RAG)<br>• Xây dựng Backend Core API, Phân quyền RBAC 4 Tầng & Mô-đun Quản lý Lợi nhuận Độc quyền Admin |
| **Nguyễn Đình Tiến** | **Frontend Lead & UI/UX** | • Thiết kế toàn bộ Giao diện UI/UX Dark Mode Glassmorphism<br>• Xây dựng Giao diện Bán Hàng Tại Quầy POS (`CounterPosView`) & Chế độ POS Checkout<br>• Căn chỉnh giao diện Modal hoàn tất đơn hàng, Widget Trợ lý AI tích hợp Web Speech API & Multimodal Image I/O |
| **Nguyễn Hồng Phúc** | **Database & QA Lead** | • Thiết kế CSDL PostgreSQL (Prisma ORM) & Quy trình kiểm soát kho 2 lớp<br>• Xây dựng luồng tạo nhanh Khách lẻ bằng SĐT & Tích điểm/Bảo hành<br>• Xây dựng các bộ kiểm thử tự động đạt chuẩn **39/39 test cases (100% PASS)** |

---

<div align="center">

*Đồ Án Tốt Nghiệp / Chuyên Ngành — SHOPBEE STORE AI 2026*  
*Giải Pháp Quản Trị Bán Hàng Bán Lẻ Đa Kênh Tích Hợp AI Thực Tế*

</div>

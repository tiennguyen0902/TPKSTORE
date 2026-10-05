# 🐝 SHOPBEE / STORE AI — HỆ THỐNG QUẢN TRỊ BÁN HÀNG TÍCH HỢP TRÍ TUỆ NHÂN TẠO

> **Đồ án Chuyên ngành Công nghệ Thông tin / Kỹ thuật Phần mềm**  
> **Đề tài:** Hệ thống Quản trị Bán hàng & Thương mại Điện tử Đa kênh Tích hợp Trí tuệ Nhân tạo Đa phương thức (Multimodal Local AI & Cloud), Bán Hàng Tại Quầy (POS) Cho Khách Vãng Lai, Quản Lý Lợi Nhuận, Trợ Lý RAG Bán Hàng, Phân Quyền RBAC 4 Tầng và Quản Lý Kho Hàng 2 Lớp.  
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
[![Tests](https://img.shields.io/badge/Test_Suite-8%2F8_Pass_(100%25)-success.svg)](https://github.com/tiennguyen0902/TPKSTORE)

---

## 📋 Mục Lục

1. [Tổng Quan Hệ Thống & Kiến Trúc 5 Tầng](#1-tổng-quan-hệ-thống--kiến-trúc-5-tầng)
2. [Cấu Trúc Thư Mục](#2-cấu-trúc-thư-mục)
3. [Các Tính Năng Nổi Bật & Nghiệp Vụ Bán Lẻ Thực Tế](#3-các-tính-năng-nổi-bật--nghiệp-vụ-bán-lẻ-thực-tế)
   - [3.1. Nghiệp Vụ Bán Hàng Tại Quầy (POS Mode) & Quản Lý Khách Vãng Lai](#31-nghiệp-vụ-bán-hàng-tại-quầy-pos-mode--quản-lý-khách-vãng-lai)
   - [3.2. Quản Lý Lợi Nhuận, Doanh Thu & Giá Vốn Sản Phẩm (Cost & Profit Margin)](#32-quản-lý-lợi-nhuận-doanh-thu--giá-vốn-sản-phẩm-cost--profit-margin)
   - [3.3. Phân Quyền Đa Tầng (RBAC 4 Cấp Độ Độc Lập)](#33-phân-quyền-đa-tầng-rbac-4-cấp-độ-độc-lập)
   - [3.4. Sản Phẩm Công Nghệ Thực Tế Đa Biến Thể (Màu Sắc & Dung Lượng Chuẩn Hãng)](#34-sản-phẩm-công-nghệ-thực-tế-đa-biến-thể-màu-sắc--dung-lượng-chuẩn-hãng)
   - [3.5. Thuật Toán Tìm Kiếm Sản Phẩm Thông Minh (Smart Tokenized Search)](#35-thuật-toán-tìm-kiếm-sản-phẩm-thông-minh-smart-tokenized-search)
   - [3.6. Quản Lý Kho Hàng 2 Lớp (Inbound & Outbound) & Lọc Phiếu Theo Nhân Viên](#36-quản-lý-kho-hàng-2-lớp-inbound--outbound--lọc-phiếu-theo-nhân-viên)
   - [3.7. Trợ Lý AI Đa Phương Thức (Voice STT/TTS, Multimodal Vision, Dual Engine)](#37-trợ-lý-ai-đa-phương-thức-voice-stttts-multimodal-vision-dual-engine)
   - [3.8. AI Dự Báo Doanh Thu (Prophet-ARIMA) & Phân Tích Tồn Kho An Toàn](#38-ai-dự-báo-doanh-thu-prophet-arima--phân-tích-tồn-kho-an-toàn)
   - [3.9. Cổng Thanh Toán Đa Dạng (VNPAY Sandbox, Ví MoMo, Tiền Mặt Tại Quầy)](#39-cổng-thanh-toán-đa-dạng-vnpay-sandbox-ví-momo-tiền-mặt-tại-quầy)
   - [3.10. Architecture Studio & AI Security Auditor](#310-architecture-studio--ai-security-auditor)
4. [Tech Stack Toàn Diện](#4-tech-stack-toàn-diện)
5. [Bộ Kiểm Thử Tự Động (Automated Test Suite)](#5-bộ-kiểm-thử-tự-động-automated-test-suite)
6. [Cài Đặt Môi Trường (ENV)](#6-cài-đặt-môi-trường-env)
7. [Hướng Dẫn Khởi Chạy](#7-hướng-dẫn-khởi-chạy)
   - [Cách 1: Khởi Chạy Từng Phân Hệ (Local Dev)](#cách-1--khởi-chạy-từng-phân-hệ-local-dev)
   - [Cách 2: Khởi Chạy Toàn Bộ Bằng Docker Compose (Production Ready)](#cách-2--khởi-chạy-toàn-bộ-bằng-docker-compose-production-ready)
   - [Hướng Dẫn Khởi Chạy Mô Hình AI Cục Bộ (Ollama)](#hướng-dẫn-khởi-chạy-mô-hình-ai-cục-bộ-ollama)
8. [Tài Khoản Demo Hệ Thống](#8-tài-khoản-demo-hệ-thống)
9. [Đội Ngũ Thực Hiện](#9-đội-ngũ-thực-hiện)

---

## 1. Tổng Quan Hệ Thống & Kiến Trúc 5 Tầng

Hệ thống được thiết kế theo mô hình **Kiến trúc Phân tầng 5 lớp (5-Tier Layered Architecture)** chuẩn công nghiệp kết hợp với **AI Microservices Ecosystem** và **Local AI Engine**, đảm bảo tính mở rộng cao (Scalability), độ sẵn sàng cao (High Availability), và bảo mật dữ liệu tuyệt đối (Zero Trust RBAC).

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
 │   • POS Walk-in Customer Core   │             │   • Fallback JSON Store Engine   │  │   • Cloud AI: Gemini 3.x Series  │
 │   • Profit Margin Calculator    │             │   • Full-Text Search Engine      │  │   • Python FastAPI AI Service    │
 │   • 2-Step Inbound/Outbound     │             │   • Token Rotation Blacklist     │  │   • Redis 7 In-Memory Cache      │
 │   • Cart & Order State Machine  │             │   • Warranty & Points Ledger     │  │   • VNPAY & MoMo Gateways        │
 └─────────────────────────────────┘             └──────────────────────────────────┘  └──────────────────────────────────┘
```

---

## 2. Cấu Trúc Thư Mục

```
TPKSTORE/                               ← Root thư mục dự án
│
├── 📄 .env.example                     ← Template biến môi trường
├── 📄 .gitignore                       ← Danh sách tệp loại trừ Git
├── 📄 docker-compose.yml               ← Điều phối 6 containers (Postgres, Redis, BE, FE, AI, Nginx)
├── 📄 nginx.conf                       ← Cấu hình Nginx Reverse Proxy & Load Balancing
├── 📄 openapi.yaml                     ← Đặc tả 30+ endpoints chuẩn OpenAPI 3.0
├── 📄 package.json                     ← Root scripts điều phối toàn dự án
├── 📄 README.md                        ← Tài liệu hướng dẫn toàn diện
│
├── 🤖 ai_service/                      ← AI Microservice (Python / FastAPI)
│   ├── 📄 Dockerfile
│   ├── 📄 requirements.txt             ← fastapi, uvicorn, requests, pydantic, numpy
│   ├── 📄 app.py                       ← REST API: Chat RAG, Recommender, Forecast, Safety Stock
│   ├── 📄 recommender.py               ← Hybrid Engine (Content-Based + Collaborative Filtering)
│   ├── 📄 forecaster.py                ← Mô phỏng chuỗi thời gian Prophet-ARIMA
│   ├── 📄 inventory_analyzer.py        ← Tính toán tồn kho an toàn & tốc độ bán hàng (Daily Velocity)
│   └── 📄 knowledge_base.py            ← Cơ sở tri thức chính sách & FAQ cửa hàng
│
├── 🖥️ backend/                         ← Core Backend (Node.js / Express / TypeScript)
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 🗄️ prisma/
│   │   ├── 📄 schema.prisma            ← Schema CSDL 10 bảng: User, Product, Category, StockTicket...
│   │   └── 📄 seed.ts                  ← Script nạp CSDL sản phẩm thật & tài khoản mẫu
│   ├── 🧪 test/
│   │   └── 📄 core_business_ai.test.js ← Bộ test tự động 8/8 test cases cốt lõi (100% PASS)
│   └── 📁 src/
│       ├── 📄 index.ts                 ← Khởi động Express, CORS, gắn route
│       ├── 📄 db.ts                    ← Khởi tạo Prisma Client & FallbackStore
│       ├── 📄 mockData.ts              ← Dữ liệu khởi tạo: sản phẩm công nghệ thật, tài khoản mẫu
│       ├── 📁 middleware/
│       │   └── 📄 auth.ts              ← JWT Verification, Refresh Token Rotation, RBAC authorize()
│       └── 📁 routes/
│           ├── 📄 authRoutes.ts        ← Đăng nhập, đăng ký, refresh token, GET /me
│           ├── 📄 productRoutes.ts     ← Quản lý sản phẩm & biến thể màu/dung lượng (Chỉ Admin)
│           ├── 📄 inventoryRoutes.ts   ← Quản lý phiếu kho: Lọc theo Staff, Duyệt/Từ chối, Thống kê tồn
│           ├── 📄 categoryRoutes.ts    ← CRUD danh mục hàng hóa
│           ├── 📄 cartRoutes.ts        ← Thao tác giỏ hàng đồng bộ CSDL
│           ├── 📄 orderRoutes.ts       ← Đơn hàng trực tuyến & POS bán tại quầy, phiếu bảo hành
│           ├── 📄 paymentRoutes.ts     ← Cổng thanh toán VNPAY Sandbox & MoMo
│           ├── 📄 aiRoutes.ts          ← Động cơ AI: Local AI (Ollama), Gemini 3.x+, Voice & Vision RAG
│           ├── 📄 userRoutes.ts        ← Tra cứu SĐT khách vãng lai, tạo nhanh khách tại quầy, cấp quyền AI
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
│       │   └── 📄 api.ts               ← Lớp giao tiếp REST API toàn diện (gồm POS & Lookup SĐT)
│       ├── 📁 styles/
│       │   └── 📄 index.css            ← Hệ thống CSS & bảng màu Dark Mode Glassmorphism
│       └── 📁 components/              ← 29 Components giao diện chức năng chuyên sâu
│           ├── 📄 Navbar.tsx           ← Header điều hướng, giỏ hàng, nút truy cập nhanh Bán POS
│           ├── 📄 Footer.tsx           ← Footer nhận diện thương hiệu
│           ├── 📄 StorefrontHome.tsx   ← Trang chủ cửa hàng, sản phẩm nổi bật
│           ├── 📄 CatalogView.tsx      ← Bộ lọc danh mục, tìm kiếm đa chiều, phân trang
│           ├── 📄 ProductCard.tsx      ← Thẻ sản phẩm: giá bán, giá cost ngầm, tồn kho
│           ├── 📄 ProductModal.tsx     ← Chi tiết sản phẩm, bộ chọn màu thực tế & dung lượng
│           ├── 📄 CartView.tsx         ← Trang quản lý giỏ hàng mua sắm
│           ├── 📄 CheckoutView.tsx     ← Đặt hàng, Chế độ Bán Quầy (POS Mode) miễn ship 0đ
│           ├── 📄 CounterPosView.tsx   ← Giao diện Bán Hàng Tại Quầy POS chuyên nghiệp cho Nhân viên
│           ├── 📄 VnpayModal.tsx       ← Giả lập cổng thanh toán VNPAY Sandbox chuẩn ngân hàng
│           ├── 📄 MomoModal.tsx        ← Giả lập quét mã thanh toán Ví điện tử MoMo
│           ├── 📄 AuthView.tsx         ← Giao diện Đăng nhập / Đăng ký tài khoản
│           ├── 📄 ProfileView.tsx      ← Xem và chỉnh sửa thông tin cá nhân
│           ├── 📄 MyOrdersView.tsx     ← Khách hàng theo dõi lịch sử đơn và bảo hành
│           ├── 📄 FloatingChatWidget.tsx ← Trợ lý AI: Giọng nói (Voice), Thị giác (Vision), Local AI
│           ├── 📄 AdminSidebar.tsx     ← Thanh điều hướng phân quyền (ADMIN vs MANAGER có mục POS)
│           ├── 📄 AdminDashboard.tsx   ← Dashboard tổng quan KPI, Doanh thu, Giá vốn, Lợi nhuận gộp
│           ├── 📄 AdminProducts.tsx    ← Quản lý sản phẩm: Khóa chỉ xem đối với Quản lý kho / Nhân viên
│           ├── 📄 AdminCategories.tsx  ← Quản lý danh mục sản phẩm (Chỉ Admin)
│           ├── 📄 AdminOrders.tsx      ← Quản lý danh sách đơn hàng & trạng thái vận chuyển
│           ├── 📄 AdminCustomers.tsx   ← Quản trị khách hàng: Điểm tích lũy, kích hoạt Chat AI
│           ├── 📄 StockTicketsView.tsx ← Quản lý phiếu xuất/nhập kho: Lọc theo Staff, Duyệt/Từ chối
│           ├── 📄 AdminAiForecast.tsx  ← Biểu đồ dự báo doanh thu chuỗi thời gian AI (Prophet-ARIMA)
│           ├── 📄 AdminInventoryAlerts.tsx ← Bảng cảnh báo cạn kho & nút duyệt bổ sung nhanh
│           ├── 📄 AdminSettings.tsx    ← Cài đặt mô hình AI: Tích hợp tab cấu hình Local AI Ollama
│           ├── 📄 ArchitectureStudio.tsx ← Trực quan hóa kiến trúc 5 tầng & kiểm tra an ninh AI
│           ├── 📄 StaffDashboard.tsx   ← Cổng vận hành Staff: Mặc định mở Bàn Bán Hàng Tại Quầy (POS)
│           ├── 📄 Pagination.tsx       ← Phân trang dữ liệu
│           └── 📄 ErrorBoundary.tsx    ← Bắt lỗi giao diện an toàn
│
└── 📁 docs/                            ← Tài liệu báo cáo chuyên ngành
    ├── 📄 01_GenAI_SoftwareDevelopment_project-plan.docx
    ├── 📄 02_GenAI_SoftwareDevelopment_requirements-qa.docx
    ├── 📄 BAO_CAO_DO_AN_HE_THONG_QUAN_LY_BAN_HANG_STORE_AI.docx
    ├── 📄 BAO_CAO_PHAN_TICH_THIET_KE_HE_THONG_STORE_AI.docx
    └── 📁 ảnh dự án/                   ← Ảnh chụp màn hình giao diện thực tế
```

---

## 3. Các Tính Năng Nổi Bật & Nghiệp Vụ Bán Lẻ Thực Tế

### 3.1. Nghiệp Vụ Bán Hàng Tại Quầy (POS Mode) & Quản Lý Khách Vãng Lai
Trong thực tế bán lẻ thiết bị công nghệ, **90% khách hàng ghé cửa hàng trực tiếp không có tài khoản web**, nhân viên chỉ xin **Số điện thoại** để kích hoạt bảo hành điện tử và tích điểm thành viên:

* **Tra cứu & Tạo nhanh bằng Số điện thoại (Zero-friction)**:
  * `GET /api/users/lookup?phone=...`: Nhân viên nhập 10 chữ số điện thoại, hệ thống tự động kiểm tra hồ sơ khách hàng, số điểm tích lũy hiện có, tổng chi tiêu và lịch sử đơn hàng/bảo hành trước đó.
  * `POST /api/users/quick-customer`: Nếu là khách hàng mới, hệ thống tự động khởi tạo hồ sơ ngầm với vai trò `CUSTOMER` mà không bắt khách phải cung cấp email hay tạo mật khẩu rườm rà.
* **Tích điểm tự động (Loyalty Program)**: Cứ mỗi **10.000 VNĐ** thanh toán = **1 điểm thưởng tích lũy**.
* **Giao diện POS Bán Hàng Tại Quầy Chuyên Dụng (`CounterPosView.tsx`)**:
  * Tích hợp trực tiếp làm tab mặc định tại **Cổng Vận Hành Staff** (`/staff`) và **Admin / Manager Panel** (`/admin/pos`).
  * Có nút bấm truy cập nhanh **"Bán Tại Quầy (POS)"** ngay trên thanh Navbar cho nhân viên và quản lý.
  * Bộ lọc nhanh sản phẩm theo danh mục, tìm kiếm tức thì theo tên/mã, hiển thị tồn kho thời gian thực (Real-time Stock Badge) chống bán vượt kho.
  * Giỏ hàng bán tại quầy hỗ trợ: tăng/giảm số lượng, chiết khấu giảm giá, tính tiền khách đưa và **tự động tính tiền thừa trả lại khách**.
  * Tùy chọn phương thức thanh toán: **Tiền mặt tại quầy (COD)**, **Quét mã QR VNPay Sandbox**, **Ví điện tử MoMo**.
  * **Phiếu Bảo Hành Điện Tử & Hóa Đơn Bán Lẻ In Ngay**: Xuất modal hóa đơn và phiếu bảo hành chính hãng (12 - 24 tháng theo từng mặt hàng) có thể in ngay cho khách mang về.
* **Chế độ POS trong luồng Checkout chuẩn (`CheckoutView.tsx`)**:
  * Khi nhân viên tư vấn khách trên trang Storefront, bật công tắc **"Chế độ Bán Hàng Tại Quầy"**: tự động miễn phí vận chuyển 0đ (Nhận tại quầy), tự động điền địa chỉ showroom `Mua trực tiếp tại quầy - TPKSTORE`, gắn tên nhân viên tư vấn và kích hoạt bảo hành theo SĐT khách.

---

### 3.2. Quản Lý Lợi Nhuận, Doanh Thu & Giá Vốn Sản Phẩm (Cost & Profit Margin)
Hệ thống giải quyết bài toán quản trị tài chính cốt lõi của chủ cửa hàng:
* **Quy tắc tính Giá vốn (COGS)**: Giá vốn mỗi sản phẩm được tính ngầm chuẩn bằng **75% so với giá bán gốc** (`cost = price * 0.75`), mang lại tỷ suất lợi nhuận gộp danh nghĩa là **25%** (`profit margin = 25%`).
* **Bảng điều khiển Lợi Nhuận (Profit Management)**:
  * Tổng Doanh Thu (Revenue).
  * Tổng Giá Vốn Hàng Bán (Total COGS).
  * Tổng Lợi Nhuận Gộp Thực Tế (Gross Profit = Revenue - COGS).
  * Tỷ suất sinh lời trung bình toàn hệ thống (Profit Margin %).
  * Danh sách Top 5 sản phẩm đóng góp lợi nhuận cao nhất để chủ cửa hàng lên kế hoạch nhập hàng chiến lược.

---

### 3.3. Phân Quyền Đa Tầng (RBAC 4 Cấp Độ Độc Lập)
Hệ thống thiết lập hàng rào bảo mật nghiêm ngặt theo 4 vai trò độc lập:
1. 👑 **ADMIN (Quản trị viên tối cao)**:
   - Toàn quyền quản trị hệ thống: Báo cáo Doanh thu, Lợi nhuận, Giá vốn, Dashboard KPI.
   - **Độc quyền** thêm mới, chỉnh sửa giá bán, cập nhật mô tả và xóa sản phẩm.
   - Quản trị người dùng, phân vai trò, kích hoạt/hủy quyền Chat AI hàng loạt.
   - Cấu hình mô hình AI hệ thống (Local Ollama, Google Gemini 3.x+).
   - Truy cập giao diện Bán hàng tại quầy POS.
2. 👔 **MANAGER (Quản lý kho hàng)**:
   - Kiểm soát toàn bộ hoạt động xuất - nhập kho (Inbound / Outbound).
   - Kiểm tra, đối chiếu và **phê duyệt hoặc từ chối** phiếu xuất/nhập do nhân viên lập.
   - Lọc danh sách phiếu kho theo từng nhân viên lập phiếu.
   - Theo dõi mức tồn kho, cảnh báo an toàn kho và dự báo cạn hàng AI.
   - **Chế độ Chỉ Xem (Read-only)** đối với danh mục sản phẩm: Không có quyền thêm/sửa/xóa sản phẩm để đảm bảo an toàn dữ liệu kinh doanh.
   - Truy cập giao diện POS để hỗ trợ bán hàng khi quầy đông khách.
3. 👷 **STAFF (Nhân viên vận hành & tư vấn bán hàng)**:
   - **Bán hàng tại quầy POS**: Tìm kiếm sản phẩm, nhập SĐT khách vãng lai, xuất hóa đơn, tích điểm và cấp bảo hành điện tử.
   - Tiếp nhận và xử lý đơn hàng trực tuyến của khách hàng.
   - Lập phiếu đề xuất Nhập kho (`IMPORT`) hoặc Xuất kho (`EXPORT`) gửi Manager duyệt.
   - Tra cứu nhanh tồn kho tức thì phục vụ tư vấn khách.
4. 🛒 **CUSTOMER (Khách hàng)**:
   - Mua sắm trực tuyến, tìm kiếm sản phẩm, đặt hàng giao tận nơi.
   - Tra cứu lịch sử đơn hàng, xem thời hạn bảo hành điện tử theo SĐT.
   - Trò chuyện với Trợ lý AI bằng giọng nói tiếng Việt hoặc hình ảnh.

---

### 3.4. Sản Phẩm Công Nghệ Thực Tế Đa Biến Thể (Màu Sắc & Dung Lượng Chuẩn Hãng)
Hệ thống sử dụng dữ liệu sản phẩm công nghệ thật 100%:
* **Đầy đủ màu sắc theo công bố của nhà sản xuất**:
  * *Samsung Galaxy Z Fold6 5G AI Foldable*: Chuẩn 5 màu chính hãng (Xám Titan, Đen Titan, Xanh Maya, Trắng Titan, Nâu Da).
  * *iPhone 16 Pro Max*: Chuẩn 4 màu Titan (Titan Sa Mạc, Titan Tự Nhiên, Titan Trắng, Titan Đen).
  * *MacBook Pro 16 M3 Max, Dell XPS 16, Sony WH-1000XM5, v.v.*
* **Biến thể dung lượng thực tế**: 256GB, 512GB, 1TB, v.v.
* **Giao diện chọn màu tối ưu UX**: Thiết kế nút chọn màu có chỉ báo tên màu trực quan, hiệu ứng chuyển đổi mượt mà không làm xô lệch viền khung (anti-layout shift).

---

### 3.5. Thuật Toán Tìm Kiếm Sản Phẩm Thông Minh (Smart Tokenized Search)
* **Khắc phục triệt để lỗi tìm kiếm sai loại hàng**: Thuật toán tìm kiếm cũ tìm *"điện thoại"* có thể ra *"cục sạc"* do cục sạc có chữ *"sạc cho điện thoại"* trong mô tả.
* **Thuật toán Tokenized Ranking mới**:
  1. Ưu tiên khớp chính xác theo **Danh mục sản phẩm** (ví dụ từ khóa *"điện thoại"* → khớp danh mục *"Điện thoại & Tablet"*).
  2. Ưu tiên khớp theo **Tên sản phẩm** (`name`).
  3. Phân tách từ khóa (tokenization) và lọc từ phủ định/loại trừ, đảm bảo khách tìm điện thoại sẽ ra điện thoại, tìm sạc ra sạc, tìm tai nghe ra tai nghe.

---

### 3.6. Quản Lý Kho Hàng 2 Lớp (Inbound & Outbound) & Lọc Phiếu Theo Nhân Viên
1. **Lập phiếu yêu cầu**: Nhân viên kho (`STAFF`) lập phiếu Nhập kho (`IMPORT`) khi hàng về hoặc Xuất kho (`EXPORT`) khi chuyển hàng. Phiếu ở trạng thái `PENDING (Chờ Quản Lý Duyệt)`.
2. **Kiểm soát & Phê duyệt**: 
   * Quản lý kho (`MANAGER`) hoặc Quản trị viên (`ADMIN`) xem danh sách phiếu chờ duyệt.
   * **Bộ lọc nhân viên (`Staff Filter`)**: Cho phép Quản lý kho lọc nhanh toàn bộ phiếu được tạo bởi một nhân viên cụ thể (`GET /api/inventory/tickets?staff=<userId>`).
   * Khi duyệt (`APPROVE`): Hệ thống thực hiện giao dịch nguyên tử (Atomic transaction) tự động cộng/trừ số lượng tồn kho sản phẩm tức thì.
   * Khi từ chối (`REJECT`): Quản lý kho nhập lý do từ chối cụ thể để nhân viên nắm bắt.

---

### 3.7. Trợ Lý AI Đa Phương Thức (Voice STT/TTS, Multimodal Vision, Dual Engine)
Khung chat nổi thông minh (`FloatingChatWidget`) đóng vai trò là một chuyên gia bán hàng ảo:
* **Hỗ trợ 2 Nhà Cung Cấp Mô Hình**:
  * 🤖 **Local AI (Ollama)**: Chạy hoàn toàn cục bộ trên máy tính, bảo mật riêng tư 100%, không phát sinh chi phí gọi API. Tương thích: `llava` (thị giác), `llama3.2-vision`, `phi3`, `qwen2.5`, `mistral`.
  * ✨ **Google Gemini Cloud (Thế hệ 3.x+)**: Tích hợp các mô hình `gemini-3.5-flash`, `gemini-3.1-flash-lite`, `gemini-3.6-flash`, `gemini-3.7-flash`, `gemini-3.8-flash`, `gemini-3.5-pro`.
* **Nhận Diện Giọng Nói (Speech-to-Text)**: Tích hợp Web Speech API chuẩn tiếng Việt (`vi-VN`) với hiệu ứng sóng âm thời gian thực.
* **Đọc Câu Trả Lời Thành Tiếng (Text-to-Speech)**: Tự động lọc bỏ ký tự Markdown và đọc to câu trả lời bằng giọng đọc tiếng Việt truyền cảm (`SpeechSynthesis`).
* **Truy Vấn Bằng Hình Ảnh (Multimodal Vision)**: Tải ảnh, kéo thả ảnh hoặc **Dán ảnh chụp màn hình trực tiếp từ clipboard (`Ctrl+V`)** để AI phân tích model máy và gợi ý sản phẩm còn hàng trong kho.
* **Kiểm Soát Tồn Kho RAG Chặt Chẽ**: AI chỉ gợi ý các sản phẩm đang có số lượng tồn kho > 0, ngăn ngừa việc tư vấn hàng hết kho.

---

### 3.8. AI Dự Báo Doanh Thu (Prophet-ARIMA) & Phân Tích Tồn Kho An Toàn
* **Dự báo chuỗi thời gian**: Dự báo doanh thu 30 / 60 / 90 ngày tới với khoảng tin cậy 95%, chỉ số độ chính xác **R² Score 95.88%**, **MAPE 4.12%**.
* **Phân tích tồn kho an toàn (Safety Stock Analyzer)**: Đánh giá tốc độ tiêu thụ hàng ngày (Daily Sales Velocity) và thời gian giao hàng của nhà cung ứng (Lead Time), phân thành 4 cấp độ: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`.
* **Duyệt nhập hàng 1-Click**: Tự động tạo phiếu nhập hàng tức thì ngay từ bảng cảnh báo cạn kho.

---

### 3.9. Cổng Thanh Toán Đa Dạng (VNPAY Sandbox, Ví MoMo, Tiền Mặt Tại Quầy)
* **VNPAY Sandbox**: Giả lập cổng thanh toán VNPAY Sandbox chuẩn ngân hàng thương mại. Hỗ trợ thẻ test NCB (`9704198526191432152`, Tên `NGUYEN VAN A`, Ngày phát hành `07/15`, OTP `123456`).
* **Ví Điện Tử MoMo**: Giả lập quét mã QR MoMo và xác nhận giao dịch tự động.
* **Tiền mặt tại quầy (COD/Cash)**: Tích hợp cho đơn mua trực tiếp tại quầy hoặc nhận hàng thanh toán tại nhà.

---

### 3.10. Architecture Studio & AI Security Auditor
* **5-Tier Canvas**: Trực quan hóa cấu trúc phân tầng và trạng thái kết nối thời gian thực giữa 5 tầng kiến trúc.
* **OpenAPI 3.0 Studio**: Trình duyệt tương tác trực tiếp với 30+ API endpoints.
* **AI Security Audit**: Công cụ dùng AI phân tích cấu hình hệ thống, kiểm tra lỗ hổng bảo mật và đưa ra thang điểm an toàn.

---

## 4. Tech Stack Toàn Diện

| Phân Hệ | Công Nghệ Sử Dụng | Mục Đích |
| :--- | :--- | :--- |
| **Giao Diện Frontend** | React 19, TypeScript, Vite, TailwindCSS, Lucide React | SPA hiệu năng cao, Dark Mode Glassmorphism, POS Quầy |
| **Tương Tác Đa Phương Thức** | Web Speech API (STT & TTS), Clipboard Paste API | Nhận diện giọng nói, đọc câu trả lời tiếng Việt, dán ảnh màn hình |
| **Backend Core** | Node.js, Express, TypeScript, Prisma ORM, JWT, Bcrypt | REST API, RBAC 4 Tầng, Giao dịch nguyên tử (Atomic Transactions) |
| **AI Local Engine** | Ollama Local Engine (`llava`, `llama3.2-vision`, `phi3`) | Chat AI nội bộ offline, phân tích hình ảnh, bảo mật dữ liệu tuyệt đối |
| **Cloud AI & Microservices** | Python 3.10+, FastAPI, Uvicorn, Google Gemini 3.x API | Dự báo chuỗi thời gian Prophet-ARIMA, Phân tích tồn kho an toàn |
| **Cơ Sở Dữ Liệu & Bộ Đệm**| PostgreSQL 15, Redis 7, Fallback JSON Store | Lưu trữ quan hệ, Blacklist Token, Fallback đảm bảo chạy 100% |
| **Cổng Thanh Toán** | VNPAY Sandbox Simulator, MoMo QR Simulator | Thanh toán điện tử chuẩn ngân hàng và ví điện tử |
| **Hạ Tầng & Điều Phối** | Docker, Docker Compose, Nginx Reverse Proxy | Điều phối 6 dịch vụ, cân bằng tải, SSL/TLS |

---

## 5. Bộ Kiểm Thử Tự Động (Automated Test Suite)

Dự án tích hợp bộ kiểm thử tự động toàn diện kiểm chứng toàn bộ quy trình nghiệp vụ:

```bash
npm test
```

### Kết Quả Kiểm Thử (100% PASS):

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

==================================================================
🏁 TỔNG KẾT KIỂM THỬ: 8/8 TEST CASES THÀNH CÔNG (100%)
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
| `PORT` | Cổng chạy Backend API | `5000` |
| `JWT_ACCESS_SECRET` | Khóa bí mật ký JWT Access Token (15 phút) | `super_secret_jwt_access_key_shopbee_2026` |
| `JWT_REFRESH_SECRET` | Khóa bí mật ký JWT Refresh Token (7 ngày) | `super_secret_jwt_refresh_key_shopbee_2026` |
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL | `postgresql://postgres:postgres@localhost:5432/shopbee` |
| `REDIS_URL` | Chuỗi kết nối Redis Cache | `redis://localhost:6379` |
| `LOCAL_AI_URL` | Địa chỉ máy chủ AI Local (Ollama) | `http://localhost:11434` |
| `LOCAL_AI_MODEL` | Tên mô hình AI Local mặc định | `llava` *(hoặc `llama3.2-vision`, `phi3`)* |
| `GEMINI_API_KEY` | Khóa Google Gemini API Key | *(Lấy miễn phí tại [Google AI Studio](https://aistudio.google.com/))* |
| `AI_SERVICE_URL` | Đường dẫn tới Python AI Microservice | `http://localhost:8000` |

---

## 7. Hướng Dẫn Khởi Chạy

### Cách 1 — Khởi Chạy Từng Phân Hệ (Local Dev)

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
*(Backend tự động kích hoạt `FallbackStore` nếu máy tính chưa cài PostgreSQL, đảm bảo dự án luôn chạy thành công 100%).*

#### Bước 3: Khởi động Frontend UI
```bash
cd frontend
npm install
npm run dev
# → Giao diện website hoạt động tại: http://localhost:3000
```

---

### Cách 2 — Khởi Chạy Toàn Bộ Bằng Docker Compose (Production Ready)

Khởi chạy đồng loạt toàn bộ 6 dịch vụ chỉ với 1 câu lệnh:

```bash
# Xây dựng và khởi chạy ngầm tất cả container
docker-compose up --build -d

# Kiểm tra trạng thái các container
docker-compose ps

# Xem log hoạt động theo thời gian thực
docker-compose logs -f
```

**Các cổng truy cập:**
* **Giao diện Web & POS Quầy:** [http://localhost:3000](http://localhost:3000)
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
| 👑 **ADMIN** | `admin@example.com` | `Password123@` | **Toàn quyền Quản trị Tối cao:**<br>• Độc quyền thêm/sửa/xóa sản phẩm & cấu hình màu sắc<br>• Báo cáo Doanh thu, Giá vốn (COGS) & Lợi nhuận gộp (Profit)<br>• Cấu hình mô hình AI Local & Gemini Cloud<br>• Sử dụng Bàn Bán Hàng Tại Quầy (POS Mode)<br>• Architecture Studio & AI Security Auditor |
| 👔 **MANAGER** | `manager@example.com` | `Password123@` | **Quản Lý Kho Hàng & Giám Sát Quầy:**<br>• Kiểm soát toàn bộ xuất - nhập kho (Inbound / Outbound)<br>• Phê duyệt / Từ chối phiếu xuất nhập kho của từng Staff<br>• Theo dõi cảnh báo cạn kho & tồn kho an toàn AI<br>• Hỗ trợ Bán hàng tại quầy POS khi đông khách<br>• *Khóa chỉ xem sản phẩm (không sửa/xóa danh mục)* |
| 👷 **STAFF 1** | `staff@example.com` | `Password123@` | **Nhân Viên Tư Vấn & Bán Hàng Tại Quầy (POS):**<br>• **Bàn Bán Hàng POS tại quầy**: Tra cứu SĐT khách vãng lai, xuất hóa đơn, tích điểm & in phiếu bảo hành 12-24 tháng<br>• Tiếp nhận và xử lý đơn đặt hàng trực tuyến<br>• Lập phiếu đề xuất Nhập/Xuất kho chờ Manager duyệt<br>• Tra cứu tồn kho sản phẩm tức thì phục vụ tư vấn |
| 👷 **STAFF 2** | `staff2@example.com` | `Password123@` | **Nhân Viên Bán Hàng & Vận Hành 2** *(tương tự Staff 1)* |
| 🛒 **CUSTOMER** | `customer@example.com` | `Password123@` | **Khách Hàng Mua Sắm Trực Tuyến:**<br>• Tìm kiếm thông minh, lọc danh mục theo ngân sách<br>• Đặt hàng thanh toán COD, VNPAY Sandbox, Ví MoMo<br>• Tra cứu thời hạn bảo hành điện tử theo SĐT<br>• Trợ lý AI Bán hàng: Nói bằng giọng nói, dán ảnh sản phẩm |

---

## 9. Đội Ngũ Thực Hiện

| Thành Viên | Vai Trò Chính | Trách Nhiệm Chi Tiết |
| :--- | :--- | :--- |
| **Thang Quốc Khải** | **Team Leader & AI Architect** | • Thiết kế Kiến trúc Phân tầng 5 lớp (5-Tier Layered Architecture)<br>• Tích hợp AI Microservices, Local AI Ollama & Trợ lý Đa phương thức (Voice & Vision RAG)<br>• Xây dựng Backend Core API, Phân quyền RBAC 4 Tầng & Mô-đun Quản lý Lợi nhuận (Cost/Profit) |
| **Nguyễn Đình Tiến** | **Frontend Lead & UI/UX** | • Thiết kế toàn bộ Giao diện UI/UX Dark Mode Glassmorphism<br>• Xây dựng Giao diện Bán Hàng Tại Quầy POS (`CounterPosView`) & Chế độ POS Checkout<br>• Widget Trợ lý AI tích hợp Web Speech API & Multimodal Image I/O |
| **Nguyễn Hồng Phúc** | **Database & QA Lead** | • Thiết kế CSDL PostgreSQL (Prisma ORM) & Quy trình kiểm soát kho 2 lớp<br>• Xây dựng luồng tạo nhanh Khách hàng vãng lai bằng SĐT & Tích điểm/Bảo hành<br>• Xây dựng bộ kiểm thử tự động 8/8 test cases đạt chuẩn 100% PASS |

---

<div align="center">

*Đồ Án Tốt Nghiệp / Chuyên Ngành — SHOPBEE STORE AI 2026*  
*Giải Pháp Quản Trị Bán Hàng Bán Lẻ Đa Kênh Tích Hợp AI Thực Tế*

</div>

# 🐝 SHOPBEE / STORE AI — HỆ THỐNG QUẢN TRỊ BÁN HÀNG TÍCH HỢP TRÍ TUỆ NHÂN TẠO

> **Đồ án Chuyên ngành Công nghệ Thông tin / Kỹ thuật Phần mềm**  
> **Đề tài:** Hệ thống Quản trị Bán hàng & Thương mại Điện tử Đa kênh Tích hợp Trí tuệ Nhân tạo Đa phương thức (Multimodal Local AI & Cloud), Bán Hàng Tại Quầy (POS) Cho Khách Lẻ, Quản Lý Lợi Nhuận, Trợ Lý RAG Bán Hàng, Phân Quyền RBAC 4 Tầng và Quản Lý Kho Hàng 2 Lớp.  
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
[![Tests](https://img.shields.io/badge/Test_Suites-34%2F34_Pass_(100%25)-success.svg)](https://github.com/tiennguyen0902/TPKSTORE)

---

## 📋 Mục Lục

1. [Tổng Quan Hệ Thống & Kiến Trúc 5 Tầng](#1-tổng-quan-hệ-thống--kiến-trúc-5-tầng)
2. [Cấu Trúc Thư Mục](#2-cấu-trúc-thư-mục)
3. [Các Tính Năng Nổi Bật & Nghiệp Vụ Bán Lẻ Thực Tế](#3-các-tính-năng-nổi-bật--nghiệp-vụ-bán-lẻ-thực-tế)
   - [3.1. Nghiệp Vụ Bán Hàng Tại Quầy (POS Mode) & Quản Lý Khách Lẻ](#31-nghiệp-vụ-bán-hàng-tại-quầy-pos-mode--quản-lý-khách-lẻ)
   - [3.2. Quản Lý Lợi Nhuận, Doanh Thu & Giá Vốn Sản Phẩm (Cost & Profit Margin)](#32-quản-lý-lợi-nhuận-doanh-thu--giá-vốn-sản-phẩm-cost--profit-margin)
   - [3.3. Phân Quyền Đa Tầng (RBAC 4 Cấp Độ Độc Lập)](#33-phân-quyền-đa-tầng-rbac-4-cấp-độ-độc-lập)
   - [3.4. Sản Phẩm Công Nghệ Thực Tế Đa Biến Thể (Màu Sắc & Dung Lượng Chuẩn Hãng)](#34-sản-phẩm-công-nghệ-thực-tế-đa-biến-thể-màu-sắc--dung-lượng-chuẩn-hãng)
   - [3.5. Thuật Toán Tìm Kiếm Sản Phẩm Thông Minh (Smart Tokenized Search)](#35-thuật-toán-tìm-kiếm-sản-phẩm-thông-minh-smart-tokenized-search)
   - [3.6. Quản Lý Kho Hàng 2 Lớp (Inbound & Outbound) & Lọc Phiếu Theo Nhân Viên](#36-quản-lý-kho-hàng-2-lớp-inbound--outbound--lọc-phiếu-theo-nhân-viên)
   - [3.7. Trợ Lý AI Đa Phương Thức (Voice STT/TTS, Multimodal Vision, Dual Engine)](#37-trợ-lý-ai-đa-phương-thức-voice-stttts-multimodal-vision-dual-engine)
   - [3.8. AI Dự Báo Doanh Thu (Mô Phỏng Xu Hướng & Chu Kỳ Tuần) & Phân Tích Cảnh Báo Tồn Kho](#38-ai-dự-báo-doanh-thu-mô-phỏng-xu-hướng--chu-kỳ-tuần--phân-tích-cảnh-báo-tồn-kho)
   - [3.9. Cổng Thanh Toán Đa Dạng (VNPAY Giả Lập, Ví MoMo Test, Tiền Mặt Tại Quầy)](#39-cổng-thanh-toán-đa-dạng-vnpay-giả-lập-ví-momo-test-tiền-mặt-tại-quầy)
   - [3.10. Architecture Studio & AI Security Auditor](#310-architecture-studio--ai-security-auditor)
4. [Tech Stack Toàn Diện](#4-tech-stack-toàn-diện)
5. [Bộ Kiểm Thử Tự Động (Automated Test Suite)](#5-bộ-kiểm-thử-tự-động-automated-test-suite)
6. [Cài Đặt Môi Trường (ENV)](#6-cài-đặt-môi-trường-env)
7. [Hướng Dẫn Khởi Chạy](#7-hướng-dẫn-khởi-chạy)
   - [Cách 1: Khởi Chạy Từng Phân Hệ (Local Dev)](#cách-1--khởi-chạy-từng-phân-hệ-local-dev)
   - [Cách 2: Khởi Chạy Toàn Bộ Bằng Docker Compose](#cách-2--khởi-chạy-toàn-bộ-bằng-docker-compose)
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
 │   • Profit Margin Calculator    │             │   • Full-Text Search Engine      │  │   • Python FastAPI AI Service    │
 │   • 2-Step Inbound/Outbound     │             │   • Refresh Token SHA-256 (DB)   │  │   • Token Blacklist (In-Memory)  │
 │   • Cart & Order State Machine  │             │   • Dynamic Loyalty Points Calc  │  │   • VNPAY & MoMo Test Gateways   │
 └─────────────────────────────────┘             └──────────────────────────────────┘  └──────────────────────────────────┘
```

> **Lưu ý về phiên làm việc & bộ đệm:**  
> Hệ thống không sử dụng Redis. Refresh token được băm SHA-256 và lưu trữ trực tiếp trong bảng `refresh_tokens` của PostgreSQL. Danh sách thu hồi Access token (Token Blacklist) và bộ đếm giới hạn đăng nhập được quản lý bằng cấu trúc `Map` có cơ chế tự động dọn dẹp (TTL) trong bộ nhớ RAM của tiến trình backend.

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
│   │   ├── 📄 schema.prisma            ← Schema CSDL 14 bảng: User, RefreshToken, Customer, Category, Product, Cart, CartItem, Order, OrderItem, Payment, StockTicket, StockMovement, AIInteraction, SystemSettings
│   │   ├── 📁 migrations/              ← Lịch sử di chuyển CSDL Prisma
│   │   └── 📄 seed.ts                  ← Script nạp CSDL sản phẩm thật & tài khoản mẫu
│   ├── 🧪 tests/
│   │   ├── 📄 automated_verification.js ← Bộ kiểm thử tự động đặc tả kỹ thuật 20/20 test cases
│   │   └── 📄 regression_fixes.js       ← Bộ kiểm thử hồi quy nghiệp vụ 6/6 test cases
│   ├── 🧪 test/
│   │   └── 📄 core_business_ai.test.js  ← Bộ kiểm thử nghiệp vụ lõi & AI 8/8 test cases
│   └── 📁 src/
│       ├── 📄 index.ts                 ← Khởi động Express, CORS, gắn route
│       ├── 📄 db.ts                    ← Khởi tạo Prisma Client & FallbackStore
│       ├── 📄 mockData.ts              ← Dữ liệu khởi tạo: sản phẩm công nghệ thật, tài khoản mẫu
│       ├── 📁 middleware/
│       │   └── 📄 auth.ts              ← JWT Verification, Refresh Token SHA-256, RBAC authorize()
│       ├── 📁 services/
│       │   ├── 📄 aiOrchestratorService.ts  ← AI Orchestrator: Gemini API & Ollama Local routing
│       │   ├── 📄 productSearchService.ts   ← Smart Tokenized Search Engine
│       │   ├── 📄 intentParserService.ts    ← Phân tích ý định người dùng
│       │   ├── 📄 groundedChatService.ts    ← RAG chat có kiểm soát ngữ cảnh
│       │   ├── 📄 speechToTextService.ts    ← Chuyển giọng nói thành văn bản
│       │   ├── 📄 imageAnalysisService.ts   ← Phân tích hình ảnh đa phương thức
│       │   └── 📄 safetyGuardrailService.ts ← Lọc nội dung an toàn & kiểm soát quyền hạn AI
│       └── 📁 routes/
│           ├── 📄 authRoutes.ts        ← Đăng nhập, đăng ký, refresh token, GET /me
│           ├── 📄 productRoutes.ts     ← Quản lý sản phẩm & biến thể màu/dung lượng (Chỉ Admin)
│           ├── 📄 inventoryRoutes.ts   ← Quản lý phiếu kho: Lọc theo Staff, Duyệt/Từ chối, Điều chỉnh tồn
│           ├── 📄 categoryRoutes.ts    ← CRUD danh mục hàng hóa
│           ├── 📄 cartRoutes.ts        ← Thao tác giỏ hàng đồng bộ CSDL
│           ├── 📄 orderRoutes.ts       ← Đơn hàng trực tuyến & POS bán tại quầy, phiếu bảo hành
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
│       │   └── 📄 api.ts               ← Lớp giao tiếp REST API toàn diện (gồm POS & Lookup SĐT)
│       ├── 📁 styles/
│       │   └── 📄 index.css            ← Hệ thống CSS & bảng màu Dark Mode Glassmorphism
│       └── 📁 components/              ← 31 Components giao diện chức năng chuyên sâu
│           ├── 📄 Navbar.tsx           ← Header điều hướng, giỏ hàng, nút truy cập nhanh Bán POS
│           ├── 📄 Footer.tsx           ← Footer nhận diện thương hiệu
│           ├── 📄 StorefrontHome.tsx   ← Trang chủ cửa hàng, sản phẩm nổi bật
│           ├── 📄 CatalogView.tsx      ← Bộ lọc danh mục, tìm kiếm đa chiều, phân trang
│           ├── 📄 ProductCard.tsx      ← Thẻ sản phẩm: giá bán, tồn kho thời gian thực
│           ├── 📄 ProductModal.tsx     ← Chi tiết sản phẩm, bộ chọn màu thực tế & dung lượng
│           ├── 📄 CartView.tsx         ← Trang quản lý giỏ hàng mua sắm
│           ├── 📄 CheckoutView.tsx     ← Đặt hàng, Chế độ Bán Quầy (POS Mode) miễn ship 0đ
│           ├── 📄 CounterPosView.tsx   ← Giao diện Bán Hàng Tại Quầy POS chuyên nghiệp
│           ├── 📄 VnpayModal.tsx       ← Giả lập luồng thanh toán VNPAY trong hệ thống
│           ├── 📄 MomoModal.tsx        ← Thanh toán Ví MoMo qua API môi trường test
│           ├── 📄 AuthView.tsx         ← Giao diện Đăng nhập / Đăng ký tài khoản
│           ├── 📄 LoginModal.tsx       ← Modal đăng nhập nhanh không chuyển trang
│           ├── 📄 ProfileView.tsx      ← Xem và chỉnh sửa thông tin cá nhân
│           ├── 📄 MyOrdersView.tsx     ← Khách hàng theo dõi lịch sử đơn và bảo hành
│           ├── 📄 FloatingChatWidget.tsx ← Trợ lý AI: Giọng nói (Voice), Thị giác (Vision), Local AI
│           ├── 📄 AdminSidebar.tsx     ← Thanh điều hướng phân quyền RBAC 4 vai trò
│           ├── 📄 AdminDashboard.tsx   ← Dashboard tổng quan KPI, Doanh thu, Giá vốn, Lợi nhuận gộp
│           ├── 📄 AdminProducts.tsx    ← Quản lý sản phẩm: Khóa chỉ xem đối với MANAGER/STAFF
│           ├── 📄 AdminCategories.tsx  ← Quản lý danh mục sản phẩm (Chỉ Admin)
│           ├── 📄 AdminOrders.tsx      ← Quản lý danh sách đơn hàng & trạng thái vận chuyển
│           ├── 📄 AdminCustomers.tsx   ← Quản trị khách hàng: Điểm tích lũy, kích hoạt Chat AI
│           ├── 📄 StockTicketsView.tsx ← Quản lý phiếu xuất/nhập kho: Lọc theo Staff, Duyệt/Từ chối
│           ├── 📄 AdminAiForecast.tsx  ← Biểu đồ dự báo doanh thu mô phỏng xu hướng & chu kỳ tuần
│           ├── 📄 AdminInventoryAlerts.tsx ← Bảng cảnh báo cạn kho theo ngưỡng & nút duyệt bổ sung
│           ├── 📄 AdminSettings.tsx    ← Cài đặt mô hình AI: Tích hợp tab cấu hình Local AI Ollama
│           ├── 📄 ArchitectureStudio.tsx ← Trực quan hóa kiến trúc 5 tầng & kiểm tra an ninh AI
│           ├── 📄 StaffDashboard.tsx   ← Cổng vận hành Staff: Mặc định mở Bàn Bán Hàng Tại Quầy (POS)
│           ├── 📄 MobileBottomNav.tsx  ← Thanh điều hướng dưới cùng tối ưu cho thiết bị di động
│           ├── 📄 Pagination.tsx       ← Phân trang dữ liệu
│           └── 📄 ErrorBoundary.tsx    ← Bắt lỗi giao diện an toàn
│
└── 📁 docs/                            ← Tài liệu báo cáo chuyên ngành
    ├── 📄 01_GenAI_SoftwareDevelopment_project-plan.docx
    ├── 📄 02_GenAI_SoftwareDevelopment_requirements-qa.docx
    ├── 📄 BAO_CAO_DO_AN_HE_THONG_QUAN_LY_BAN_HANG_STORE_AI.docx
    ├── 📄 BAO_CAO_PHAN_TICH_THIET_KE_HE_THONG_STORE_AI.docx
    ├── 📄 BAO_CAO_TIEN_DO_THUC_HIEN_DO_AN_STORE_AI.docx
    ├── 📄 CHANGELOG_RBAC_INVENTORY_AI.md
    ├── 📄 HUONG_DAN_CAI_DAT_VA_VAN_HANH_AI.md
    ├── 📄 KIEM_THU_CHUC_NANG_QUAN_LY_VA_AI.docx
    └── 📁 ảnh dự án/                   ← Ảnh chụp màn hình giao diện thực tế
```

---

## 3. Các Tính Năng Nổi Bật & Nghiệp Vụ Bán Lẻ Thực Tế

### 3.1. Nghiệp Vụ Bán Hàng Tại Quầy (POS Mode) & Quản Lý Khách Lẻ
Trong thực tế bán lẻ thiết bị công nghệ, **90% khách hàng ghé cửa hàng trực tiếp không có tài khoản web**, nhân viên chỉ xin **Số điện thoại** để kích hoạt bảo hành điện tử và tích điểm thành viên:

* **Tra cứu & Tạo nhanh bằng Số điện thoại (Zero-friction)**:
  * `GET /api/users/lookup?phone=...`: Nhân viên nhập 10 chữ số điện thoại, hệ thống **truy vấn trực tiếp vào CSDL User** để kiểm tra hồ sơ khách hàng, số điểm tích lũy hiện có, tổng chi tiêu và lịch sử đơn hàng/bảo hành trước đó.
  * `POST /api/users/quick-customer`: Nếu là khách hàng mới, hệ thống tự động khởi tạo hồ sơ ngầm với vai trò `CUSTOMER` mà không bắt khách phải cung cấp email hay tạo mật khẩu rườm rà.
* **Tích điểm tự động (Loyalty Program)**: Điểm thưởng được tính toán động tại thời điểm tra cứu bằng `Math.floor(tổng chi tiêu / 10.000)` (không lưu trực tiếp trường riêng trong CSDL).
* **Giao diện POS Bán Hàng Tại Quầy Chuyên Dụng (`CounterPosView.tsx`)**:
  * Tích hợp trực tiếp làm tab mặc định tại **Cổng Vận Hành Staff** (`/staff`) và **Admin / Manager Panel** (`/admin/pos`).
  * Có nút bấm truy cập nhanh **"Bán Tại Quầy (POS)"** ngay trên thanh Navbar cho nhân viên và quản lý.
  * Bộ lọc nhanh sản phẩm theo danh mục, tìm kiếm tức thì theo tên/mã, hiển thị tồn kho thời gian thực (Real-time Stock Badge) chống bán vượt kho.
  * Giỏ hàng bán tại quầy hỗ trợ: tăng/giảm số lượng, chiết khấu giảm giá, tính tiền khách đưa và **tự động tính tiền thừa trả lại khách**.
  * Tùy chọn phương thức thanh toán: **Tiền mặt tại quầy (COD)**, **Quét mã QR VNPay giả lập**, **Ví điện tử MoMo**.
  * **Phiếu Bảo Hành Điện Tử & Hóa Đơn Bán Lẻ In Ngay**: Phiếu bảo hành được tự động sinh khi tạo đơn hàng bán tại quầy (POS Mode), thời hạn bảo hành 12 - 24 tháng theo từng mặt hàng, có thể in ngay kèm hóa đơn bán lẻ cho khách mang về.
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

Hệ thống thiết lập hàng rào bảo mật nghiêm ngặt theo 4 vai trò độc lập với ranh giới đặc quyền chuẩn hóa:

#### 👑 ADMIN (Quản trị viên tối cao)
* **Quản lý Master Data của sản phẩm**: Toàn quyền quản trị dữ liệu gốc của sản phẩm (tên, thông số kỹ thuật, hình ảnh, biến thể).
* **Giá**: Quản lý giá bán, giá niêm yết, giá vốn (cost) và biên lợi nhuận sản phẩm.
* **Danh mục**: Toàn quyền CRUD các danh mục sản phẩm (Category).
* **Tài khoản**: Quản trị tài khoản người dùng, phân quyền các vai trò trong hệ thống, cấp quyền truy cập.
* **Doanh thu**: Giám sát doanh thu toàn bộ hệ thống, báo cáo lãi/lỗ chi tiết, phân tích dòng tiền và biểu đồ dự báo kinh doanh.
* **Toàn bộ hệ thống**: Cấu hình các cổng thanh toán, thiết lập AI Provider (Gemini API Cloud / Ollama Local), giám sát Architecture Studio và toàn bộ hệ thống.

#### 👔 MANAGER (Quản lý kho hàng & Bán quầy)
* **Bán hàng tại quầy (POS)**: Được quyền thao tác giao diện Bán Hàng Tại Quầy (POS Mode), tra cứu SĐT khách lẻ, tạo đơn hàng tại quầy và xuất hóa đơn/phiếu bảo hành.
* **Quản lý nghiệp vụ kho**: Điều hành toàn bộ hoạt động xuất - nhập kho và kiểm soát hàng tồn kho.
* **Nhập kho**: Lập và thực thi các phiếu nhập kho từ nhà cung cấp.
* **Xuất kho**: Lập các phiếu xuất kho điều chuyển, xuất mẫu hoặc xuất quầy.
* **Duyệt yêu cầu**: Thẩm định và phê duyệt hoặc từ chối các yêu cầu xuất kho từ nhân viên bán hàng (STAFF) hoặc đề xuất từ AI.
* **Kiểm kê**: Thực hiện kiểm đếm thực tế và đối chiếu với số liệu hệ thống.
* **Điều chỉnh tồn**: Điều chỉnh số lượng tồn kho theo số liệu kiểm kê thực tế (`POST /api/inventory/adjustment`), tự động ghi nhật ký bất biến `StockMovement`.
* **Cảnh báo tồn kho**: Theo dõi danh sách cảnh báo cạn kho theo ngưỡng (`CRITICAL`, `HIGH`, `MEDIUM`).
* **Xem thông tin sản phẩm**: Tra cứu danh sách và chi tiết sản phẩm ở chế độ chỉ đọc (Read-only); **không có quyền** sửa tên, giá bán, danh mục hay xóa sản phẩm.

#### 👷 STAFF (Nhân viên bán hàng)
* **Bán hàng**: Thao tác giao diện Bán hàng tại quầy (POS Mode), tạo đơn hàng nhanh cho khách lẻ bằng số điện thoại, xuất hóa đơn và kích hoạt bảo hành điện tử.
* **Xem tồn**: Tra cứu tức thì số lượng tồn kho khả dụng của từng mã sản phẩm để phục vụ bán hàng.
* **Yêu cầu xuất kho**: Lập phiếu yêu cầu xuất kho (phiếu loại `EXPORT` ở trạng thái `PENDING`) khi cần lấy hàng từ kho; **không có quyền** tự duyệt phiếu, không có quyền lập phiếu nhập kho và không có quyền điều chỉnh tồn kho.
* **Tư vấn khách**: Sử dụng Trợ lý AI Bán hàng tra cứu nhanh sản phẩm phù hợp với nhu cầu, tầm giá và sở thích của khách hàng.

#### 🛒 CUSTOMER (Khách hàng)
* **Mua hàng**: Khám phá danh mục, tìm kiếm thông minh, thêm vào giỏ hàng, đặt hàng trực tuyến (COD, VNPAY, MoMo), theo dõi trạng thái đơn hàng cá nhân.
* **Nhận tư vấn sản phẩm**: Trò chuyện với Trợ lý AI tư vấn chọn sản phẩm (Cloud API hoặc Local AI); **hệ thống tự động ngăn chặn** các câu hỏi liên quan đến doanh thu nội bộ, lợi nhuận hoặc giá vốn cửa hàng.

---

### 3.4. Sản Phẩm Công Nghệ Thực Tế Đa Biến Thể (Màu Sắc & Dung Lượng Chuẩn Hãng)
Hệ thống sử dụng dữ liệu sản phẩm công nghệ thực tế:
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
1. **Lập phiếu yêu cầu**: Nhân viên kho (`STAFF`) lập phiếu Xuất kho (`EXPORT`) khi cần hàng. Phiếu ở trạng thái `PENDING (Chờ Quản Lý Duyệt)`.
2. **Kiểm soát & Phê duyệt**: 
   * Quản lý kho (`MANAGER`) hoặc Quản trị viên (`ADMIN`) lập phiếu Nhập kho (`IMPORT`) và xem danh sách phiếu chờ duyệt.
   * **Bộ lọc nhân viên (`Staff Filter`)**: Cho phép Quản lý kho lọc nhanh toàn bộ phiếu được tạo bởi một nhân viên cụ thể (`GET /api/inventory/tickets?staff=<userId>`).
   * Khi duyệt (`APPROVE`): Hệ thống thực hiện giao dịch nguyên tử (Atomic transaction) tự động cộng/trừ số lượng tồn kho sản phẩm tức thì, ghi nhật ký `StockMovement` bất biến.
   * Khi từ chối (`REJECT`): Quản lý kho nhập lý do từ chối cụ thể để nhân viên nắm bắt.
3. **Kiểm kê & Điều chỉnh tồn** (`POST /api/inventory/adjustment`): MANAGER/ADMIN cập nhật số lượng thực tế sau kiểm đếm, hệ thống tự động tính delta và ghi nhật ký `StockMovement` (type: `ADJUSTMENT`).

---

### 3.7. Trợ Lý AI Đa Phương Thức (Voice STT/TTS, Multimodal Vision, Dual Engine)
Khung chat nổi thông minh (`FloatingChatWidget`) đóng vai trò là một chuyên gia bán hàng ảo:
* **Hỗ trợ 2 Nhà Cung Cấp Mô Hình**:
  * 🤖 **Local AI (Ollama)**: Chạy hoàn toàn cục bộ trên máy tính, bảo vệ quyền riêng tư dữ liệu, không phát sinh chi phí gọi API ngoài. Tương thích: `llava` (thị giác), `llama3.2-vision`, `phi3`, `qwen2.5`, `mistral`.
  * ✨ **Google Gemini Cloud (Thế hệ 3.x+)**: Tích hợp các mô hình `gemini-3.5-flash`, `gemini-3.1-flash-lite`, `gemini-3.6-flash`, `gemini-3.7-flash`, `gemini-3.8-flash`, `gemini-3.5-pro`.
* **Nhận Diện Giọng Nói (Speech-to-Text)**: Tích hợp Web Speech API chuẩn tiếng Việt (`vi-VN`) với hiệu ứng sóng âm thời gian thực.
* **Đọc Câu Trả Lời Thành Tiếng (Text-to-Speech)**: Tự động lọc bỏ ký tự Markdown và đọc to câu trả lời bằng giọng đọc tiếng Việt (`SpeechSynthesis`).
* **Truy Vấn Bằng Hình Ảnh (Multimodal Vision)**: Tải ảnh, kéo thả ảnh hoặc **Dán ảnh chụp màn hình trực tiếp từ clipboard (`Ctrl+V`)** để AI phân tích model máy và gợi ý sản phẩm còn hàng trong kho.
* **Kiểm Soát Tồn Kho RAG Chặt Chẽ**: AI chỉ gợi ý các sản phẩm đang có số lượng tồn kho > 0, ngăn ngừa việc tư vấn hàng hết kho.
* **Product Advice qua AI Orchestrator thật**: Endpoint `/api/ai/product-advice` gửi ngữ cảnh sản phẩm thực tế từ CSDL sang Gemini hoặc Ollama và trả lời tư vấn thực tế; không ghép chuỗi template giả.

---

### 3.8. AI Dự Báo Doanh Thu (Mô Phỏng Xu Hướng & Chu Kỳ Tuần) & Phân Tích Cảnh Báo Tồn Kho
* **Dự báo mô phỏng xu hướng & mùa vụ**: Dự báo doanh thu 30 / 60 / 90 ngày tới được mô phỏng dựa trên hàm xu hướng tuyến tính kết hợp chu kỳ dao động theo tuần (Weekly Seasonality). Dữ liệu mang tính chất minh họa kịch bản, chưa huấn luyện trên tập dữ liệu bán hàng thực tế và không cung cấp các chỉ số sai số (như MAPE, RMSE hay R² Score).
* **Cảnh báo tồn kho theo ngưỡng (Threshold-based Alerts)**: Hệ thống phân loại mức độ cảnh báo tồn kho dựa trên các ngưỡng số lượng thực tế:
  * Số lượng tồn ≤ 3: Mức NGUY CẤP (`CRITICAL`)
  * Số lượng tồn ≤ 5: Mức CAO (`HIGH`)
  * Số lượng tồn ≤ 10: Mức TRUNG BÌNH (`MEDIUM`)
* **Duyệt nhập hàng 1-Click**: Tự động tạo phiếu nhập hàng tức thì ngay từ bảng cảnh báo cạn kho.

---

### 3.9. Cổng Thanh Toán Đa Dạng (VNPAY Giả Lập, Ví MoMo Test, Tiền Mặt Tại Quầy)
* **VNPAY Giả Lập**: Giả lập luồng thanh toán VNPAY trong hệ thống, mô phỏng giao diện nhập thông tin thẻ và xác thực OTP nội bộ (Hỗ trợ thẻ test NCB: `9704198526191432152`, Tên `NGUYEN VAN A`, Ngày phát hành `07/15`, OTP `123456`).
* **Ví Điện Tử MoMo**: Tích hợp gọi trực tiếp API môi trường test của MoMo (`test-payment.momo.vn`) để tạo yêu cầu thanh toán quét mã QR.
* **Tiền mặt tại quầy (COD/Cash)**: Tích hợp cho đơn mua trực tiếp tại quầy hoặc nhận hàng thanh toán tại nhà.

---

### 3.10. Architecture Studio & AI Security Auditor
* **5-Tier Canvas**: Trực quan hóa cấu trúc phân tầng và trạng thái kết nối thời gian thực giữa 5 tầng kiến trúc.
* **OpenAPI 3.0 Studio**: Trình duyệt tương tác trực tiếp với 30+ API endpoints.
* **AI Security Audit**: Phân tích an ninh kiến trúc hệ thống bằng trí tuệ nhân tạo. **Lưu ý:** Tính năng này chỉ hoạt động khi hệ thống được cấu hình `GEMINI_API_KEY` hợp lệ. Khi AI offline hoặc không có API key, hệ thống hiển thị trạng thái `unavailable` thay vì tự tạo điểm số giả.

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
| **Hạ Tầng & Điều Phối** | Docker, Docker Compose, Nginx Reverse Proxy | Điều phối 5 dịch vụ, Reverse proxy cổng 8088 (chưa cấu hình SSL) |

---

## 5. Bộ Kiểm Thử Tự Động (Automated Test Suite)

Dự án tích hợp 3 bộ kiểm thử tự động toàn diện trên hệ cơ sở dữ liệu thật với kết quả đạt **34/34 tests PASS (100%)**:

1. **Bộ kiểm thử đặc tả kỹ thuật (`backend/tests/automated_verification.js`)**: 20/20 test cases đạt 100% PASS.
2. **Bộ kiểm thử nghiệp vụ lõi & AI (`backend/test/core_business_ai.test.js`)**: 8/8 test cases đạt 100% PASS.
3. **Bộ kiểm thử hồi quy nghiệp vụ (`backend/tests/regression_fixes.js`)**: 6/6 test cases đạt 100% PASS.

```bash
# Chạy bộ kiểm thử 1: Đặc tả kỹ thuật RBAC, Kho, AI & Đơn hàng (20 tests)
node backend/tests/automated_verification.js

# Chạy bộ kiểm thử 2: Nghiệp vụ sản phẩm, giỏ hàng, POS & AI Fallback (8 tests)
node backend/test/core_business_ai.test.js

# Chạy bộ kiểm thử 3: Kiểm thử hồi quy chống bán vượt kho, chuyển trạng thái, RBAC POS, chống xác nhận đơn đã hủy (6 tests)
node backend/tests/regression_fixes.js
```

### Kết Quả Kiểm Thử Toàn Diện (34/34 PASS — 100%):

```
================================================================
       TPKSTORE SPECIFICATION TEST SUITE (SECTION 20)           
================================================================

Authenticating 4 roles (ADMIN, MANAGER, STAFF, CUSTOMER)...
All 4 roles authenticated successfully.

--- 1. RBAC Product Management Matrix ---
[PASS] RBAC-PROD-01: MANAGER cannot create product (403)
[PASS] RBAC-PROD-02: STAFF cannot update product (403)
[PASS] RBAC-PROD-03: ADMIN CRUD product allowed & direct stock update blocked (Created: 201, Stock preserved at 15)

--- 2. Inventory & Stock Ticket Matrix ---
[PASS] INV-01: STAFF can create EXPORT ticket (PENDING) (Status: 201)
[PASS] INV-02: STAFF cannot create IMPORT ticket (403 Forbidden)
[PASS] INV-03: STAFF cannot approve stock tickets (403 Forbidden)
[PASS] INV-04: MANAGER approves EXPORT -> stock decremented & StockMovement logged
[PASS] INV-05: MANAGER approves IMPORT -> stock incremented & StockMovement logged
[PASS] INV-06: MANAGER inventory check & stock adjustment -> stock updated & StockMovement logged
[PASS] INV-07: STAFF cannot perform stock adjustment (403 Forbidden)

--- 3. AI Provider & Orchestration Matrix ---
[PASS] AI-01: CUSTOMER AI advice via API Provider (200 OK)
[PASS] AI-02: CUSTOMER AI advice via Local Provider (200 OK)
[PASS] AI-03: CUSTOMER blocked from inquiring revenue/profit (403 Forbidden)
[PASS] AI-04: STAFF AI inventory status lookup allowed (200 OK)
[PASS] AI-05: STAFF blocked from AI stock ticket approval (403 Forbidden)
[PASS] AI-06: MANAGER AI stock proposal creates PENDING ticket (Stock unchanged)
[PASS] AI-07: ADMIN business-qa & forecast endpoints accessible with role auth (QA: 200, Forecast: 200)
[PASS] AI-08: AI Multi-provider status endpoint reports live availability: Providers: api:online, local:online

--- 4. Order Transactions & Stock Movements Matrix ---
[PASS] ORDER-01: Order creation decrements stock and writes StockMovement (SALE)
[PASS] ORDER-02: Order cancellation restores stock and writes StockMovement (SALE_CANCEL)
================================================================
TEST RESULTS: 20/20 PASSED (0 FAILED)
================================================================

================================================================
       CORE BUSINESS & AI RESILIENCE TEST SUITE
================================================================
[PASS] TEST 1: Public product catalog & search works without auth
[PASS] TEST 2: Customer can add to cart, update quantity, and fetch cart
[PASS] TEST 3: Staff creates POS order for walk-in customer -> instant stock decrement & warranty issued
[PASS] TEST 4: Manager & Admin can access profit and margin dashboard
[PASS] TEST 5: Customer cannot access manager/admin inventory routes (403)
[PASS] TEST 6: Dual-engine AI advice works when Gemini online or gracefully falls back to Ollama
[PASS] TEST 7: AI chat rejects injection attempts on internal profit/cost data
[PASS] TEST 8: Stock ticket lifecycle (Create PENDING -> Approve -> Atomic Stock Update)
================================================================
TEST RESULTS: 8/8 PASSED (0 FAILED)
================================================================

================================================================
       TPKSTORE REGRESSION & BUG FIXES TEST SUITE               
================================================================
[PASS] REG-01: DELIVERED order cannot be reverted to PENDING (Status: 400)
[PASS] REG-02: PENDING order can transition to CONFIRMED (Status: 200)
[PASS] REG-03: Concurrent order checkout prevents overselling (Success: 1, Failed: 1, Final Stock: 0)
[PASS] REG-04: MANAGER role is authorized to execute POS checkout (Status: 201)
[PASS] REG-05: Registration rejects weak password under 8 chars / missing numbers (Status: 400)
[PASS] REG-06: Cancelled order cannot be confirmed via /payment/vnpay-confirm (Status: 400, Order Status: CANCELLED)
================================================================
TEST RESULTS: 6/6 PASSED (0 FAILED)
================================================================
```

> **Ghi chú quan trọng về kiểm thử AI:** Bộ kiểm thử AI xác nhận phân quyền, định tuyến và phản hồi dự phòng; chưa đánh giá chất lượng câu trả lời khi provider offline.

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
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL | `postgresql://postgres:postgres@localhost:5432/shopbee` |
| `LOCAL_AI_URL` | Địa chỉ máy chủ AI Local (Ollama) | `http://localhost:11434` |
| `LOCAL_AI_MODEL` | Tên mô hình AI Local mặc định | `llava` *(hoặc `llama3.2-vision`, `phi3`)* |
| `GEMINI_API_KEY` | Khóa Google Gemini API Key | *(Lấy miễn phí tại [Google AI Studio](https://aistudio.google.com/))* |
| `GEMINI_MODEL` | Mô hình Google Gemini Cloud mặc định | `gemini-3.5-flash` |
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
*(Backend hỗ trợ chế độ `FallbackStore` trong môi trường phát triển khi chưa kết nối PostgreSQL).*

#### Bước 3: Khởi động Frontend UI
```bash
cd frontend
npm install
npm run dev
# → Giao diện website hoạt động tại: http://localhost:5173
```

---

### Cách 2 — Khởi Chạy Toàn Bộ Bằng Docker Compose

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
| 👑 **ADMIN** | `admin@example.com` | `Password123@` | **Toàn quyền Quản trị Tối cao:**<br>• Độc quyền thêm/sửa/xóa sản phẩm & cấu hình màu sắc<br>• Báo cáo Doanh thu, Giá vốn (COGS) & Lợi nhuận gộp (Profit)<br>• Cấu hình mô hình AI Local & Gemini Cloud<br>• Sử dụng Bàn Bán Hàng Tại Quầy (POS Mode)<br>• Architecture Studio & AI Security Auditor |
| 👔 **MANAGER** | `manager@example.com` | `Password123@` | **Quản Lý Kho Hàng & Bán Quầy:**<br>• Sử dụng Bàn Bán Hàng Tại Quầy (POS Mode) để bán hàng trực tiếp, tạo đơn và in hóa đơn/phiếu bảo hành<br>• Kiểm soát toàn bộ xuất - nhập kho (Inbound / Outbound)<br>• Phê duyệt / Từ chối phiếu xuất nhập kho của từng Staff<br>• Kiểm kê & Điều chỉnh tồn kho thực tế (`ADJUSTMENT`)<br>• Theo dõi cảnh báo cạn kho theo ngưỡng (`CRITICAL`, `HIGH`, `MEDIUM`)<br>• *Khóa chỉ xem sản phẩm (không sửa/xóa danh mục/doanh thu)* |
| 👷 **STAFF 1** | `staff@example.com` | `Password123@` | **Nhân Viên Tư Vấn & Bán Hàng Tại Quầy (POS):**<br>• **Bàn Bán Hàng POS tại quầy**: Tra cứu SĐT khách lẻ, xuất hóa đơn, tích điểm & in phiếu bảo hành 12-24 tháng<br>• Lập phiếu đề xuất Xuất kho (chờ Manager duyệt)<br>• Tra cứu tồn kho sản phẩm tức thì phục vụ tư vấn<br>• *Không có quyền lập phiếu nhập kho hoặc điều chỉnh tồn* |
| 👷 **STAFF 2** | `staff2@example.com` | `Password123@` | **Nhân Viên Bán Hàng & Vận Hành 2** *(tương tự Staff 1)* |
| 🛒 **CUSTOMER** | `customer@example.com` | `Password123@` | **Khách Hàng Mua Sắm Trực Tuyến:**<br>• Tìm kiếm thông minh, lọc danh mục theo ngân sách<br>• Đặt hàng thanh toán COD, VNPAY giả lập, Ví MoMo test<br>• Tra cứu thời hạn bảo hành điện tử theo SĐT<br>• Trợ lý AI Bán hàng: Nói bằng giọng nói, dán ảnh sản phẩm |

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
| **Thang Quốc Khải** | **Team Leader & AI Architect** | • Thiết kế Kiến trúc Phân tầng 5 lớp (5-Tier Layered Architecture)<br>• Tích hợp AI Microservices, Local AI Ollama & Trợ lý Đa phương thức (Voice & Vision RAG)<br>• Xây dựng Backend Core API, Phân quyền RBAC 4 Tầng & Mô-đun Quản lý Lợi nhuận (Cost/Profit) |
| **Nguyễn Đình Tiến** | **Frontend Lead & UI/UX** | • Thiết kế toàn bộ Giao diện UI/UX Dark Mode Glassmorphism<br>• Xây dựng Giao diện Bán Hàng Tại Quầy POS (`CounterPosView`) & Chế độ POS Checkout<br>• Widget Trợ lý AI tích hợp Web Speech API & Multimodal Image I/O |
| **Nguyễn Hồng Phúc** | **Database & QA Lead** | • Thiết kế CSDL PostgreSQL (Prisma ORM) & Quy trình kiểm soát kho 2 lớp<br>• Xây dựng luồng tạo nhanh Khách lẻ bằng SĐT & Tích điểm/Bảo hành<br>• Xây dựng các bộ kiểm thử tự động đạt chuẩn **34/34 test cases (100% PASS)** |

---

<div align="center">

*Đồ Án Tốt Nghiệp / Chuyên Ngành — SHOPBEE STORE AI 2026*  
*Giải Pháp Quản Trị Bán Hàng Bán Lẻ Đa Kênh Tích Hợp AI Thực Tế*

</div>

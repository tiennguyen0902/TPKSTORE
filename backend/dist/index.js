"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
// Nạp biến môi trường ngay đầu tiên
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Request logger
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });
    next();
});
// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "SHOPBEE / STORE AI Core Backend",
        version: "2.1.0",
        database: "PostgreSQL + Prisma ORM",
        timestamp: new Date().toISOString()
    });
});
// API Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/cart", cartRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/payment", paymentRoutes_1.default);
app.use("/api/ai", aiRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/settings", settingsRoutes_1.default);
// Static files & SPA fallback for Frontend (Fullstack / Tenten / Plesk Production)
const possibleFrontendPaths = [
    path_1.default.resolve(process.cwd(), "frontend/dist"),
    path_1.default.resolve(__dirname, "../../frontend/dist"),
    path_1.default.resolve(__dirname, "../frontend/dist"),
    path_1.default.resolve(__dirname, "public"),
    path_1.default.resolve(process.cwd(), "dist")
];
let frontendDistPath = "";
for (const p of possibleFrontendPaths) {
    if (fs_1.default.existsSync(p) && fs_1.default.existsSync(path_1.default.join(p, "index.html"))) {
        frontendDistPath = p;
        break;
    }
}
if (frontendDistPath) {
    console.log(`📦 Serving frontend static assets from: ${frontendDistPath}`);
    app.use(express_1.default.static(frontendDistPath));
    app.get("*", (req, res, next) => {
        if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/health")) {
            return next();
        }
        res.sendFile(path_1.default.join(frontendDistPath, "index.html"));
    });
}
// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Server Error:", err);
    res.status(err.status || 500).json({
        error: err.message || "Lỗi máy chủ nội bộ. Vui lòng thử lại sau.",
        timestamp: new Date().toISOString()
    });
});
// Start Server with Prisma Connection
async function main() {
    try {
        await db_1.prisma.$connect();
        console.log("✅ Kết nối PostgreSQL thành công qua Prisma ORM!");
    }
    catch (err) {
        console.warn("⚠️ Cảnh báo: Chưa thể kết nối database PostgreSQL (Vui lòng kiểm tra DATABASE_URL):", err);
    }
    app.listen(PORT, () => {
        console.log(`🚀 SHOPBEE Fullstack Server running on port ${PORT}`);
        console.log(`📡 API Endpoints available at /api`);
        console.log(`🗄️  Database: PostgreSQL (Prisma ORM)`);
    });
}
// Graceful Shutdown
process.on("SIGINT", async () => {
    console.log("\n🔄 Đang đóng kết nối database...");
    await db_1.prisma.$disconnect().catch(() => { });
    console.log("✅ Đã ngắt kết nối database.");
    process.exit(0);
});
process.on("SIGTERM", async () => {
    await db_1.prisma.$disconnect().catch(() => { });
    process.exit(0);
});
main();
exports.default = app;

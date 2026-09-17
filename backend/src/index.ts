import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Nạp biến môi trường ngay đầu tiên
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import { prisma } from "./db";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import aiRoutes from "./routes/aiRoutes";
import userRoutes from "./routes/userRoutes";
import settingsRoutes from "./routes/settingsRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "SHOPBEE / STORE AI Core Backend",
    version: "2.1.0",
    database: "PostgreSQL + Prisma ORM",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);

// Static files & SPA fallback for Frontend (Fullstack / Tenten / Plesk Production)
const possibleFrontendPaths = [
  path.resolve(process.cwd(), "frontend/dist"),
  path.resolve(__dirname, "../../frontend/dist"),
  path.resolve(__dirname, "../frontend/dist"),
  path.resolve(__dirname, "public"),
  path.resolve(process.cwd(), "dist")
];

let frontendDistPath = "";
for (const p of possibleFrontendPaths) {
  if (fs.existsSync(p) && fs.existsSync(path.join(p, "index.html"))) {
    frontendDistPath = p;
    break;
  }
}

if (frontendDistPath) {
  console.log(`📦 Serving frontend static assets from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));
  app.get("*", (req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/health")) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Server Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Lỗi máy chủ nội bộ. Vui lòng thử lại sau.",
    timestamp: new Date().toISOString()
  });
});

// Start Server with Prisma Connection
async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Kết nối PostgreSQL thành công qua Prisma ORM!");
  } catch (err) {
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
  await prisma.$disconnect().catch(() => {});
  console.log("✅ Đã ngắt kết nối database.");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect().catch(() => {});
  process.exit(0);
});

main();

export default app;

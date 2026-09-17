const { default: EmbeddedPostgres } = require("embedded-postgres");
const path = require("path");
const fs = require("fs");
const { Client } = require("pg");

async function start() {
  const dataDir = path.resolve(__dirname, "./pg_data");

  // Clean stale lock files if any
  const pidFile = path.join(dataDir, "postmaster.pid");
  if (fs.existsSync(pidFile)) {
    try { fs.unlinkSync(pidFile); } catch (e) {}
  }

  const pg = new EmbeddedPostgres({
    databaseDir: dataDir,
    port: 5432,
    user: "postgres",
    password: "password123",
    persistent: true
  });

  if (!fs.existsSync(path.join(dataDir, "PG_VERSION"))) {
    console.log("🌱 Khởi tạo dữ liệu PostgreSQL ban đầu...");
    await pg.initialise();
  }

  console.log("🚀 Đang khởi động PostgreSQL Server trên cổng 5432...");
  await pg.start();
  console.log("✅ PostgreSQL Server đã khởi động thành công!");

  // Ensure store_ai_db exists
  try {
    const client = new Client({
      connectionString: "postgresql://postgres:password123@localhost:5432/postgres"
    });
    await client.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'store_ai_db'");
    if (res.rows.length === 0) {
      console.log("📦 Đang tạo database 'store_ai_db' (UTF-8)...");
      await client.query("CREATE DATABASE store_ai_db WITH TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C'");
      console.log("✅ Database 'store_ai_db' đã được tạo thành công!");
    } else {
      console.log("✅ Database 'store_ai_db' đã sẵn sàng!");
    }
    await client.end();
  } catch (err) {
    console.warn("Lưu ý kiểm tra database:", err.message);
  }

  console.log("===================================================");
  console.log("  🐘 POSTGRESQL 18 SERVER ĐANG HOẠT ĐỘNG (Port 5432)");
  console.log("  URL: postgresql://postgres:password123@localhost:5432/store_ai_db");
  console.log("  Thư mục dữ liệu: backend/pg_data");
  console.log("===================================================");
  console.log("Server đang lắng nghe kết nối từ Backend & Prisma...");

  // Handle graceful exit
  const handleExit = async () => {
    console.log("\nĐang dừng PostgreSQL an toàn...");
    try {
      await pg.stop();
      console.log("PostgreSQL đã tắt.");
    } catch (e) {}
    process.exit(0);
  };

  process.on("SIGINT", handleExit);
  process.on("SIGTERM", handleExit);

  // Keep process alive
  setInterval(() => {}, 10000);
}

start().catch(err => {
  console.error("Lỗi khởi động PostgreSQL:", err);
  process.exit(1);
});

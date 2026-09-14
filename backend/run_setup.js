const path = require("path");
const fs = require("fs");
const net = require("net");
const { spawn, execSync } = require("child_process");
const dotenv = require("dotenv");

// Load backend/.env
const envPath = path.resolve(__dirname, ".env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:password123@localhost:5432/store_ai_db?schema=public";

function maskDbUrl(url) {
  try {
    const u = new URL(url);
    if (u.password) u.password = "******";
    return u.toString();
  } catch (e) {
    return url.replace(/:([^:@]+)@/, ":******@");
  }
}

function checkPort(port, host = "127.0.0.1", timeout = 1500) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isOpen = false;
    socket.setTimeout(timeout);
    socket.on("connect", () => {
      isOpen = true;
      socket.destroy();
    });
    socket.on("timeout", () => socket.destroy());
    socket.on("error", () => socket.destroy());
    socket.on("close", () => resolve(isOpen));
    socket.connect(port, host);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function runProcess(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32";
    const executable = isWindows ? `${cmd}.cmd` : cmd;
    
    // Check if cmd.cmd exists, else fallback to cmd
    const p = spawn(executable, args, {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        CHECKPOINT_DISABLE: "1",
        PRISMA_TELEMETRY_INFORMATION_DISABLED: "1",
        ...options.env
      },
      cwd: __dirname,
      ...options
    });

    p.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Tiến trình ${cmd} kết thúc với mã lỗi ${code}`));
    });

    p.on("error", (err) => reject(err));
  });
}

async function main() {
  console.log("==================================================================");
  console.log("          🐘 TPKSTORE / SHOPBEE - POSTGRESQL DATABASE SETUP       ");
  console.log("==================================================================");
  console.log(`📌 Chuỗi kết nối: ${maskDbUrl(dbUrl)}`);
  
  const isLocal = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");

  if (isLocal) {
    console.log("🔍 Phát hiện cấu hình PostgreSQL nội bộ (localhost:5432)...");
    const portOpen = await checkPort(5432);

    if (!portOpen) {
      console.log("⏳ PostgreSQL Server chưa bật. Đang tự động khởi chạy PostgreSQL Engine...");
      
      // Khởi động server postgres trong một tiến trình riêng độc lập
      const startScript = path.resolve(__dirname, "start_postgres.js");
      const pgProcess = spawn("node", [startScript], {
        detached: true,
        stdio: "ignore",
        cwd: __dirname
      });
      pgProcess.unref();

      // Đợi tối đa 15 giây cho port 5432 sẵn sàng
      let ready = false;
      for (let i = 0; i < 15; i++) {
        process.stdout.write(".");
        await sleep(1000);
        if (await checkPort(5432)) {
          ready = true;
          break;
        }
      }
      console.log("");

      if (!ready) {
        throw new Error("Không thể khởi động PostgreSQL sau 15 giây. Vui lòng chạy 'node start_postgres.js' thủ công để kiểm tra log lỗi.");
      }
      console.log("✅ PostgreSQL Server đã sẵn sàng tiếp nhận kết nối!");
    } else {
      console.log("✅ PostgreSQL Server đã đang chạy trên cổng 5432!");
    }
  } else {
    console.log("🌐 Đang sử dụng PostgreSQL Cloud (Neon.tech / Supabase / Remote DB)...");
  }

  // 1. Đồng bộ bảng với Prisma db push
  console.log("\n------------------------------------------------------------------");
  console.log("📦 BƯỚC 1/2: Đồng bộ cấu trúc bảng vào PostgreSQL (prisma db push)...");
  console.log("------------------------------------------------------------------");
  await runProcess("npx", ["prisma", "db push", "--skip-generate"]);
  console.log("✅ Đã tạo/đồng bộ thành công 11 bảng cơ sở dữ liệu!");

  // 2. Nạp dữ liệu mẫu
  console.log("\n------------------------------------------------------------------");
  console.log("🌱 BƯỚC 2/2: Nạp toàn bộ dữ liệu mẫu (Users, Products, Orders, Categories)...");
  console.log("------------------------------------------------------------------");
  await runProcess("npx", ["ts-node", "prisma/seed.ts"]);

  console.log("\n==================================================================");
  console.log("  🎉 HOÀN TẤT! TOÀN BỘ CƠ SỞ DỮ LIỆU POSTGRESQL ĐÃ SẴN SÀNG 100%");
  console.log("  - Tài khoản Admin:   admin@shopbee.vn (Mật khẩu: Admin@123)");
  console.log("  - Khách hàng mẫu:   khachhang@gmail.com (Mật khẩu: 123456)");
  console.log("  - Dữ liệu đã lưu:   Tài khoản đăng ký mới & đơn đặt hàng sẽ");
  console.log("                      được lưu vĩnh viễn trong PostgreSQL!");
  console.log("==================================================================\n");
}

main().catch((err) => {
  console.error("\n❌ LỖI TRONG QUÁ TRÌNH THIẾT LẬP DATABASE:");
  console.error(err.message || err);
  process.exit(1);
});

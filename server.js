const path = require("path");
const fs = require("fs");

// Add backend/node_modules to require lookup paths if root node_modules not yet present
const backendModules = path.resolve(__dirname, "backend/node_modules");
if (fs.existsSync(backendModules)) {
  require("module").globalPaths.push(backendModules);
  module.paths.push(backendModules);
}

const dotenv = require("dotenv");

// Load .env from root or backend/.env
const rootEnv = path.resolve(__dirname, ".env");
const backendEnv = path.resolve(__dirname, "backend/.env");

if (fs.existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv });
} else if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
} else {
  dotenv.config();
}

// Default environment variables fallback (guarantees Prisma & Backend never crash on missing env)
const DEFAULTS = {
  PORT: "5000",
  NODE_ENV: "production",
  DATABASE_URL: "postgresql://postgres:password123@localhost:5432/store_ai_db?schema=public",
  JWT_ACCESS_SECRET: "store_ai_access_secret_super_secure_key_2026",
  JWT_REFRESH_SECRET: "store_ai_refresh_secret_super_secure_key_2026",
  AI_SERVICE_URL: "http://localhost:8000",
  GEMINI_MODEL: "gemini-2.5-flash",
  VNPAY_TMN_CODE: "SANDBOX_STORE_AI",
  VNPAY_HASH_SECRET: "SANDBOX_HASH_SECRET_KEY"
};

for (const [key, val] of Object.entries(DEFAULTS)) {
  if (!process.env[key]) {
    process.env[key] = val;
  }
}

// Auto-create .env on server if none exists
if (!fs.existsSync(rootEnv) && !fs.existsSync(backendEnv)) {
  try {
    const envBody = Object.entries(DEFAULTS).map(([k, v]) => `${k}=${v}`).join("\n") + "\n";
    fs.writeFileSync(rootEnv, envBody, "utf8");
    console.log("📝 Auto-generated default .env file at:", rootEnv);
  } catch (e) {
    // Ignore if file system is read-only
  }
}

// Locate compiled backend or runtime
const distIndex = path.resolve(__dirname, "backend/dist/index.js");

if (fs.existsSync(distIndex)) {
  console.log("🚀 Starting SHOPBEE Fullstack Server from backend/dist/index.js...");
  require(distIndex);
} else {
  console.log("⚙️ backend/dist not found. Loading with ts-node runtime fallback...");
  try {
    require("ts-node").register({
      transpileOnly: true,
      project: path.resolve(__dirname, "backend/tsconfig.json")
    });
    require(path.resolve(__dirname, "backend/src/index.ts"));
  } catch (err) {
    console.error("❌ Failed to start application:", err);
    process.exit(1);
  }
}

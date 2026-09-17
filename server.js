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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = generateTokens;
exports.addToBlacklist = addToBlacklist;
exports.isBlacklisted = isBlacklisted;
exports.authenticateToken = authenticateToken;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../db");
// WARNING: Fallback secrets dưới đây CHỈ dùng cho môi trường dev.
// Trong production, bắt buộc set JWT_ACCESS_SECRET và JWT_REFRESH_SECRET qua biến môi trường.
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "store_ai_access_secret_key_2026";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "store_ai_refresh_secret_key_2026";
// In-memory blacklist for invalidated access tokens (only needs to survive within session)
const blacklistedTokens = new Set();
async function generateTokens(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
    };
    const accessToken = jsonwebtoken_1.default.sign(payload, JWT_ACCESS_SECRET, { expiresIn: "15m" });
    const rawRefreshToken = crypto_1.default.randomBytes(40).toString("hex");
    const tokenHash = crypto_1.default.createHash("sha256").update(rawRefreshToken).digest("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    // Store hashed refresh token in database
    await db_1.db.refreshToken.create({
        data: {
            tokenHash,
            userId: user.id,
            expiresAt,
        }
    });
    return {
        accessToken,
        refreshToken: rawRefreshToken,
        expiresIn: 900 // 15 minutes
    };
}
function addToBlacklist(token) {
    blacklistedTokens.add(token);
}
function isBlacklisted(token) {
    return blacklistedTokens.has(token);
}
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Yêu cầu đăng nhập để truy cập tài nguyên này." });
    }
    if (isBlacklisted(token)) {
        return res.status(401).json({ error: "Token đã bị vô hiệu hóa (Blacklisted)." });
    }
    jsonwebtoken_1.default.verify(token, JWT_ACCESS_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Phiên đăng nhập đã hết hạn hoặc không hợp lệ." });
        }
        try {
            const user = await db_1.db.user.findFirst({
                where: { id: decoded.id, isActive: true }
            });
            if (!user) {
                return res.status(403).json({ error: "Tài khoản không tồn tại hoặc đã bị khóa." });
            }
            req.user = user;
            next();
        }
        catch (dbErr) {
            return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu." });
        }
    });
}
function authorize(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Chưa xác thực người dùng." });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: `Bạn không có quyền truy cập. Yêu cầu quyền: [${allowedRoles.join(", ")}]. Vai trò hiện tại: ${req.user.role}`
            });
        }
        next();
    };
}

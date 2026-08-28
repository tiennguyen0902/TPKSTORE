import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db } from "../db";
import { User } from "../mockData";

// WARNING: Fallback secrets dưới đây CHỈ dùng cho môi trường dev.
// Trong production, bắt buộc set JWT_ACCESS_SECRET và JWT_REFRESH_SECRET qua biến môi trường.
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "store_ai_access_secret_key_2026";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "store_ai_refresh_secret_key_2026";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function generateTokens(user: User) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName
  };

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: "15m" });
  const rawRefreshToken = crypto.randomBytes(40).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Store hashed refresh token in database
  db.refreshTokens.push({
    id: crypto.randomUUID(),
    tokenHash,
    userId: user.id,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString()
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    expiresIn: 900 // 15 minutes
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Yêu cầu đăng nhập để truy cập tài nguyên này." });
  }

  if (db.blacklistedTokens.has(token)) {
    return res.status(401).json({ error: "Token đã bị vô hiệu hóa (Blacklisted)." });
  }

  jwt.verify(token, JWT_ACCESS_SECRET, (err, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Phiên đăng nhập đã hết hạn hoặc không hợp lệ." });
    }
    const user = db.users.find(u => u.id === decoded.id && u.isActive);
    if (!user) {
      return res.status(403).json({ error: "Tài khoản không tồn tại hoặc đã bị khóa." });
    }
    req.user = user;
    next();
  });
}

export function authorize(allowedRoles: ("ADMIN" | "STAFF" | "CUSTOMER")[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

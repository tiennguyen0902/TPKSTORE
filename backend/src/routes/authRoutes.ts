import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "../db";
import { generateTokens, authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, phone, address } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ Email, Mật khẩu và Họ tên." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Mật khẩu phải có độ dài từ 6 ký tự trở lên." });
    }

    const existingUser = await db.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } }
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email này đã được đăng ký trên hệ thống." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        fullName,
        phone: phone || "",
        address: address || "",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        role: "CUSTOMER",
        isActive: true,
        canChatAi: true,
      }
    });

    const tokens = await generateTokens(newUser);

    return res.status(201).json({
      message: "Đăng ký tài khoản thành công!",
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        canChatAi: (newUser as any).canChatAi !== false,
        phone: newUser.phone,
        address: newUser.address,
        avatar: newUser.avatar
      },
      tokens
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi hệ thống khi đăng ký: " + err.message });
  }
});

// Quản lý số lần đăng nhập sai liên tiếp và thời gian khóa tạm thời 15 phút (Key: email chuẩn hóa)
interface LoginAttemptRecord {
  failedCount: number;
  lockedUntil?: number; // timestamp ms
}
const loginAttemptsMap = new Map<string, LoginAttemptRecord>();

// Định kỳ dọn dẹp các bản ghi hết hạn sau mỗi 5 phút
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of loginAttemptsMap.entries()) {
    if (record.lockedUntil && record.lockedUntil <= now) {
      loginAttemptsMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ Email và Mật khẩu." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const now = Date.now();

    // 1. Kiểm tra tài khoản có đang bị tạm khóa 15 phút do nhập sai 5 lần liên tiếp hay không
    const attempt = loginAttemptsMap.get(normalizedEmail);
    if (attempt && attempt.lockedUntil) {
      if (attempt.lockedUntil > now) {
        const remainingMs = attempt.lockedUntil - now;
        const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
        return res.status(429).json({
          error: `Tài khoản đã bị tạm khóa 15 phút do nhập sai mật khẩu 5 lần liên tiếp. Vui lòng thử lại sau ${remainingMinutes} phút.`
        });
      } else {
        // Đã hết thời gian khóa 15 phút -> giải phóng khóa
        loginAttemptsMap.delete(normalizedEmail);
      }
    }

    const user = await db.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } }
    });

    if (!user) {
      const cur = loginAttemptsMap.get(normalizedEmail) || { failedCount: 0 };
      cur.failedCount += 1;
      if (cur.failedCount >= 5) {
        cur.lockedUntil = Date.now() + 15 * 60 * 1000; // Khóa 15 phút
        loginAttemptsMap.set(normalizedEmail, cur);
        return res.status(429).json({
          error: "Bạn đã nhập sai thông tin 5 lần liên tiếp. Tài khoản đã bị tạm khóa trong 15 phút để bảo đảm an toàn."
        });
      }
      loginAttemptsMap.set(normalizedEmail, cur);
      const remaining = 5 - cur.failedCount;
      return res.status(401).json({
        error: `Tài khoản hoặc mật khẩu không chính xác. Bạn còn ${remaining} lần thử trước khi bị khóa tạm thời 15 phút.`
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Tài khoản đã bị tạm khóa. Vui lòng liên hệ Admin." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const cur = loginAttemptsMap.get(normalizedEmail) || { failedCount: 0 };
      cur.failedCount += 1;

      if (cur.failedCount >= 5) {
        cur.lockedUntil = Date.now() + 15 * 60 * 1000; // Khóa 15 phút
        loginAttemptsMap.set(normalizedEmail, cur);
        return res.status(429).json({
          error: "Bạn đã nhập sai mật khẩu 5 lần liên tiếp. Tài khoản đã bị tạm khóa trong 15 phút để bảo đảm an toàn."
        });
      } else {
        loginAttemptsMap.set(normalizedEmail, cur);
        const remaining = 5 - cur.failedCount;
        return res.status(401).json({
          error: `Mật khẩu không chính xác. Bạn còn ${remaining} lần thử trước khi tài khoản bị khóa tạm thời 15 phút.`
        });
      }
    }

    // Đăng nhập thành công -> Xóa bộ đếm sai mật khẩu
    loginAttemptsMap.delete(normalizedEmail);

    const tokens = await generateTokens(user);

    return res.json({
      message: "Đăng nhập thành công!",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        canChatAi: (user as any).canChatAi !== false,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar
      },
      tokens
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi hệ thống khi đăng nhập: " + err.message });
  }
});

// POST /api/auth/refresh-token (Refresh Token Rotation)
router.post("/refresh-token", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Vui lòng cung cấp refreshToken." });
    }

    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const storedToken = await db.refreshToken.findUnique({
      where: { tokenHash }
    });

    if (!storedToken) {
      return res.status(403).json({ error: "Refresh token không hợp lệ hoặc đã bị thu hồi." });
    }

    if (new Date(storedToken.expiresAt) < new Date()) {
      await db.refreshToken.delete({ where: { id: storedToken.id } });
      return res.status(403).json({ error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." });
    }

    const user = await db.user.findFirst({
      where: { id: storedToken.userId, isActive: true }
    });
    if (!user) {
      return res.status(403).json({ error: "Người dùng không tồn tại." });
    }

    // Token Rotation: Invalidate old token and issue new token pair
    await db.refreshToken.delete({ where: { id: storedToken.id } });
    const newTokens = await generateTokens(user);

    return res.json({
      message: "Xoay vòng token thành công!",
      tokens: newTokens
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi hệ thống: " + err.message });
  }
});

// GET /api/auth/me
router.get("/me", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  return res.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      canChatAi: (user as any).canChatAi !== false,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      createdAt: user.createdAt
    }
  });
});

// PUT /api/auth/profile
router.put("/profile", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { fullName, phone, address, avatar } = req.body;

    const updateData: any = {};
    if (fullName) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (avatar !== undefined) updateData.avatar = avatar;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData
    });

    return res.json({
      message: "Cập nhật thông tin thành công!",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        canChatAi: (updatedUser as any).canChatAi !== false,
        phone: updatedUser.phone,
        address: updatedUser.address,
        avatar: updatedUser.avatar
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi cập nhật: " + err.message });
  }
});

// PUT /api/auth/change-password
router.put("/change-password", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { currentPassword, newPassword, currentRefreshToken } = req.body;

    // 1. Bắt buộc nhập mật khẩu hiện tại
    if (!currentPassword || typeof currentPassword !== "string" || !currentPassword.trim()) {
      return res.status(400).json({ error: "Bắt buộc phải nhập mật khẩu hiện tại." });
    }

    // 2. Mật khẩu mới tối thiểu 8 ký tự, có cả chữ và số
    if (!newPassword || typeof newPassword !== "string") {
      return res.status(400).json({ error: "Vui lòng nhập mật khẩu mới." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Mật khẩu mới phải có tối thiểu 8 ký tự." });
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      return res.status(400).json({ error: "Mật khẩu mới phải chứa ít nhất một chữ cái và một chữ số." });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ error: "Mật khẩu mới không được trùng với mật khẩu hiện tại." });
    }

    // 3. Xác thực mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Mật khẩu hiện tại không chính xác." });
    }

    // 4. Mã hóa và lưu mật khẩu mới
    const newHash = await bcrypt.hash(newPassword, 10);
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash }
    });

    // 5. Đổi xong thu hồi các phiên đăng nhập khác
    if (currentRefreshToken) {
      const currentTokenHash = crypto.createHash("sha256").update(currentRefreshToken).digest("hex");
      // Thu hồi tất cả các phiên đăng nhập của tài khoản này, NGOẠI TRỪ phiên hiện tại
      await db.refreshToken.deleteMany({
        where: {
          userId: user.id,
          tokenHash: { not: currentTokenHash }
        }
      });
    } else {
      // Nếu không truyền refreshToken hiện tại, thu hồi toàn bộ token cũ
      await db.refreshToken.deleteMany({
        where: { userId: user.id }
      });
    }

    // Sinh cặp token mới cho phiên làm việc hiện tại
    const newTokens = await generateTokens(updatedUser);

    return res.json({ 
      message: "Đổi mật khẩu thành công! Toàn bộ các phiên đăng nhập trên thiết bị khác đã được thu hồi an toàn.",
      tokens: newTokens
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi hệ thống khi đổi mật khẩu: " + err.message });
  }
});

// Bộ nhớ lưu mã OTP khôi phục mật khẩu trong phiên (email -> { otp, expiresAt })
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// POST /api/auth/forgot-password (Yêu cầu mã OTP khôi phục mật khẩu)
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Vui lòng cung cấp địa chỉ Email." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await db.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } }
    });

    if (!user) {
      return res.status(404).json({ error: "Email này chưa được đăng ký trong hệ thống SHOPBEE." });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Tài khoản này đã bị tạm khóa. Vui lòng liên hệ Quản trị viên." });
    }

    // Sinh mã OTP 6 chữ số ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // Có hiệu lực 15 phút

    otpStore.set(normalizedEmail, { otp, expiresAt });

    console.log(`[AUTH] Mã OTP khôi phục mật khẩu cho ${normalizedEmail}: ${otp}`);

    const isDev = process.env.NODE_ENV !== "production" || process.env.ENABLE_DEMO_OTP === "true";

    return res.json({
      message: "Mã xác thực OTP đã được tạo thành công!",
      email: normalizedEmail,
      ...(isDev ? { otp } : {}), // Chỉ hiển thị OTP trong response khi ở môi trường Development / Demo
      expiresInMinutes: 15
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi hệ thống khi yêu cầu khôi phục mật khẩu: " + err.message });
  }
});

// POST /api/auth/reset-password (Xác thực OTP và đặt lại mật khẩu mới)
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ Email, mã OTP và Mật khẩu mới." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Mật khẩu mới phải có tối thiểu 8 ký tự." });
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      return res.status(400).json({ error: "Mật khẩu mới phải chứa cả chữ cái và số." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const storedOtp = otpStore.get(normalizedEmail);

    if (!storedOtp) {
      return res.status(400).json({ error: "Yêu cầu khôi phục không tồn tại hoặc đã hết hạn. Vui lòng gửi lại mã OTP." });
    }

    if (Date.now() > storedOtp.expiresAt) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({ error: "Mã OTP đã hết hạn (chỉ có hiệu lực trong 15 phút). Vui lòng yêu cầu mã mới." });
    }

    if (storedOtp.otp !== otp.trim()) {
      return res.status(400).json({ error: "Mã OTP không chính xác. Vui lòng kiểm tra lại." });
    }

    const user = await db.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } }
    });

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại." });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash }
    });

    // Thu hồi toàn bộ các phiên đăng nhập cũ
    await db.refreshToken.deleteMany({
      where: { userId: user.id }
    });

    // Xóa bộ đếm khóa tạm thời (nếu có)
    loginAttemptsMap.delete(normalizedEmail);

    // Huỷ mã OTP sau khi sử dụng thành công
    otpStore.delete(normalizedEmail);

    console.log(`[AUTH] Đặt lại mật khẩu thành công cho tài khoản: ${normalizedEmail}`);

    return res.json({
      message: "Đặt lại mật khẩu thành công! Tất cả các phiên đăng nhập cũ đã được thu hồi. Bạn có thể đăng nhập ngay."
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi hệ thống khi đặt lại mật khẩu: " + err.message });
  }
});

// POST /api/auth/upload-avatar (Upload ảnh đại diện từ file, base64, tối đa 3MB)
router.post("/upload-avatar", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { base64, mimeType } = req.body;

    if (!base64 || !mimeType) {
      return res.status(400).json({ error: "Vui lòng cung cấp dữ liệu ảnh (base64) và loại file (mimeType)." });
    }

    // Kiểm tra loại file hợp lệ
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedMimeTypes.includes(mimeType.toLowerCase())) {
      return res.status(400).json({ error: "Chỉ chấp nhận file ảnh định dạng JPEG, PNG, GIF hoặc WebP." });
    }

    // Kiểm tra kích thước (base64 ~4/3 bytes so với binary gốc)
    const base64Data = base64.replace(/^data:[^;]+;base64,/, "");
    const fileSizeBytes = Math.ceil((base64Data.length * 3) / 4);
    const maxSizeBytes = 3 * 1024 * 1024; // 3MB

    if (fileSizeBytes > maxSizeBytes) {
      return res.status(400).json({ error: `Kích thước ảnh vượt quá giới hạn 3MB (file hiện tại: ${(fileSizeBytes / 1024 / 1024).toFixed(2)}MB).` });
    }

    // Tạo data URI để lưu vào DB
    const dataUri = `data:${mimeType};base64,${base64Data}`;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { avatar: dataUri }
    });

    return res.json({
      message: "Cập nhật ảnh đại diện thành công!",
      avatar: updatedUser.avatar,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        canChatAi: (updatedUser as any).canChatAi !== false,
        phone: updatedUser.phone,
        address: updatedUser.address,
        avatar: updatedUser.avatar
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi hệ thống khi cập nhật avatar: " + err.message });
  }
});

export default router;

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

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ Email và Mật khẩu." });
    }

    const user = await db.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } }
    });
    if (!user) {
      return res.status(401).json({ error: "Tài khoản hoặc mật khẩu không chính xác." });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Tài khoản đã bị tạm khóa. Vui lòng liên hệ Admin." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Tài khoản hoặc mật khẩu không chính xác." });
    }

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
  const user = req.user!;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Vui lòng nhập mật khẩu hiện tại và mật khẩu mới." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Mật khẩu mới phải có tối thiểu 6 ký tự." });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ error: "Mật khẩu hiện tại không chính xác." });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash }
  });

  return res.json({ message: "Đổi mật khẩu thành công!" });
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

    return res.json({
      message: "Mã xác thực OTP đã được tạo thành công!",
      email: normalizedEmail,
      otp, // Trả về mã OTP phục vụ kiểm thử và demo trực quan
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

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Mật khẩu mới phải có tối thiểu 6 ký tự." });
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

    // Huỷ mã OTP sau khi sử dụng thành công
    otpStore.delete(normalizedEmail);

    console.log(`[AUTH] Đặt lại mật khẩu thành công cho tài khoản: ${normalizedEmail}`);

    return res.json({
      message: "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ."
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi hệ thống khi đặt lại mật khẩu: " + err.message });
  }
});

export default router;

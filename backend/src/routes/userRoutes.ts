import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticateToken, authorize, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// GET /api/users (Admin & Staff view customer list)
router.get("/", authenticateToken, authorize(["ADMIN", "STAFF"]), (req: AuthenticatedRequest, res: Response) => {
  const { role, search } = req.query;
  let list = db.users.map(u => ({
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    phone: u.phone,
    address: u.address,
    avatar: u.avatar,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt
  }));

  if (role && role !== "ALL") {
    list = list.filter(u => u.role === role);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(u => 
      u.fullName.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) || 
      (u.phone && u.phone.includes(q)) ||
      (u.address && u.address.toLowerCase().includes(q))
    );
  }

  return res.json({
    total: list.length,
    users: list
  });
});

// PUT /api/users/:id/role (Admin update role)
router.put("/:id/role", authenticateToken, authorize(["ADMIN"]), (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "Không tìm thấy người dùng." });
  }

  const { role } = req.body;
  if (!role || !["ADMIN", "STAFF", "CUSTOMER"].includes(role)) {
    return res.status(400).json({ error: "Vai trò không hợp lệ." });
  }

  user.role = role;
  user.updatedAt = new Date().toISOString();

  return res.json({
    message: `Đã cập nhật vai trò người dùng thành ${role}!`,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }
  });
});

// PUT /api/users/:id/toggle-active (Admin lock / unlock account)
router.put("/:id/toggle-active", authenticateToken, authorize(["ADMIN"]), (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "Không tìm thấy người dùng." });
  }

  if (user.id === req.user!.id) {
    return res.status(400).json({ error: "Bạn không thể tự khóa tài khoản của chính mình." });
  }

  user.isActive = !user.isActive;
  user.updatedAt = new Date().toISOString();

  return res.json({
    message: user.isActive ? "Đã mở khóa tài khoản người dùng." : "Đã tạm khóa tài khoản người dùng.",
    isActive: user.isActive
  });
});

export default router;

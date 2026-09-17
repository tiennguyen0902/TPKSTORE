import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticateToken, authorize, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// GET /api/users (Admin & Staff view customer list)
router.get("/", authenticateToken, authorize(["ADMIN", "STAFF"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role, search } = req.query;

    const where: any = {};

    if (role && role !== "ALL") {
      where.role = role as string;
    }

    if (search) {
      const q = (search as string).toLowerCase();
      where.OR = [
        { fullName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
        { address: { contains: q, mode: "insensitive" } }
      ];
    }

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        address: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" }
    });

    return res.json({
      total: users.length,
      users
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi truy vấn người dùng: " + err.message });
  }
});

// PUT /api/users/:id/role (Admin update role)
router.put("/:id/role", authenticateToken, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await db.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy người dùng." });
    }

    const { role } = req.body;
    if (!role || !["ADMIN", "STAFF", "CUSTOMER"].includes(role)) {
      return res.status(400).json({ error: "Vai trò không hợp lệ." });
    }

    const updatedUser = await db.user.update({
      where: { id: req.params.id },
      data: { role }
    });

    return res.json({
      message: `Đã cập nhật vai trò người dùng thành ${role}!`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi cập nhật vai trò: " + err.message });
  }
});

// PUT /api/users/:id/toggle-active (Admin lock / unlock account)
router.put("/:id/toggle-active", authenticateToken, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await db.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy người dùng." });
    }

    if (user.id === req.user!.id) {
      return res.status(400).json({ error: "Bạn không thể tự khóa tài khoản của chính mình." });
    }

    const updatedUser = await db.user.update({
      where: { id: req.params.id },
      data: { isActive: !user.isActive }
    });

    return res.json({
      message: updatedUser.isActive ? "Đã mở khóa tài khoản người dùng." : "Đã tạm khóa tài khoản người dùng.",
      isActive: updatedUser.isActive
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi cập nhật: " + err.message });
  }
});

export default router;

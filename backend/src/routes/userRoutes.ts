import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticateToken, authorize, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// GET /api/users (Admin, Manager & Staff view customer list)
router.get("/", authenticateToken, authorize(["ADMIN", "MANAGER", "STAFF"]), async (req: AuthenticatedRequest, res: Response) => {
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
        canChatAi: true,
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
    if (!role || !["ADMIN", "MANAGER", "STAFF", "CUSTOMER"].includes(role)) {
      return res.status(400).json({ error: "Vai trò không hợp lệ. Chọn ADMIN, MANAGER, STAFF hoặc CUSTOMER." });
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

// PUT /api/users/:id/toggle-chat-ai (Admin toggle AI Chat permission)
router.put("/:id/toggle-chat-ai", authenticateToken, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await db.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy người dùng." });
    }

    const currentPerm = (user as any).canChatAi !== false;
    const updatedUser = await db.user.update({
      where: { id: req.params.id },
      data: { canChatAi: !currentPerm }
    });

    return res.json({
      message: (updatedUser as any).canChatAi ? "Đã kích hoạt quyền Chat AI cho người dùng." : "Đã tạm dừng quyền Chat AI của người dùng.",
      canChatAi: (updatedUser as any).canChatAi
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi cập nhật quyền Chat AI: " + err.message });
  }
});

// POST /api/users/grant-all-chat-ai (Admin grant AI Chat permission to ALL users on system)
router.post("/grant-all-chat-ai", authenticateToken, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await db.user.updateMany({
      data: { canChatAi: true }
    });

    return res.json({
      message: `Đã cấp quyền Chat AI thành công cho tất cả tài khoản người dùng trên hệ thống!`,
      count: (result as any)?.count || 0
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi kích hoạt quyền Chat AI toàn hệ thống: " + err.message });
  }
});

export default router;

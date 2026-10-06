import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticateToken, authorize, AuthenticatedRequest } from "../middleware/auth";
import bcrypt from "bcryptjs";

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

// GET /api/users/lookup?phone=0912345678 (Staff, Manager & Admin quick lookup customer by phone/email in DB)
router.get("/lookup", authenticateToken, authorize(["ADMIN", "MANAGER", "STAFF"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rawInput = req.query.phone ? String(req.query.phone).trim() : (req.query.search ? String(req.query.search).trim() : "");
    if (!rawInput) {
      return res.status(400).json({ error: "Vui lòng cung cấp số điện thoại hoặc email khách hàng cần tra cứu." });
    }

    const cleanPhone = rawInput.replace(/\D/g, "");
    const last9 = cleanPhone.length >= 9 ? cleanPhone.slice(-9) : cleanPhone;

    let matchedUserId: string | null = null;

    // 1. Tìm trực tiếp trong bảng users bằng SQL Regex (chuẩn hóa số điện thoại cả 2 phía)
    if (cleanPhone.length >= 7) {
      try {
        const rows: any[] = await (db as any).$queryRawUnsafe(`
          SELECT id FROM users
          WHERE 
            phone = $1
            OR REGEXP_REPLACE(COALESCE(phone, ''), '\\D', '', 'g') = $2
            OR (LENGTH($3) >= 8 AND REGEXP_REPLACE(COALESCE(phone, ''), '\\D', '', 'g') LIKE '%' || $3)
            OR email ILIKE '%' || $2 || '%'
            OR (LENGTH($1) >= 5 AND email ILIKE '%' || $1 || '%')
          LIMIT 1;
        `, rawInput, cleanPhone, last9);

        if (rows && rows.length > 0) {
          matchedUserId = rows[0].id;
        }
      } catch (sqlErr) {
        console.warn("SQL raw query fallback to Prisma findFirst:", sqlErr);
      }
    }

    // 2. Dự phòng: Tìm kiếm thông qua Prisma OR
    if (!matchedUserId) {
      const orConditions: any[] = [
        { phone: rawInput },
        ...(cleanPhone ? [{ phone: cleanPhone }] : []),
        ...(last9.length >= 8 ? [{ phone: { contains: last9 } }] : []),
        ...(rawInput.includes("@") ? [{ email: { equals: rawInput.toLowerCase(), mode: "insensitive" } }] : []),
        ...(cleanPhone.length >= 8 ? [{ email: { contains: cleanPhone } }] : [])
      ];

      const foundPrisma = await db.user.findFirst({
        where: { OR: orConditions },
        select: { id: true }
      });
      if (foundPrisma) {
        matchedUserId = foundPrisma.id;
      }
    }

    // 3. Nếu chưa thấy trong hồ sơ User, kiểm tra qua lịch sử đơn hàng cũ (Order.phone)
    if (!matchedUserId && cleanPhone.length >= 8) {
      try {
        const orderRows: any[] = await (db as any).$queryRawUnsafe(`
          SELECT DISTINCT "userId" FROM orders
          WHERE "userId" IS NOT NULL AND (
            phone = $1
            OR REGEXP_REPLACE(COALESCE(phone, ''), '\\D', '', 'g') = $2
            OR (LENGTH($3) >= 8 AND REGEXP_REPLACE(COALESCE(phone, ''), '\\D', '', 'g') LIKE '%' || $3)
          )
          LIMIT 1;
        `, rawInput, cleanPhone, last9);

        if (orderRows && orderRows.length > 0) {
          matchedUserId = orderRows[0].userId;
        }
      } catch (e) {}
    }

    // 4. Nếu không tìm thấy người dùng trong CSDL
    if (!matchedUserId) {
      return res.json({
        found: false,
        searchedPhone: rawInput,
        message: "Chưa tìm thấy khách hàng với thông tin này trong CSDL người dùng."
      });
    }

    // 5. Nạp đầy đủ thông tin User + Lịch sử đơn hàng + Quyền lợi tích điểm
    const user = await db.user.findUnique({
      where: { id: matchedUserId },
      include: {
        orders: {
          include: {
            items: {
              include: { product: true }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!user) {
      return res.json({
        found: false,
        searchedPhone: rawInput,
        message: "Không tìm thấy dữ liệu người dùng."
      });
    }

    // Tự động cập nhật số điện thoại cho user nếu hồ sơ đang để trống SĐT
    if (!user.phone && cleanPhone.length >= 9) {
      try {
        await db.user.update({
          where: { id: user.id },
          data: { phone: cleanPhone }
        });
        user.phone = cleanPhone;
      } catch (err) {}
    }

    // Tính toán số liệu khách hàng
    const completedOrders = (user.orders || []).filter((o: any) => o.status !== "CANCELLED");
    const totalSpent = completedOrders.reduce((sum: number, o: any) => sum + (o.finalAmount || o.totalAmount || 0), 0);
    const loyaltyPoints = Math.floor(totalSpent / 10000); // 1 điểm / 10.000đ

    return res.json({
      found: true,
      customer: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone || cleanPhone || rawInput,
        email: user.email,
        address: user.address || "",
        role: user.role,
        totalOrders: completedOrders.length,
        totalSpent,
        loyaltyPoints,
        recentOrders: user.orders ? user.orders.slice(0, 5) : []
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi truy vấn CSDL người dùng: " + err.message });
  }
});

// POST /api/users/quick-customer (Staff, Manager & Admin quick create walk-in customer profile)
// Chuẩn hóa RBAC: Không tạo user ảo có password mặc định; lưu trữ an toàn trong bảng Customer
router.post("/quick-customer", authenticateToken, authorize(["ADMIN", "MANAGER", "STAFF"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fullName, phone, address } = req.body;
    if (!phone || !String(phone).trim()) {
      return res.status(400).json({ error: "Vui lòng nhập số điện thoại khách hàng." });
    }

    const trimmedPhone = String(phone).trim();
    const cleanPhone = trimmedPhone.replace(/\D/g, "");
    const last9 = cleanPhone.length >= 9 ? cleanPhone.slice(-9) : cleanPhone;

    // 1. Kiểm tra tài khoản User chính thức nếu đã đăng ký tài khoản từ trước
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { phone: trimmedPhone },
          { phone: cleanPhone },
          ...(last9.length >= 8 ? [{ phone: { contains: last9 } }] : []),
          ...(cleanPhone.length >= 8 ? [{ email: { contains: cleanPhone } }] : [])
        ]
      }
    });

    // 2. Kiểm tra hoặc tạo hồ sơ Customer
    let existingCustomer = await db.customer.findFirst({
      where: {
        OR: [
          { phone: trimmedPhone },
          { phone: cleanPhone },
          ...(existingUser ? [{ userId: existingUser.id }] : [])
        ]
      }
    });

    if (existingCustomer) {
      if (fullName && String(fullName).trim() && existingCustomer.fullName !== String(fullName).trim()) {
        existingCustomer = await db.customer.update({
          where: { id: existingCustomer.id },
          data: { fullName: String(fullName).trim() }
        });
      }
      return res.json({
        isNew: false,
        message: "Khách hàng thân thiết đã có trong hệ thống",
        customer: {
          ...existingCustomer,
          role: "CUSTOMER",
          isActive: true
        }
      });
    }

    // 3. Tạo mới hồ sơ Customer độc lập (không gán mật khẩu mặc định cố định)
    const newCustomer = await db.customer.create({
      data: {
        fullName: (fullName && String(fullName).trim()) || "Khách lẻ",
        phone: trimmedPhone,
        address: (address && String(address).trim()) || "Mua tại quầy - TPKSTORE",
        userId: existingUser ? existingUser.id : null
      }
    });

    return res.status(201).json({
      isNew: true,
      message: "Tạo hồ sơ khách lẻ thành công (an toàn, không mật khẩu mặc định)!",
      customer: {
        ...newCustomer,
        role: "CUSTOMER",
        isActive: true
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi tạo khách hàng: " + err.message });
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

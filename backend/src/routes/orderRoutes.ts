import { Router, Response } from "express";
import { db } from "../db";
import { authenticateToken, authorize, AuthenticatedRequest } from "../middleware/auth";
import bcrypt from "bcryptjs";

const router = Router();

// POST /api/orders (Checkout: Support both standard web checkout & Staff counter consultation for walk-in customers)
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { 
      customerName, 
      phone, 
      shippingAddress, 
      note, 
      paymentMethod, 
      items, 
      isCounterOrder, 
      isWalkIn,
      status: requestedStatus, 
      paymentStatus: requestedPaymentStatus, 
      discountAmount: reqDiscount 
    } = req.body;

    const isStaffOrAdmin = ["STAFF", "MANAGER", "ADMIN"].includes(req.user!.role);
    const isCounter = Boolean(isCounterOrder || (isStaffOrAdmin && isWalkIn));

    let orderCustomerName = (customerName && String(customerName).trim()) || "";
    let orderPhone = (phone && String(phone).trim()) || "";
    let orderAddress = (shippingAddress && String(shippingAddress).trim()) || "";

    if (isCounter) {
      if (!orderPhone) {
        return res.status(400).json({ error: "Vui lòng nhập Số điện thoại khách hàng để kích hoạt bảo hành điện tử và tích điểm." });
      }
      if (!orderCustomerName) {
        orderCustomerName = "Khách lẻ";
      }
      if (!orderAddress) {
        orderAddress = "Mua trực tiếp tại quầy - TPKSTORE";
      }
    } else {
      if (!orderCustomerName || !orderPhone || !orderAddress) {
        return res.status(400).json({ error: "Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng." });
      }
    }

    let checkoutItems: { productId: string; quantity: number }[] = [];

    if (items && Array.isArray(items) && items.length > 0) {
      checkoutItems = items;
    } else {
      // Use cart items
      const cart = await db.cart.findUnique({
        where: { userId },
        include: { items: true }
      });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: "Giỏ hàng của bạn đang trống." });
      }
      checkoutItems = cart.items.map(ci => ({
        productId: ci.productId,
        quantity: ci.quantity
      }));
    }

    // Use transaction for atomic stock decrement + StockMovement + order creation
    const newOrder = await db.$transaction(async (tx: any) => {
      let targetUserId: string | null = userId;
      let targetCustomerId: string | null = null;

      // Nếu là đơn hàng tại quầy / do nhân viên tư vấn, liên kết hoặc tạo hồ sơ Customer an toàn theo SĐT
      if (isCounter || (isStaffOrAdmin && orderPhone)) {
        const cleanPhone = orderPhone.replace(/\D/g, "");
        const existingUser = await tx.user.findFirst({
          where: {
            OR: [
              { phone: orderPhone },
              { phone: cleanPhone },
              ...(cleanPhone.length >= 9 ? [{ phone: { contains: cleanPhone.slice(-9) } }] : [])
            ]
          }
        });

        if (existingUser) {
          targetUserId = existingUser.id;
          if (orderCustomerName && orderCustomerName !== "Khách lẻ" && (!existingUser.fullName || existingUser.fullName === "Khách lẻ")) {
            await tx.user.update({
              where: { id: existingUser.id },
              data: { fullName: orderCustomerName }
            });
          }
        } else {
          // Khách tại quầy không bắt buộc có User account login với password ảo
          targetUserId = null;
        }

        // Tìm hoặc tạo hồ sơ Customer chuẩn hóa
        let custProfile = await tx.customer.findFirst({
          where: {
            OR: [
              { phone: orderPhone },
              { phone: cleanPhone },
              ...(targetUserId ? [{ userId: targetUserId }] : [])
            ]
          }
        });

        if (!custProfile) {
          custProfile = await tx.customer.create({
            data: {
              userId: targetUserId,
              fullName: orderCustomerName || "Khách lẻ",
              phone: orderPhone,
              address: orderAddress
            }
          });
        } else if (targetUserId && !custProfile.userId) {
          await tx.customer.update({
            where: { id: custProfile.id },
            data: { userId: targetUserId }
          });
        }
        targetCustomerId = custProfile.id;
      } else if (userId) {
        // Đơn online của User đã đăng nhập
        let custProfile = await tx.customer.findUnique({ where: { userId } });
        if (!custProfile) {
          custProfile = await tx.customer.create({
            data: {
              userId,
              fullName: orderCustomerName || req.user?.fullName || "Khách hàng",
              phone: orderPhone || req.user?.phone || "",
              address: orderAddress || req.user?.address || ""
            }
          });
        }
        targetCustomerId = custProfile.id;
      }

      let totalAmount = 0;
      const orderItemsData: { productId: string; quantity: number; price: number }[] = [];

      // Generate sequential Order ID trước để reference trong StockMovement
      const orderCount = await tx.order.count();
      const orderId = `#ord_${1000 + orderCount + 1}`;

      // Verify stock, deduct stock and log StockMovement
      for (const item of checkoutItems) {
        const prod = await tx.product.findUnique({ where: { id: item.productId } });
        if (!prod) {
          throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
        }
        if (prod.stock < item.quantity) {
          throw new Error(`Sản phẩm "${prod.name}" chỉ còn ${prod.stock} trong kho`);
        }

        const beforeStock = typeof prod.stock === "number" ? prod.stock : (parseInt(String(prod.stock)) || 0);
        const afterStock = beforeStock - item.quantity;

        // Trừ tồn kho trong Transaction
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: afterStock }
        });

        // Ghi nhật ký biến động kho bất biến StockMovement (SALE)
        await tx.stockMovement.create({
          data: {
            productId: prod.id,
            quantity: item.quantity,
            type: "SALE",
            beforeStock,
            afterStock,
            referenceId: orderId,
            createdById: isStaffOrAdmin ? req.user!.id : (targetUserId || null),
            note: `Bán hàng qua đơn hàng ${orderId} (SL: ${item.quantity})`
          }
        });

        const itemTotal = prod.price * item.quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          productId: prod.id,
          quantity: item.quantity,
          price: prod.price
        });
      }

      const settings = await tx.systemSettings.findFirst();
      const freeShippingThreshold = settings?.freeShippingThreshold || 500000;
      const shippingFee = isCounter ? 0 : (totalAmount >= freeShippingThreshold ? 0 : 30000);
      const discountAmount = typeof reqDiscount === "number" ? reqDiscount : 0;
      const finalAmount = Math.max(0, totalAmount + shippingFee - discountAmount);

      const pm = paymentMethod === "MOMO" ? "MOMO" : (paymentMethod === "VNPAY" ? "VNPAY" : "COD");

      let finalNote = note || "";
      if (isStaffOrAdmin) {
        const staffTag = `[Nhân viên tư vấn: ${req.user!.fullName || req.user!.email}]`;
        finalNote = finalNote ? `${finalNote} ${staffTag}` : `${isCounter ? "Mua trực tiếp tại quầy" : "Tư vấn bán hàng"} ${staffTag}`;
      }

      const orderStatusVal = isCounter ? (requestedStatus || "DELIVERED") : (requestedStatus || "PENDING");
      const paymentStatusVal = isCounter ? (requestedPaymentStatus || (pm === "COD" ? "COMPLETED" : "PENDING")) : (requestedPaymentStatus || "PENDING");

      const order = await tx.order.create({
        data: {
          id: orderId,
          userId: targetUserId,
          customerId: targetCustomerId,
          createdByStaffId: isStaffOrAdmin ? req.user!.id : null,
          customerName: orderCustomerName,
          phone: orderPhone,
          shippingAddress: orderAddress,
          note: finalNote || null,
          totalAmount,
          shippingFee,
          discountAmount,
          finalAmount,
          status: orderStatusVal,
          paymentMethod: pm,
          paymentStatus: paymentStatusVal,
          items: {
            create: orderItemsData
          }
        },
        include: {
          items: {
            include: { product: true }
          }
        }
      });

      // Clear customer cart only for standard online checkout (not counter POS)
      if (!isCounter && userId) {
        const cart = await tx.cart.findUnique({ where: { userId } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      }

      return order;
    });

    return res.status(201).json({
      message: isCounter ? "Tạo đơn hàng tại quầy & kích hoạt bảo hành thành công!" : "Đặt hàng thành công!",
      order: newOrder
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// POST /api/orders/pos (Specialized POS Counter Order for Staff & Admin)
router.post("/pos", authenticateToken, authorize(["ADMIN", "STAFF"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      customerName, 
      phone, 
      shippingAddress, 
      note, 
      paymentMethod, 
      items, 
      discountAmount = 0,
      paymentStatus = "COMPLETED",
      status = "DELIVERED"
    } = req.body;

    if (!phone || !String(phone).trim()) {
      return res.status(400).json({ error: "Vui lòng nhập Số điện thoại khách hàng để lưu bảo hành và tích điểm." });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Đơn hàng phải có ít nhất 1 sản phẩm." });
    }

    const trimmedPhone = String(phone).trim();
    const cleanPhone = trimmedPhone.replace(/\D/g, "");
    const orderCustomerName = (customerName && String(customerName).trim()) || "Khách lẻ";
    const orderAddress = (shippingAddress && String(shippingAddress).trim()) || "Mua trực tiếp tại quầy - TPKSTORE";

    const newOrder = await db.$transaction(async (tx: any) => {
      // 1. Tìm hoặc liên kết hồ sơ khách lẻ chuẩn hóa trong bảng Customer
      let targetUserId: string | null = null;
      let targetCustomerId: string | null = null;

      const existingUser = await tx.user.findFirst({
        where: {
          OR: [
            { phone: trimmedPhone },
            { phone: cleanPhone },
            ...(cleanPhone.length >= 9 ? [{ phone: { contains: cleanPhone.slice(-9) } }] : [])
          ]
        }
      });

      if (existingUser) {
        targetUserId = existingUser.id;
        if (orderCustomerName !== "Khách lẻ" && (!existingUser.fullName || existingUser.fullName === "Khách lẻ")) {
          await tx.user.update({
            where: { id: existingUser.id },
            data: { fullName: orderCustomerName }
          });
        }
      }

      let custProfile = await tx.customer.findFirst({
        where: {
          OR: [
            { phone: trimmedPhone },
            { phone: cleanPhone },
            ...(targetUserId ? [{ userId: targetUserId }] : [])
          ]
        }
      });

      if (!custProfile) {
        custProfile = await tx.customer.create({
          data: {
            userId: targetUserId,
            fullName: orderCustomerName,
            phone: trimmedPhone,
            address: orderAddress
          }
        });
      } else if (targetUserId && !custProfile.userId) {
        await tx.customer.update({
          where: { id: custProfile.id },
          data: { userId: targetUserId }
        });
      }
      targetCustomerId = custProfile.id;

      // 2. Trừ tồn kho & tính tiền & ghi nhận StockMovement (SALE)
      let totalAmount = 0;
      const orderItemsData: { productId: string; quantity: number; price: number }[] = [];

      const orderCount = await tx.order.count();
      const orderId = `#ord_${1000 + orderCount + 1}`;

      for (const item of items) {
        const prod = await tx.product.findUnique({ where: { id: item.productId } });
        if (!prod) {
          throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
        }
        if (prod.stock < item.quantity) {
          throw new Error(`Sản phẩm "${prod.name}" chỉ còn ${prod.stock} trong kho (yêu cầu: ${item.quantity})`);
        }

        const beforeStock = typeof prod.stock === "number" ? prod.stock : (parseInt(String(prod.stock)) || 0);
        const afterStock = beforeStock - item.quantity;

        // Trừ tồn kho trong Transaction
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: afterStock }
        });

        // Ghi nhật ký biến động kho bất biến StockMovement (SALE)
        await tx.stockMovement.create({
          data: {
            productId: prod.id,
            quantity: item.quantity,
            type: "SALE",
            beforeStock,
            afterStock,
            referenceId: orderId,
            createdById: req.user!.id,
            note: `Bán tại quầy POS qua đơn hàng ${orderId} (SL: ${item.quantity})`
          }
        });

        const itemTotal = prod.price * item.quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          productId: prod.id,
          quantity: item.quantity,
          price: prod.price
        });
      }

      const finalDiscount = Number(discountAmount) || 0;
      const finalAmount = Math.max(0, totalAmount - finalDiscount);

      const pm = paymentMethod === "MOMO" ? "MOMO" : (paymentMethod === "VNPAY" ? "VNPAY" : "COD");
      const staffTag = `[Nhân viên tư vấn: ${req.user!.fullName || req.user!.email}]`;
      const finalNote = note ? `${note} ${staffTag}` : `Mua tại quầy ${staffTag}`;

      const createdOrder = await tx.order.create({
        data: {
          id: orderId,
          userId: targetUserId,
          customerId: targetCustomerId,
          createdByStaffId: req.user!.id,
          customerName: orderCustomerName,
          phone: trimmedPhone,
          shippingAddress: orderAddress,
          note: finalNote,
          totalAmount,
          shippingFee: 0,
          discountAmount: finalDiscount,
          finalAmount,
          status: status || "DELIVERED",
          paymentMethod: pm,
          paymentStatus: paymentStatus || "COMPLETED",
          items: {
            create: orderItemsData
          }
        },
        include: {
          items: {
            include: { product: true }
          },
          user: true
        }
      });

      return createdOrder;
    });

    // Thông tin bảo hành điện tử theo SĐT
    const loyaltyPointsEarned = Math.floor(newOrder.finalAmount / 10000);

    return res.status(201).json({
      message: "Lập đơn bán hàng tại quầy thành công!",
      order: newOrder,
      warrantyInfo: {
        warrantyPhone: trimmedPhone,
        customerName: orderCustomerName,
        policy: "Bảo hành chính hãng 12-24 tháng tại hệ thống TPKSTORE",
        loyaltyPointsEarned,
        consultant: req.user!.fullName
      }
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});


// GET /api/orders/my (Customer view own orders)
router.get("/my", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orders = await db.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" }
    });
    return res.json({
      total: orders.length,
      orders
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi truy vấn đơn hàng: " + err.message });
  }
});

// GET /api/orders (Admin / Manager / Staff view all orders)
router.get("/", authenticateToken, authorize(["ADMIN", "MANAGER", "STAFF"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search } = req.query;

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status as string;
    }

    if (search) {
      const q = (search as string).toLowerCase();
      where.OR = [
        { id: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } }
      ];
    }

    const orders = await db.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" }
    });

    return res.json({
      total: orders.length,
      orders
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi truy vấn đơn hàng: " + err.message });
  }
});

// GET /api/orders/:id
router.get("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const order = await db.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } } }
    });

    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
    }

    // Customers can only view their own orders
    if (user.role === "CUSTOMER" && order.userId !== user.id) {
      return res.status(403).json({ error: "Bạn không có quyền xem đơn hàng này." });
    }

    return res.json(order);
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi truy vấn: " + err.message });
  }
});

// PUT /api/orders/:id/status (Admin / Manager / Staff update state machine)
router.put("/:id/status", authenticateToken, authorize(["ADMIN", "MANAGER", "STAFF"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const order = await db.order.findUnique({
      where: { id: req.params.id },
      include: { items: true }
    });
    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
    }

    const { status, paymentStatus } = req.body;
    const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Trạng thái đơn hàng không hợp lệ." });
    }

    // Handle stock refund if cancelled
    if (status === "CANCELLED" && order.status !== "CANCELLED") {
      await db.$transaction(async (tx: any) => {
        for (const item of order.items) {
          const prod = await tx.product.findUnique({ where: { id: item.productId } });
          const beforeStock = prod ? (typeof prod.stock === "number" ? prod.stock : (parseInt(String(prod.stock)) || 0)) : 0;
          const afterStock = beforeStock + item.quantity;

          await tx.product.update({
            where: { id: item.productId },
            data: { stock: afterStock }
          });

          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              quantity: item.quantity,
              type: "SALE_CANCEL",
              beforeStock,
              afterStock,
              referenceId: order.id,
              createdById: req.user!.id,
              note: `Hoàn tồn kho do đổi trạng thái đơn hàng #${order.id} sang CANCELLED (+${item.quantity})`
            }
          });
        }
        await tx.order.update({
          where: { id: order.id },
          data: { status: "CANCELLED" }
        });
      });

      const updated = await db.order.findUnique({
        where: { id: order.id },
        include: { items: { include: { product: true } } }
      });
      return res.json({ message: "Đã hủy đơn hàng và hoàn lại tồn kho cùng nhật ký StockMovement.", order: updated });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    if (status === "DELIVERED" && order.paymentMethod === "COD") {
      updateData.paymentStatus = "COMPLETED";
    }

    const updatedOrder = await db.order.update({
      where: { id: order.id },
      data: updateData,
      include: { items: { include: { product: true } } }
    });

    return res.json({
      message: "Cập nhật trạng thái đơn hàng thành công!",
      order: updatedOrder
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi cập nhật: " + err.message });
  }
});

// POST /api/orders/:id/cancel (Customer or Admin cancel)
router.post("/:id/cancel", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const whereClause: any = { id: req.params.id };
    if (user.role === "CUSTOMER") {
      whereClause.userId = user.id;
    }

    const order = await db.order.findFirst({
      where: whereClause,
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng hoặc bạn không có quyền hủy." });
    }

    if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
      return res.status(400).json({ error: "Chỉ có thể hủy đơn hàng đang ở trạng thái Chờ xử lý hoặc Đã xác nhận." });
    }

    await db.$transaction(async (tx: any) => {
      // Refund stock and record StockMovement
      for (const item of order.items) {
        const prod = await tx.product.findUnique({ where: { id: item.productId } });
        const beforeStock = prod ? (typeof prod.stock === "number" ? prod.stock : (parseInt(String(prod.stock)) || 0)) : 0;
        const afterStock = beforeStock + item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: afterStock }
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            type: "SALE_CANCEL",
            beforeStock,
            afterStock,
            referenceId: order.id,
            createdById: user.id,
            note: `Khách hàng/Admin hủy đơn #${order.id} (Hoàn kho: +${item.quantity})`
          }
        });
      }
      await tx.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" }
      });
    });

    const cancelledOrder = await db.order.findUnique({
      where: { id: order.id },
      include: { items: { include: { product: true } } }
    });

    return res.json({
      message: "Hủy đơn hàng thành công và đã hoàn lại số lượng tồn kho!",
      order: cancelledOrder
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;

import { PrismaClient, Role, OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { 
  INITIAL_USERS, 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_SETTINGS 
} from "../src/mockData";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu nạp dữ liệu ban đầu (Seeding database)...");

  // 1. Seed SystemSettings
  await prisma.systemSettings.upsert({
    where: { id: "default_settings" },
    update: {},
    create: {
      id: "default_settings",
      freeShippingThreshold: INITIAL_SETTINGS.freeShippingThreshold || 500000,
      aiProvider: INITIAL_SETTINGS.aiProvider?.toUpperCase() || "GEMINI",
      geminiApiKey: INITIAL_SETTINGS.geminiApiKey || "",
      geminiModel: INITIAL_SETTINGS.geminiModel || "gemini-2.5-flash",
      openaiApiKey: INITIAL_SETTINGS.openaiApiKey || "",
      openaiModel: INITIAL_SETTINGS.openaiModel || "",
      aiServiceUrl: INITIAL_SETTINGS.aiServiceUrl || "http://localhost:8000",
      vnpayTmnCode: INITIAL_SETTINGS.vnpayTmnCode || "SANDBOX_STORE_AI",
      momoPartnerCode: INITIAL_SETTINGS.momoPartnerCode || "MOMO",
      momoAccessKey: INITIAL_SETTINGS.momoAccessKey || "",
      momoSecretKey: INITIAL_SETTINGS.momoSecretKey || ""
    }
  });
  console.log("✅ Đã cập nhật SystemSettings");

  // 2. Seed Users
  for (const u of INITIAL_USERS) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        email: u.email,
        passwordHash: u.passwordHash,
        fullName: u.fullName,
        phone: u.phone,
        address: u.address,
        avatar: u.avatar,
        role: u.role as Role,
        isActive: u.isActive,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt)
      }
    });

    // Create a Cart for each user if not existing
    await prisma.cart.upsert({
      where: { userId: u.id },
      update: {},
      create: {
        id: `cart_${u.id}`,
        userId: u.id
      }
    });
  }
  console.log(`✅ Đã nạp ${INITIAL_USERS.length} người dùng & giỏ hàng`);

  // 3. Seed Categories
  for (const c of INITIAL_CATEGORIES) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: c.icon,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt)
      }
    });
  }
  console.log(`✅ Đã nạp ${INITIAL_CATEGORIES.length} danh mục`);

  // 4. Seed Products
  for (const p of INITIAL_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        stock: p.stock,
        thumbnail: p.thumbnail,
        images: p.images,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        categoryId: p.categoryId,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }
    });
  }
  console.log(`✅ Đã nạp ${INITIAL_PRODUCTS.length} sản phẩm`);

  // 5. Seed Orders & OrderItems
  for (const o of INITIAL_ORDERS) {
    const existingOrder = await prisma.order.findUnique({ where: { id: o.id } });
    if (!existingOrder) {
      await prisma.order.create({
        data: {
          id: o.id,
          userId: o.userId,
          totalAmount: o.totalAmount,
          shippingFee: o.shippingFee,
          discountAmount: o.discountAmount,
          finalAmount: o.finalAmount,
          status: o.status as OrderStatus,
          paymentMethod: o.paymentMethod as PaymentMethod,
          paymentStatus: o.paymentStatus as PaymentStatus,
          shippingAddress: o.shippingAddress,
          phone: o.phone,
          customerName: o.customerName,
          note: o.note,
          createdAt: new Date(o.createdAt),
          updatedAt: new Date(o.updatedAt),
          items: {
            create: (o.items || []).map(it => ({
              id: it.id,
              productId: it.productId,
              quantity: it.quantity,
              price: it.price,
              createdAt: new Date(it.createdAt)
            }))
          }
        }
      });
    }
  }
  console.log(`✅ Đã nạp ${INITIAL_ORDERS.length} đơn hàng mẫu`);

  console.log("🎉 Hoàn tất Seed Database PostgreSQL!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

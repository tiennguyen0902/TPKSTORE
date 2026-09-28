import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { INITIAL_PRODUCTS } from "../src/mockProducts";

const prisma = new PrismaClient();

// Hash for 'Password123@'
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync("Password123@", 10);

async function main() {
  console.log("🌱 Bắt đầu seed dữ liệu mẫu vào PostgreSQL...\n");

  // 1. Seed System Settings
  console.log("⚙️  Tạo cấu hình hệ thống...");
  await prisma.systemSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "SHOPBEE",
      hotline: "1900 6868",
      supportEmail: "support@store-ai.example.com",
      freeShippingThreshold: 500000,
      aiProvider: "gemini",
      geminiApiKey: process.env.GEMINI_API_KEY || "",
      geminiModel: "gemini-3.5-flash",
      openaiApiKey: "",
      openaiModel: "gpt-5.4-mini",
      aiServiceUrl: process.env.AI_SERVICE_URL || "http://ai_service:8000",
      vnpayTmnCode: "SANDBOX_STORE_AI",
      momoPartnerCode: "MOMO",
      momoAccessKey: "F8BBA842ECF85",
      momoSecretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz"
    }
  });

  // 2. Seed Users
  console.log("👥 Tạo tài khoản người dùng...");
  try {
    await prisma.$executeRawUnsafe(`ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'MANAGER';`);
  } catch (e) {}

  const users = [
    {
      id: "usr_admin",
      email: "admin@example.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      fullName: "Thang Quốc Khải (Admin)",
      phone: "0901234567",
      address: "Tòa nhà Keangnam Landmark 72, Phạm Hùng, Q. Nam Từ Liêm, Hà Nội",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: "ADMIN" as const,
      isActive: true,
    },
    {
      id: "usr_manager",
      email: "manager@example.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      fullName: "Trần Quốc Quản (Quản lý kho)",
      phone: "0908889999",
      address: "Kho tổng TPKSTORE, Cụm Công nghiệp Nam Từ Liêm, Hà Nội",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      role: "MANAGER" as const,
      isActive: true,
    },
    {
      id: "usr_staff_1",
      email: "staff@example.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      fullName: "Nguyễn Đình Tiến (Staff)",
      phone: "0902345678",
      address: "123 Cầu Giấy, P. Dịch Vọng, Q. Cầu Giấy, Hà Nội",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      role: "STAFF" as const,
      isActive: true,
    },
    {
      id: "usr_staff_2",
      email: "staff2@example.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      fullName: "Nguyễn Hồng Phúc (Staff)",
      phone: "0903456789",
      address: "456 Nguyễn Trãi, P. Thanh Xuân Trung, Q. Thanh Xuân, Hà Nội",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      role: "STAFF" as const,
      isActive: true,
    },
    {
      id: "usr_customer_1",
      email: "customer@example.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      fullName: "Lê Hoàng Nam",
      phone: "0912345678",
      address: "Số 45 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
      role: "CUSTOMER" as const,
      isActive: true,
    },
    {
      id: "usr_customer_2",
      email: "customer2@example.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      fullName: "Trần Thị Mai Anh",
      phone: "0913456789",
      address: "Số 18 Đường Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      role: "CUSTOMER" as const,
      isActive: true,
    },
    {
      id: "usr_customer_3",
      email: "customer3@example.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      fullName: "Phạm Quốc Bảo",
      phone: "0914567890",
      address: "Số 88 Trần Hưng Đạo, P. An Hải Tây, Q. Sơn Trà, Đà Nẵng",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      role: "CUSTOMER" as const,
      isActive: true,
    },
    {
      id: "usr_customer_4",
      email: "customer4@example.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      fullName: "Đỗ Ngọc Ánh",
      phone: "0915678901",
      address: "24 Đường Lê Lợi, Phường 4, TP. Vũng Tàu, Bà Rịa - Vũng Tàu",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      role: "CUSTOMER" as const,
      isActive: true,
    },
    {
      id: "usr_customer_5",
      email: "customer5@example.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      fullName: "Vũ Minh Trí",
      phone: "0916789012",
      address: "56 Nguyễn Thị Minh Khai, P. Đa Kao, Quận 1, TP. Hồ Chí Minh",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      role: "CUSTOMER" as const,
      isActive: true,
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: { canChatAi: true },
      create: { ...user, canChatAi: true }
    });
  }
  console.log(`   ✅ Đã tạo ${users.length} tài khoản với quyền Chat AI được kích hoạt`);

  // 3. Seed Categories
  console.log("📂 Tạo danh mục sản phẩm...");
  const categories = [
    { id: "cat_1", name: "Điện thoại & Tablet", slug: "dien-thoai-tablet", description: "Smartphone AI, iPhone, iPad, Máy tính bảng cao cấp", icon: "Smartphone" },
    { id: "cat_2", name: "Laptop & Macbook", slug: "laptop-macbook", description: "Laptop Gaming, AI Ultrabook, Macbook Pro, Văn phòng", icon: "Laptop" },
    { id: "cat_3", name: "Tai nghe & Âm thanh", slug: "tai-nghe-am-thanh", description: "Tai nghe chống ồn AI, Loa Bluetooth, Soundbar", icon: "Headphones" },
    { id: "cat_4", name: "Đồng hồ thông minh", slug: "dong-ho-thong-minh", description: "Smartwatch theo dõi sức khỏe AI, Apple Watch, Garmin", icon: "Watch" },
    { id: "cat_5", name: "Phụ kiện & Cáp sạc", slug: "phu-kien-cap-sac", description: "Củ sạc GaN, Pin dự phòng AI Power, Cáp sạc nhanh", icon: "Zap" },
    { id: "cat_6", name: "Nhà thông minh (Smart Home)", slug: "nha-thong-minh", description: "Camera AI an ninh, Robot hút bụi AI, Đèn thông minh", icon: "Home" },
    { id: "cat_7", name: "Màn hình máy tính", slug: "man-hinh-may-tinh", description: "Màn hình 4K HDR, Gaming 240Hz, Đồ họa chuyên nghiệp", icon: "Monitor" },
    { id: "cat_8", name: "Bàn phím & Chuột", slug: "ban-phim-chuot", description: "Bàn phím cơ không dây, Chuột công thái học AI Sensor", icon: "Keyboard" },
    { id: "cat_9", name: "Thiết bị mạng & Wi-Fi 7", slug: "thiet-bi-mang", description: "Router AI Mesh, Bộ phát Wi-Fi 6E/7 tốc độ cao", icon: "Wifi" },
    { id: "cat_10", name: "Phần mềm & Bản quyền", slug: "phan-mem-ban-quyen", description: "Gói AI Assistant, Office 365, Antivirus Security", icon: "ShieldCheck" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: cat
    });
  }
  console.log(`   ✅ Đã tạo ${categories.length} danh mục`);

  // 4. Dọn dẹp dữ liệu cũ & Seed 100 sản phẩm mới
  console.log("🧹 Dọn dẹp giỏ hàng, đơn hàng và toàn bộ sản phẩm cũ...");
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.product.deleteMany({});

  console.log(`📦 Nạp ${INITIAL_PRODUCTS.length} sản phẩm mới (10 danh mục x 10 sản phẩm)...`);
  for (const prod of INITIAL_PRODUCTS) {
    const { category, ...prodData } = prod as any;
    await prisma.product.create({
      data: {
        id: prodData.id,
        name: prodData.name,
        slug: prodData.slug,
        description: prodData.description,
        price: prodData.price,
        originalPrice: prodData.originalPrice,
        stock: prodData.stock,
        thumbnail: prodData.thumbnail,
        images: prodData.images,
        rating: prodData.rating,
        reviewCount: prodData.reviewCount,
        isFeatured: prodData.isFeatured,
        isNew: prodData.isNew,
        categoryId: prodData.categoryId
      }
    });
  }
  console.log(`   ✅ Đã tạo thành công ${INITIAL_PRODUCTS.length} sản phẩm mới!`);

  // 5. Seed Orders (with OrderItems)
  console.log("📋 Tạo đơn hàng mẫu...");
  const orders = [
    {
      id: "#ord_1001",
      userId: "usr_customer_1",
      customerName: "Lê Hoàng Nam",
      phone: "0912345678",
      shippingAddress: "Số 45 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
      note: "Giao trong giờ hành chính",
      totalAmount: 34990000, shippingFee: 0, discountAmount: 0, finalAmount: 34990000,
      status: "DELIVERED" as const, paymentMethod: "VNPAY" as const, paymentStatus: "COMPLETED" as const,
      createdAt: new Date("2026-08-15T09:24:41.000Z"),
      items: [{ productId: "prd_1", quantity: 1, price: 34990000 }]
    },
    {
      id: "#ord_1002",
      userId: "usr_customer_1",
      customerName: "Lê Hoàng Nam",
      phone: "0912345678",
      shippingAddress: "Số 45 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
      note: "Gọi trước khi giao 15 phút",
      totalAmount: 82480000, shippingFee: 0, discountAmount: 0, finalAmount: 82480000,
      status: "SHIPPING" as const, paymentMethod: "COD" as const, paymentStatus: "PENDING" as const,
      createdAt: new Date("2026-08-18T09:24:41.000Z"),
      items: [
        { productId: "prd_11", quantity: 1, price: 79990000 },
        { productId: "prd_41", quantity: 1, price: 2490000 }
      ]
    },
    {
      id: "#ord_1003",
      userId: "usr_customer_2",
      customerName: "Trần Thị Mai Anh",
      phone: "0913456789",
      shippingAddress: "Tòa nhà Landmark 81, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh",
      note: "Gửi lễ tân nhận giúp",
      totalAmount: 7490000, shippingFee: 0, discountAmount: 0, finalAmount: 7490000,
      status: "CONFIRMED" as const, paymentMethod: "VNPAY" as const, paymentStatus: "COMPLETED" as const,
      createdAt: new Date("2026-08-19T10:15:00.000Z"),
      items: [{ productId: "prd_21", quantity: 1, price: 7490000 }]
    },
    {
      id: "#ord_1004",
      userId: "usr_customer_3",
      customerName: "Phạm Quốc Bảo",
      phone: "0914567890",
      shippingAddress: "128 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh",
      note: "Kiểm tra kỹ tem niêm phong",
      totalAmount: 19990000, shippingFee: 0, discountAmount: 0, finalAmount: 19990000,
      status: "PENDING" as const, paymentMethod: "COD" as const, paymentStatus: "PENDING" as const,
      createdAt: new Date("2026-08-20T11:20:00.000Z"),
      items: [{ productId: "prd_31", quantity: 1, price: 19990000 }]
    }
  ];

  for (const order of orders) {
    const { items, ...orderData } = order;
    await prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: items
        }
      }
    });
  }
  console.log(`   ✅ Đã tạo ${orders.length} đơn hàng mẫu`);

  // 6. Seed Cart with items for demo user
  console.log("🛒 Tạo giỏ hàng demo...");
  await prisma.cart.create({
    data: {
      userId: "usr_customer_1",
      items: {
        create: [
          { productId: "prd_1", quantity: 1 },
          { productId: "prd_42", quantity: 2 }
        ]
      }
    }
  });
  console.log("   ✅ Đã tạo giỏ hàng demo cho Lê Hoàng Nam");

  console.log("\n🎉 Seed dữ liệu hoàn tất! 100 sản phẩm mới đã được nạp thành công vào PostgreSQL.");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

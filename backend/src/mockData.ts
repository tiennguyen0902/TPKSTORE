import bcrypt from "bcryptjs";

// Hash for 'Password123@'
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync("Password123@", 10);

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: "ADMIN" | "MANAGER" | "STAFF" | "CUSTOMER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockTicket {
  id: string;
  type: "IMPORT" | "EXPORT";
  productId: string;
  productName: string;
  productThumbnail?: string;
  quantity: number;
  reason: string;
  note?: string;
  requestedByUserId: string;
  requestedByName: string;
  requestedByRole: "STAFF" | "MANAGER" | "ADMIN";
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedByUserId?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  thumbnail: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product?: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  shippingAddress: string;
  note?: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELLED";
  paymentMethod: "COD" | "VNPAY" | "MOMO";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  momoTransId?: string;
  momoPayUrl?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface SystemSettings {
  storeName: string;
  hotline: string;
  supportEmail: string;
  freeShippingThreshold: number;
  aiProvider?: "gemini" | "openai";
  geminiApiKey: string;
  geminiModel: string;
  openaiApiKey?: string;
  openaiModel?: string;
  aiServiceUrl: string;
  vnpayTmnCode: string;
  momoPartnerCode?: string;
  momoAccessKey?: string;
  momoSecretKey?: string;
}

export const INITIAL_USERS: User[] = [
  {
    id: "usr_admin",
    email: "admin@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    fullName: "Thang Quốc Khải (Admin)",
    phone: "0901234567",
    address: "Tòa nhà Keangnam Landmark 72, Phạm Hùng, Q. Nam Từ Liêm, Hà Nội",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "ADMIN",
    isActive: true,
    createdAt: "2026-08-01T08:00:00.000Z",
    updatedAt: "2026-08-20T09:00:00.000Z"
  },
  {
    id: "usr_manager",
    email: "manager@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    fullName: "Trần Quốc Quản (Quản lý kho)",
    phone: "0908889999",
    address: "Kho tổng TPKSTORE, Cụm Công nghiệp Nam Từ Liêm, Hà Nội",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    role: "MANAGER",
    isActive: true,
    createdAt: "2026-08-01T08:30:00.000Z",
    updatedAt: "2026-08-20T09:00:00.000Z"
  },
  {
    id: "usr_staff_1",
    email: "staff@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    fullName: "Nguyễn Đình Tiến (Staff)",
    phone: "0902345678",
    address: "123 Cầu Giấy, P. Dịch Vọng, Q. Cầu Giấy, Hà Nội",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "STAFF",
    isActive: true,
    createdAt: "2026-08-02T08:00:00.000Z",
    updatedAt: "2026-08-20T09:00:00.000Z"
  },
  {
    id: "usr_staff_2",
    email: "staff2@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    fullName: "Nguyễn Hồng Phúc (Staff)",
    phone: "0903456789",
    address: "456 Nguyễn Trãi, P. Thanh Xuân Trung, Q. Thanh Xuân, Hà Nội",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    role: "STAFF",
    isActive: true,
    createdAt: "2026-08-02T08:30:00.000Z",
    updatedAt: "2026-08-20T09:00:00.000Z"
  },
  {
    id: "usr_customer_1",
    email: "customer@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    fullName: "Lê Hoàng Nam",
    phone: "0912345678",
    address: "Số 45 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    role: "CUSTOMER",
    isActive: true,
    createdAt: "2026-08-05T09:00:00.000Z",
    updatedAt: "2026-08-20T09:00:00.000Z"
  },
  {
    id: "usr_customer_2",
    email: "customer2@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    fullName: "Trần Thị Mai Anh",
    phone: "0913456789",
    address: "Số 18 Đường Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    role: "CUSTOMER",
    isActive: true,
    createdAt: "2026-08-06T10:00:00.000Z",
    updatedAt: "2026-08-20T09:00:00.000Z"
  },
  {
    id: "usr_customer_3",
    email: "customer3@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    fullName: "Phạm Quốc Bảo",
    phone: "0914567890",
    address: "Số 88 Trần Hưng Đạo, P. An Hải Tây, Q. Sơn Trà, Đà Nẵng",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    role: "CUSTOMER",
    isActive: true,
    createdAt: "2026-08-08T11:00:00.000Z",
    updatedAt: "2026-08-20T09:00:00.000Z"
  },
  {
    id: "usr_customer_4",
    email: "customer4@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    fullName: "Đỗ Ngọc Ánh",
    phone: "0915678901",
    address: "24 Đường Lê Lợi, Phường 4, TP. Vũng Tàu, Bà Rịa - Vũng Tàu",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    role: "CUSTOMER",
    isActive: true,
    createdAt: "2026-08-10T14:00:00.000Z",
    updatedAt: "2026-08-20T09:00:00.000Z"
  },
  {
    id: "usr_customer_5",
    email: "customer5@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    fullName: "Vũ Minh Trí",
    phone: "0916789012",
    address: "56 Nguyễn Thị Minh Khai, P. Đa Kao, Quận 1, TP. Hồ Chí Minh",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    role: "CUSTOMER",
    isActive: true,
    createdAt: "2026-08-12T16:00:00.000Z",
    updatedAt: "2026-08-20T09:00:00.000Z"
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat_1",
    name: "Điện thoại & Tablet",
    slug: "dien-thoai-tablet",
    description: "Smartphone AI, iPhone, iPad, Máy tính bảng cao cấp",
    icon: "Smartphone",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "cat_2",
    name: "Laptop & Macbook",
    slug: "laptop-macbook",
    description: "Laptop Gaming, AI Ultrabook, Macbook Pro, Văn phòng",
    icon: "Laptop",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "cat_3",
    name: "Tai nghe & Âm thanh",
    slug: "tai-nghe-am-thanh",
    description: "Tai nghe chống ồn AI, Loa Bluetooth, Soundbar",
    icon: "Headphones",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "cat_4",
    name: "Đồng hồ thông minh",
    slug: "dong-ho-thong-minh",
    description: "Smartwatch theo dõi sức khỏe AI, Apple Watch, Garmin",
    icon: "Watch",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "cat_5",
    name: "Phụ kiện & Cáp sạc",
    slug: "phu-kien-cap-sac",
    description: "Củ sạc GaN, Pin dự phòng AI Power, Cáp sạc nhanh",
    icon: "Zap",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "cat_6",
    name: "Nhà thông minh (Smart Home)",
    slug: "nha-thong-minh",
    description: "Camera AI an ninh, Robot hút bụi AI, Đèn thông minh",
    icon: "Home",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "cat_7",
    name: "Màn hình máy tính",
    slug: "man-hinh-may-tinh",
    description: "Màn hình 4K HDR, Gaming 240Hz, Đồ họa chuyên nghiệp",
    icon: "Monitor",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "cat_8",
    name: "Bàn phím & Chuột",
    slug: "ban-phim-chuot",
    description: "Bàn phím cơ không dây, Chuột công thái học AI Sensor",
    icon: "Keyboard",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "cat_9",
    name: "Thiết bị mạng & Wi-Fi 7",
    slug: "thiet-bi-mang",
    description: "Router AI Mesh, Bộ phát Wi-Fi 6E/7 tốc độ cao",
    icon: "Wifi",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "cat_10",
    name: "Phần mềm & Bản quyền",
    slug: "phan-mem-ban-quyen",
    description: "Gói AI Assistant, Office 365, Antivirus Security",
    icon: "ShieldCheck",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prd_1",
    name: "Tai nghe không dây chống ồn AI ANC Pro",
    slug: "tai-nghe-khong-day-chong-on-ai-anc-pro",
    description: "Tai nghe True Wireless cao cấp tích hợp chip chống ồn chủ động thích ứng bằng AI, âm thanh Hi-Res, thời lượng pin 36 giờ, chuẩn chống nước IPX5.",
    price: 1250000,
    originalPrice: 1590000,
    stock: 45,
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 142,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_3",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_2",
    name: "Điện thoại thông minh Flagship AI 5G (8GB/256GB)",
    slug: "dien-thoai-thong-minh-flagship-ai-5g",
    description: "Màn hình OLED 120Hz 6.7 inch, bộ vi xử lý AI Neural Engine thế hệ mới, camera 108MP hỗ trợ chụp đêm xóa phông bằng AI, pin 5000mAh sạc siêu nhanh 67W.",
    price: 8990000,
    originalPrice: 10490000,
    stock: 18,
    thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 98,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_1",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_3",
    name: "Laptop Gaming AI Ultra Slim RTX 4060",
    slug: "laptop-gaming-ai-ultra-slim-rtx-4060",
    description: "Laptop cao cấp vi xử lý Intel Core i7 thế hệ mới, card đồ họa rời NVIDIA RTX 4060 8GB, màn hình 2.5K 165Hz 100% sRGB, tản nhiệt buồng hơi AI Vapor.",
    price: 23500000,
    originalPrice: 26900000,
    stock: 12,
    thumbnail: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 65,
    isFeatured: true,
    isNew: false,
    categoryId: "cat_2",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_4",
    name: "Đồng hồ thông minh Smartwatch Health AI",
    slug: "dong-ho-thong-minh-smartwatch-health-ai",
    description: "Đồng hồ đo điện tâm đồ ECG, nồng độ oxy trong máu SpO2, theo dõi giấc ngủ và stress bằng AI. Màn hình AMOLED Always-on chống trầy Sapphire.",
    price: 2490000,
    originalPrice: 2990000,
    stock: 30,
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.7,
    reviewCount: 88,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_4",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_5",
    name: "Củ sạc nhanh thông minh GaN 65W AI Chip",
    slug: "cu-sac-nhanh-thong-minh-gan-65w-ai-chip",
    description: "Công nghệ bán dẫn GaN III nhỏ gọn, tích hợp chip AI điều phối dòng điện tự động chống quá nhiệt, 3 cổng ra (2 Type-C, 1 USB-A) sạc cùng lúc Laptop và Phone.",
    price: 450000,
    originalPrice: 590000,
    stock: 80,
    thumbnail: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 210,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_5",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_6",
    name: "Robot hút bụi lau nhà AI Vision LiDAR",
    slug: "robot-hut-bui-lau-nha-ai-vision-lidar",
    description: "Hệ thống cảm biến Laser LiDAR 3D kết hợp camera AI nhận diện đồ vật tránh vật cản chính xác 99%, lực hút 6000Pa, tự động giặt giẻ và sấy khô.",
    price: 8490000,
    originalPrice: 9990000,
    stock: 15,
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 52,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_6",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_7",
    name: "Màn hình chuyên đồ họa 27 inch 4K IPS HDR",
    slug: "man-hinh-chuyen-do-hoa-27-inch-4k-ips-hdr",
    description: "Độ phân giải 4K UHD 3840x2160, chuẩn màu 99% DCI-P3 Delta E < 1.5, hỗ trợ cân chỉnh màu AI tích hợp sẵn, cổng Type-C 90W cấp nguồn máy tính.",
    price: 7290000,
    originalPrice: 8490000,
    stock: 22,
    thumbnail: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 39,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_7",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_8",
    name: "Chuột công thái học Ergonomic AI Sensor",
    slug: "chuot-cong-thai-hoc-ergonomic-ai-sensor",
    description: "Thiết kế góc nghiêng tự nhiên 57 độ bảo vệ cổ tay, cảm biến quang học AI thích ứng trên mọi bề mặt kể cả kính trong suốt, kết nối 3 thiết bị Bluetooth + Wireless.",
    price: 1350000,
    originalPrice: 1650000,
    stock: 35,
    thumbnail: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 76,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_8",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_9",
    name: "Router Wi-Fi 7 Tri-Band Gaming Ultra Fast",
    slug: "router-wi-fi-7-tri-band-gaming",
    description: "Chuẩn Wi-Fi 7 tốc độ lên đến 19Gbps, 3 băng tần, công nghệ AI QoS tự động ưu tiên gói tin game và video call, tầm phủ sóng 350m2 xuyên tường cực mạnh.",
    price: 3890000,
    originalPrice: 4500000,
    stock: 16,
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.7,
    reviewCount: 31,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_9",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_10",
    name: "Gói Bản Quyền AI Assistant Pro 1 Năm",
    slug: "goi-ban-quyen-ai-assistant-pro-1-nam",
    description: "Bộ công cụ trợ lý AI toàn năng hỗ trợ lập trình, phân tích dữ liệu, tóm tắt văn bản và sinh ảnh không giới hạn tốc độ cao.",
    price: 1200000,
    originalPrice: 1800000,
    stock: 999,
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 115,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_10",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_11",
    name: "Máy tính bảng AI Pad Pro 11 inch 128GB",
    slug: "may-tinh-bang-ai-pad-pro-11-inch",
    description: "Thiết kế nhôm nguyên khối siêu mỏng 5.9mm, màn hình Liquid Retina 120Hz ProMotion, chip M2 hỗ trợ xử lý tác vụ đồ họa và ghi chú bằng bút stylus thông minh.",
    price: 11490000,
    originalPrice: 13500000,
    stock: 14,
    thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 45,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_1",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_12",
    name: "Bàn phím cơ không dây RGB Hot-swap AI Knob",
    slug: "ban-phim-co-khong-day-rgb-hot-swap",
    description: "Layout 75% gọn gàng, switch cơ học pre-lubed êm ái, núm xoay đa năng AI điều chỉnh âm lượng & công cụ làm việc, pin 4000mAh dùng 3 tháng liên tục.",
    price: 1890000,
    originalPrice: 2300000,
    stock: 28,
    thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 92,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_8",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  // --- THÊM 3 SẢN PHẨM MỖI DANH MỤC (prd_13 đến prd_42) ---
  // 1. Điện thoại & Tablet (cat_1)
  {
    id: "prd_13",
    name: "iPhone 16 Pro Max 256GB Titan Sa Mạc",
    slug: "iphone-16-pro-max-256gb-titan-sa-mac",
    description: "Siêu phẩm Apple Intelligence đỉnh cao, khung viền titan cấp 5, chip A18 Pro tiến trình 3nm, camera Fusion 48MP zoom quang 5x, màn hình Super Retina XDR 6.9 inch 120Hz.",
    price: 34990000,
    originalPrice: 37990000,
    stock: 25,
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 89,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_1",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_14",
    name: "Samsung Galaxy S24 Ultra 5G AI Phone (12GB/512GB)",
    slug: "samsung-galaxy-s24-ultra-5g-ai-phone",
    description: "Đỉnh cao Galaxy AI với tính năng khoanh tròn để tìm kiếm, phiên dịch cuộc gọi trực tiếp, bút S-Pen quyền năng, camera 200MP zoom quang 100x Space Zoom, màn hình chống chói Gorilla Armor.",
    price: 29990000,
    originalPrice: 33990000,
    stock: 20,
    thumbnail: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 74,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_1",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_15",
    name: "iPad Air M2 13 inch Wi-Fi 128GB Không Gian Xám",
    slug: "ipad-air-m2-13-inch-wifi-128gb",
    description: "Màn hình Liquid Retina 13 inch mở rộng trải nghiệm, sức mạnh đột phá từ vi xử lý Apple M2 thế hệ mới, hỗ trợ Apple Pencil Pro và Magic Keyboard chuyên nghiệp.",
    price: 21490000,
    originalPrice: 23990000,
    stock: 15,
    thumbnail: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 42,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_1",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  // 2. Laptop & Macbook (cat_2)
  {
    id: "prd_16",
    name: "MacBook Pro 14 M3 Pro (18GB RAM / 512GB SSD)",
    slug: "macbook-pro-14-m3-pro-18gb-512gb",
    description: "Laptop chuyên nghiệp cho lập trình viên và sáng tạo nội dung, chip Apple M3 Pro 11 nhân CPU, màn hình Liquid Retina XDR 120Hz độ sáng 1600 nits, pin lên đến 18 tiếng.",
    price: 48990000,
    originalPrice: 52990000,
    stock: 10,
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 56,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_2",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_17",
    name: "Laptop ASUS Zenbook 14 OLED AI PC Intel Core Ultra 7",
    slug: "laptop-asus-zenbook-14-oled-ai-pc",
    description: "Chuẩn Copilot+ AI PC siêu mỏng nhẹ chỉ 1.2kg, màn hình Lumina OLED 3K 120Hz 100% DCI-P3, tích hợp NPU Intel AI Boost tăng tốc xử lý tác vụ trí tuệ nhân tạo.",
    price: 27990000,
    originalPrice: 31490000,
    stock: 18,
    thumbnail: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 38,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_2",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_18",
    name: "Laptop Dell XPS 13 Plus 9340 Siêu Gọn Nhẹ",
    slug: "laptop-dell-xps-13-plus-9340",
    description: "Thiết kế tương lai với hàng phím chức năng cảm ứng vô hình, touchpad liền mạch bằng kính, màn hình InfinityEdge FHD+ tràn viền 500 nits, chip Intel Core Ultra thế hệ mới.",
    price: 36500000,
    originalPrice: 39900000,
    stock: 12,
    thumbnail: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.7,
    reviewCount: 29,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_2",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  // 3. Tai nghe & Âm thanh (cat_3)
  {
    id: "prd_19",
    name: "Tai nghe chụp tai chống ồn Sony WH-1000XM5 AI Optimizer",
    slug: "tai-nghe-chup-tai-sony-wh-1000xm5",
    description: "Công nghệ chống ồn đỉnh cao thế giới với 8 micro và bộ xử lý Auto NC Optimizer AI tự động tinh chỉnh theo môi trường, màng loa 30mm mạ sợi carbon, pin 30 giờ.",
    price: 7490000,
    originalPrice: 8690000,
    stock: 25,
    thumbnail: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 112,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_3",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_20",
    name: "Loa Bluetooth di động Marshall Stanmore III Vintage",
    slug: "loa-bluetooth-marshall-stanmore-iii",
    description: "Âm thanh nổi stereo lan tỏa rộng khắp phòng, củ loa công suất 80W Class D mạnh mẽ, kết nối Bluetooth 5.2 tương thích âm thanh thế hệ mới LE Audio, phong cách cổ điển sang trọng.",
    price: 8990000,
    originalPrice: 9990000,
    stock: 16,
    thumbnail: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 68,
    isFeatured: true,
    isNew: false,
    categoryId: "cat_3",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_21",
    name: "Tai nghe AirPods Pro Gen 2 USB-C Chip H2",
    slug: "tai-nghe-airpods-pro-gen-2-usb-c",
    description: "Khả năng khử tiếng ồn chủ động gấp 2 lần, chế độ Âm Thanh Thích Ứng tự động điều chỉnh âm lượng theo môi trường, kháng bụi nước IP54 cùng hộp sạc tìm kiếm Precision Finding.",
    price: 5390000,
    originalPrice: 6190000,
    stock: 40,
    thumbnail: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 154,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_3",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  // 4. Đồng hồ thông minh (cat_4)
  {
    id: "prd_22",
    name: "Apple Watch Ultra 2 Titanium Dây Ocean",
    slug: "apple-watch-ultra-2-titanium",
    description: "Vỏ titan 49mm chống va đập tiêu chuẩn quân đội, màn hình sáng nhất lịch sử 3000 nits, chip S9 SiP thao tác chạm hai lần Double Tap, định vị GPS tần số kép chuẩn xác dưới mọi điều kiện.",
    price: 19990000,
    originalPrice: 21990000,
    stock: 14,
    thumbnail: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 63,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_4",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_23",
    name: "Đồng hồ thể thao Garmin Fenix 7 Pro Solar Sapphire",
    slug: "dong-ho-the-thao-garmin-fenix-7-pro-solar",
    description: "Sạc năng lượng mặt trời cho thời lượng pin đến 37 ngày, đèn pin LED tích hợp, bản đồ địa hình Topo đa lục địa, theo dõi chỉ số sức khỏe chuyên sâu AI Endurance & Hill Score.",
    price: 21490000,
    originalPrice: 23500000,
    stock: 12,
    thumbnail: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 47,
    isFeatured: true,
    isNew: false,
    categoryId: "cat_4",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_24",
    name: "Samsung Galaxy Watch 7 AI BioActive Sensor",
    slug: "samsung-galaxy-watch-7-ai",
    description: "Cảm biến BioActive thế hệ mới theo dõi chỉ số AGEs (sản phẩm glycat hóa bền vững), phân tích điểm năng lượng Energy Score thông minh, chip xử lý 3nm mạnh mẽ mượt mà.",
    price: 7290000,
    originalPrice: 8490000,
    stock: 22,
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 35,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_4",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  // 5. Phụ kiện & Cáp sạc (cat_5)
  {
    id: "prd_25",
    name: "Pin sạc dự phòng Anker Prime 20.000mAh 200W Màn hình số",
    slug: "pin-sac-du-phong-anker-prime-20000mah-200w",
    description: "Công suất khủng 200W hỗ trợ sạc cùng lúc 2 laptop, màn hình màu TFT hiển thị điện áp và công suất sạc từng cổng thời gian thực, công nghệ tản nhiệt thông minh ActiveShield 2.0.",
    price: 2490000,
    originalPrice: 2890000,
    stock: 55,
    thumbnail: "https://images.unsplash.com/photo-1609592807901-bcf3b91b92e7?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1609592807901-bcf3b91b92e7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 88,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_5",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_26",
    name: "Đế sạc không dây 3 trong 1 MagSafe Hợp Kim Nhôm",
    slug: "de-sac-khong-day-3-in-1-magsafe",
    description: "Thiết kế gập gọn thanh lịch, tích hợp sạc nhanh chuẩn Qi2 15W cho iPhone, sạc Apple Watch và AirPods đồng thời, nam châm hít siêu mạnh chống rơi rớt.",
    price: 950000,
    originalPrice: 1250000,
    stock: 60,
    thumbnail: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 52,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_5",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_27",
    name: "Cáp sạc Type-C to Type-C 240W Dù Siêu Bền 2m",
    slug: "cap-sac-type-c-to-c-240w-2m",
    description: "Chuẩn USB 4 / Thunderbolt hỗ trợ công suất cực đại 240W (48V/5A), truyền dữ liệu siêu tốc 40Gbps, vỏ bọc dù bện sợi Kevlar chống đứt gãy 30.000 lần uốn gập.",
    price: 320000,
    originalPrice: 450000,
    stock: 120,
    thumbnail: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 140,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_5",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  // 6. Nhà thông minh (Smart Home) (cat_6)
  {
    id: "prd_28",
    name: "Camera An Ninh AI Ngoài Trời 360 4K Còi Báo Động",
    slug: "camera-an-ninh-ai-ngoai-troi-360-4k",
    description: "Độ phân giải siêu nét Ultra HD 4K, AI nhận diện phân biệt người, thú cưng và phương tiện xe cộ, quay quét toàn cảnh 360 độ ban đêm có màu Starlight Color, đàm thoại 2 chiều.",
    price: 1850000,
    originalPrice: 2200000,
    stock: 35,
    thumbnail: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 64,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_6",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_29",
    name: "Khóa cửa thông minh nhận diện khuôn mặt FaceID 3D AI",
    slug: "khoa-cua-thong-minh-faceid-3d-ai",
    description: "Mở khóa sinh trắc học khuôn mặt 3D chuẩn xác trong 0.5s chống giả mạo bằng ảnh chụp/video, tích hợp chuông cửa màn hình thông minh, kết nối app theo dõi mở cửa từ xa.",
    price: 5890000,
    originalPrice: 6990000,
    stock: 20,
    thumbnail: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 41,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_6",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_30",
    name: "Bóng đèn thông minh Philips Hue White & Color Ambiance",
    slug: "bong-den-thong-minh-philips-hue-rgb",
    description: "Tùy biến 16 triệu màu sắc ánh sáng đồng bộ cùng nhạc, game và phim ảnh, điều khiển bằng giọng nói tiếng Việt qua Google Assistant/Siri, tiết kiệm điện năng chuẩn A++.",
    price: 1190000,
    originalPrice: 1450000,
    stock: 48,
    thumbnail: "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.7,
    reviewCount: 75,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_6",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  // 7. Màn hình máy tính (cat_7)
  {
    id: "prd_31",
    name: "Màn hình cong Gaming QD-OLED 34 inch UltraWide 175Hz",
    slug: "man-hinh-cong-gaming-qd-oled-34-inch",
    description: "Tấm nền Quantum Dot OLED siêu thực, tần số quét 175Hz thời gian phản hồi siêu tốc 0.03ms, độ tương phản vô cực, tỷ lệ màn hình điện ảnh 21:9 chìm đắm trong game.",
    price: 21990000,
    originalPrice: 24500000,
    stock: 12,
    thumbnail: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 33,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_7",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_32",
    name: "Màn hình di động cảm ứng 15.6 inch FHD IPS Type-C",
    slug: "man-hinh-di-dong-cam-ung-15-6-inch-fhd",
    description: "Độ mỏng chỉ 5mm trọng lượng 750g kèm bao da kiêm giá đỡ tiện lợi, hỗ trợ cảm ứng 10 điểm chạm mượt mà, cắm trực tiếp qua cáp Type-C duy nhất cho laptop, phone, Switch.",
    price: 3490000,
    originalPrice: 4200000,
    stock: 30,
    thumbnail: "https://images.unsplash.com/photo-1585792180666-f7347c490ee7?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 45,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_7",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_33",
    name: "Màn hình văn phòng bảo vệ mắt Dell UltraSharp 24 inch IPS",
    slug: "man-hinh-dell-ultrasharp-24-inch-ips",
    description: "Công nghệ ComfortView Plus giảm ánh sáng xanh có hại nhưng không làm sai lệch màu, viền màn hình siêu mỏng InfinityEdge 4 cạnh, chân đế công thái học xoay nâng linh hoạt.",
    price: 5290000,
    originalPrice: 5990000,
    stock: 40,
    thumbnail: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 82,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_7",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  // 8. Bàn phím & Chuột (cat_8)
  {
    id: "prd_34",
    name: "Bàn phím không dây Logitech MX Keys S Cao Cấp",
    slug: "ban-phim-khong-day-logitech-mx-keys-s",
    description: "Phím lõm thông minh ôm sát đầu ngón tay mang lại cảm giác gõ êm ái chính xác tuyệt đối, đèn nền cảm ứng tiệm cận thông minh tự sáng khi tay đến gần, sạc Type-C dùng 5 tháng.",
    price: 2690000,
    originalPrice: 3090000,
    stock: 32,
    thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 110,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_8",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_35",
    name: "Chuột Gaming siêu nhẹ Logitech G Pro X Superlight 2",
    slug: "chuot-gaming-logitech-g-pro-x-superlight-2",
    description: "Trọng lượng siêu nhẹ chỉ 60g, cảm biến HERO 2 độ phân giải lên đến 32.000 DPI, switch cơ lai quang học LIGHTFORCE độ trễ 0ms cực bền 100 triệu lần click.",
    price: 3490000,
    originalPrice: 3990000,
    stock: 26,
    thumbnail: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 95,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_8",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_36",
    name: "Bàn phím cơ Custom Nhôm CNC Rain 75 Switch HMX",
    slug: "ban-phim-co-nhom-cnc-rain-75",
    description: "Vỏ nhôm CNC nguyên khối anode cao cấp nặng 1.8kg, cấu trúc Gasket mount 5 lớp tiêu âm cực êm cho âm thanh gõ thock trầm ấm, 3 chế độ kết nối Type-C/2.4G/Bluetooth.",
    price: 2150000,
    originalPrice: 2500000,
    stock: 22,
    thumbnail: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 58,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_8",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  // 9. Thiết bị mạng & Wi-Fi 7 (cat_9)
  {
    id: "prd_37",
    name: "Hệ thống Wi-Fi 7 Mesh 3 Pack Phủ Sóng 700m2 AI Roaming",
    slug: "he-thong-wifi-7-mesh-3-pack-ai-roaming",
    description: "Bộ 3 node phát sóng đồng nhất tạo vùng phủ sóng rộng 700m2 xuyên mọi vật cản, hỗ trợ kết nối hơn 300 thiết bị cùng lúc, thuật toán AI Mesh tự động chuyển vùng không độ trễ.",
    price: 8990000,
    originalPrice: 10500000,
    stock: 15,
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 44,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_9",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_38",
    name: "Bộ phát Wi-Fi 6 Di động 5G Tốc độ 2.5Gbps Pin 5000mAh",
    slug: "bo-phat-wifi-6-di-dong-5g-2-5gbps",
    description: "Lắp SIM 5G phát sóng Wi-Fi 6 tốc độ tải xuống tới 2.5Gbps, màn hình LCD 2.4 inch hiển thị dung lượng pin và lưu lượng data, pin 5000mAh hoạt động liên tục 12 tiếng.",
    price: 2890000,
    originalPrice: 3450000,
    stock: 35,
    thumbnail: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 52,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_9",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_39",
    name: "Switch Mạng 8 Cổng 2.5Gbps Cắm Là Chạy Vỏ Kim Loại",
    slug: "switch-mang-8-cong-2-5gbps",
    description: "Bứt phá băng thông gấp 2.5 lần mạng Gigabit tiêu chuẩn, 8 cổng RJ45 2.5G tương thích ngược, vỏ thép tản nhiệt thụ động không quạt hoạt động êm ái bền bỉ 24/7.",
    price: 1450000,
    originalPrice: 1790000,
    stock: 40,
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.7,
    reviewCount: 31,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_9",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  // 10. Phần mềm & Bản quyền (cat_10)
  {
    id: "prd_40",
    name: "Gói Bản Quyền Microsoft 365 Family 1 Năm (6 Người Dùng)",
    slug: "goi-ban-quyen-microsoft-365-family-1-nam",
    description: "Bản quyền chính hãng cho tối đa 6 người dùng, trọn bộ ứng dụng Word, Excel, PowerPoint, Outlook mới nhất, tặng kèm 6TB (1TB/người) lưu trữ đám mây OneDrive tốc độ cao.",
    price: 1490000,
    originalPrice: 1990000,
    stock: 999,
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 168,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_10",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_41",
    name: "Bản Quyền Windows 11 Pro 64-Bit Chính Hãng Vĩnh Viễn",
    slug: "ban-quyen-windows-11-pro-chinh-hang",
    description: "Khóa kích hoạt điện tử chính hãng kích hoạt trực tiếp từ Microsoft, hỗ trợ tính năng BitLocker mã hóa dữ liệu an toàn, máy ảo Hyper-V và cập nhật bảo mật trọn đời.",
    price: 850000,
    originalPrice: 1200000,
    stock: 999,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 220,
    isFeatured: true,
    isNew: false,
    categoryId: "cat_10",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "prd_42",
    name: "Phần mềm Diệt Virus & Bảo Mật Kaspersky Total Security 1 Năm",
    slug: "kaspersky-total-security-1-nam",
    description: "Giải pháp bảo vệ toàn diện chống mã độc tống tiền (Ransomware), bảo vệ thanh toán ngân hàng trực tuyến an toàn Safe Money, VPN bảo mật và tường lửa AI ngăn chặn tin tặc.",
    price: 390000,
    originalPrice: 550000,
    stock: 999,
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 94,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_10",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "#ord_1001",
    userId: "usr_customer_1",
    customerName: "Lê Hoàng Nam",
    phone: "0912345678",
    shippingAddress: "Số 45 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
    note: "Giao trong giờ hành chính",
    totalAmount: 1250000,
    shippingFee: 0,
    discountAmount: 0,
    finalAmount: 1250000,
    status: "DELIVERED",
    paymentMethod: "VNPAY",
    paymentStatus: "COMPLETED",
    createdAt: "2026-08-15T09:24:41.000Z",
    updatedAt: "2026-08-16T14:30:00.000Z",
    items: [
      {
        id: "oit_1",
        orderId: "#ord_1001",
        productId: "prd_1",
        quantity: 1,
        price: 1250000,
        createdAt: "2026-08-15T09:24:41.000Z"
      }
    ]
  },
  {
    id: "#ord_1002",
    userId: "usr_customer_1",
    customerName: "Lê Hoàng Nam",
    phone: "0912345678",
    shippingAddress: "Số 45 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
    note: "Gọi trước khi giao 15 phút",
    totalAmount: 9440000,
    shippingFee: 0,
    discountAmount: 0,
    finalAmount: 9440000,
    status: "SHIPPING",
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    createdAt: "2026-08-18T09:24:41.000Z",
    updatedAt: "2026-08-19T08:00:00.000Z",
    items: [
      {
        id: "oit_2",
        orderId: "#ord_1002",
        productId: "prd_2",
        quantity: 1,
        price: 8990000,
        createdAt: "2026-08-18T09:24:41.000Z"
      },
      {
        id: "oit_3",
        orderId: "#ord_1002",
        productId: "prd_5",
        quantity: 1,
        price: 450000,
        createdAt: "2026-08-18T09:24:41.000Z"
      }
    ]
  },
  {
    id: "#ord_1003",
    userId: "usr_customer_2",
    customerName: "Trần Thị Mai Anh",
    phone: "0913456789",
    shippingAddress: "Tòa nhà Landmark 81, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh",
    note: "Gửi lễ tân nhận giúp",
    totalAmount: 2490000,
    shippingFee: 0,
    discountAmount: 0,
    finalAmount: 2490000,
    status: "CONFIRMED",
    paymentMethod: "VNPAY",
    paymentStatus: "COMPLETED",
    createdAt: "2026-08-19T10:15:00.000Z",
    updatedAt: "2026-08-19T10:30:00.000Z",
    items: [
      {
        id: "oit_4",
        orderId: "#ord_1003",
        productId: "prd_4",
        quantity: 1,
        price: 2490000,
        createdAt: "2026-08-19T10:15:00.000Z"
      }
    ]
  },
  {
    id: "#ord_1004",
    userId: "usr_customer_3",
    customerName: "Phạm Quốc Bảo",
    phone: "0914567890",
    shippingAddress: "128 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh",
    note: "Kiểm tra kỹ tem niêm phong",
    totalAmount: 23500000,
    shippingFee: 0,
    discountAmount: 0,
    finalAmount: 23500000,
    status: "PENDING",
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    createdAt: "2026-08-20T11:20:00.000Z",
    updatedAt: "2026-08-20T11:20:00.000Z",
    items: [
      {
        id: "oit_5",
        orderId: "#ord_1004",
        productId: "prd_3",
        quantity: 1,
        price: 23500000,
        createdAt: "2026-08-20T11:20:00.000Z"
      }
    ]
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
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
};

export const INITIAL_STOCK_TICKETS: StockTicket[] = [
  {
    id: "stk_1",
    type: "IMPORT",
    productId: "prd_1",
    productName: "Tai nghe chống ồn không dây AI Studio Pro",
    productThumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    quantity: 25,
    reason: "Nhập thêm hàng từ nhà phân phối Sony VN cho đợt khuyến mãi",
    note: "Lô hàng kèm hóa đơn VAT số 08912",
    requestedByUserId: "usr_staff_1",
    requestedByName: "Nguyễn Đình Tiến (Staff)",
    requestedByRole: "STAFF",
    status: "PENDING",
    createdAt: "2026-09-20T10:30:00.000Z",
    updatedAt: "2026-09-20T10:30:00.000Z"
  },
  {
    id: "stk_2",
    type: "EXPORT",
    productId: "prd_5",
    productName: "Củ sạc nhanh thông minh GaN 65W AI Chip",
    productThumbnail: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
    quantity: 10,
    reason: "Xuất kho điều chuyển sang showroom chi nhánh Cầu Giấy",
    note: "Xe giao nhận nội bộ số 29B-883.12",
    requestedByUserId: "usr_staff_2",
    requestedByName: "Nguyễn Hồng Phúc (Staff)",
    requestedByRole: "STAFF",
    status: "PENDING",
    createdAt: "2026-09-21T08:15:00.000Z",
    updatedAt: "2026-09-21T08:15:00.000Z"
  },
  {
    id: "stk_3",
    type: "IMPORT",
    productId: "prd_12",
    productName: "Bàn phím cơ không dây RGB Hot-swap AI Knob",
    productThumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    quantity: 30,
    reason: "Nhập đợt hàng mới từ xưởng sản xuất Keychron",
    note: "Đã kiểm đếm đạt chuẩn QC 100%",
    requestedByUserId: "usr_staff_1",
    requestedByName: "Nguyễn Đình Tiến (Staff)",
    requestedByRole: "STAFF",
    status: "APPROVED",
    approvedByUserId: "usr_manager",
    approvedByName: "Trần Quốc Quản (Quản lý kho)",
    approvedAt: "2026-09-18T14:20:00.000Z",
    createdAt: "2026-09-18T09:00:00.000Z",
    updatedAt: "2026-09-18T14:20:00.000Z"
  },
  {
    id: "stk_4",
    type: "EXPORT",
    productId: "prd_6",
    productName: "Robot hút bụi lau nhà AI Vision LiDAR",
    productThumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    quantity: 5,
    reason: "Xuất kho trả hàng cho đại lý lỗi phần mềm",
    note: "Biên bản hoàn trả số 142",
    requestedByUserId: "usr_staff_2",
    requestedByName: "Nguyễn Hồng Phúc (Staff)",
    requestedByRole: "STAFF",
    status: "REJECTED",
    approvedByUserId: "usr_manager",
    approvedByName: "Trần Quốc Quản (Quản lý kho)",
    approvedAt: "2026-09-19T11:00:00.000Z",
    rejectReason: "Chưa có biên bản xác nhận lỗi từ bộ phận kỹ thuật bảo hành",
    createdAt: "2026-09-19T08:45:00.000Z",
    updatedAt: "2026-09-19T11:00:00.000Z"
  }
];

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
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  isActive: boolean;
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

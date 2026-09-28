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
  canChatAi?: boolean;
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
  aiProvider?: "gemini" | "openai" | "local";
  geminiApiKey: string;
  geminiModel: string;
  openaiApiKey?: string;
  openaiModel?: string;
  localAiUrl?: string;
  localAiModel?: string;
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
    canChatAi: true,
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
    canChatAi: true,
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
    canChatAi: true,
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
    canChatAi: true,
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
    canChatAi: true,
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
    canChatAi: true,
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
    canChatAi: true,
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
    canChatAi: true,
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
    canChatAi: true,
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

export { INITIAL_PRODUCTS } from "./mockProducts";

export const INITIAL_ORDERS: Order[] = [
  {
    id: "#ord_1001",
    userId: "usr_customer_1",
    customerName: "Lê Hoàng Nam",
    phone: "0912345678",
    shippingAddress: "Số 45 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
    note: "Giao trong giờ hành chính",
    totalAmount: 34990000,
    shippingFee: 0,
    discountAmount: 0,
    finalAmount: 34990000,
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
        price: 34990000,
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
    totalAmount: 82480000,
    shippingFee: 0,
    discountAmount: 0,
    finalAmount: 82480000,
    status: "SHIPPING",
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    createdAt: "2026-08-18T09:24:41.000Z",
    updatedAt: "2026-08-19T08:00:00.000Z",
    items: [
      {
        id: "oit_2",
        orderId: "#ord_1002",
        productId: "prd_11",
        quantity: 1,
        price: 79990000,
        createdAt: "2026-08-18T09:24:41.000Z"
      },
      {
        id: "oit_3",
        orderId: "#ord_1002",
        productId: "prd_41",
        quantity: 1,
        price: 2490000,
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
    totalAmount: 7490000,
    shippingFee: 0,
    discountAmount: 0,
    finalAmount: 7490000,
    status: "CONFIRMED",
    paymentMethod: "VNPAY",
    paymentStatus: "COMPLETED",
    createdAt: "2026-08-19T10:15:00.000Z",
    updatedAt: "2026-08-19T10:30:00.000Z",
    items: [
      {
        id: "oit_4",
        orderId: "#ord_1003",
        productId: "prd_21",
        quantity: 1,
        price: 7490000,
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
    totalAmount: 19990000,
    shippingFee: 0,
    discountAmount: 0,
    finalAmount: 19990000,
    status: "PENDING",
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    createdAt: "2026-08-20T11:20:00.000Z",
    updatedAt: "2026-08-20T11:20:00.000Z",
    items: [
      {
        id: "oit_5",
        orderId: "#ord_1004",
        productId: "prd_31",
        quantity: 1,
        price: 19990000,
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
  localAiUrl: "http://localhost:11434",
  localAiModel: "llava",
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
    productName: "iPhone 16 Pro Max 256GB Titan Sa Mạc",
    productThumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    quantity: 25,
    reason: "Nhập thêm hàng từ nhà phân phối Apple VN cho đợt khuyến mãi",
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
    productId: "prd_42",
    productName: "Củ sạc nhanh Anker Prime 100W GaN 3 cổng Thông Minh",
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
    productId: "prd_71",
    productName: "Bàn phím cơ Keychron Q1 Pro Wireless Hot-swap Vỏ Nhôm CNC",
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
    productId: "prd_51",
    productName: "Robot hút bụi lau nhà Ecovacs Deebot X2 Omni AI Lực Hút 8000Pa",
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

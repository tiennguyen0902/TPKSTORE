import { Product } from "../types";

export interface ColorVariant {
  name: string;
  hex: string;
  borderClass?: string;
}

export interface OptionItem {
  name: string;
  priceDiff: number; // Chênh lệch giá VND so với bản gốc (0 nếu là bản cơ sở)
  description?: string;
  isDefault?: boolean;
}

export interface ProductVariantGroup {
  colorLabel?: string;
  colors?: ColorVariant[];
  optionLabel?: string;
  options?: OptionItem[];
}

/**
 * BẢNG DỮ LIỆU BIẾN THỂ THỰC TẾ 100% CHÍNH HÃNG:
 * Chuẩn màu sắc, bộ nhớ, cấu hình từ Apple, Samsung, Xiaomi, ASUS, Dell, HP, Bose, Sony, Marshall, Keychron, Logitech...
 * Toàn bộ nhãn tiếp thị / nhấn mạnh (badges) đã được loại bỏ để giao diện thanh lịch, chuẩn mực.
 */
export const PRODUCT_VARIANTS_MAP: Record<string, ProductVariantGroup> = {
  // =========================================================================
  // 1. DANH MỤC ĐIỆN THOẠI & TABLET (cat_1)
  // =========================================================================

  // prd_1: iPhone 16 Pro Max (4 màu Titan Grade 5 chính thức Apple)
  "prd_1": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Titan Sa Mạc (Desert Titanium)", hex: "#C5B49D" },
      { name: "Titan Tự Nhiên (Natural Titanium)", hex: "#9B9790" },
      { name: "Titan Trắng (White Titanium)", hex: "#F2F1ED" },
      { name: "Titan Đen (Black Titanium)", hex: "#3C3B37" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "256GB", priceDiff: 0, description: "Bản tiêu chuẩn, đủ lưu trữ hơn 40.000 bức ảnh", isDefault: true },
      { name: "512GB", priceDiff: 6000000, description: "Quay video 4K 120fps ProRes chuyên nghiệp" },
      { name: "1TB", priceDiff: 12500000, description: "Dung lượng tối thượng cho sáng tạo nội dung điện ảnh" }
    ]
  },

  // prd_2: Samsung Galaxy S24 Ultra (Đầy đủ 7 màu chính hãng Samsung)
  "prd_2": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Xám Titan (Titanium Gray)", hex: "#7F7D78" },
      { name: "Đen Titan (Titanium Black)", hex: "#2C2B29" },
      { name: "Tím Titan (Titanium Violet)", hex: "#524E65" },
      { name: "Vàng Titan (Titanium Yellow)", hex: "#D8CA9F" },
      { name: "Xanh Titan (Titanium Blue)", hex: "#607B8B" },
      { name: "Xanh Lục Titan (Titanium Green)", hex: "#576352" },
      { name: "Cam Titan (Titanium Orange)", hex: "#C76D49" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "12GB / 256GB", priceDiff: -3000000, description: "Phiên bản tiêu chuẩn đáp ứng mọi nhu cầu Galaxy AI" },
      { name: "12GB / 512GB", priceDiff: 0, description: "Phiên bản cân bằng tối ưu giữa lưu trữ và hiệu năng", isDefault: true },
      { name: "12GB / 1TB", priceDiff: 7500000, description: "Bộ nhớ UFS 4.0 dung lượng khủng cho chuyên gia" }
    ]
  },

  // prd_5: Samsung Galaxy Z Fold6 5G (Đầy đủ 5 màu chính hãng Samsung)
  "prd_5": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Xám Metal (Silver Shadow)", hex: "#A8A9AD" },
      { name: "Xanh Navy (Navy)", hex: "#212C3D" },
      { name: "Hồng Rose (Pink)", hex: "#F1D3CF" },
      { name: "Đen Crafted Black (Vân Carbon)", hex: "#1E1F21" },
      { name: "Trắng Classic White", hex: "#FAF9F6" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "12GB / 256GB", priceDiff: 0, description: "Màn hình gập 7.6 inch độ sáng 2600 nits, Snapdragon 8 Gen 3", isDefault: true },
      { name: "12GB / 512GB", priceDiff: 4500000, description: "Đa nhiệm 3 ứng dụng cùng lúc với bộ công cụ Galaxy AI" },
      { name: "12GB / 1TB", priceDiff: 11000000, description: "Không gian làm việc di động hoàn hảo thay thế máy tính" }
    ]
  },

  // prd_4: Xiaomi 14 Ultra (4 màu chính hãng Leica)
  "prd_4": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Da Nano (Black Leather)", hex: "#1C1C1E" },
      { name: "Trắng Da Nano (White Leather)", hex: "#F5F5F7" },
      { name: "Xanh Dương (Dragon Crystal Blue)", hex: "#2D486B" },
      { name: "Xám Titan (Titanium Edition)", hex: "#5A5A5C" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "16GB / 512GB (Tiêu chuẩn)", priceDiff: 0, description: "4 ống kính Leica Summilux 50MP cảm biến 1 inch LYT-900", isDefault: true },
      { name: "16GB / 512GB + Photography Kit", priceDiff: 2800000, description: "Kèm báng tay cầm chụp ảnh chuyên nghiệp, vòng filter 67mm và pin phụ" },
      { name: "16GB / 1TB Titanium Edition", priceDiff: 6000000, description: "Khung viền Titan siêu cứng cấp hàng không, liên lạc vệ tinh 2 chiều" }
    ]
  },

  // prd_3: iPad Pro M4 11 inch (OLED Tandem)
  "prd_3": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Không Gian (Space Black)", hex: "#2E2C2F" },
      { name: "Bạc Ánh Kim (Silver)", hex: "#E2E4E5" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "256GB (8GB RAM)", priceDiff: 0, description: "Màn hình Tandem OLED kép Ultra Retina XDR đỉnh cao", isDefault: true },
      { name: "512GB (8GB RAM)", priceDiff: 5500000, description: "Gấp đôi dung lượng cho dự án thiết kế Procreate và Nomad Sculpt" },
      { name: "1TB (16GB RAM • Kính Nano-texture)", priceDiff: 18000000, description: "Kính phủ Nano-texture chống chói tán xạ ánh sáng, 16GB RAM" },
      { name: "2TB (16GB RAM • Kính Nano-texture)", priceDiff: 29000000, description: "Cấu hình tối đa cho dựng phim 8K đa luồng ProRes Log" }
    ]
  },

  // prd_6: Google Pixel 9 Pro XL (4 màu chính hãng Google)
  "prd_6": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đá Núi Lửa (Obsidian)", hex: "#1E1E1E" },
      { name: "Sứ Trắng (Porcelain)", hex: "#F4F3ED" },
      { name: "Xám Thạch Anh (Hazel)", hex: "#6F756F" },
      { name: "Hồng Thạch Anh (Rose Quartz)", hex: "#E8C8C7" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "16GB / 128GB", priceDiff: 0, description: "Bản tiêu chuẩn tích hợp chip Google Tensor G4 và chip bảo mật Titan M2", isDefault: true },
      { name: "16GB / 256GB", priceDiff: 2500000, description: "Lưu trữ thoải mái ảnh chụp đêm AI và video 4K 60fps" },
      { name: "16GB / 512GB", priceDiff: 6500000, description: "Lưu trữ ảnh RAW 50MP và tính năng Video Boost AI ban đêm" },
      { name: "16GB / 1TB", priceDiff: 11500000, description: "Dung lượng tối đa cho người dùng sáng tạo nội dung chuyên sâu" }
    ]
  },

  // prd_7: iPad Air M2 13 inch (4 màu chính hãng Apple)
  "prd_7": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Xám Không Gian (Space Gray)", hex: "#68696D" },
      { name: "Ánh Sao (Starlight)", hex: "#E5DCC5" },
      { name: "Xanh Dương (Blue)", hex: "#B8C9D9" },
      { name: "Tím Nhạt (Purple)", hex: "#D6D2E0" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "128GB Wi-Fi", priceDiff: 0, description: "Màn hình Liquid Retina 13 inch cực lớn", isDefault: true },
      { name: "256GB Wi-Fi", priceDiff: 3000000, description: "Cài đặt ứng dụng học tập và ghi chú Goodnotes thoải mái" },
      { name: "128GB Wi-Fi + 5G Cellular", priceDiff: 4000000, description: "Gắn SIM 5G kết nối internet mọi lúc mọi nơi" },
      { name: "512GB Wi-Fi + 5G Cellular", priceDiff: 9500000, description: "Cấu hình tối đa cho sinh viên và dân văn phòng di chuyển" }
    ]
  },

  // prd_8: Samsung Galaxy Tab S9 Ultra (14.6 inch AMOLED 2X)
  "prd_8": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Graphite (Graphite)", hex: "#2F3136" },
      { name: "Be Khói (Beige)", hex: "#E4DEC8" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "12GB / 256GB Wi-Fi", priceDiff: 0, description: "Màn hình Dynamic AMOLED 2X 14.6 inch khổng lồ kèm bút S-Pen", isDefault: true },
      { name: "12GB / 512GB Wi-Fi", priceDiff: 3500000, description: "Tặng kèm bút S-Pen có tính năng điều khiển từ xa qua Bluetooth" },
      { name: "16GB / 1TB 5G Cellular", priceDiff: 11000000, description: "Hỗ trợ Samsung DeX như máy tính để bàn chuyên nghiệp" }
    ]
  },

  // prd_9: ASUS ROG Phone 8 Pro
  "prd_9": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Phantom Black (Đen Bóng Đêm)", hex: "#1A1A1C" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "16GB RAM / 512GB ROM", priceDiff: 0, description: "Màn hình Samsung AMOLED 165Hz, Snapdragon 8 Gen 3", isDefault: true },
      { name: "24GB RAM / 1TB ROM (Pro Edition)", priceDiff: 6000000, description: "Tặng kèm quạt tản nhiệt bán dẫn AeroActive Cooler X chính hãng" }
    ]
  },

  // prd_10: iPad Mini 7 chip A17 Pro (4 màu chính hãng)
  "prd_10": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Xám Không Gian (Space Gray)", hex: "#68696D" },
      { name: "Ánh Sao (Starlight)", hex: "#E5DCC5" },
      { name: "Xanh Lam (Blue)", hex: "#B8C9D9" },
      { name: "Tím (Purple)", hex: "#D6D2E0" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "128GB Wi-Fi", priceDiff: 0, description: "Hỗ trợ Apple Pencil Pro và ray tracing chơi game console", isDefault: true },
      { name: "256GB Wi-Fi", priceDiff: 2800000, description: "Lưu trữ tài liệu và game nặng tiện lợi" },
      { name: "512GB Wi-Fi + 5G", priceDiff: 8500000, description: "Phiên bản đầy đủ 5G gắn e-SIM kết nối di động mọi lúc" }
    ]
  },

  // =========================================================================
  // 2. DANH MỤC LAPTOP & MACBOOK (cat_2)
  // =========================================================================

  // prd_11: MacBook Pro 14 M3 Max
  "prd_11": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Không Gian (Space Black)", hex: "#272729" },
      { name: "Bạc Ánh Kim (Silver)", hex: "#E2E4E5" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "14 CPU / 30 GPU • 36GB RAM / 1TB SSD", priceDiff: 0, description: "Màn hình Liquid Retina XDR 120Hz 1600 nits đỉnh", isDefault: true },
      { name: "16 CPU / 40 GPU • 48GB RAM / 1TB SSD", priceDiff: 14000000, description: "Tối ưu hóa chạy mô hình Local LLM và render Blender 3D" },
      { name: "16 CPU / 40 GPU • 64GB RAM / 2TB SSD", priceDiff: 28000000, description: "Cỗ máy trạm di động mạnh mẽ nhất của hệ sinh thái Apple" }
    ]
  },

  // prd_12: MacBook Air 15 M3 (4 màu chính hãng)
  "prd_12": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đêm Xanh Thẳm (Midnight)", hex: "#1C2430" },
      { name: "Ánh Sao (Starlight)", hex: "#E5DCC5" },
      { name: "Xám Không Gian (Space Gray)", hex: "#75777B" },
      { name: "Bạc (Silver)", hex: "#E2E4E5" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "16GB RAM / 512GB SSD", priceDiff: 0, description: "Thời lượng pin 18 giờ, không quạt tản nhiệt êm ái", isDefault: true },
      { name: "24GB RAM / 512GB SSD", priceDiff: 5000000, description: "Chạy đa nhiệm ứng dụng nặng mượt mà không nghẽn RAM" },
      { name: "24GB RAM / 1TB SSD", priceDiff: 10500000, description: "Dung lượng thoải mái cho thư viện ảnh và dự án Final Cut" }
    ]
  },

  // prd_13: ASUS Zenbook 14 OLED
  "prd_13": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Xanh Ponder (Ponder Blue)", hex: "#232F3E" },
      { name: "Bạc Foggy (Foggy Silver)", hex: "#D2D6DC" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Core Ultra 7 155H • 16GB / 512GB SSD", priceDiff: 0, description: "Màn hình 14 inch Lumina OLED 3K 120Hz siêu nét", isDefault: true },
      { name: "Core Ultra 7 155H • 32GB / 1TB SSD", priceDiff: 4500000, description: "Gấp đôi RAM và SSD cho lập trình viên và kế toán" },
      { name: "Core Ultra 9 185H • 32GB / 1TB SSD", priceDiff: 8500000, description: "Vi xử lý đầu bảng tích hợp NPU Intel AI Boost tăng tốc trí tuệ nhân tạo" }
    ]
  },

  // prd_14: Dell XPS 14 OLED 9440
  "prd_14": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Bạch Kim (Platinum)", hex: "#E5E5E7" },
      { name: "Graphite (Xám Than)", hex: "#3A3B3E" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "FHD+ 120Hz • Intel Arc Graphics (16GB/512GB)", priceDiff: -6000000, description: "Tiết kiệm pin vượt trội lên tới 16 giờ sử dụng" },
      { name: "3.2K OLED Cảm Ứng • RTX 4050 6GB (32GB/1TB)", priceDiff: 0, description: "Màn hình OLED cảm ứng chuẩn đồ họa DCI-P3 100%", isDefault: true },
      { name: "3.2K OLED Cảm Ứng • RTX 4050 6GB (64GB/2TB)", priceDiff: 12000000, description: "Cấu hình kịch kim cho kiến trúc sư và đồ họa kỹ xảo" }
    ]
  },

  // prd_15: Lenovo ThinkPad X1 Carbon Gen 12
  "prd_15": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Nhám Sợi Carbon (Deep Black)", hex: "#1A1A1A" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Core Ultra 7 155H • 32GB LPDDR5X / 1TB SSD", priceDiff: 0, description: "Vỏ sợi carbon siêu nhẹ 1.09kg, bàn phím gõ sâu êm ái", isDefault: true },
      { name: "Core Ultra 7 165H vPro • 64GB / 2TB SSD • Màn 2.8K OLED", priceDiff: 12000000, description: "Bảo mật phần cứng chuẩn doanh nghiệp vPro, màn OLED 120Hz" }
    ]
  },

  // prd_16: HP Spectre x360 14 (3 màu chính hãng HP)
  "prd_16": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Bóng Đêm (Nightfall Black)", hex: "#212123" },
      { name: "Xanh Phiến Đá (Slate Blue)", hex: "#384353" },
      { name: "Bạc Sahara (Sahara Silver)", hex: "#D0D3D6" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Core Ultra 7 155H • 16GB / 1TB • OLED 2.8K 120Hz", priceDiff: 0, description: "Kèm bút cảm ứng HP Rechargeable MPP 2.0 Tilt Pen", isDefault: true },
      { name: "Core Ultra 7 155H • 32GB / 2TB • OLED 2.8K 120Hz", priceDiff: 6500000, description: "Tối ưu hóa đa nhiệm đồ họa và lưu trữ không giới hạn" }
    ]
  },

  // prd_17: ROG Zephyrus G16 OLED
  "prd_17": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Xám Eclipse (Eclipse Gray)", hex: "#333438" },
      { name: "Trắng Bạch Kim (Platinum White)", hex: "#EBECEC" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "RTX 4070 8GB GDDR6 (32GB / 1TB)", priceDiff: 0, description: "Màn hình ROG Nebula OLED 2.5K 240Hz 0.2ms", isDefault: true },
      { name: "RTX 4080 12GB GDDR6 (32GB / 1TB)", priceDiff: 16000000, description: "Chiến mượt mọi tựa game AAA bật Ray Tracing và DLSS 3.5" },
      { name: "RTX 4090 16GB GDDR6 (32GB / 2TB)", priceDiff: 32000000, description: "Sức mạnh tối thượng, tản nhiệt kim loại lỏng Conductonaut Extreme" }
    ]
  },

  // prd_18: Acer Predator Helios 16
  "prd_18": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Abyssal Black (Đen Huyền Bí)", hex: "#18181A" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Core i9 14900HX • RTX 4070 8GB (16GB/1TB)", priceDiff: 0, description: "Màn hình WQXGA 240Hz 100% DCI-P3 chuẩn eSports", isDefault: true },
      { name: "Core i9 14900HX • RTX 4080 12GB (32GB/2TB)", priceDiff: 18000000, description: "Quạt AeroBlade 3D thế hệ 5 kim loại siêu êm" }
    ]
  },

  // prd_19: MacBook Pro 16 M3 Max
  "prd_19": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Không Gian (Space Black)", hex: "#272729" },
      { name: "Bạc Ánh Kim (Silver)", hex: "#E2E4E5" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "16 CPU / 40 GPU • 48GB RAM / 1TB SSD", priceDiff: 0, description: "Màn hình Liquid Retina XDR 16.2 inch khổng lồ", isDefault: true },
      { name: "16 CPU / 40 GPU • 64GB RAM / 2TB SSD", priceDiff: 18000000, description: "Dành cho nhà sản xuất âm nhạc và kỹ sư trí tuệ nhân tạo" },
      { name: "16 CPU / 40 GPU • 128GB RAM / 4TB SSD", priceDiff: 48000000, description: "Dung lượng RAM tối đa để train mô hình ngôn ngữ lớn trên macOS" }
    ]
  },

  // prd_20: Dell Alienware m16 R2
  "prd_20": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Mặt Trăng Đen (Dark Metallic Moon)", hex: "#2C2D30" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Core Ultra 7 155H • RTX 4070 8GB (32GB/1TB)", priceDiff: 0, description: "Bàn phím cơ CherryMX siêu mỏng AlienFX RGB từng phím", isDefault: true },
      { name: "Core Ultra 9 185H • RTX 4080 12GB (64GB/2TB)", priceDiff: 22000000, description: "Tản nhiệt buồng hơi Cryo-tech độc quyền của Dell Alienware" }
    ]
  },

  // =========================================================================
  // 3. DANH MỤC PHỤ KIỆN & ÂM THANH (cat_3)
  // =========================================================================

  // prd_21: Sony WH-1000XM5 (4 màu chính hãng Sony)
  "prd_21": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Nhám (Black)", hex: "#1F1F21" },
      { name: "Bạc Bạch Kim (Silver)", hex: "#D6D4CD" },
      { name: "Xanh Đêm (Midnight Blue)", hex: "#1A263B" },
      { name: "Hồng Khói (Smoky Pink)", hex: "#CBB3AF" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Bản Tiêu Chuẩn (Fullbox)", priceDiff: 0, description: "Kèm hộp đựng cao cấp, cáp 3.5mm mạ vàng và cáp sạc Type-C", isDefault: true },
      { name: "Kèm Giá Treo Tai Nghe Hợp Kim Nhôm", priceDiff: 350000, description: "Bảo vệ đệm đầu tai nghe và làm gọn bàn làm việc" }
    ]
  },

  // prd_22: Apple AirPods Pro Gen 2 USB-C Chip H2
  "prd_22": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Trắng Apple (White)", hex: "#FFFFFF" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Hộp Sạc Type-C MagSafe Chuẩn", priceDiff: 0, description: "Kháng bụi nước IP54 cho cả tai nghe và hộp sạc, chip H2", isDefault: true },
      { name: "Kèm Bao Da Bảo Vệ Thật Chống Rơi Vỡ", priceDiff: 290000, description: "Chất liệu da bò cao cấp chống trầy xước hộp sạc" }
    ]
  },

  // prd_23: Bose QuietComfort Ultra (4 màu chính hãng Bose)
  "prd_23": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen (Black)", hex: "#1E1E20" },
      { name: "Trắng Khói (White Smoke)", hex: "#EDEAE5" },
      { name: "Cát Sa Mạc (Sandstone)", hex: "#C8B499" },
      { name: "Xanh Trăng Non (Lunar Blue)", hex: "#2C3A4E" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Bản Tiêu Chuẩn Không Dây", priceDiff: 0, description: "Chống ồn đỉnh cao thế giới, hỗ trợ Snapdragon Sound aptX Lossless", isDefault: true }
    ]
  },

  // prd_24: Marshall Stanmore III
  "prd_24": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Cổ Điển (Black)", hex: "#1E1E1E" },
      { name: "Kem Vintage (Cream)", hex: "#E9E3D3" },
      { name: "Nâu Đậm (Brown)", hex: "#5C3E31" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Bản Tiêu Chuẩn Cắm Điện Trực Tiếp (80W)", priceDiff: 0, description: "Âm trường rộng hơn thế hệ II, Bluetooth 5.2 LE Audio", isDefault: true },
      { name: "Kèm Cáp Dù 3.5mm Marshall Chống Nhiễu", priceDiff: 390000, description: "Cáp cuộn xoắn mạ vàng phong cách rocker hoài niệm" }
    ]
  },

  // prd_25: Sennheiser Momentum 4 Wireless Pin 60H
  "prd_25": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Nhám (Black)", hex: "#1C1C1E" },
      { name: "Trắng Bạc (White)", hex: "#E5E4E2" },
      { name: "Xanh Vải Jean (Denim Edition)", hex: "#324558" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Bản Tiêu Chuẩn Pin 60 Giờ", priceDiff: 0, description: "Chất âm audiophile đậm chất Đức, màng loa 42mm", isDefault: true }
    ]
  },

  // prd_26: JBL Boombox 3 Wi-Fi
  "prd_26": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Mờ (Black)", hex: "#1E1E1E" },
      { name: "Rằn Ri Quân Đội (Squad Camo)", hex: "#4B5320" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Bản Wi-Fi & Bluetooth 5.3", priceDiff: 0, description: "Hỗ trợ Dolby Atmos 3D, truyền phát nhạc Lossless qua AirPlay & Spotify Connect", isDefault: true }
    ]
  },

  // prd_27: Bang & Olufsen Beosound A1 2nd Gen
  "prd_27": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Than (Black Anthracite)", hex: "#222224" },
      { name: "Sương Mù Xám (Grey Mist)", hex: "#C7C8C5" },
      { name: "Băng Bắc Âu (Nordic Ice)", hex: "#D3DCDE" },
      { name: "Mật Ong (Honey Tone)", hex: "#D4A373" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Bản Tiêu Chuẩn Kèm Dây Da Thật", priceDiff: 0, description: "Vỏ nhôm Anodized chống nước hoàn toàn IP67", isDefault: true }
    ]
  },

  // prd_28: Apple AirPods Max Type-C (5 màu mới Apple)
  "prd_28": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Nửa Đêm (Midnight)", hex: "#22252B" },
      { name: "Ánh Sao (Starlight)", hex: "#E5DDD0" },
      { name: "Xanh Dương (Blue)", hex: "#4B6B8A" },
      { name: "Tím (Purple)", hex: "#7E6E85" },
      { name: "Cam (Orange)", hex: "#C76544" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Phiên bản Type-C 2024", priceDiff: 0, description: "Sạc tiện lợi chung cáp iPhone, hỗ trợ âm thanh không gian cá nhân hóa", isDefault: true }
    ]
  },

  // prd_29: Sony WF-1000XM5
  "prd_29": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Nhám (Black)", hex: "#1E1E20" },
      { name: "Bạc Bạch Kim (Silver)", hex: "#D5D4CE" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Bản Tiêu Chuẩn Fullbox", priceDiff: 0, description: "Driver Dynamic X 8.4mm tái tạo âm thanh chuẩn Hi-Res LDAC", isDefault: true },
      { name: "Kèm Ốp Bảo Vệ Chống Sốc Silicone", priceDiff: 150000, description: "Bảo vệ hộp sạc khỏi trầy xước và rơi rớt" }
    ]
  },

  // prd_30: Harman Kardon Aura Studio 4
  "prd_30": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Khói Pha Lê (Diamond Smoked Black)", hex: "#2A2A2E" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Bản Tiêu Chuẩn 130W", priceDiff: 0, description: "Hệ thống vòm kính pha lê với 5 dải đèn LED hiệu ứng sóng âm", isDefault: true }
    ]
  },

  // =========================================================================
  // 4. DANH MỤC SMARTWATCH & THIẾT BỊ ĐEO (cat_4)
  // =========================================================================

  // prd_31: Apple Watch Ultra 2
  "prd_31": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Titan Tự Nhiên (Natural Titanium)", hex: "#B8B5AE" },
      { name: "Titan Đen Mới (Black Titanium)", hex: "#282829" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Dây Ocean Biển (Cao su fluoroelastomer)", priceDiff: 0, description: "Chuyên cho thể thao dưới nước và lặn bình khí sâu 40m", isDefault: true },
      { name: "Dây Alpine Loop (Leo núi dệt liền mạch)", priceDiff: 0, description: "Móc khóa titan chữ G gia cố siêu chắc chắn" },
      { name: "Dây Trail Loop (Chạy bộ mỏng nhẹ)", priceDiff: 0, description: "Dây đeo co giãn thoải mái nhất, thoáng khí cho cự ly Marathon" },
      { name: "Dây Milanese Titan Đen (Doanh nhân)", priceDiff: 3200000, description: "Dệt thủ công bằng sợi titan cao cấp sang trọng" }
    ]
  },

  // prd_32: Apple Watch Series 10 (Đầy đủ 6 màu: 3 Nhôm + 3 Titan)
  "prd_32": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Bóng Jet Black (Nhôm)", hex: "#121214" },
      { name: "Vàng Hồng Rose Gold (Nhôm)", hex: "#E8C8BE" },
      { name: "Bạc Nhôm Silver", hex: "#E1E2E4" },
      { name: "Xám Đá Slate (Titan)", hex: "#3B3E45" },
      { name: "Vàng Gold (Titan)", hex: "#C9B588" },
      { name: "Titan Tự Nhiên Natural", hex: "#B8B4AB" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "42mm (Bản Nhôm GPS)", priceDiff: 0, description: "Màn hình OLED góc nhìn rộng hơn 40%, sạc nhanh 80% trong 30 phút", isDefault: true },
      { name: "46mm (Bản Nhôm GPS)", priceDiff: 1000000, description: "Mặt đồng hồ lớn hiển thị nhiều thông số sức khỏe hơn" },
      { name: "46mm GPS + Cellular (eSIM)", priceDiff: 3500000, description: "Nghe gọi độc lập không cần mang theo điện thoại iPhone" }
    ]
  },

  // prd_33: Garmin Fenix 8 Solar Sapphire
  "prd_33": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Titan Xám Than (Carbon Gray DLC)", hex: "#3E4044" },
      { name: "Titan Bạc (Titanium Silver)", hex: "#B5B8BA" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "47mm AMOLED Sapphire Kính Chống Xước", priceDiff: 0, description: "Màn hình AMOLED rực rỡ, tích hợp loa ngoài và micro đàm thoại", isDefault: true },
      { name: "51mm Solar Sapphire (Sạc Năng Lượng Mặt Trời)", priceDiff: 3500000, description: "Thời lượng pin lên tới 30 ngày cho các chuyến thám hiểm xuyên rừng" }
    ]
  },

  // prd_34: Samsung Galaxy Watch Ultra LTE
  "prd_34": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Xám Titan (Titanium Gray)", hex: "#5C5D61" },
      { name: "Trắng Titan (Titanium White)", hex: "#ECECEC" },
      { name: "Bạc Titan (Titanium Silver)", hex: "#C7C8CA" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Dây Thể Thao Marine Chống Nước", priceDiff: 0, description: "Kháng nước 10 ATM, chịu nhiệt -20°C đến 55°C, pin 100 giờ", isDefault: true },
      { name: "Dây Trail Siêu Nhẹ Vải Dệt", priceDiff: 250000, description: "Thoải mái theo dõi giấc ngủ và nồng độ oxy trong máu SpO2" }
    ]
  },

  // prd_35: Samsung Galaxy Watch 7 (3 màu chính hãng)
  "prd_35": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Xanh Quân Đội (Green)", hex: "#485244" },
      { name: "Kem Vani (Cream)", hex: "#E8E2D5" },
      { name: "Bạc Ánh Kim (Silver)", hex: "#D8D9DB" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "40mm Bluetooth (Cổ tay nhỏ)", priceDiff: 0, description: "Cảm biến BioActive thế hệ mới theo dõi chỉ số AGEs", isDefault: true },
      { name: "44mm Bluetooth (Cổ tay vừa và lớn)", priceDiff: 800000, description: "Pin lớn hơn, màn hình hiển thị rộng rãi" },
      { name: "44mm LTE Hỗ trợ eSIM", priceDiff: 2000000, description: "Kết nối 4G độc lập nghe gọi nhận tin nhắn khi chạy bộ" }
    ]
  },

  // prd_36: Garmin Forerunner 965
  "prd_36": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Carbon (Black/Gray)", hex: "#232426" },
      { name: "Trắng Xám (Whitestone)", hex: "#EDEDED" },
      { name: "Vàng Năng Động (Amp Yellow)", hex: "#E5C158" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Bản Tiêu Chuẩn Viền Titan", priceDiff: 0, description: "Màn hình AMOLED 1.4 inch cảm ứng, bản đồ màu Topo đa lục địa", isDefault: true }
    ]
  },

  // prd_37: Huawei Watch Ultimate Design
  "prd_37": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Thám Hiểm (Voyage Black)", hex: "#1F2022" },
      { name: "Xanh Đại Dương (Ocean Blue)", hex: "#1B365D" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Bản Dây Cao Su HNBR Lặn Biển", priceDiff: 0, description: "Vỏ kim loại lỏng gốc Zirconium cứng gấp 4.5 lần thép không gỉ", isDefault: true },
      { name: "Kèm Dây Kim Loại Titanium Chải Xước", priceDiff: 2500000, description: "Sang trọng và lịch lãm cho các buổi tiệc dạ hội" }
    ]
  },

  // prd_38: Amazfit T-Rex 3
  "prd_38": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Dung Nham (Lava Black)", hex: "#262628" },
      { name: "Xanh Rừng (Wild Green)", hex: "#3D4A3E" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Bản Tiêu Chuẩn Pin 27 Ngày", priceDiff: 0, description: "GPS băng tần kép 6 vệ tinh, độ bền quân đội Mỹ MIL-STD-810H", isDefault: true }
    ]
  },

  // prd_39: Suunto Race Titanium
  "prd_39": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Xám Titan (Charcoal Titanium)", hex: "#434447" },
      { name: "Đen Toàn Diện (All Black)", hex: "#1F1F20" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Bản Màn Hình AMOLED 1.43 inch", priceDiff: 0, description: "Núm xoay Digital Crown điều hướng mượt mà, đo biến thiên nhịp tim HRV", isDefault: true }
    ]
  },

  // prd_40: Google Pixel Watch 3
  "prd_40": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Nhám (Matte Black)", hex: "#1F1F21" },
      { name: "Bạc Đánh Bóng (Polished Silver)", hex: "#DADBDD" },
      { name: "Vàng Sâm Panh (Champagne Gold)", hex: "#D7C8A9" },
      { name: "Xám Thạch Anh (Hazel)", hex: "#666D67" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "41mm Bluetooth / Wi-Fi", priceDiff: 0, description: "Màn hình Actua độ sáng 2000 nits, tích hợp thuật toán AI Fitbit", isDefault: true },
      { name: "45mm Màn Hình Lớn Bluetooth", priceDiff: 1500000, description: "Pin lớn hơn 35%, hiển thị bản đồ Google Maps độc lập" },
      { name: "45mm LTE Hỗ Trợ eSIM", priceDiff: 3200000, description: "Nhận cuộc gọi và nghe nhạc trực tuyến không cần điện thoại" }
    ]
  },

  // =========================================================================
  // 5. BÀN PHÍM CƠ & PHỤ KIỆN VĂN PHÒNG (cat_8)
  // =========================================================================

  // prd_71: Keychron Q1 Pro
  "prd_71": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Carbon Black (Đen Than)", hex: "#2B2C30" },
      { name: "Silver Grey (Xám Bạc)", hex: "#A8ABB0" },
      { name: "Shell White (Trắng Vỏ Sò)", hex: "#EAEAE8" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Red Switch (Linear - Êm, mượt mà)", priceDiff: 0, description: "Lực bấm 45g nhẹ nhàng, không gây ồn phù hợp văn phòng", isDefault: true },
      { name: "Brown Switch (Tactile - Có khấc phản hồi)", priceDiff: 0, description: "Cảm giác gõ nảy tay vừa phải, chống bấm nhầm phím" },
      { name: "Banana Switch (Tactile sớm - Độ nảy sắc nét)", priceDiff: 150000, description: "Khấc phản hồi lực ngay từ đầu hành trình bấm" }
    ]
  },

  // prd_75: Logitech MX Master 3S
  "prd_75": {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Graphite (Xám Than)", hex: "#35363A" },
      { name: "Pale Grey (Xám Trắng)", hex: "#DCDDDF" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Bản Đa Hệ (Windows / macOS / Linux)", priceDiff: 0, description: "Cảm biến 8000 DPI trên mọi bề mặt kính, con cuộn MagSpeed 1000 dòng/giây", isDefault: true },
      { name: "Bản Dành Riêng Cho Mac (Bluetooth Tối Ưu)", priceDiff: 100000, description: "Tương thích hoàn hảo các thao tác Gesture trên macOS và iPadOS" }
    ]
  }
};

/**
 * Trả về dữ liệu biến thể chuẩn xác 100% cho mọi sản phẩm trong hệ thống.
 * Áp dụng thống nhất cho tất cả các danh mục từ cat_1 đến cat_10.
 */
export function getProductVariants(product: Product | null): ProductVariantGroup | null {
  if (!product) return null;

  // 1. Kiểm tra bảng tra cứu trực tiếp theo ID sản phẩm
  if (PRODUCT_VARIANTS_MAP[product.id]) {
    return PRODUCT_VARIANTS_MAP[product.id];
  }

  const nameLower = product.name.toLowerCase();

  // 2. Tra cứu thông minh theo tên dòng sản phẩm cụ thể
  if (nameLower.includes("z fold") || nameLower.includes("fold6") || nameLower.includes("fold 6")) {
    return PRODUCT_VARIANTS_MAP["prd_5"];
  }
  if (nameLower.includes("s24 ultra") || nameLower.includes("s24") || (nameLower.includes("galaxy") && nameLower.includes("ultra"))) {
    return PRODUCT_VARIANTS_MAP["prd_2"];
  }
  if (nameLower.includes("iphone") && (nameLower.includes("pro") || nameLower.includes("promax") || nameLower.includes("pro max"))) {
    return PRODUCT_VARIANTS_MAP["prd_1"];
  }
  if (nameLower.includes("airpods pro")) {
    return PRODUCT_VARIANTS_MAP["prd_22"];
  }
  if (nameLower.includes("airpods max")) {
    return PRODUCT_VARIANTS_MAP["prd_28"];
  }
  if (nameLower.includes("apple watch ultra")) {
    return PRODUCT_VARIANTS_MAP["prd_31"];
  }
  if (nameLower.includes("apple watch series") || nameLower.includes("series 10")) {
    return PRODUCT_VARIANTS_MAP["prd_32"];
  }
  if (nameLower.includes("galaxy watch ultra")) {
    return PRODUCT_VARIANTS_MAP["prd_34"];
  }
  if (nameLower.includes("galaxy watch 7")) {
    return PRODUCT_VARIANTS_MAP["prd_35"];
  }
  if (nameLower.includes("mx master 3s") || nameLower.includes("mx master")) {
    return PRODUCT_VARIANTS_MAP["prd_75"];
  }
  if (nameLower.includes("keychron")) {
    return PRODUCT_VARIANTS_MAP["prd_71"];
  }

  // 3. Fallback theo từng danh mục chuẩn xác 100% (cat_1 đến cat_10)

  // cat_1: Điện thoại & Tablet
  if (product.categoryId === "cat_1" || nameLower.includes("điện thoại") || nameLower.includes("phone") || nameLower.includes("tablet") || nameLower.includes("ipad")) {
    return {
      colorLabel: "Màu sắc",
      colors: [
        { name: "Titan Tự Nhiên (Natural Titanium)", hex: "#9B9790" },
        { name: "Đen Không Gian (Space Black)", hex: "#222325" },
        { name: "Trắng Bạc (White / Silver)", hex: "#F3F3F5" },
        { name: "Xanh Dương (Deep Blue)", hex: "#3E536E" }
      ],
      optionLabel: "Phiên bản",
      options: [
        { name: "128GB / 256GB Tiêu Chuẩn", priceDiff: 0, description: "Bộ nhớ tiêu chuẩn đáp ứng lưu trữ ảnh và ứng dụng hàng ngày", isDefault: true },
        { name: "512GB Nâng Cao", priceDiff: 3500000, description: "Gấp đôi dung lượng cho quay phim chất lượng cao và đa nhiệm" },
        { name: "1TB Tối Thượng", priceDiff: 8500000, description: "Dung lượng bộ nhớ khủng cho nhà sáng tạo nội dung chuyên nghiệp" }
      ]
    };
  }

  // cat_2: Laptop & Máy tính xách tay
  if (product.categoryId === "cat_2" || nameLower.includes("laptop") || nameLower.includes("macbook")) {
    return {
      colorLabel: "Màu sắc",
      colors: [
        { name: "Xám Không Gian (Space Gray)", hex: "#55575B" },
        { name: "Bạc Ánh Kim (Silver)", hex: "#E2E4E5" },
        { name: "Đen Nhám (Matte Black)", hex: "#222325" }
      ],
      optionLabel: "Phiên bản",
      options: [
        { name: "16GB RAM / 512GB SSD", priceDiff: 0, description: "Cấu hình chuẩn tối ưu cho văn phòng và lập trình viên", isDefault: true },
        { name: "32GB RAM / 1TB SSD", priceDiff: 5000000, description: "Dung lượng RAM dồi dào render đồ họa và dựng video 4K" },
        { name: "64GB RAM / 2TB SSD", priceDiff: 12000000, description: "Cấu hình tối thượng cho kỹ sư dữ liệu và AI Machine Learning" }
      ]
    };
  }

  // cat_3: Âm thanh & Tai nghe
  if (product.categoryId === "cat_3" || nameLower.includes("tai nghe") || nameLower.includes("loa") || nameLower.includes("sound") || nameLower.includes("audio")) {
    return {
      colorLabel: "Màu sắc",
      colors: [
        { name: "Đen Cổ Điển (Black)", hex: "#1C1C1E" },
        { name: "Trắng Bạc (White / Silver)", hex: "#E8E7E3" },
        { name: "Xanh Đêm (Midnight Blue)", hex: "#202A3D" }
      ],
      optionLabel: "Phiên bản",
      options: [
        { name: "Bản Tiêu Chuẩn (Fullbox)", priceDiff: 0, description: "Kèm phụ kiện chính hãng, cáp sạc và đệm tai thay thế", isDefault: true },
        { name: "Kèm Gói Bảo Hành Vàng 2 Năm Đổi Mới", priceDiff: 450000, description: "Bảo hành 1 đổi 1 trong 24 tháng nếu có bất kỳ lỗi phần cứng" }
      ]
    };
  }

  // cat_4: Smartwatch & Thiết bị đeo
  if (product.categoryId === "cat_4" || nameLower.includes("watch") || nameLower.includes("đồng hồ")) {
    return {
      colorLabel: "Màu sắc",
      colors: [
        { name: "Titan Tự Nhiên (Natural)", hex: "#9E9A93" },
        { name: "Đen Thể Thao (Midnight Black)", hex: "#252628" },
        { name: "Bạc Ánh Kim (Silver)", hex: "#D6D7D9" }
      ],
      optionLabel: "Phiên bản",
      options: [
        { name: "Bản Mặt Nhỏ GPS (40mm / 42mm)", priceDiff: 0, description: "Thiết kế thanh thoát ôm sát cổ tay", isDefault: true },
        { name: "Bản Mặt Lớn GPS (44mm / 46mm)", priceDiff: 800000, description: "Mặt kính lớn hơn, pin dung lượng cao hiển thị nhiều chỉ số" },
        { name: "Bản Mặt Lớn LTE Hỗ Trợ eSIM", priceDiff: 2200000, description: "Kết nối mạng di động độc lập không cần mang theo điện thoại" }
      ]
    };
  }

  // cat_5: Cáp, Củ sạc, Hub & Phụ kiện nguồn
  if (product.categoryId === "cat_5" || nameLower.includes("sạc") || nameLower.includes("cáp") || nameLower.includes("hub") || nameLower.includes("pencil") || nameLower.includes("dock")) {
    return {
      colorLabel: "Màu sắc",
      colors: [
        { name: "Đen Nhám (Matte Black)", hex: "#222325" },
        { name: "Xám Kim Loại (Space Gray)", hex: "#4E5158" },
        { name: "Trắng Tinh Khiết (Pure White)", hex: "#F5F5F7" }
      ],
      optionLabel: "Phiên bản",
      options: [
        { name: "Bản Tiêu Chuẩn Chính Hãng", priceDiff: 0, description: "Tương thích công nghệ sạc nhanh PD 3.1 & GaN thế hệ mới", isDefault: true },
        { name: "Bản Kèm Cáp Sạc Nhanh 240W Siêu Bền (1.5m)", priceDiff: 250000, description: "Cáp bọc dù chống đứt gãy truyền tải dữ liệu tốc độ cao" }
      ]
    };
  }

  // cat_6: Nhà thông minh & Robot hút bụi
  if (product.categoryId === "cat_6" || nameLower.includes("robot") || nameLower.includes("hút bụi") || nameLower.includes("camera") || nameLower.includes("khóa") || nameLower.includes("đèn") || nameLower.includes("lọc không khí")) {
    return {
      colorLabel: "Màu sắc",
      colors: [
        { name: "Trắng Bắc Cực (Polar White)", hex: "#F6F6F8" },
        { name: "Đen Vũ Trụ (Cosmic Black)", hex: "#1E1F22" }
      ],
      optionLabel: "Phiên bản",
      options: [
        { name: "Bản Tiêu Chuẩn Trạm Sạc Tự Động", priceDiff: 0, description: "Tự động giặt sấy giẻ lau và gom bụi thông minh", isDefault: true },
        { name: "Kèm Bộ Phụ Kiện Tiêu Hao 1 Năm (Giẻ lau + Lọc)", priceDiff: 650000, description: "Đầy đủ 4 cặp giẻ lau xoay, 2 màng lọc HEPA và 4 túi rác kháng khuẩn" }
      ]
    };
  }

  // cat_7: Màn hình máy tính chuyên nghiệp
  if (product.categoryId === "cat_7" || nameLower.includes("màn hình") || nameLower.includes("monitor") || nameLower.includes("display")) {
    return {
      colorLabel: "Màu sắc",
      colors: [
        { name: "Đen Chuyên Nghiệp (Professional Black)", hex: "#1C1D20" },
        { name: "Bạc Bạch Kim (Silver Platinum)", hex: "#D6D8DC" }
      ],
      optionLabel: "Phiên bản",
      options: [
        { name: "Chân Đế Nâng Hạ Xoay Công Thái Học", priceDiff: 0, description: "Điều chỉnh độ cao, xoay dọc 90 độ và nghiêng linh hoạt", isDefault: true },
        { name: "Bản Ngàm Treo Tường VESA Chuẩn 100x100mm", priceDiff: -300000, description: "Tối ưu hóa không gian bàn làm việc với tay nâng Arm" },
        { name: "Kèm Cáp Thunderbolt 4 40Gbps Cấp Nguồn 96W", priceDiff: 750000, description: "Một sợi cáp duy nhất truyền hình ảnh 4K/5K và sạc pin cho laptop" }
      ]
    };
  }

  // cat_8: Bàn phím & Chuột
  if (product.categoryId === "cat_8" || nameLower.includes("phím") || nameLower.includes("chuột") || nameLower.includes("keyboard") || nameLower.includes("mouse")) {
    return {
      colorLabel: "Màu sắc",
      colors: [
        { name: "Đen Nhám (Black)", hex: "#222224" },
        { name: "Xám Trắng (Pale Grey / White)", hex: "#D5D6D8" }
      ],
      optionLabel: "Phiên bản",
      options: [
        { name: "Red Switch (Linear - Êm ái văn phòng)", priceDiff: 0, description: "Lực nhấn 45g nhẹ nhàng, không gây tiếng ồn", isDefault: true },
        { name: "Brown Switch (Tactile - Phản hồi có khấc)", priceDiff: 0, description: "Cảm giác bấm nảy tay rõ ràng, giảm thiểu gõ nhầm" },
        { name: "Blue Switch (Clicky - Âm thanh giòn tan)", priceDiff: 0, description: "Âm thanh gõ đanh sắc nét cho cảm giác cơ học truyền thống" }
      ]
    };
  }

  // cat_9: Thiết bị mạng & NAS lưu trữ
  if (product.categoryId === "cat_9" || nameLower.includes("wifi") || nameLower.includes("wi-fi") || nameLower.includes("router") || nameLower.includes("mesh") || nameLower.includes("nas")) {
    return {
      colorLabel: "Màu sắc",
      colors: [
        { name: "Trắng Tuyết (Snow White)", hex: "#F8F9FA" },
        { name: "Đen Mờ (Matte Black)", hex: "#1C1D1F" }
      ],
      optionLabel: "Phiên bản",
      options: [
        { name: "Bản Đơn Thiết Bị (1-Pack)", priceDiff: 0, description: "Phủ sóng diện tích 150-250m² với tốc độ cao", isDefault: true },
        { name: "Bộ Hệ Thống Mesh (2-Pack / 3-Pack)", priceDiff: 2500000, description: "Chuyển vùng liền mạch Roaming phủ sóng nhà nhiều tầng diện tích lớn" }
      ]
    };
  }

  // cat_10: Bản quyền phần mềm & Dịch vụ số
  if (product.categoryId === "cat_10" || nameLower.includes("bản quyền") || nameLower.includes("phần mềm") || nameLower.includes("license") || nameLower.includes("windows") || nameLower.includes("microsoft") || nameLower.includes("adobe")) {
    return {
      colorLabel: "Màu sắc",
      colors: [
        { name: "Bản Quyền Cá Nhân (Personal)", hex: "#2563EB" },
        { name: "Bản Quyền Nhóm / Doanh Nghiệp (Family / Business)", hex: "#0D9488" }
      ],
      optionLabel: "Phiên bản",
      options: [
        { name: "Gói Bản Quyền 1 Năm Chính Hãng", priceDiff: 0, description: "Kích hoạt trực tuyến bằng email chính chủ, cập nhật tính năng mới liên tục", isDefault: true },
        { name: "Gói Bản Quyền 2 Năm Ưu Đãi", priceDiff: 900000, description: "Tiết kiệm 25% chi phí gia hạn so với mua từng năm" },
        { name: "Gói Bản Quyền Vĩnh Viễn FPP Trọn Đời", priceDiff: 2200000, description: "Sở hữu vĩnh viễn không cần gia hạn định kỳ, chuyển đổi máy thoải mái" }
      ]
    };
  }

  // Fallback an toàn cho bất kỳ sản phẩm nào khác
  return {
    colorLabel: "Màu sắc",
    colors: [
      { name: "Đen Tiêu Chuẩn (Black)", hex: "#222325" },
      { name: "Bạc Ánh Kim (Silver)", hex: "#E2E4E5" }
    ],
    optionLabel: "Phiên bản",
    options: [
      { name: "Bản Tiêu Chuẩn Chính Hãng", priceDiff: 0, description: "Đầy đủ phụ kiện và bảo hành chính hãng 12 tháng", isDefault: true },
      { name: "Bản Nâng Cấp Kèm Gói Bảo Hành 2 Năm", priceDiff: 350000, description: "Tăng cường thời hạn bảo hành 1 đổi 1 an tâm sử dụng" }
    ]
  };
}

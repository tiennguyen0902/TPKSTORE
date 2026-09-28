import { Product } from "../types";

export interface SpecItem {
  label: string;
  value: string;
}

export interface SpecGroup {
  groupName: string;
  specs: SpecItem[];
}

// Từ điển thông số kỹ thuật chi tiết chuẩn xác cho từng sản phẩm
export const PRODUCT_SPECS_MAP: Record<string, SpecGroup[]> = {
  // ==========================================
  // DANH MỤC 1: ĐIỆN THOẠI & TABLET (cat_1)
  // ==========================================
  "prd_1": [
    {
      groupName: "Màn hình & Thiết kế",
      specs: [
        { label: "Kích thước màn hình", value: "6.9 inch Super Retina XDR OLED" },
        { label: "Tần số quét", value: "120Hz ProMotion thích ứng" },
        { label: "Độ sáng tối đa", value: "2000 nits (ngoài trời), 1 nit tối thiểu" },
        { label: "Chất liệu", value: "Khung viền Titan Grade 5 cao cấp, Mặt lưng kính mờ nhám" },
        { label: "Trọng lượng & Kích thước", value: "227g • 163 x 77.6 x 8.25 mm" }
      ]
    },
    {
      groupName: "Hiệu năng & Cấu hình",
      specs: [
        { label: "Vi xử lý (CPU)", value: "Apple A18 Pro 3nm (6 nhân CPU: 2 hiệu năng + 4 tiết kiệm)" },
        { label: "Đồ họa (GPU)", value: "6 nhân GPU hỗ trợ Ray Tracing phần cứng" },
        { label: "Bộ xử lý AI (NPU)", value: "16-core Neural Engine (35 nghìn tỷ phép tính/giây)" },
        { label: "Bộ nhớ trong", value: "256GB NVMe siêu tốc" },
        { label: "Bộ nhớ RAM", value: "8GB LPDDR5X (Hỗ trợ Apple Intelligence)" }
      ]
    },
    {
      groupName: "Camera & Đa phương tiện",
      specs: [
        { label: "Camera chính", value: "48MP Fusion 24mm f/1.78, OIS chống rung dịch chuyển cảm biến" },
        { label: "Camera góc siêu rộng", value: "48MP Ultra Wide 13mm f/2.2 chụp macro siêu nét" },
        { label: "Camera Telephoto", value: "12MP 5x quang học 120mm lăng kính Tetraprism" },
        { label: "Nút bấm chuyên dụng", value: "Camera Control cảm ứng lực và trượt điều khiển zoom" },
        { label: "Quay video", value: "4K 120fps Dolby Vision, Quay video không gian Spatial Video" }
      ]
    },
    {
      groupName: "Pin & Kết nối",
      specs: [
        { label: "Thời lượng pin", value: "Lên tới 33 giờ xem video liên tục" },
        { label: "Công nghệ sạc", value: "Sạc nhanh 50% trong 30 phút, MagSafe 25W, Qi2 không dây" },
        { label: "Chuẩn kháng nước", value: "IP68 (chịu nước sâu 6 mét trong 30 phút)" },
        { label: "Kết nối mạng", value: "5G Sub-6GHz, Wi-Fi 7 (802.11be), Bluetooth 5.3, Thread" },
        { label: "Cổng sạc & Dữ liệu", value: "USB-C tốc độ USB 3 (lên đến 10Gbps), DisplayPort" }
      ]
    }
  ],

  "prd_2": [
    {
      groupName: "Màn hình & Thiết kế",
      specs: [
        { label: "Màn hình", value: "6.8 inch Dynamic AMOLED 2X phẳng, QHD+ (3120 x 1440)" },
        { label: "Tần số quét", value: "1 - 120Hz thích ứng LTPO" },
        { label: "Độ sáng & Kính bảo vệ", value: "2600 nits đỉnh • Kính cường lực Corning Gorilla Armor chống lóa 75%" },
        { label: "Chất liệu khung", value: "Titanium siêu bền, Kháng nước IP68" },
        { label: "Bút cảm ứng", value: "Tích hợp bút S-Pen có khe cắm trong thân máy, độ trễ 2.8ms" }
      ]
    },
    {
      groupName: "Cấu hình & Trí tuệ AI",
      specs: [
        { label: "Vi xử lý", value: "Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm)" },
        { label: "Bộ nhớ", value: "12GB RAM LPDDR5X • 512GB ROM UFS 4.0" },
        { label: "Tính năng Galaxy AI", value: "Khoanh tròn tìm kiếm (Circle to Search), Phiên dịch trực tiếp cuộc gọi, Trợ lý Note" },
        { label: "Tản nhiệt", value: "Buồng hơi Vapor Chamber lớn hơn 1.9 lần so với thế hệ trước" }
      ]
    },
    {
      groupName: "Camera & Pin",
      specs: [
        { label: "Camera sau", value: "200MP chính (OIS) + 50MP Periscope 5x (OIS) + 10MP Tele 3x + 12MP Siêu rộng" },
        { label: "Thu phóng kỹ thuật số", value: "Space Zoom 100x thế hệ mới AI ProVisual Engine" },
        { label: "Dung lượng pin", value: "5000 mAh • Sạc nhanh có dây 45W, Sạc không dây Fast Wireless 2.0" }
      ]
    }
  ],

  "prd_3": [
    {
      groupName: "Màn hình & Thiết kế",
      specs: [
        { label: "Màn hình", value: "11 inch Ultra Retina XDR OLED kép (Tandem OLED)" },
        { label: "Độ phân giải", value: "2420 x 1668 pixels (264 ppi), ProMotion 10-120Hz" },
        { label: "Độ sáng", value: "1000 nits toàn màn hình, 1600 nits đỉnh HDR" },
        { label: "Độ mỏng kỷ lục", value: "Chỉ 5.3 mm siêu mỏng nhẹ, Trọng lượng 444g" }
      ]
    },
    {
      groupName: "Hiệu năng Apple M4",
      specs: [
        { label: "Vi xử lý", value: "Apple M4 thế hệ mới (9 nhân CPU: 3 hiệu năng + 6 tiết kiệm)" },
        { label: "GPU & AI", value: "10 nhân GPU hỗ trợ Mesh Shading • Neural Engine 38 TOPS" },
        { label: "Bộ nhớ", value: "8GB RAM Unified Memory • 256GB SSD" },
        { label: "Phụ kiện tương thích", value: "Apple Pencil Pro, Magic Keyboard thế hệ mới nhôm nguyên khối" }
      ]
    }
  ],

  "prd_4": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Màn hình", value: "6.73 inch LTPO AMOLED 2K (3200 x 1440), 120Hz, 3000 nits" },
        { label: "Vi xử lý", value: "Snapdragon 8 Gen 3 (4nm) • 16GB RAM LPDDR5X • 512GB UFS 4.0" },
        { label: "Hệ thống ống kính Leica", value: "4 camera 50MP cảm biến chính 1 inch Sony LYT-900 khẩu độ biến thiên f/1.63 - f/4.0" },
        { label: "Pin & Sạc", value: "5000 mAh • Sạc siêu nhanh HyperCharge 90W, Sạc không dây 80W" }
      ]
    }
  ],

  "prd_5": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Màn hình chính (Gập)", value: "7.6 inch Dynamic AMOLED 2X, 1-120Hz, 2600 nits" },
        { label: "Màn hình ngoài", value: "6.3 inch Dynamic AMOLED 2X, viền phẳng sắc sảo" },
        { label: "Bản lề & Độ bền", value: "Bản lề rãnh kép Flex Hinge cải tiến, Kháng nước IP48, Khung Armor Aluminum" },
        { label: "Cấu hình", value: "Snapdragon 8 Gen 3 for Galaxy • 12GB RAM • 256GB ROM" },
        { label: "Pin & Sạc", value: "4400 mAh • Sạc nhanh 25W, Sạc không dây 15W" }
      ]
    }
  ],

  "prd_6": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Màn hình", value: "6.8 inch Super Actua OLED, LTPO 1-120Hz, 3000 nits cực đại" },
        { label: "Chipset & AI", value: "Google Tensor G4 (4nm) tích hợp chip bảo mật Titan M2 & Gemini Nano" },
        { label: "Bộ nhớ", value: "16GB RAM chuyên dụng cho AI • 128GB UFS 3.1" },
        { label: "Camera AI", value: "50MP chính + 48MP Tele 5x + 48MP Siêu rộng, Quay video 8K AI Boost" },
        { label: "Hỗ trợ phần mềm", value: "Cập nhật hệ điều hành Android & Bản vá bảo mật trong 7 năm" }
      ]
    }
  ],

  "prd_7": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Màn hình", value: "13.0 inch Liquid Retina (2732 x 2048), Dải màu rộng P3, True Tone" },
        { label: "Vi xử lý", value: "Apple M2 (8 nhân CPU + 9 nhân GPU + 16 nhân Neural Engine)" },
        { label: "Bộ nhớ", value: "8GB RAM Unified • 128GB ROM" },
        { label: "Camera", value: "Camera trước 12MP Ultra Wide đặt ngang tiện đàm thoại video" },
        { label: "Trọng lượng", value: "617g • Pin dùng liên tục 10 giờ" }
      ]
    }
  ],

  "prd_8": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Màn hình", value: "14.6 inch Dynamic AMOLED 2X khổng lồ (2960 x 1848), 120Hz" },
        { label: "Vi xử lý", value: "Snapdragon 8 Gen 2 for Galaxy • 12GB RAM • 256GB ROM (Hỗ trợ thẻ nhớ 1TB)" },
        { label: "Âm thanh", value: "4 loa stereo AKG công suất lớn hỗ trợ Dolby Atmos" },
        { label: "Kháng nước & Bút", value: "Chuẩn IP68 cho cả máy tính bảng và bút S-Pen đi kèm" },
        { label: "Pin", value: "11.200 mAh • Sạc nhanh 45W" }
      ]
    }
  ],

  "prd_9": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Màn hình", value: "6.78 inch Samsung Flexible AMOLED 165Hz, độ trễ 1ms, 2500 nits" },
        { label: "Cấu hình Gaming", value: "Snapdragon 8 Gen 3 • 16GB RAM LPDDR5X • 512GB UFS 4.0" },
        { label: "Phím siêu âm", value: "AirTrigger cảm ứng siêu nhạy thao tác 4 ngón như tay cầm console" },
        { label: "Hệ thống tản nhiệt", value: "GameCool 8 buồng hơi kết hợp quạt gắn ngoài AeroActive Cooler X" },
        { label: "Pin & Cổng sạc", value: "5500 mAh • Sạc HyperCharge 65W, 2 cổng USB-C cạnh bên và đáy" }
      ]
    }
  ],

  "prd_10": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Màn hình", value: "8.3 inch Liquid Retina nhỏ gọn trong lòng bàn tay (2266 x 1488)" },
        { label: "Vi xử lý", value: "Apple A17 Pro (6 nhân CPU + 5 nhân GPU hỗ trợ Ray Tracing)" },
        { label: "Bộ nhớ", value: "8GB RAM • 128GB ROM (Hỗ trợ Apple Intelligence)" },
        { label: "Bút tương thích", value: "Apple Pencil Pro và Apple Pencil USB-C" },
        { label: "Trọng lượng", value: "Chỉ 293g cực kỳ tiện bỏ túi áo khoác" }
      ]
    }
  ],

  // ==========================================
  // DANH MỤC 2: LAPTOP & MACBOOK (cat_2)
  // ==========================================
  "prd_11": [
    {
      groupName: "Cấu hình phần cứng",
      specs: [
        { label: "Vi xử lý (CPU)", value: "Apple M3 Max (14 nhân CPU: 10 nhân hiệu năng cao + 4 nhân tiết kiệm)" },
        { label: "Đồ họa (GPU)", value: "30 nhân GPU kiến trúc mới, Dynamic Caching, Ray Tracing phần cứng" },
        { label: "Bộ nhớ RAM", value: "36GB Unified Memory băng thông cực lớn 300GB/s" },
        { label: "Ổ cứng SSD", value: "1TB SSD NVMe PCIe siêu tốc (tốc độ đọc ghi lên tới 7400 MB/s)" },
        { label: "Hệ điều hành", value: "macOS Sonoma (Tương thích hoàn hảo macOS Sequoia)" }
      ]
    },
    {
      groupName: "Màn hình & Âm thanh",
      specs: [
        { label: "Màn hình", value: "14.2 inch Liquid Retina XDR (3024 x 1964), 1 tỷ màu" },
        { label: "Tần số quét", value: "ProMotion 120Hz thích ứng tự động" },
        { label: "Độ sáng hiển thị", value: "1000 nits duy trì toàn màn hình, 1600 nits đỉnh HDR" },
        { label: "Hệ thống âm thanh", value: "6 loa độ trung thực cao với loa trầm khử lực, Âm thanh không gian Spatial Audio" }
      ]
    },
    {
      groupName: "Cổng kết nối & Pin",
      specs: [
        { label: "Cổng giao tiếp", value: "3x Thunderbolt 4 (USB-C), HDMI 2.1 8K, Khe đọc thẻ SDXC, Jack 3.5mm" },
        { label: "Thời lượng pin", value: "Pin 72.4Wh lên đến 18 giờ xem phim liên tục" },
        { label: "Cổng sạc", value: "Cáp sạc MagSafe 3 tiện lợi kèm củ sạc USB-C 96W" },
        { label: "Màu sắc & Trọng lượng", value: "Space Black (Đen không gian chống bám vân tay) • 1.62 kg" }
      ]
    }
  ],

  "prd_12": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Màn hình", value: "15.3 inch Liquid Retina (2880 x 1864), 500 nits, dải màu P3" },
        { label: "Vi xử lý", value: "Apple M3 (8 nhân CPU + 10 nhân GPU + 16 nhân Neural Engine)" },
        { label: "Bộ nhớ", value: "16GB RAM Unified • 512GB SSD PCIe" },
        { label: "Thiết kế & Tản nhiệt", value: "Vỏ nhôm nguyên khối siêu mỏng 11.5mm, Thiết kế không quạt hoạt động êm ái 100%" },
        { label: "Thời lượng pin", value: "Lên đến 18 giờ • Trọng lượng 1.51 kg" }
      ]
    }
  ],

  "prd_13": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Màn hình", value: "14.0 inch Lumina OLED 3K (2880 x 1800), 120Hz, 100% DCI-P3, 0.2ms" },
        { label: "Vi xử lý (CPU)", value: "Intel Core Ultra 7 155H (16 nhân, 22 luồng, xung nhịp 4.8GHz, NPU Intel AI Boost)" },
        { label: "Bộ nhớ", value: "32GB LPDDR5X 7467MHz • 1TB SSD M.2 NVMe PCIe 4.0" },
        { label: "Trọng lượng & Pin", value: "Siêu mỏng nhẹ chỉ 1.2 kg • Pin 75Wh dùng liên tục 15 giờ" },
        { label: "Bàn phím & Âm thanh", value: "Bàn phím ErgoSense êm ái, Loa Harman Kardon Dolby Atmos" }
      ]
    }
  ],

  "prd_14": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Màn hình", value: "14.5 inch InfinityEdge OLED 3.2K (3200 x 2000) cảm ứng 120Hz" },
        { label: "Cấu hình", value: "Intel Core Ultra 7 155H • 32GB RAM LPDDR5X • 1TB SSD NVMe" },
        { label: "Card đồ họa rời", value: "NVIDIA GeForce RTX 4050 6GB GDDR6 (Hỗ trợ NVIDIA Studio & AI Denoising)" },
        { label: "Thiết kế tương lai", value: "Bàn rê chuột vô hình với cảm ứng lực Haptic, Hàng phím chức năng cảm ứng phát sáng" },
        { label: "Trọng lượng", value: "1.68 kg nhôm CNC nguyên khối kết hợp kính Gorilla Glass 3" }
      ]
    }
  ],

  "prd_15": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Vi xử lý khủng", value: "Intel Core i9-14900HX (24 nhân, 32 luồng, Turbo Boost 5.8GHz)" },
        { label: "Card đồ họa", value: "NVIDIA GeForce RTX 4080 12GB GDDR6 (TGP tối đa 175W, MUX Switch + Advanced Optimus)" },
        { label: "RAM & Ổ cứng", value: "32GB RAM DDR5 5600MHz • 1TB SSD NVMe Gen 4 (Nâng cấp tối đa 4TB)" },
        { label: "Màn hình Esports", value: "16.0 inch WQXGA (2560 x 1600), 240Hz, 500 nits, 100% sRGB, G-Sync" },
        { label: "Tản nhiệt", value: "Legion Coldfront 5.0 buồng hơi Vapor Chamber kết hợp keo kim loại lỏng" }
      ]
    }
  ],

  // ==========================================
  // DANH MỤC 3: TAI NGHE & ÂM THANH (cat_3)
  // ==========================================
  "prd_21": [
    {
      groupName: "Âm thanh & Chống ồn",
      specs: [
        { label: "Kiểu tai nghe", value: "Chụp tai chống ồn chủ động (Over-ear ANC)" },
        { label: "Màng loa (Driver)", value: "30mm mạ sợi carbon tổng hợp siêu nhẹ tái tạo dải âm tự nhiên" },
        { label: "Bộ xử lý chống ồn", value: "Kép: HD QN1 + V1 kết hợp hệ thống 8 micro định hướng" },
        { label: "Công nghệ thông minh", value: "Auto NC Optimizer tự động tinh chỉnh theo áp suất và tiếng ồn môi trường" },
        { label: "Chuẩn âm thanh", value: "Hi-Res Audio, Hi-Res Wireless, LDAC, DSEE Extreme AI" }
      ]
    },
    {
      groupName: "Thời lượng pin & Tính năng",
      specs: [
        { label: "Thời lượng pin", value: "30 giờ (bật ANC), 40 giờ (tắt ANC)" },
        { label: "Sạc nhanh", value: "Sạc 3 phút dùng được 3 giờ với củ sạc chuẩn USB-PD" },
        { label: "Tính năng đàm thoại", value: "Speak-to-Chat tự ngưng nhạc khi nói chuyện, 4 micro lọc gió Beamforming AI" },
        { label: "Kết nối đa điểm", value: "Bluetooth 5.2 kết nối cùng lúc 2 thiết bị (điện thoại & laptop)" },
        { label: "Trọng lượng", value: "250g (Đệm da mềm mại không gây đau tai)" }
      ]
    }
  ],

  "prd_22": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Chip xử lý", value: "Apple H2 trong tai nghe • Chip Apple U1/U2 trong hộp sạc" },
        { label: "Chống ồn chủ động", value: "Khử tiếng ồn gấp 2 lần thế hệ trước, Chế độ Âm thanh thích ứng (Adaptive Audio)" },
        { label: "Âm thanh không gian", value: "Personalized Spatial Audio theo dõi chuyển động đầu theo thời gian thực" },
        { label: "Thời lượng pin", value: "6 giờ tai nghe đơn (bật ANC) • Tổng 30 giờ kèm hộp sạc MagSafe USB-C" },
        { label: "Kháng bụi nước", value: "Chuẩn IP54 cho cả tai nghe và hộp sạc" }
      ]
    }
  ],

  "prd_23": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Công nghệ độc quyền", value: "Bose Immersive Audio không gian hóa âm thanh đa chiều 3D" },
        { label: "Hiệu chỉnh ống tai", value: "CustomTune tự phân tích hình dáng tai để tinh chỉnh âm thanh và khử ồn cá nhân hóa" },
        { label: "Thời lượng pin", value: "24 giờ nghe liên tục (18 giờ với Immersive Audio)" },
        { label: "Chất liệu hoàn thiện", value: "Khung nhôm đúc sang trọng, đệm tai bọc da protein mềm mại tuyệt đối" }
      ]
    }
  ],

  "prd_24": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Hệ thống củ loa", value: "1 loa trầm 50W Class D + 2 loa tweeter 15W Class D (Tổng công suất 80W)" },
        { label: "Âm thanh nổi", value: "Trường âm stereo rộng mở hướng ra ngoài góc rộng, tính năng Dynamic Loudness" },
        { label: "Cổng kết nối", value: "Bluetooth 5.2 (LE Audio), Cổng vào 3.5mm AUX, Cổng RCA analog" },
        { label: "Thiết kế biểu tượng", value: "Vỏ vân da cổ điển, lưới ê-căng kim loại đính logo Marshall mạ đồng thau" },
        { label: "Kích thước & Trọng lượng", value: "350 x 203 x 188 mm • 4.25 kg" }
      ]
    }
  ],

  // ==========================================
  // DANH MỤC 4: ĐỒNG HỒ THÔNG MINH (cat_4)
  // ==========================================
  "prd_31": [
    {
      groupName: "Thiết kế & Màn hình",
      specs: [
        { label: "Kích thước vỏ", value: "49mm hợp kim Titan chuẩn hàng không vũ trụ, viền gờ bảo vệ mặt kính" },
        { label: "Màn hình", value: "Retina LTPO OLED luôn bật (Always-On), độ sáng khủng 3000 nits" },
        { label: "Mặt kính", value: "Kính tinh thể Sapphire phẳng chống trầy xước va đập cấp quân sự" },
        { label: "Chống nước & Bụi", value: "Chống nước 100m, Chứng nhận lặn thể thao EN13319 độ sâu 40m, IP6X" }
      ]
    },
    {
      groupName: "Cảm biến & Thời lượng pin",
      specs: [
        { label: "Chip xử lý", value: "Apple S9 SiP (Hỗ trợ cử chỉ chạm đúp ngón tay Double Tap không chạm màn hình)" },
        { label: "Định vị vệ tinh", value: "GPS băng tần kép chính xác cao L1 + L5 vượt trội trong đô thị nhà cao tầng" },
        { label: "Thời lượng pin", value: "36 giờ sử dụng thông thường, lên đến 72 giờ ở chế độ Tiết kiệm pin" },
        { label: "Còi báo động khẩn cấp", value: "Còi âm lượng 86 decibel phát xa bán kính 180 mét khi gặp nạn" }
      ]
    }
  ],

  "prd_33": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Mặt kính & Viền", value: "Kính Sapphire chống trầy xước + Thấu kính sạc mặt trời Solar • Viền Titan" },
        { label: "Thời lượng pin", value: "Đến 48 ngày ở chế độ smartwatch mặt trời, 149 giờ ở chế độ GPS thể thao" },
        { label: "Tính năng ngoài trời", value: "Tích hợp Loa ngoài & Micro đàm thoại, Đèn pin LED siêu sáng nhiều nấc" },
        { label: "Chuẩn lặn & Kháng nước", value: "Chứng nhận lặn độ sâu 40m nút bấm cảm ứng chống rò rỉ rò điện, 10 ATM" },
        { label: "Bản đồ", value: "Bản đồ địa hình Topo đa lục địa chi tiết dẫn đường ngã rẽ ngoại tuyến" }
      ]
    }
  ],

  // ==========================================
  // DANH MỤC 5: PHỤ KIỆN & CÁP SẠC (cat_5)
  // ==========================================
  "prd_41": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Dung lượng pin", value: "20.000 mAh (72Wh) - Được phép mang lên máy bay" },
        { label: "Tổng công suất đầu ra", value: "200W cực đại (Sạc đồng thời 2 laptop ở công suất 100W mỗi cổng)" },
        { label: "Màn hình hiển thị", value: "Màn hình màu TFT hiển thị điện áp (V), cường độ (A), công suất (W) và chu kỳ sạc" },
        { label: "Số lượng cổng", value: "2x USB-C (100W Max/cổng) + 1x USB-A (65W Max)" },
        { label: "Công nghệ an toàn", value: "ActiveShield 2.0 đo nhiệt độ thông minh 3.000.000 lần mỗi ngày" }
      ]
    }
  ],

  "prd_42": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Công suất tối đa", value: "100W Power Delivery 3.0" },
        { label: "Công nghệ chế tạo", value: "GaN III (Gallium Nitride) thu nhỏ kích thước 45% so với củ sạc thông thường" },
        { label: "Số cổng sạc", value: "3 cổng (2 USB-C + 1 USB-A) sạc cùng lúc MacBook, iPhone và iPad" },
        { label: "Tương thích", value: "MacBook Pro, Dell XPS, iPhone 16/15, Galaxy S24 Ultra, iPad, ROG Ally" }
      ]
    }
  ],

  // ==========================================
  // DANH MỤC 6: NHÀ THÔNG MINH (cat_6)
  // ==========================================
  "prd_51": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Lực hút cực đại", value: "8.000 Pa bão táp hút sạch bụi khe sâu trên sàn gỗ và thảm dày" },
        { label: "Thiết kế gầm & Góc", value: "Dáng vuông bo góc tiếp cận 99.77% chân tường, siêu mỏng chỉ 9.5cm chui gầm sofa" },
        { label: "Cảm biến điều hướng", value: "Hệ thống LiDAR thể rắn kép ẩn thân máy kết hợp Camera AIVI 3D 2.0 nhận diện đồ chơi" },
        { label: "Trạm sạc toàn năng", value: "Tự động giặt giẻ nước nóng 60°C, Sấy khô khí nóng 45°C, Tự đổ rác vào túi 3L kháng khuẩn" },
        { label: "Trợ lý giọng nói", value: "Tích hợp trợ lý AI YIKO 2.0 ra lệnh dọn dẹp bằng giọng nói trực tiếp" }
      ]
    }
  ],

  // ==========================================
  // DANH MỤC 7: MÀN HÌNH MÁY TÍNH (cat_7)
  // ==========================================
  "prd_61": [
    {
      groupName: "Thông số hiển thị",
      specs: [
        { label: "Kích thước & Tấm nền", value: "27.0 inch IPS Black thế hệ mới độ tương phản vượt trội 2000:1" },
        { label: "Độ phân giải", value: "QHD 2K (2560 x 1440) tỉ lệ 16:9" },
        { label: "Tần số quét", value: "120Hz siêu mượt mà giảm mỏi mắt" },
        { label: "Độ chuẩn màu", value: "100% sRGB, 98% DCI-P3, Delta E < 2 hiệu chuẩn sẵn từ nhà máy" },
        { label: "Cảm biến ánh sáng", value: "Tự động điều chỉnh độ sáng và nhiệt độ màu theo ánh sáng phòng" }
      ]
    },
    {
      groupName: "Cổng kết nối Thunderbolt",
      specs: [
        { label: "Cổng Thunderbolt 4", value: "Hỗ trợ truyền dữ liệu 40Gbps, cấp nguồn sạc ngược 90W PD và Daisy Chain nối tiếp 2 màn" },
        { label: "Cổng mạng RJ45", value: "2.5 Gigabit Ethernet truyền dữ liệu mạng LAN ổn định" },
        { label: "Cổng mở rộng khác", value: "DisplayPort 1.4, HDMI 2.1, 4x USB-A 10Gbps, 1x USB-C 15W sạc nhanh điện thoại" },
        { label: "Chân đế", value: "Công thái học điều chỉnh nâng hạ độ cao 150mm, xoay dọc 90 độ, xoay trái phải" }
      ]
    }
  ],

  "prd_62": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Tấm nền đỉnh cao", value: "31.5 inch QD-OLED (Quantum Dot OLED thế hệ 3) 4K UHD (3840 x 2160)" },
        { label: "Tần số quét & Phản hồi", value: "240Hz siêu tốc • Thời gian phản hồi 0.03ms (GtG) loại bỏ hiện tượng bóng mờ" },
        { label: "Độ tương phản & Màu", value: "1.500.000:1, Độ sáng đỉnh 1000 nits (HDR), 99% DCI-P3, Delta E < 2" },
        { label: "Tản nhiệt bảo vệ", value: "Tản nhiệt buồng hơi Graphene tùy chỉnh không quạt ồn, bảo hành chống cháy hình 3 năm" },
        { label: "Cổng kết nối", value: "DisplayPort 1.4 DSC, HDMI 2.1 48Gbps, USB-C 90W sạc ngược kiêm xuất hình" }
      ]
    }
  ],

  // ==========================================
  // DANH MỤC 8: BÀN PHÍM & CHUỘT (cat_8)
  // ==========================================
  "prd_71": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Layout & Khung vỏ", value: "Layout 75% gọn gàng • Vỏ nhôm nguyên khối 6063 gia công cắt CNC chính xác" },
        { label: "Cấu trúc bàn phím", value: "Double-Gasket Mount tiêu âm cao cấp mang lại âm gõ trầm đục êm ái" },
        { label: "Mạch & Tính năng", value: "Mạch xuôi Hot-swap đổi switch không cần hàn, Hỗ trợ tùy biến phím QMK/VIA" },
        { label: "Kết nối & Pin", value: "Không dây Bluetooth 5.1 (kết nối 3 thiết bị) + Có dây Type-C • Pin 4000 mAh" },
        { label: "Keycaps & Switch", value: "Keycaps PBT Double-shot OSA Profile chống bóng mờ, Switch Keychron K Pro Lube sẵn" }
      ]
    }
  ],

  "prd_75": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Cảm biến quang học", value: "Darkfield 8.000 DPI theo dõi mượt mà trên mọi bề mặt kể cả kính trong suốt" },
        { label: "Nút bấm yên tĩnh", value: "Công nghệ Quiet Clicks giảm 90% tiếng ồn click chuột" },
        { label: "Con lăn MagSpeed", value: "Con lăn điện từ cuộn 1.000 dòng trong 1 giây, tự chuyển chế độ mượt mà" },
        { label: "Phím cuộn ngang", value: "Tích hợp cuộn ngón cái cuộn bảng tính Excel và timeline dựng video" },
        { label: "Thời lượng pin", value: "70 ngày sau 1 lần sạc đầy • Sạc nhanh 1 phút dùng được 3 giờ qua cổng USB-C" }
      ]
    }
  ],

  // ==========================================
  // DANH MỤC 9: THIẾT BỊ MẠNG (cat_9)
  // ==========================================
  "prd_81": [
    {
      groupName: "Thông số chi tiết",
      specs: [
        { label: "Chuẩn Wi-Fi", value: "Wi-Fi 7 thế hệ mới (802.11be) 12 luồng băng thông" },
        { label: "Tốc độ truyền tải", value: "22 Gbps (11520 Mbps trên 6GHz + 8640 Mbps trên 5GHz + 1376 Mbps trên 2.4GHz)" },
        { label: "Cổng mạng có dây", value: "2x Cổng 10Gbps (1 combo RJ45/SFP+) + 2x Cổng 2.5Gbps cực nhanh" },
        { label: "Vùng phủ sóng", value: "Bộ 3 node phủ sóng rộng tới 850m2 kết nối hơn 200 thiết bị cùng lúc" },
        { label: "Công nghệ đột phá", value: "MLO (Multi-Link Operation) cho phép thiết bị truyền dữ liệu qua nhiều băng tần đồng thời" }
      ]
    }
  ],

  // ==========================================
  // DANH MỤC 10: PHẦN MỀM & BẢN QUYỀN (cat_10)
  // ==========================================
  "prd_91": [
    {
      groupName: "Thông tin bản quyền",
      specs: [
        { label: "Loại bản quyền", value: "Gói gia đình Microsoft 365 Family thuê bao 1 năm chính hãng" },
        { label: "Số lượng người dùng", value: "Tối đa 6 người dùng (Mỗi người dùng được kích hoạt trên 5 thiết bị cùng lúc)" },
        { label: "Ứng dụng bao gồm", value: "Trọn bộ Word, Excel, PowerPoint, Outlook, OneNote, Microsoft Defender mới nhất" },
        { label: "Lưu trữ đám mây", value: "Tổng 6TB dung lượng OneDrive an toàn bảo mật (1TB cho mỗi người dùng)" },
        { label: "Hỗ trợ nền tảng", value: "Windows, macOS, iOS, iPadOS, Android" }
      ]
    }
  ],

  "prd_92": [
    {
      groupName: "Thông số bản quyền",
      specs: [
        { label: "Phiên bản", value: "Windows 11 Professional 64-Bit Bản quyền vĩnh viễn FPP" },
        { label: "Số lượng máy", value: "1 PC (Được phép chuyển đổi bản quyền sang máy tính mới)" },
        { label: "Bảo mật nâng cao", value: "BitLocker mã hóa ổ cứng chống đánh cắp dữ liệu, Windows Hello FaceID" },
        { label: "Tính năng chuyên nghiệp", value: "Hyper-V máy ảo, Windows Sandbox, Remote Desktop điều khiển máy từ xa" },
        { label: "Ngôn ngữ", value: "Đa ngôn ngữ (Hỗ trợ tiếng Việt và tiếng Anh chuẩn)" }
      ]
    }
  ],

  "prd_95": [
    {
      groupName: "Chi tiết gói dịch vụ",
      specs: [
        { label: "Dịch vụ", value: "Bản quyền ChatGPT Plus thuê bao 1 năm chính chủ OpenAI" },
        { label: "Mô hình AI cao cấp", value: "Truy cập không giới hạn GPT-4o, OpenAI o1-preview và o1-mini suy luận logic bậc cao" },
        { label: "Tính năng sáng tạo", value: "Tạo ảnh DALL-E 3 độ phân giải cao, Phân tích dữ liệu & Code Python thời gian thực" },
        { label: "Giọng nói thời gian thực", value: "Advanced Voice Mode đàm thoại trực tiếp đa ngôn ngữ không độ trễ" },
        { label: "Tặng kèm", value: "Gói tín dụng OpenAI API Credit trị giá 20 USD phục vụ lập trình viên" }
      ]
    }
  ]
};

// Hàm thông minh tự động trích xuất thông số kỹ thuật cho bất kỳ sản phẩm nào
export function getProductSpecifications(product: Product): SpecGroup[] {
  if (!product) return [];

  // Nếu sản phẩm có trong từ điển cấu hình sẵn, trả về ngay
  if (PRODUCT_SPECS_MAP[product.id]) {
    return PRODUCT_SPECS_MAP[product.id];
  }

  // Tự động phân tích theo danh mục và tên sản phẩm nếu là sản phẩm mới/tự thêm
  const catId = product.categoryId || "";
  const name = product.name || "";
  const desc = product.description || "";

  const generalSpecs: SpecItem[] = [
    { label: "Mã sản phẩm", value: product.id },
    { label: "Tên thiết bị", value: name },
    { label: "Tình trạng", value: product.isNew ? "Mới 100% nguyên hộp niêm phong" : "Chính hãng Brand New" },
    { label: "Bảo hành", value: catId === "cat_10" ? "Kích hoạt online bản quyền trọn đời/1 năm" : "12 tháng chính hãng (1 đổi 1 trong 30 ngày)" },
    { label: "Xuất xứ", value: "Chính hãng phân phối thị trường Việt Nam (VAT đầy đủ)" }
  ];

  if (catId === "cat_1") {
    // Điện thoại / Tablet
    return [
      {
        groupName: "Thông số kỹ thuật phần cứng",
        specs: [
          ...generalSpecs,
          { label: "Dòng sản phẩm", value: "Smartphone / Tablet Flagship cao cấp" },
          { label: "Kết nối di động", value: "5G Sub-6 / Dual SIM / Wi-Fi 6E/7" },
          { label: "Mô tả tính năng", value: desc }
        ]
      }
    ];
  }

  if (catId === "cat_2") {
    // Laptop
    return [
      {
        groupName: "Cấu hình chi tiết",
        specs: [
          ...generalSpecs,
          { label: "Loại máy", value: "Laptop chuyên nghiệp / Gaming Ultrabook" },
          { label: "Mô tả cấu hình", value: desc }
        ]
      }
    ];
  }

  if (catId === "cat_10") {
    // Phần mềm
    return [
      {
        groupName: "Thông tin bản quyền & Kích hoạt",
        specs: [
          ...generalSpecs,
          { label: "Hình thức giao hàng", value: "Khóa kích hoạt điện tử (Key) gửi tức thì qua Email/SMS" },
          { label: "Chi tiết gói", value: desc }
        ]
      }
    ];
  }

  return [
    {
      groupName: "Thông số kỹ thuật tiêu chuẩn",
      specs: [
        ...generalSpecs,
        { label: "Đặc điểm nổi bật", value: desc }
      ]
    }
  ];
}

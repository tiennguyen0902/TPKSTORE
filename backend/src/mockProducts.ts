import { Product } from "./mockData";

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // DANH MỤC 1: ĐIỆN THOẠI & TABLET (cat_1) - 10 THIẾT BỊ
  // ==========================================
  {
    id: "prd_1",
    name: "iPhone 16 Pro Max 256GB Titan Sa Mạc",
    slug: "iphone-16-pro-max-256gb-titan-sa-mac",
    description: "Siêu phẩm flagship Apple với khung viền Titan Grade 5 siêu bền, chip Apple A18 Pro 3nm mạnh mẽ bậc nhất, nút điều khiển camera Camera Control chuyên dụng và hệ thống Apple Intelligence tối tân.",
    price: 34990000,
    originalPrice: 37990000,
    stock: 25,
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 148,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_1",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_2",
    name: "Samsung Galaxy S24 Ultra 5G AI Phone (12GB/512GB)",
    slug: "samsung-galaxy-s24-ultra-5g-ai-phone",
    description: "Quyền năng Galaxy AI đỉnh cao với phiên dịch cuộc gọi trực tiếp, trợ lý Note quyền năng, khung viền titan siêu bền, camera zoom quang học 100x và bút S-Pen tích hợp.",
    price: 31990000,
    originalPrice: 34990000,
    stock: 20,
    thumbnail: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 96,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_1",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_3",
    name: "iPad Pro M4 11 inch Ultra Retina XDR OLED (256GB Wi-Fi)",
    slug: "ipad-pro-m4-11-inch-oled",
    description: "Độ mỏng kỷ lục 5.3mm, màn hình kép Tandem OLED rực rỡ đột phá, sức mạnh chip Apple M4 với công cụ AI Neural Engine 38 nghìn tỷ phép tính/giây xử lý đồ họa 3D và render 4K chuyên nghiệp.",
    price: 27990000,
    originalPrice: 29990000,
    stock: 18,
    thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 92,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_1",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_4",
    name: "Xiaomi 14 Ultra 5G Leica Quad Camera (16GB/512GB)",
    slug: "xiaomi-14-ultra-5g-leica",
    description: "Hệ thống 4 ống kính quang học Leica Summilux đỉnh cao, cảm biến 1 inch thế hệ mới LYT-900, chip Snapdragon 8 Gen 3 kết hợp thuật toán AI Ultra Raw, màn hình AMOLED 2K 120Hz độ sáng 3000 nits.",
    price: 26990000,
    originalPrice: 29990000,
    stock: 15,
    thumbnail: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 65,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_1",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_5",
    name: "Samsung Galaxy Z Fold6 5G AI Foldable (12GB/256GB)",
    slug: "samsung-galaxy-z-fold6-5g-ai",
    description: "Màn hình gập Dynamic AMOLED 2X 7.6 inch, thiết kế bản lề FlexHinge siêu mỏng bền bỉ, tích hợp Galaxy AI phiên dịch hai chiều song song trên 2 màn hình, ghi chú thông minh Note Assist.",
    price: 41990000,
    originalPrice: 44990000,
    stock: 12,
    thumbnail: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 54,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_1",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_6",
    name: "Google Pixel 9 Pro XL AI Tensor G4 (16GB/128GB)",
    slug: "google-pixel-9-pro-xl-ai",
    description: "Siêu phẩm thuần Google tích hợp Gemini Nano AI trực tiếp trên phần cứng, camera chụp thiếu sáng Night Sight AI xuất sắc, chỉnh sửa ảnh ma thuật Magic Editor, hỗ trợ cập nhật Android 7 năm.",
    price: 25490000,
    originalPrice: 27990000,
    stock: 16,
    thumbnail: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 46,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_1",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_7",
    name: "iPad Air M2 13 inch Wi-Fi 128GB Không Gian Xám",
    slug: "ipad-air-m2-13-inch-wifi-128gb",
    description: "Màn hình Liquid Retina 13 inch mở rộng trải nghiệm, sức mạnh đột phá từ vi xử lý Apple M2 thế hệ mới, hỗ trợ Apple Pencil Pro và Magic Keyboard chuyên nghiệp cho học tập và đồ họa.",
    price: 21490000,
    originalPrice: 23990000,
    stock: 22,
    thumbnail: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 71,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_1",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_8",
    name: "Samsung Galaxy Tab S9 Ultra 14.6 inch Kèm S-Pen (12GB/256GB)",
    slug: "samsung-galaxy-tab-s9-ultra",
    description: "Màn hình Dynamic AMOLED 2X khổng lồ 14.6 inch 120Hz chuẩn rạp chiếu phim, kháng nước bụi IP68 toàn diện cả máy và bút, chip Snapdragon 8 Gen 2 for Galaxy biến tablet thành máy tính trạm di động.",
    price: 23990000,
    originalPrice: 26990000,
    stock: 14,
    thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 38,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_1",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_9",
    name: "ASUS ROG Phone 8 Pro Gaming Phone 165Hz (16GB/512GB)",
    slug: "asus-rog-phone-8-pro-gaming-phone",
    description: "Quái vật gaming đích thực với chip Snapdragon 8 Gen 3, màn hình Samsung E6 AMOLED 165Hz, nút siêu âm AirTrigger độc quyền và tản nhiệt buồng hơi kết hợp quạt làm mát AeroActive Cooler X.",
    price: 28990000,
    originalPrice: 31990000,
    stock: 15,
    thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 42,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_1",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_10",
    name: "iPad Mini 7 chip A17 Pro Siêu Nhỏ Gọn (128GB Wi-Fi)",
    slug: "ipad-mini-7-chip-a17-pro-128gb",
    description: "Sức mạnh vượt trội trong lòng bàn tay với chip Apple A17 Pro hỗ trợ ray tracing đồ họa console, màn hình Liquid Retina 8.3 inch sắc nét, hỗ trợ Apple Pencil Pro và kết nối Wi-Fi 6E siêu tốc.",
    price: 13990000,
    originalPrice: 15490000,
    stock: 30,
    thumbnail: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 51,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_1",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },

  // ==========================================
  // DANH MỤC 2: LAPTOP & MACBOOK (cat_2) - 10 THIẾT BỊ
  // ==========================================
  {
    id: "prd_11",
    name: "MacBook Pro 14 M3 Max (36GB RAM / 1TB SSD) Space Black",
    slug: "macbook-pro-14-m3-max-36gb-1tb",
    description: "Cỗ máy tối thượng cho lập trình viên và sáng tạo chuyên nghiệp, vi xử lý M3 Max 14 CPU / 30 GPU, màn hình Liquid Retina XDR 120Hz 1600 nits, thời lượng pin ấn tượng lên tới 18 giờ.",
    price: 79990000,
    originalPrice: 84990000,
    stock: 8,
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 68,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_2",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_12",
    name: "MacBook Air 15 M3 Siêu Mỏng Nhẹ (16GB RAM / 512GB SSD)",
    slug: "macbook-air-15-m3-16gb-512gb",
    description: "Màn hình 15.3 inch Liquid Retina rộng rãi trong thân máy nhôm nguyên khối siêu mỏng 11.5mm, chip Apple M3 với AI Neural Engine nhanh hơn 60%, thời lượng pin lên đến 18 tiếng không quạt tản nhiệt yên tĩnh.",
    price: 38990000,
    originalPrice: 42990000,
    stock: 16,
    thumbnail: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 84,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_2",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_13",
    name: "Laptop ASUS Zenbook 14 OLED AI PC Intel Core Ultra 7",
    slug: "laptop-asus-zenbook-14-oled-ai-pc",
    description: "Chuẩn Copilot+ AI PC siêu mỏng nhẹ chỉ 1.2kg, màn hình Lumina OLED 3K 120Hz 100% DCI-P3, tích hợp NPU Intel AI Boost tăng tốc xử lý tác vụ trí tuệ nhân tạo mượt mà.",
    price: 27990000,
    originalPrice: 31490000,
    stock: 18,
    thumbnail: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 52,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_2",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_14",
    name: "Laptop Dell XPS 14 OLED 9440 Intel Core Ultra 7 (32GB / 1TB)",
    slug: "laptop-dell-xps-14-oled-9440",
    description: "Kiệt tác thiết kế tương lai với bề mặt kính liền mạch, touchpad cảm ứng haptic ẩn, màn hình InfinityEdge OLED 3.2K 120Hz, card đồ họa rời NVIDIA GeForce RTX 4050 6GB.",
    price: 54990000,
    originalPrice: 59990000,
    stock: 10,
    thumbnail: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 37,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_2",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_15",
    name: "Laptop Lenovo Legion Pro 7i Core i9 14900HX RTX 4080 Gaming",
    slug: "laptop-lenovo-legion-pro-7i-rtx-4080",
    description: "Quái vật gaming trang bị chip Intel Core i9-14900HX, GPU RTX 4080 12GB TGP 175W, màn hình PureSight Gaming 16 inch WQXGA 240Hz 500 nits, tản nhiệt hơi Legion Coldfront 5.0.",
    price: 68990000,
    originalPrice: 74990000,
    stock: 7,
    thumbnail: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 45,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_2",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_16",
    name: "Laptop HP Spectre x360 14 2-in-1 Cảm Ứng OLED Core Ultra 7",
    slug: "laptop-hp-spectre-x360-14-oled",
    description: "Laptop xoay gập 360 độ cao cấp với màn hình OLED 2.8K 120Hz cảm ứng đa điểm, camera AI 9MP tự động căn khung hình, âm thanh Poly Studio 4 loa, đi kèm bút cảm ứng HP Rechargeable MPP2.0 Tilt Pen.",
    price: 39990000,
    originalPrice: 43900000,
    stock: 12,
    thumbnail: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 31,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_2",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_17",
    name: "Laptop ROG Zephyrus G16 OLED 240Hz Intel Core Ultra 9",
    slug: "laptop-rog-zephyrus-g16-oled-240hz",
    description: "Laptop gaming mỏng nhẹ chuẩn thời trang với dải đèn Slash Lighting mặt A độc đáo, màn hình ROG Nebula OLED 2.5K 240Hz 0.2ms chuẩn G-Sync, card đồ họa RTX 4070 mạnh mẽ.",
    price: 57990000,
    originalPrice: 62990000,
    stock: 9,
    thumbnail: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 62,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_2",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_18",
    name: "Laptop ThinkPad X1 Carbon Gen 12 Doanh Nhân Siêu Nhẹ 1.09kg",
    slug: "laptop-thinkpad-x1-carbon-gen-12",
    description: "Biểu tượng laptop doanh nhân bền bỉ chuẩn quân đội MIL-STD-810H, khung sợi carbon và magie tái chế, bàn phím gõ êm trứ danh với núm TrackPoint đỏ, chip Intel Core Ultra 7 tích hợp AI.",
    price: 46990000,
    originalPrice: 50990000,
    stock: 14,
    thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 40,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_2",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_19",
    name: "Laptop Acer Predator Helios 16 QHD+ 240Hz Core i9 RTX 4070",
    slug: "laptop-acer-predator-helios-16",
    description: "Sức mạnh chiến game đỉnh cao với công nghệ quạt kim loại 3D AeroBlade thế hệ 5 và keo tản nhiệt kim loại lỏng, màn hình Mini LED 240Hz độ sáng 1000 nits sống động.",
    price: 49990000,
    originalPrice: 54990000,
    stock: 11,
    thumbnail: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 29,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_2",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_20",
    name: "Laptop MSI Raider GE78 HX Khủng Long Đồ Họa 3D Core i9 14900HX",
    slug: "laptop-msi-raider-ge78-hx",
    description: "Dải đèn ma trận Mystic Light rực rỡ, trang bị CPU i9-14900HX và GPU RTX 4090 16GB, hệ thống tản nhiệt Cooler Boost 5 2 quạt 6 ống đồng tản nhiệt cực êm cho render 3D và dựng phim 8K.",
    price: 92990000,
    originalPrice: 99990000,
    stock: 5,
    thumbnail: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 23,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_2",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },

  // ==========================================
  // DANH MỤC 3: TAI NGHE & ÂM THANH (cat_3) - 10 THIẾT BỊ
  // ==========================================
  {
    id: "prd_21",
    name: "Tai nghe chụp tai chống ồn Sony WH-1000XM5 AI Optimizer",
    slug: "tai-nghe-chup-tai-sony-wh-1000xm5",
    description: "Công nghệ chống ồn số 1 thế giới với 8 micro và chip Auto NC Optimizer tự động tinh chỉnh theo áp suất và môi trường, màng loa 30mm sợi carbon nhẹ, pin 30 giờ sạc nhanh 3 phút nghe 3 giờ.",
    price: 7490000,
    originalPrice: 8690000,
    stock: 25,
    thumbnail: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 135,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_3",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_22",
    name: "Tai nghe Apple AirPods Pro Gen 2 USB-C Chip H2",
    slug: "tai-nghe-airpods-pro-gen-2-usb-c",
    description: "Khử tiếng ồn chủ động gấp 2 lần, chế độ Âm Thanh Thích Ứng Adaptive Audio, kháng bụi nước IP54 cùng hộp sạc MagSafe có loa tìm kiếm chính xác Precision Finding.",
    price: 5390000,
    originalPrice: 6190000,
    stock: 40,
    thumbnail: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 168,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_3",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_23",
    name: "Tai nghe chống ồn Bose QuietComfort Ultra Headphones Không Dây",
    slug: "tai-nghe-chong-on-bose-quietcomfort-ultra",
    description: "Công nghệ âm thanh Bose Immersive Audio không gian hóa âm thanh đỉnh cao, công nghệ CustomTune cá nhân hóa âm thanh theo ống tai, đệm tai da protein êm ái hàng đầu.",
    price: 9490000,
    originalPrice: 10590000,
    stock: 18,
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 78,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_3",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_24",
    name: "Loa Bluetooth di động Marshall Stanmore III Vintage",
    slug: "loa-bluetooth-marshall-stanmore-iii",
    description: "Âm thanh nổi stereo lan tỏa rộng khắp phòng, củ loa công suất 80W Class D mạnh mẽ, kết nối Bluetooth 5.2 hỗ trợ chuẩn tương lai LE Audio, phong cách hoài cổ đậm chất Rock & Roll.",
    price: 8990000,
    originalPrice: 9990000,
    stock: 16,
    thumbnail: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 95,
    isFeatured: true,
    isNew: false,
    categoryId: "cat_3",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_25",
    name: "Tai nghe over-ear Sennheiser Momentum 4 Wireless Pin 60H",
    slug: "tai-nghe-sennheiser-momentum-4-wireless",
    description: "Âm thanh audiophile thuần khiết với màng loa 42mm độ phân giải cao, chống ồn thích ứng Hybrid ANC, thời lượng pin vô địch lên tới 60 giờ chỉ với một lần sạc.",
    price: 7990000,
    originalPrice: 8990000,
    stock: 15,
    thumbnail: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 44,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_3",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_26",
    name: "Loa Bluetooth di động JBL Boombox 3 Wi-Fi Âm Trầm Uy Lực",
    slug: "loa-bluetooth-jbl-boombox-3-wifi",
    description: "Công suất khủng 180W với loa siêu trầm chuyên biệt Subwoofer, kết nối Wi-Fi hỗ trợ phát nhạc AirPlay và Spotify Connect không nén, kháng nước bụi IP67 pin 24 giờ tiệc tùng.",
    price: 11990000,
    originalPrice: 13500000,
    stock: 12,
    thumbnail: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 56,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_3",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_27",
    name: "Loa di động cao cấp Bang & Olufsen Beosound A1 2nd Gen Chống Nước",
    slug: "loa-bang-olufsen-beosound-a1-2nd",
    description: "Thiết kế nhôm anode hóa thổi hạt sang trọng của Đan Mạch, âm thanh đa hướng True360 sống động, chuẩn chống nước bụi IP67 hoàn hảo cùng 3 micro đàm thoại rõ nét.",
    price: 6850000,
    originalPrice: 7500000,
    stock: 20,
    thumbnail: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 38,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_3",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_28",
    name: "Tai nghe chụp tai Apple AirPods Max Type-C Spatial Audio",
    slug: "tai-nghe-apple-airpods-max-type-c",
    description: "Khung thép không gỉ bọc đệm lưới thoáng khí, công nghệ Âm Thanh Không Gian Cá Nhân Hóa Personal Spatial Audio theo dõi chuyển động đầu, cổng sạc Type-C hiện đại.",
    price: 13490000,
    originalPrice: 14990000,
    stock: 14,
    thumbnail: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 67,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_3",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_29",
    name: "Tai nghe True Wireless Sony WF-1000XM5 Chống Ồn Tuyệt Đối",
    slug: "tai-nghe-sony-wf-1000xm5",
    description: "Chip chống ồn chuyên dụng HD Noise Cancelling Processor QN2e cùng bộ xử lý V2 tích hợp, màng loa Dynamic Driver X tái tạo âm bass dày và âm cao trong trẻo chuẩn Hi-Res LDAC.",
    price: 5690000,
    originalPrice: 6490000,
    stock: 30,
    thumbnail: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 112,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_3",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_30",
    name: "Loa để bàn biểu tượng Harman Kardon Aura Studio 4 Âm Thanh Vòm",
    slug: "loa-harman-kardon-aura-studio-4",
    description: "Vòm kính trong suốt tích hợp hiệu ứng ánh sáng đèn LED kim cương 5 chế độ tương tác theo nhịp điệu, âm thanh vòm 360 độ công suất 130W cho trải nghiệm nghe nhìn nghệ thuật.",
    price: 6490000,
    originalPrice: 7290000,
    stock: 18,
    thumbnail: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 59,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_3",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },

  // ==========================================
  // DANH MỤC 4: ĐỒNG HỒ THÔNG MINH (cat_4) - 10 THIẾT BỊ
  // ==========================================
  {
    id: "prd_31",
    name: "Apple Watch Ultra 2 Titanium Dây Ocean Thể Thao Biển",
    slug: "apple-watch-ultra-2-titanium",
    description: "Vỏ titan hàng không 49mm chống va đập quân đội, màn hình sáng 3000 nits, chip S9 SiP thao tác chạm hai lần Double Tap, định vị GPS tần số kép L1+L5 chính xác dưới tán rừng dày.",
    price: 19990000,
    originalPrice: 21990000,
    stock: 14,
    thumbnail: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 88,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_4",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_32",
    name: "Apple Watch Series 10 Vỏ Nhôm Màn Hình Góc Rộng Mới Nhất",
    slug: "apple-watch-series-10-nhom",
    description: "Độ mỏng ấn tượng giảm 10%, màn hình OLED góc nhìn rộng sáng hơn 40% ở góc nghiêng, cảm biến đo nhiệt độ nước và độ sâu đo lặn biển, sạc nhanh 80% chỉ trong 30 phút.",
    price: 10490000,
    originalPrice: 11490000,
    stock: 25,
    thumbnail: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 72,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_4",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_33",
    name: "Garmin Fenix 8 Solar Sapphire Chống Nước 100m Loa & Micro",
    slug: "garmin-fenix-8-solar-sapphire",
    description: "Kính Sapphire chống xước kết hợp thấu kính sạc năng lượng mặt trời cho pin đến 48 ngày, tích hợp micro và loa đàm thoại trực tiếp, nút bấm cảm ứng chống rò rỉ nước lặn 40m chuyên nghiệp.",
    price: 26990000,
    originalPrice: 28990000,
    stock: 10,
    thumbnail: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 46,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_4",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_34",
    name: "Samsung Galaxy Watch Ultra LTE AI Titanium Bền Bỉ 100 Giờ",
    slug: "samsung-galaxy-watch-ultra-lte-titanium",
    description: "Vỏ titan hàng không vũ trụ chịu nhiệt từ -20°C đến 55°C, còi cứu hộ SOS 86dB khẩn cấp, kháng nước 10ATM, phân tích chỉ số thể lực FTP cho đạp xe và năng lượng Energy Score thông minh.",
    price: 15990000,
    originalPrice: 17490000,
    stock: 16,
    thumbnail: "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 53,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_4",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_35",
    name: "Samsung Galaxy Watch 7 AI BioActive Sensor Chip 3nm Siêu Nhanh",
    slug: "samsung-galaxy-watch-7-ai",
    description: "Cảm biến BioActive 13 bóng LED theo dõi nhịp tim chính xác khi tập cường độ cao, đo chỉ số AGEs glycat hóa, vi xử lý tiến trình 3nm tối ưu điện năng vượt trội.",
    price: 7290000,
    originalPrice: 8490000,
    stock: 22,
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 64,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_4",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_36",
    name: "Garmin Forerunner 965 Màn Hình AMOLED Bản Đồ Địa Hình Topo",
    slug: "garmin-forerunner-965-amoled",
    description: "Đồng hồ chạy bộ ba môn phối hợp cao cấp nhất, viền titan nhẹ, bản đồ màu tích hợp dẫn đường từng ngã rẽ, tính năng Training Readiness đo độ sẵn sàng tập luyện.",
    price: 15490000,
    originalPrice: 16990000,
    stock: 15,
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 41,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_4",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_37",
    name: "Huawei Watch Ultimate Design Thép Zirconium Lặn Sâu 100m",
    slug: "huawei-watch-ultimate-design-zirconium",
    description: "Vỏ làm từ kim loại lỏng gốc Zirconium cứng gấp 4.5 lần thép, hỗ trợ máy đo độ sâu lặn biển chứng nhận EN13319 100 mét và chế độ thám hiểm thám hiểm dã ngoại độc lập.",
    price: 18990000,
    originalPrice: 20990000,
    stock: 8,
    thumbnail: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 29,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_4",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_38",
    name: "Amazfit T-Rex 3 Quân Đội Bền Bỉ GPS Băng Tần Kép Pin 27 Ngày",
    slug: "amazfit-t-rex-3-quan-doi-gps",
    description: "Đạt 9 chứng nhận độ bền quân đội Mỹ MIL-STD-810H, màn hình AMOLED 2000 nits siêu sáng dưới nắng, tích hợp AI Zepp Coach hỗ trợ lập giáo án tập luyện thể hình và chạy địa hình.",
    price: 6490000,
    originalPrice: 7200000,
    stock: 24,
    thumbnail: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 48,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_4",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_39",
    name: "Suunto Race Titanium Chạy Bộ Địa Hình Màn Hình AMOLED",
    slug: "suunto-race-titanium-amoled",
    description: "Thương hiệu Phần Lan đỉnh cao cho vận động viên Ultra Trail, màn hình AMOLED 1.43 inch kính sapphire viền titan, bản đồ ngoại tuyến miễn phí toàn cầu và đo biến thiên nhịp tim HRV.",
    price: 13900000,
    originalPrice: 15200000,
    stock: 12,
    thumbnail: "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 33,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_4",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_40",
    name: "Google Pixel Watch 3 45mm Màn Hình Actua 2000 Nits",
    slug: "google-pixel-watch-3-45mm",
    description: "Mặt tròn vát cong thời thượng, viền màn hình mỏng hơn 40%, theo dõi xung lực chạy bộ nâng cao Fitbit Premium, cảnh báo mất mạch đập thông minh bằng cảm biến quang phổ AI.",
    price: 9990000,
    originalPrice: 10990000,
    stock: 18,
    thumbnail: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 39,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_4",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },

  // ==========================================
  // DANH MỤC 5: PHỤ KIỆN & CÁP SẠC (cat_5) - 10 THIẾT BỊ
  // ==========================================
  {
    id: "prd_41",
    name: "Pin sạc dự phòng Anker Prime 20.000mAh 200W Màn hình số TFT",
    slug: "pin-sac-du-phong-anker-prime-20000mah-200w",
    description: "Công suất khủng 200W sạc cùng lúc 2 laptop MacBook ở tốc độ tối đa, màn hình màu TFT hiển thị điện áp, công suất và sức khỏe pin theo thời gian thực.",
    price: 2490000,
    originalPrice: 2890000,
    stock: 55,
    thumbnail: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 128,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_5",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_42",
    name: "Củ sạc nhanh Anker Prime 100W GaN 3 cổng Thông Minh",
    slug: "cu-sac-nhanh-anker-prime-100w-gan",
    description: "Công nghệ GaN III thu nhỏ kích thước 45%, phân phối điện thông minh PowerIQ 4.0 tự cân đối tải, bảo vệ quá nhiệt ActiveShield 2.0 đo nhiệt độ 3 triệu lần mỗi ngày.",
    price: 1390000,
    originalPrice: 1690000,
    stock: 65,
    thumbnail: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 145,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_5",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_43",
    name: "Trạm sạc để bàn Ugreen Nexode 300W GaN 5 cổng Desktop Fast Charge",
    slug: "tram-sac-ugreen-nexode-300w-gan",
    description: "Trạm sạc để bàn mạnh mẽ nhất công suất 300W với cổng đơn đạt chuẩn PD 3.1 140W, cấp nguồn cùng lúc 3 laptop và 2 điện thoại mà không hề bị quá nhiệt.",
    price: 3690000,
    originalPrice: 4200000,
    stock: 25,
    thumbnail: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 52,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_5",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_44",
    name: "Đế sạc không dây 3 trong 1 MagSafe Hợp Kim Nhôm Xoay 360°",
    slug: "de-sac-khong-day-3-in-1-magsafe-xoay-360",
    description: "Hợp kim nhôm nguyên khối cắt CNC sang trọng, chuẩn sạc nhanh không dây Qi2 15W hít nam châm chắc chắn cho iPhone, sạc nhanh cho Apple Watch và dock sạc AirPods.",
    price: 1150000,
    originalPrice: 1450000,
    stock: 45,
    thumbnail: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 79,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_5",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_45",
    name: "Cáp sạc Type-C to Type-C 240W Thunderbolt 4 Bọc Dù Siêu Bền 2m",
    slug: "cap-sac-type-c-to-c-240w-thunderbolt-4-2m",
    description: "Hỗ trợ công suất truyền tải điện năng 240W (48V/5A), tốc độ truyền dữ liệu siêu tốc 40Gbps, xuất video 8K@60Hz ra màn hình ngoài, bọc dù Kevlar chống đứt 30.000 lần gập.",
    price: 490000,
    originalPrice: 650000,
    stock: 120,
    thumbnail: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 210,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_5",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_46",
    name: "Pin sạc dự phòng không dây MagSafe Baseus Blade 100W Siêu Mỏng",
    slug: "pin-du-phong-baseus-blade-100w",
    description: "Độ dày siêu mỏng chỉ 18mm dễ dàng nhét vừa túi đựng laptop, công suất 100W hỗ trợ sạc nhanh cho Dell XPS, MacBook Pro và hỗ trợ hút nam châm MagSafe tiện lợi.",
    price: 1590000,
    originalPrice: 1890000,
    stock: 35,
    thumbnail: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 63,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_5",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_47",
    name: "Củ sạc Baseus GaN5 Pro 140W chuẩn PD 3.1 Kèm Cáp 240W",
    slug: "cu-sac-baseus-gan5-pro-140w",
    description: "Tối ưu hóa sạc cho MacBook Pro 16 inch đạt công suất đỉnh 140W, kích thước nhỏ gọn mang đi công tác, trang bị 3 cổng sạc linh hoạt 2 Type-C và 1 USB-A QC 3.0.",
    price: 1190000,
    originalPrice: 1450000,
    stock: 40,
    thumbnail: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 71,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_5",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_48",
    name: "Hub chuyển đổi đa năng 10-in-1 Belkin Thunderbolt 4 Dock 40Gbps",
    slug: "hub-belkin-thunderbolt-4-dock",
    description: "Mở rộng 10 cổng kết nối cao cấp: 2 cổng Thunderbolt 4, HDMI 2.1 8K, Gigabit Ethernet, đầu đọc thẻ nhớ SD 4.0 và cung cấp nguồn sạc ngược 96W cho máy tính.",
    price: 5890000,
    originalPrice: 6500000,
    stock: 15,
    thumbnail: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    isNew: false,
    categoryId: "cat_5",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_49",
    name: "Bút cảm ứng Apple Pencil Pro Cảm Biến Xoay và Phản Hồi Rung",
    slug: "but-cam-ung-apple-pencil-pro",
    description: "Thao tác bóp Squeeze mở bảng công cụ nhanh chóng, con quay hồi chuyển cảm biến xoay nòng bút Barrel Roll để đổi hướng nét vẽ, phản hồi rung Haptic Feedback chân thực.",
    price: 3490000,
    originalPrice: 3890000,
    stock: 50,
    thumbnail: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 96,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_5",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_50",
    name: "Cáp HDMI 2.1 8K@60Hz AudioQuest Bọc Bạc Chống Nhiễu Tuyệt Đối",
    slug: "cap-hdmi-2-1-8k-audioquest",
    description: "Băng thông cực đại 48Gbps hỗ trợ độ phân giải 8K@60Hz hoặc 4K@120Hz mượt mà cho PS5 và TV OLED, lõi đồng mạ bạc 5% triệt tiêu độ trễ âm thanh eARC sống động.",
    price: 1250000,
    originalPrice: 1550000,
    stock: 30,
    thumbnail: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 45,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_5",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },

  // ==========================================
  // DANH MỤC 6: NHÀ THÔNG MINH (cat_6) - 10 THIẾT BỊ
  // ==========================================
  {
    id: "prd_51",
    name: "Robot hút bụi lau nhà Ecovacs Deebot X2 Omni AI Lực Hút 8000Pa",
    slug: "robot-hut-bui-ecovacs-deebot-x2-omni",
    description: "Thiết kế vuông bo góc vươn tới 99.77% chân tường, hệ thống LiDAR kép thể rắn ẩn trong thân máy siêu mỏng 9.5cm, trạm Omni tự giặt khăn bằng nước nóng 60°C và sấy khô bằng khí ấm.",
    price: 21990000,
    originalPrice: 24990000,
    stock: 14,
    thumbnail: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 65,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_6",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_52",
    name: "Robot hút bụi lau sàn Dreame L20 Ultra AI Nhận Diện Vật Cản",
    slug: "robot-hut-bui-dreame-l20-ultra",
    description: "Công nghệ giẻ lau mở rộng MopExtend tiếp cận mép tường sát 2mm, camera AI Action nhận dạng 55 loại chướng ngại vật trong bóng tối, tự động tháo rời khăn lau khi gặp thảm dày.",
    price: 19990000,
    originalPrice: 22990000,
    stock: 16,
    thumbnail: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 52,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_6",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_53",
    name: "Camera an ninh ngoài trời 360 Ezviz 4K Dual Lens Ban Đêm Có Màu",
    slug: "camera-an-ninh-ezviz-4k-dual-lens",
    description: "Ống kính kép 4K góc rộng kết hợp ống kính tele zoom quang học 8x, thuật toán AI phát hiện hình dáng người và xe cộ cảnh báo còi hú chớp đèn xua đuổi kẻ gian.",
    price: 2450000,
    originalPrice: 2850000,
    stock: 40,
    thumbnail: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 88,
    isFeatured: true,
    isNew: false,
    categoryId: "cat_6",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_54",
    name: "Khóa cửa thông minh nhận diện khuôn mặt FaceID 3D Aqara A100",
    slug: "khoa-cua-thong-minh-aqara-a100-faceid",
    description: "Camera ánh sáng cấu trúc 3D nhận diện khuôn mặt tức thì trong 0.5s kể cả đội mũ đeo kính, hỗ trợ mở khóa qua Apple Home Key chỉ bằng cách chạm nhẹ iPhone/Apple Watch.",
    price: 6890000,
    originalPrice: 7990000,
    stock: 18,
    thumbnail: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 47,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_6",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_55",
    name: "Dây đèn thông minh Philips Hue Gradient Lightstrip 2m 16 Triệu Màu",
    slug: "den-philips-hue-gradient-lightstrip",
    description: "Đồng bộ ánh sáng nhiều màu cùng lúc theo hình ảnh trên màn hình TV hoặc âm nhạc, ánh sáng chuyển sắc mượt mà không chói mắt, điều khiển qua app Philips Hue và trợ lý ảo.",
    price: 3690000,
    originalPrice: 4200000,
    stock: 30,
    thumbnail: "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 63,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_6",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_56",
    name: "Bộ điều khiển trung tâm Hub Aqara M3 Hỗ Trợ Chuẩn Matter & Thread",
    slug: "bo-dieu-khien-hub-aqara-m3",
    description: "Trái tim của ngôi nhà thông minh thế hệ mới, hỗ trợ kết nối đa giao thức Zigbee 3.0, Thread, Bluetooth và Matter cầu nối điều khiển các thiết bị chéo nền tảng mượt mà kể cả khi mất Internet.",
    price: 2650000,
    originalPrice: 2990000,
    stock: 35,
    thumbnail: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 39,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_6",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_57",
    name: "Loa tích hợp màn hình thông minh Google Nest Hub Max 10 inch AI",
    slug: "google-nest-hub-max-10-inch",
    description: "Màn hình cảm ứng 10 inch HD hiển thị hình ảnh camera an ninh, xem công thức nấu ăn qua YouTube, camera Nest Cam góc rộng tự động nhận diện khuôn mặt Face Match để hiển thị lịch cá nhân.",
    price: 5490000,
    originalPrice: 6200000,
    stock: 20,
    thumbnail: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 55,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_6",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_58",
    name: "Máy lọc không khí Xiaomi Smart Air Purifier 4 Pro Khử Mùi Diệt Khuẩn",
    slug: "may-loc-khong-khi-xiaomi-4-pro",
    description: "Lọc sạch phòng rộng tới 60m2 chỉ trong 15 phút, màng lọc HEPA 3 lớp hiệu quả 99.97% hạt bụi mịn PM2.5, ion âm khử mùi hôi thú cưng, màn hình OLED hiển thị chất lượng không khí.",
    price: 4390000,
    originalPrice: 4990000,
    stock: 28,
    thumbnail: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 76,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_6",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_59",
    name: "Chuông cửa camera không dây thông minh Ring Video Doorbell Pro 2",
    slug: "chuong-cua-camera-ring-video-doorbell-pro-2",
    description: "Góc quay toàn cảnh Head-to-Toe 1536p nhìn rõ từ đầu tới gói hàng dưới sàn, cảm biến radar 3D Motion Detection định vị chính xác vị trí khách đứng trước cửa nhà.",
    price: 4890000,
    originalPrice: 5500000,
    stock: 22,
    thumbnail: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.7,
    reviewCount: 34,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_6",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_60",
    name: "Cảm biến hiện diện mmWave Aqara FP2 Nhận Diện Đa Vùng Thông Minh",
    slug: "cam-bien-hien-dien-aqara-fp2",
    description: "Sóng radar milimet mmWave nhận diện sự hiện diện của con người kể cả khi ngồi yên thở hoặc ngủ say, chia căn phòng thành 30 phân vùng độc lập để tự động bật tắt đèn thông minh.",
    price: 1850000,
    originalPrice: 2190000,
    stock: 45,
    thumbnail: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 68,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_6",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },

  // ==========================================
  // DANH MỤC 7: MÀN HÌNH MÁY TÍNH (cat_7) - 10 THIẾT BỊ
  // ==========================================
  {
    id: "prd_61",
    name: "Màn hình Dell UltraSharp U2724DE 27 inch 120Hz IPS Black Thunderbolt",
    slug: "man-hinh-dell-ultrasharp-u2724de",
    description: "Tấm nền IPS Black độ tương phản 2000:1 màu đen sâu thẳm, tần số quét 120Hz mượt mà, cảm biến tự động chỉnh độ sáng môi trường và cổng Thunderbolt 4 cấp nguồn 90W một dây cáp.",
    price: 12490000,
    originalPrice: 13990000,
    stock: 18,
    thumbnail: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 89,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_7",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_62",
    name: "Màn hình Gaming ASUS ROG Swift OLED PG32UCDM 4K 240Hz 0.03ms",
    slug: "man-hinh-asus-rog-swift-oled-pg32ucdm",
    description: "Đỉnh cao màn hình gaming thế giới với tấm nền QD-OLED thế hệ 3 siêu sắc nét 4K UHD, tần số quét 240Hz, thời gian phản hồi 0.03ms loại bỏ bóng mờ và tản nhiệt graphene cao cấp.",
    price: 36990000,
    originalPrice: 39990000,
    stock: 8,
    thumbnail: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 42,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_7",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_63",
    name: "Màn hình đồ họa LG UltraFine 32UQ85R Nano IPS Black 4K HDR400",
    slug: "man-hinh-lg-ultrafine-32uq85r",
    description: "Màn hình 31.5 inch 4K chuẩn đồ họa chuyên nghiệp, tích hợp đầu cảm biến tự động cân màu tự động Auto Calibration, độ bao phủ màu DCI-P3 98% chuẩn màu điện ảnh Hollywood.",
    price: 16900000,
    originalPrice: 18500000,
    stock: 14,
    thumbnail: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 56,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_7",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_64",
    name: "Màn hình cong Samsung Odyssey OLED G9 49 inch 240Hz Siêu Rộng 32:9",
    slug: "man-hinh-samsung-odyssey-oled-g9",
    description: "Màn hình cong kép Dual QHD 5120x1440 độ cong 1800R bao trọn tầm mắt, chip xử lý Neo Quantum Processor Pro tối ưu từng khung hình OLED, thiết kế mặt sau bạc kim loại đèn lõi CoreSync.",
    price: 33990000,
    originalPrice: 38990000,
    stock: 6,
    thumbnail: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    isNew: false,
    categoryId: "cat_7",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_65",
    name: "Màn hình Apple Studio Display 27 inch 5K Retina Kính Nano-texture",
    slug: "man-hinh-apple-studio-display-5k",
    description: "Độ phân giải siêu nét 5K 5120x2880 với 14.7 triệu điểm ảnh, kính Nano-texture chống chói phân tán ánh sáng cao cấp, camera 12MP góc siêu rộng tính năng Trung Tâm Màn Hình Center Stage.",
    price: 49990000,
    originalPrice: 53990000,
    stock: 9,
    thumbnail: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 47,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_7",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_66",
    name: "Màn hình Gaming BenQ ZOWIE XL2566K 24.5 inch 360Hz Fast-TN Esports",
    slug: "man-hinh-benq-zowie-xl2566k",
    description: "Vũ khí tiêu chuẩn cho các giải đấu bắn súng Esports quốc tế CS2 và Valorant, tần số quét 360Hz kết hợp công nghệ DyAc⁺ triệt tiêu độ rung mờ khi lia tâm ngắm nhanh.",
    price: 16990000,
    originalPrice: 18500000,
    stock: 15,
    thumbnail: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 35,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_7",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_67",
    name: "Màn hình đồ họa chuyên nghiệp ViewSonic ColorPro VP2776 2K 165Hz",
    slug: "man-hinh-viewsonic-colorpro-vp2776",
    description: "Tích hợp vòng điều khiển ColorPro Wheel chỉnh thông số OSD và cân màu chuẩn Pantone Validated, hỗ trợ DCI-P3 98%, đi kèm tấm chắn sáng từ tính che chói chuyên nghiệp.",
    price: 13990000,
    originalPrice: 15500000,
    stock: 12,
    thumbnail: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 28,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_7",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_68",
    name: "Màn hình di động ASUS ZenScreen OLED MQ16AH 15.6 inch Siêu Mỏng",
    slug: "man-hinh-di-dong-asus-zenscreen-oled",
    description: "Màn hình phụ di động OLED 15.6 inch FHD mỏng 5mm nhẹ chỉ 650g, 100% DCI-P3 màu sắc rực rỡ, cảm biến tiệm cận tự động đưa máy về chế độ tiết kiệm pin khi bạn rời đi.",
    price: 9490000,
    originalPrice: 10500000,
    stock: 20,
    thumbnail: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 31,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_7",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_69",
    name: "Màn hình MSI MPG 321URX QD-OLED 4K 240Hz AI Care Bảo Vệ Tấm Nền",
    slug: "man-hinh-msi-mpg-321urx-qd-oled",
    description: "Tấm nền chấm lượng tử Quantum Dot OLED 4K 240Hz, tính năng MSI OLED Care 2.0 ứng dụng thuật toán AI tự phát hiện logo thanh tác vụ để chống lưu ảnh vĩnh viễn, bảo hành cháy hình 3 năm.",
    price: 29990000,
    originalPrice: 33500000,
    stock: 10,
    thumbnail: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 44,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_7",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_70",
    name: "Màn hình Gaming Gigabyte M28U 4K 144Hz Tích Hợp KVM Switch",
    slug: "man-hinh-gigabyte-m28u-4k-144hz",
    description: "Màn hình đa năng cho cả làm việc và chơi game, tấm nền Super Speed IPS 4K 144Hz 1ms, nút bấm KVM vật lý cho phép dùng 1 bộ chuột phím điều khiển cùng lúc máy tính bàn và laptop.",
    price: 11990000,
    originalPrice: 13500000,
    stock: 22,
    thumbnail: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 61,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_7",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },

  // ==========================================
  // DANH MỤC 8: BÀN PHÍM & CHUỘT (cat_8) - 10 THIẾT BỊ
  // ==========================================
  {
    id: "prd_71",
    name: "Bàn phím cơ Keychron Q1 Pro Wireless Hot-swap Vỏ Nhôm CNC",
    slug: "ban-phim-co-keychron-q1-pro",
    description: "Thiết kế layout 75% vỏ nhôm nguyên khối gia công CNC chính xác, cấu trúc Double-Gasket êm tai, kết nối Bluetooth 5.1 và có dây, tương thích hoàn hảo cả macOS và Windows.",
    price: 4590000,
    originalPrice: 5190000,
    stock: 30,
    thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 112,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_8",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_72",
    name: "Bàn phím Gaming không dây ASUS ROG Azoth 75% Màn Hình OLED",
    slug: "ban-phim-gaming-asus-rog-azoth",
    description: "Màn hình OLED 2 inch hiển thị thông số CPU/GPU và thông báo, gasket mount 3 lớp đệm silicon triệt tiêu tiếng ồn, switch ROG NX lube sẵn cao cấp, pin hoạt động 2000 giờ.",
    price: 5990000,
    originalPrice: 6790000,
    stock: 20,
    thumbnail: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 78,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_8",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_73",
    name: "Bàn phím cơ Filco Majestouch 3 Tenkeyless Siêu Bền Made in Japan",
    slug: "ban-phim-co-filco-majestouch-3",
    description: "Tượng đài bàn phím cơ Nhật Bản với độ bền phím 50 triệu lần nhấn, switch Cherry MX chính hãng mạ vàng tiếp điểm, bo mạch 2 lớp sợi thủy tinh gia cường chống va đập tuyệt đối.",
    price: 3690000,
    originalPrice: 4100000,
    stock: 25,
    thumbnail: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 65,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_8",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_74",
    name: "Bàn phím không dây văn phòng Logitech MX Keys S Advanced",
    slug: "ban-phim-logitech-mx-keys-s",
    description: "Phím lõm hình cầu ôm trọn đầu ngón tay gõ êm tĩnh tuyệt đối, đèn nền thông minh tự sáng khi tay bạn đến gần, phím tắt thông minh Smart Actions tự động hóa chuỗi thao tác lặp lại.",
    price: 2690000,
    originalPrice: 2990000,
    stock: 45,
    thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 142,
    isFeatured: true,
    isNew: false,
    categoryId: "cat_8",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_75",
    name: "Chuột không dây công thái học Logitech MX Master 3S Quiet Click",
    slug: "chuot-logitech-mx-master-3s",
    description: "Cảm biến quang học 8000 DPI lướt mượt trên mọi bề mặt kể cả mặt bàn kính trong suốt, nút bấm giảm 90% tiếng ồn, con lăn từ tính MagSpeed cuộn 1000 dòng trong 1 giây.",
    price: 2190000,
    originalPrice: 2490000,
    stock: 60,
    thumbnail: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 185,
    isFeatured: true,
    isNew: false,
    categoryId: "cat_8",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_76",
    name: "Chuột gaming siêu nhẹ Razer Viper V3 Pro 54g Tần Số 8000Hz",
    slug: "chuot-razer-viper-v3-pro-8000hz",
    description: "Trọng lượng siêu nhẹ chỉ 54g đạt chuẩn thi đấu Esports chuyên nghiệp, cảm biến quang học Focus Pro 35K Gen-2 độ chính xác 99.8%, dongle không dây HyperPolling 8000Hz không độ trễ.",
    price: 3890000,
    originalPrice: 4290000,
    stock: 30,
    thumbnail: "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 67,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_8",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_77",
    name: "Chuột công thái học đứng Logitech Lift Vertical Bảo Vệ Cổ Tay",
    slug: "chuot-logitech-lift-vertical",
    description: "Góc nghiêng tự nhiên 57 độ giúp cổ tay đặt ở tư thế bắt tay thư giãn, giải tỏa áp lực ống cổ tay khi làm việc suốt 8 tiếng mỗi ngày, phù hợp kích thước bàn tay người châu Á.",
    price: 1450000,
    originalPrice: 1690000,
    stock: 40,
    thumbnail: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 58,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_8",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_78",
    name: "Chuột gaming không dây Pulsar X2V2 Cảm Biến Quang PAW3395",
    slug: "chuot-pulsar-x2v2-wireless",
    description: "Thiết kế đối xứng hoàn hảo trọng lượng 53g không lỗ thông khí, switch quang học Optical Switch chống double-click vĩnh viễn, con lăn Pulsar Blue Encoder nảy giòn chính xác.",
    price: 2350000,
    originalPrice: 2650000,
    stock: 35,
    thumbnail: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 43,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_8",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_79",
    name: "Bàn phím từ tính Wooting 60HE+ Rapid Trigger Hall Effect Chuyên Game",
    slug: "ban-phim-wooting-60he-plus",
    description: "Công nghệ switch cảm ứng từ trường Hall Effect cho phép nhận diện hành trình phím từ 0.1mm đến 4.0mm, tính năng Rapid Trigger ngắt phím tức thì ngay khi nhấc ngón tay.",
    price: 5490000,
    originalPrice: 6200000,
    stock: 18,
    thumbnail: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 82,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_8",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_80",
    name: "Bàn phím cơ mỏng nhẹ NuPhy Air75 V2 Low Profile RGB Không Dây",
    slug: "ban-phim-nuphy-air75-v2",
    description: "Độ dày siêu mỏng mang theo quán cafe hoặc đặt vừa vặn lên bàn phím MacBook, tần số phản hồi không dây 1000Hz, switch Gateron Low-profile 2.0 gõ êm nhẹ nhàng.",
    price: 3190000,
    originalPrice: 3590000,
    stock: 28,
    thumbnail: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 49,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_8",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },

  // ==========================================
  // DANH MỤC 9: THIẾT BỊ MẠNG & WI-FI 7 (cat_9) - 10 THIẾT BỊ
  // ==========================================
  {
    id: "prd_81",
    name: "Hệ thống Wi-Fi 7 Mesh TP-Link Deco BE85 3-Pack Tốc Độ 22Gbps",
    slug: "he-thong-wifi-7-mesh-deco-be85",
    description: "Bộ 3 node phát sóng phủ kín 800m2 biệt thự nhiều tầng, băng thông 12 luồng 22Gbps, 2 cổng 10Gbps và 2 cổng 2.5Gbps, công nghệ MLO truyền đồng thời trên cả 3 băng tần.",
    price: 24990000,
    originalPrice: 27990000,
    stock: 10,
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 39,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_9",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_82",
    name: "Router Gaming ASUS ROG Rapture GT-BE98 Quad-band Wi-Fi 7 25Gbps",
    slug: "router-asus-rog-rapture-gt-be98",
    description: "Cỗ máy định tuyến 8 râu hầm hố phát 4 băng tần độc lập, băng thông siêu khủng 25Gbps, 2 cổng 10G và 4 cổng 2.5G chuyên dụng cho gaming streamer không lo lag giật.",
    price: 19990000,
    originalPrice: 22500000,
    stock: 12,
    thumbnail: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 31,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_9",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_83",
    name: "Router Wi-Fi 7 Độc Lập Netgear Nighthawk RS700S Băng Thông 19Gbps",
    slug: "router-netgear-nighthawk-rs700s",
    description: "Thiết kế trụ đứng tản nhiệt đối lưu thông minh không quạt ồn, vùng phủ sóng rộng 300m2 cho 200 thiết bị kết nối, bảo mật mạng Armor chặn virus mã độc từ gateway.",
    price: 16490000,
    originalPrice: 18500000,
    stock: 14,
    thumbnail: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 26,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_9",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_84",
    name: "Bộ phát Wi-Fi 6 Di động 5G Netgear M6 Pro Pin 5040mAh Cảm Ứng",
    slug: "bo-phat-wifi-5g-netgear-m6-pro",
    description: "Lắp sim 5G phát sóng Wi-Fi 6E di động với tốc độ tải xuống cực đại 8Gbps, màn hình màu cảm ứng 2.8 inch quản lý data, pin dùng liên tục 13 tiếng hoạt động dã ngoại.",
    price: 18900000,
    originalPrice: 20900000,
    stock: 15,
    thumbnail: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 37,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_9",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_85",
    name: "Switch Mạng UniFi 8 Cổng Enterprise 2.5G PoE+ Layer 3 Quản Lý Cloud",
    slug: "switch-unifi-enterprise-8-poe",
    description: "8 cổng RJ45 2.5Gbps cấp nguồn PoE+ công suất tổng 120W, 2 cổng quang SFP+ 10Gbps uplink, quản lý tập trung toàn bộ hạ tầng qua ứng dụng UniFi Network trực quan.",
    price: 12500000,
    originalPrice: 13900000,
    stock: 20,
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 42,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_9",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_86",
    name: "Bộ phát sóng Access Point Ubiquiti UniFi U7 Pro Wi-Fi 7 Tri-Band",
    slug: "access-point-unifi-u7-pro",
    description: "Chuẩn Wi-Fi 7 3 băng tần (2.4GHz, 5GHz và 6GHz siêu thông thoáng), cổng uplink 2.5G PoE+, thiết kế ốp trần thanh lịch chịu tải trên 300 thiết bị văn phòng công ty.",
    price: 6490000,
    originalPrice: 7200000,
    stock: 35,
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 51,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_9",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_87",
    name: "Card mạng không dây Wi-Fi 7 PCIe Intel BE200 Bluetooth 5.4 Ăng-ten Rời",
    slug: "card-wifi-7-pcie-intel-be200",
    description: "Nâng cấp máy tính bàn lên chuẩn Wi-Fi 7 tốc độ 5.8Gbps trên băng tần 6GHz kênh rộng 320MHz, Bluetooth 5.4 kết nối tai nghe và bàn phím độ trễ cực thấp.",
    price: 950000,
    originalPrice: 1200000,
    stock: 60,
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 65,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_9",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_88",
    name: "Thiết bị cân bằng tải Router DrayTek Vigor 2927 Dual-WAN Chịu Tải 200 User",
    slug: "router-draytek-vigor-2927-dual-wan",
    description: "2 cổng WAN Gigabit cân bằng tải nhiều đường truyền Internet đồng thời, 50 kênh VPN bảo mật kết nối chi nhánh, tường lửa SPI chống tấn công DoS cho doanh nghiệp vừa và nhỏ.",
    price: 4950000,
    originalPrice: 5500000,
    stock: 25,
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 44,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_9",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_89",
    name: "Bộ kích sóng Wi-Fi 6 Mesh TP-Link RE705X AX3000 Tương Thích OneMesh",
    slug: "bo-kich-song-wifi-6-tplink-re705x",
    description: "Mở rộng vùng phủ sóng loại bỏ góc chết Wi-Fi trong phòng ngủ và sân vườn, tốc độ AX3000 2402Mbps trên 5GHz, cổng Gigabit cắm trực tiếp dây mạng cho Smart TV hoặc PC.",
    price: 1390000,
    originalPrice: 1650000,
    stock: 45,
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.7,
    reviewCount: 52,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_9",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_90",
    name: "Thiết bị lưu trữ mạng NAS Synology DiskStation DS923+ 4-Bay NVMe M.2",
    slug: "o-cung-mang-nas-synology-ds923-plus",
    description: "Máy chủ lưu trữ đám mây riêng tư cho gia đình và studio, 4 khay ổ đĩa nâng cấp tối đa 9 khay, 2 khe cắm SSD NVMe M.2 làm bộ nhớ đệm cache tăng tốc độ truy xuất file.",
    price: 16490000,
    originalPrice: 17990000,
    stock: 16,
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 48,
    isFeatured: true,
    isNew: false,
    categoryId: "cat_9",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },

  // ==========================================
  // DANH MỤC 10: PHẦN MỀM & BẢN QUYỀN (cat_10) - 10 THIẾT BỊ
  // ==========================================
  {
    id: "prd_91",
    name: "Gói Bản Quyền Microsoft 365 Family 1 Năm (6 Người Dùng + 6TB OneDrive)",
    slug: "goi-ban-quyen-microsoft-365-family-1-nam",
    description: "Bản quyền chính hãng chia sẻ tối đa 6 tài khoản, trọn bộ ứng dụng văn phòng Word, Excel, PowerPoint, Outlook cao cấp, dung lượng lưu trữ 6TB đám mây an toàn (1TB/người).",
    price: 1490000,
    originalPrice: 1990000,
    stock: 999,
    thumbnail: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22bgGrad%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23D83B01%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23EA4335%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%237719AA%22%20%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22glow%22%20cx%3D%2250%25%22%20cy%3D%2230%25%22%20r%3D%2250%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220.3%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220%22%20%2F%3E%0A%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22cardShadow%22%20x%3D%22-10%25%22%20y%3D%22-10%25%22%20width%3D%22120%25%22%20height%3D%22120%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2216%22%20stdDeviation%3D%2224%22%20flood-color%3D%22%23000000%22%20flood-opacity%3D%220.35%22%20%2F%3E%0A%20%20%20%20%3C%2Ffilter%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22url(%23bgGrad)%22%20%2F%3E%0A%20%20%3Ccircle%20cx%3D%22400%22%20cy%3D%22280%22%20r%3D%22300%22%20fill%3D%22url(%23glow)%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Outer%20Box%20Container%20--%3E%0A%20%20%3Crect%20x%3D%2280%22%20y%3D%2280%22%20width%3D%22640%22%20height%3D%22640%22%20rx%3D%2244%22%20fill%3D%22rgba(255%2C255%2C255%2C0.08)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.25)%22%20stroke-width%3D%222.5%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Central%20Software%20Emblem%20Frame%20--%3E%0A%20%20%3Cg%20transform%3D%22translate(400%2C%20300)%22%20filter%3D%22url(%23cardShadow)%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-90%22%20y%3D%22-90%22%20width%3D%22180%22%20height%3D%22180%22%20rx%3D%2238%22%20fill%3D%22rgba(255%2C255%2C255%2C0.18)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%223%22%20%2F%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate(0%2C%200)%22%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M-40%20-40%20L40%20-40%20L40%2040%20L-40%2040%20Z%22%20fill%3D%22%23F25022%22%2F%3E%3Ccircle%20cx%3D%220%22%20cy%3D%220%22%20r%3D%2232%22%20fill%3D%22%23FFFFFF%22%2F%3E%3Cpath%20d%3D%22M-12%20-12%20L12%200%20L-12%2012%20Z%22%20fill%3D%22%23D83B01%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fg%3E%0A%20%20%0A%20%20%3C!--%20Pill%20Badge%20--%3E%0A%20%20%3Crect%20x%3D%22250%22%20y%3D%22440%22%20width%3D%22300%22%20height%3D%2242%22%20rx%3D%2221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.22)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.45)%22%20stroke-width%3D%221.5%22%20%2F%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22467%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2215%22%20font-weight%3D%22900%22%20letter-spacing%3D%221.5%22%3EB%E1%BA%A2N%20QUY%E1%BB%80N%201%20N%C4%82M%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Title%20%26%20Subtitle%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22540%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2234%22%20font-weight%3D%22900%22%3EMicrosoft%20365%20Family%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22585%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.9)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22600%22%3EG%C3%B3i%206%20Ng%C6%B0%E1%BB%9Di%20D%C3%B9ng%20%E2%80%A2%206TB%20OneDrive%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Bottom%20Store%20Guarantee%20Tag%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22660%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.6)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20letter-spacing%3D%221%22%3EB%E1%BA%A2N%20QUY%E1%BB%80N%20CH%C3%8DNH%20H%C3%83NG%20100%25%20%E2%80%A2%20TPKSTORE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 220,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_10",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_92",
    name: "Bản Quyền Windows 11 Pro 64-Bit Chính Hãng Vĩnh Viễn FPP",
    slug: "ban-quyen-windows-11-pro-chinh-hang",
    description: "Khóa bản quyền điện tử chuyển đổi máy tính thoải mái, hỗ trợ mã hóa ổ cứng BitLocker bảo vệ dữ liệu tuyệt mật, tính năng máy ảo Hyper-V và nhận cập nhật bảo mật trọn đời từ Microsoft.",
    price: 850000,
    originalPrice: 1200000,
    stock: 999,
    thumbnail: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22bgGrad%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%230078D4%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23005A9E%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23002050%22%20%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22glow%22%20cx%3D%2250%25%22%20cy%3D%2230%25%22%20r%3D%2250%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220.3%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220%22%20%2F%3E%0A%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22cardShadow%22%20x%3D%22-10%25%22%20y%3D%22-10%25%22%20width%3D%22120%25%22%20height%3D%22120%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2216%22%20stdDeviation%3D%2224%22%20flood-color%3D%22%23000000%22%20flood-opacity%3D%220.35%22%20%2F%3E%0A%20%20%20%20%3C%2Ffilter%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22url(%23bgGrad)%22%20%2F%3E%0A%20%20%3Ccircle%20cx%3D%22400%22%20cy%3D%22280%22%20r%3D%22300%22%20fill%3D%22url(%23glow)%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Outer%20Box%20Container%20--%3E%0A%20%20%3Crect%20x%3D%2280%22%20y%3D%2280%22%20width%3D%22640%22%20height%3D%22640%22%20rx%3D%2244%22%20fill%3D%22rgba(255%2C255%2C255%2C0.08)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.25)%22%20stroke-width%3D%222.5%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Central%20Software%20Emblem%20Frame%20--%3E%0A%20%20%3Cg%20transform%3D%22translate(400%2C%20300)%22%20filter%3D%22url(%23cardShadow)%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-90%22%20y%3D%22-90%22%20width%3D%22180%22%20height%3D%22180%22%20rx%3D%2238%22%20fill%3D%22rgba(255%2C255%2C255%2C0.18)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%223%22%20%2F%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate(0%2C%200)%22%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-44%22%20y%3D%22-44%22%20width%3D%2240%22%20height%3D%2240%22%20rx%3D%226%22%20fill%3D%22%2300A4EF%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%22-44%22%20width%3D%2240%22%20height%3D%2240%22%20rx%3D%226%22%20fill%3D%22%2300A4EF%22%2F%3E%3Crect%20x%3D%22-44%22%20y%3D%224%22%20width%3D%2240%22%20height%3D%2240%22%20rx%3D%226%22%20fill%3D%22%2300A4EF%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%224%22%20width%3D%2240%22%20height%3D%2240%22%20rx%3D%226%22%20fill%3D%22%2300A4EF%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fg%3E%0A%20%20%0A%20%20%3C!--%20Pill%20Badge%20--%3E%0A%20%20%3Crect%20x%3D%22250%22%20y%3D%22440%22%20width%3D%22300%22%20height%3D%2242%22%20rx%3D%2221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.22)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.45)%22%20stroke-width%3D%221.5%22%20%2F%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22467%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2215%22%20font-weight%3D%22900%22%20letter-spacing%3D%221.5%22%3ECH%C3%8DNH%20H%C3%83NG%20MICROSOFT%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Title%20%26%20Subtitle%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22540%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2234%22%20font-weight%3D%22900%22%3EWindows%2011%20Pro%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22585%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.9)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22600%22%3E64-Bit%20FPP%20%E2%80%A2%20B%E1%BA%A3n%20Quy%E1%BB%81n%20V%C4%A9nh%20Vi%E1%BB%85n%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Bottom%20Store%20Guarantee%20Tag%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22660%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.6)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20letter-spacing%3D%221%22%3EB%E1%BA%A2N%20QUY%E1%BB%80N%20CH%C3%8DNH%20H%C3%83NG%20100%25%20%E2%80%A2%20TPKSTORE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
    images: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 310,
    isFeatured: true,
    isNew: false,
    categoryId: "cat_10",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_93",
    name: "Phần Mềm Diệt Virus & An Ninh Mạng Kaspersky Total Security 1 Năm",
    slug: "kaspersky-total-security-1-nam",
    description: "Lá chắn an ninh mạng hàng đầu thế giới ngăn chặn ransomware mã hóa tống tiền, bảo vệ giao dịch ngân hàng trực tuyến Safe Money, VPN mã hóa dữ liệu công cộng và kiểm soát trẻ em Safe Kids.",
    price: 390000,
    originalPrice: 550000,
    stock: 999,
    thumbnail: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22bgGrad%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23006D5B%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%2300A88F%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%2300483C%22%20%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22glow%22%20cx%3D%2250%25%22%20cy%3D%2230%25%22%20r%3D%2250%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220.3%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220%22%20%2F%3E%0A%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22cardShadow%22%20x%3D%22-10%25%22%20y%3D%22-10%25%22%20width%3D%22120%25%22%20height%3D%22120%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2216%22%20stdDeviation%3D%2224%22%20flood-color%3D%22%23000000%22%20flood-opacity%3D%220.35%22%20%2F%3E%0A%20%20%20%20%3C%2Ffilter%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22url(%23bgGrad)%22%20%2F%3E%0A%20%20%3Ccircle%20cx%3D%22400%22%20cy%3D%22280%22%20r%3D%22300%22%20fill%3D%22url(%23glow)%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Outer%20Box%20Container%20--%3E%0A%20%20%3Crect%20x%3D%2280%22%20y%3D%2280%22%20width%3D%22640%22%20height%3D%22640%22%20rx%3D%2244%22%20fill%3D%22rgba(255%2C255%2C255%2C0.08)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.25)%22%20stroke-width%3D%222.5%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Central%20Software%20Emblem%20Frame%20--%3E%0A%20%20%3Cg%20transform%3D%22translate(400%2C%20300)%22%20filter%3D%22url(%23cardShadow)%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-90%22%20y%3D%22-90%22%20width%3D%22180%22%20height%3D%22180%22%20rx%3D%2238%22%20fill%3D%22rgba(255%2C255%2C255%2C0.18)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%223%22%20%2F%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate(0%2C%200)%22%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M0%20-45%20L38%20-20%20L38%2020%20C38%2042%200%2054%200%2054%20C0%2054%20-38%2042%20-38%2020%20L-38%20-20%20Z%22%20fill%3D%22%2300E676%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%224%22%2F%3E%3Cpath%20d%3D%22M-14%203%20L-3%2014%20L18%20-10%22%20fill%3D%22none%22%20stroke%3D%22%2300483C%22%20stroke-width%3D%226%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fg%3E%0A%20%20%0A%20%20%3C!--%20Pill%20Badge%20--%3E%0A%20%20%3Crect%20x%3D%22250%22%20y%3D%22440%22%20width%3D%22300%22%20height%3D%2242%22%20rx%3D%2221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.22)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.45)%22%20stroke-width%3D%221.5%22%20%2F%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22467%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2215%22%20font-weight%3D%22900%22%20letter-spacing%3D%221.5%22%3EAN%20NINH%20M%E1%BA%A0NG%20CAO%20C%E1%BA%A4P%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Title%20%26%20Subtitle%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22540%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2234%22%20font-weight%3D%22900%22%3EKaspersky%20Total%20Security%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22585%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.9)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22600%22%3EB%E1%BA%A3o%20V%E1%BB%87%20To%C3%A0n%20Di%E1%BB%87n%203%20Thi%E1%BA%BFt%20B%E1%BB%8B%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Bottom%20Store%20Guarantee%20Tag%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22660%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.6)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20letter-spacing%3D%221%22%3EB%E1%BA%A2N%20QUY%E1%BB%80N%20CH%C3%8DNH%20H%C3%83NG%20100%25%20%E2%80%A2%20TPKSTORE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 140,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_10",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_94",
    name: "Bản Quyền Trọn Bộ Adobe Creative Cloud All Apps 1 Năm Bản Đầy Đủ",
    slug: "ban-quyen-adobe-creative-cloud-all-apps",
    description: "Bộ hơn 20 ứng dụng sáng tạo đồ họa đỉnh cao: Photoshop, Illustrator, Premiere Pro, After Effects tích hợp công cụ AI sinh ảnh tạo video Firefly độc quyền và 100GB lưu trữ đám mây Adobe Cloud.",
    price: 4990000,
    originalPrice: 6500000,
    stock: 999,
    thumbnail: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22bgGrad%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23FF0000%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23990000%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%234A0000%22%20%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22glow%22%20cx%3D%2250%25%22%20cy%3D%2230%25%22%20r%3D%2250%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220.3%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220%22%20%2F%3E%0A%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22cardShadow%22%20x%3D%22-10%25%22%20y%3D%22-10%25%22%20width%3D%22120%25%22%20height%3D%22120%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2216%22%20stdDeviation%3D%2224%22%20flood-color%3D%22%23000000%22%20flood-opacity%3D%220.35%22%20%2F%3E%0A%20%20%20%20%3C%2Ffilter%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22url(%23bgGrad)%22%20%2F%3E%0A%20%20%3Ccircle%20cx%3D%22400%22%20cy%3D%22280%22%20r%3D%22300%22%20fill%3D%22url(%23glow)%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Outer%20Box%20Container%20--%3E%0A%20%20%3Crect%20x%3D%2280%22%20y%3D%2280%22%20width%3D%22640%22%20height%3D%22640%22%20rx%3D%2244%22%20fill%3D%22rgba(255%2C255%2C255%2C0.08)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.25)%22%20stroke-width%3D%222.5%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Central%20Software%20Emblem%20Frame%20--%3E%0A%20%20%3Cg%20transform%3D%22translate(400%2C%20300)%22%20filter%3D%22url(%23cardShadow)%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-90%22%20y%3D%22-90%22%20width%3D%22180%22%20height%3D%22180%22%20rx%3D%2238%22%20fill%3D%22rgba(255%2C255%2C255%2C0.18)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%223%22%20%2F%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate(0%2C%200)%22%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M-36%2036%20L0%20-36%20L36%2036%20L16%2036%20L0%204%20L-16%2036%20Z%22%20fill%3D%22%23FFFFFF%22%2F%3E%3Crect%20x%3D%22-10%22%20y%3D%2216%22%20width%3D%2220%22%20height%3D%228%22%20fill%3D%22%23FFFFFF%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fg%3E%0A%20%20%0A%20%20%3C!--%20Pill%20Badge%20--%3E%0A%20%20%3Crect%20x%3D%22250%22%20y%3D%22440%22%20width%3D%22300%22%20height%3D%2242%22%20rx%3D%2221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.22)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.45)%22%20stroke-width%3D%221.5%22%20%2F%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22467%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2215%22%20font-weight%3D%22900%22%20letter-spacing%3D%221.5%22%3ETR%E1%BB%8CN%20B%E1%BB%98%2020%2B%20%E1%BB%A8NG%20D%E1%BB%A4NG%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Title%20%26%20Subtitle%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22540%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2234%22%20font-weight%3D%22900%22%3EAdobe%20Creative%20Cloud%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22585%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.9)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22600%22%3EAll%20Apps%20%E2%80%A2%20Photoshop%2C%20Premiere%2C%20Illustrator%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Bottom%20Store%20Guarantee%20Tag%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22660%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.6)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20letter-spacing%3D%221%22%3EB%E1%BA%A2N%20QUY%E1%BB%80N%20CH%C3%8DNH%20H%C3%83NG%20100%25%20%E2%80%A2%20TPKSTORE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 195,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_10",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_95",
    name: "Gói Bản Quyền ChatGPT Plus & OpenAI API Credit 1 Năm Siêu Trí Tuệ",
    slug: "ban-quyen-chatgpt-plus-1-nam",
    description: "Trải nghiệm mô hình GPT-4o và OpenAI o1 suy luận bậc cao không giới hạn, phân tích dữ liệu chuyên sâu Advanced Data Analysis, tạo ảnh DALL-E 3 và giọng nói đàm thoại tự nhiên thế hệ mới.",
    price: 3890000,
    originalPrice: 4800000,
    stock: 999,
    thumbnail: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22bgGrad%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%2310A37F%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%230E7A5F%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23083C2F%22%20%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22glow%22%20cx%3D%2250%25%22%20cy%3D%2230%25%22%20r%3D%2250%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220.3%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220%22%20%2F%3E%0A%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22cardShadow%22%20x%3D%22-10%25%22%20y%3D%22-10%25%22%20width%3D%22120%25%22%20height%3D%22120%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2216%22%20stdDeviation%3D%2224%22%20flood-color%3D%22%23000000%22%20flood-opacity%3D%220.35%22%20%2F%3E%0A%20%20%20%20%3C%2Ffilter%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22url(%23bgGrad)%22%20%2F%3E%0A%20%20%3Ccircle%20cx%3D%22400%22%20cy%3D%22280%22%20r%3D%22300%22%20fill%3D%22url(%23glow)%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Outer%20Box%20Container%20--%3E%0A%20%20%3Crect%20x%3D%2280%22%20y%3D%2280%22%20width%3D%22640%22%20height%3D%22640%22%20rx%3D%2244%22%20fill%3D%22rgba(255%2C255%2C255%2C0.08)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.25)%22%20stroke-width%3D%222.5%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Central%20Software%20Emblem%20Frame%20--%3E%0A%20%20%3Cg%20transform%3D%22translate(400%2C%20300)%22%20filter%3D%22url(%23cardShadow)%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-90%22%20y%3D%22-90%22%20width%3D%22180%22%20height%3D%22180%22%20rx%3D%2238%22%20fill%3D%22rgba(255%2C255%2C255%2C0.18)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%223%22%20%2F%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate(0%2C%200)%22%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%220%22%20r%3D%2242%22%20fill%3D%22none%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%226%22%2F%3E%3Cpath%20d%3D%22M-20%20-10%20L0%20-30%20L20%20-10%20L12%2020%20L-12%2020%20Z%22%20fill%3D%22%23FFFFFF%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fg%3E%0A%20%20%0A%20%20%3C!--%20Pill%20Badge%20--%3E%0A%20%20%3Crect%20x%3D%22250%22%20y%3D%22440%22%20width%3D%22300%22%20height%3D%2242%22%20rx%3D%2221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.22)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.45)%22%20stroke-width%3D%221.5%22%20%2F%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22467%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2215%22%20font-weight%3D%22900%22%20letter-spacing%3D%221.5%22%3ETR%C3%8D%20TU%E1%BB%86%20NH%C3%82N%20T%E1%BA%A0O%20CAO%20C%E1%BA%A4P%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Title%20%26%20Subtitle%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22540%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2234%22%20font-weight%3D%22900%22%3EChatGPT%20Plus%20%26%20API%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22585%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.9)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22600%22%3EGPT-4o%2C%20OpenAI%20o1%20%26%20DALL-E%203%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Bottom%20Store%20Guarantee%20Tag%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22660%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.6)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20letter-spacing%3D%221%22%3EB%E1%BA%A2N%20QUY%E1%BB%80N%20CH%C3%8DNH%20H%C3%83NG%20100%25%20%E2%80%A2%20TPKSTORE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
    images: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewCount: 260,
    isFeatured: true,
    isNew: true,
    categoryId: "cat_10",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_96",
    name: "Bản Quyền Bộ Công Cụ Lập Trình JetBrains All Products Pack 1 Năm",
    slug: "ban-quyen-jetbrains-all-products-pack",
    description: "Bộ công cụ IDE lập trình số 1 thế giới: IntelliJ IDEA Ultimate, WebStorm, PyCharm Pro, CLion, Rider tích hợp trợ lý lập trình JetBrains AI Assistant tăng gấp 3 tốc độ code dự án.",
    price: 3490000,
    originalPrice: 4500000,
    stock: 999,
    thumbnail: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22bgGrad%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23000000%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%231E1E1E%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23303030%22%20%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22glow%22%20cx%3D%2250%25%22%20cy%3D%2230%25%22%20r%3D%2250%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220.3%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220%22%20%2F%3E%0A%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22cardShadow%22%20x%3D%22-10%25%22%20y%3D%22-10%25%22%20width%3D%22120%25%22%20height%3D%22120%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2216%22%20stdDeviation%3D%2224%22%20flood-color%3D%22%23000000%22%20flood-opacity%3D%220.35%22%20%2F%3E%0A%20%20%20%20%3C%2Ffilter%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22url(%23bgGrad)%22%20%2F%3E%0A%20%20%3Ccircle%20cx%3D%22400%22%20cy%3D%22280%22%20r%3D%22300%22%20fill%3D%22url(%23glow)%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Outer%20Box%20Container%20--%3E%0A%20%20%3Crect%20x%3D%2280%22%20y%3D%2280%22%20width%3D%22640%22%20height%3D%22640%22%20rx%3D%2244%22%20fill%3D%22rgba(255%2C255%2C255%2C0.08)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.25)%22%20stroke-width%3D%222.5%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Central%20Software%20Emblem%20Frame%20--%3E%0A%20%20%3Cg%20transform%3D%22translate(400%2C%20300)%22%20filter%3D%22url(%23cardShadow)%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-90%22%20y%3D%22-90%22%20width%3D%22180%22%20height%3D%22180%22%20rx%3D%2238%22%20fill%3D%22rgba(255%2C255%2C255%2C0.18)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%223%22%20%2F%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate(0%2C%200)%22%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-42%22%20y%3D%22-42%22%20width%3D%2284%22%20height%3D%2284%22%20rx%3D%2216%22%20fill%3D%22%23000000%22%20stroke%3D%22%23FF318C%22%20stroke-width%3D%224%22%2F%3E%3Crect%20x%3D%22-30%22%20y%3D%2216%22%20width%3D%2230%22%20height%3D%228%22%20fill%3D%22%23FF318C%22%2F%3E%3Cpath%20d%3D%22M-30%20-22%20L0%20-22%20M-15%20-22%20L-15%204%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%226%22%20stroke-linecap%3D%22round%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fg%3E%0A%20%20%0A%20%20%3C!--%20Pill%20Badge%20--%3E%0A%20%20%3Crect%20x%3D%22250%22%20y%3D%22440%22%20width%3D%22300%22%20height%3D%2242%22%20rx%3D%2221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.22)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.45)%22%20stroke-width%3D%221.5%22%20%2F%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22467%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2215%22%20font-weight%3D%22900%22%20letter-spacing%3D%221.5%22%3ECHO%20L%E1%BA%ACP%20TR%C3%8CNH%20VI%C3%8AN%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Title%20%26%20Subtitle%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22540%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2234%22%20font-weight%3D%22900%22%3EJetBrains%20All%20Products%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22585%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.9)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22600%22%3EIntelliJ%2C%20WebStorm%2C%20PyCharm%2C%20CLion%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Bottom%20Store%20Guarantee%20Tag%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22660%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.6)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20letter-spacing%3D%221%22%3EB%E1%BA%A2N%20QUY%E1%BB%80N%20CH%C3%8DNH%20H%C3%83NG%20100%25%20%E2%80%A2%20TPKSTORE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
    images: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 115,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_10",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_97",
    name: "Gói Lưu Trữ Đám Mây Google One 2TB Kèm Trợ Lý Gemini Advanced 1 Năm",
    slug: "goi-google-one-2tb-gemini-advanced",
    description: "2TB lưu trữ chia sẻ cho 5 thành viên qua Google Drive, Photos, Gmail, độc quyền truy cập mô hình AI Gemini 1.5 Pro với cửa sổ ngữ cảnh 1 triệu token đọc hiểu toàn bộ tài liệu và video dài.",
    price: 2690000,
    originalPrice: 3300000,
    stock: 999,
    thumbnail: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22bgGrad%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%234285F4%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%2334A853%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23FBBC05%22%20%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22glow%22%20cx%3D%2250%25%22%20cy%3D%2230%25%22%20r%3D%2250%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220.3%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220%22%20%2F%3E%0A%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22cardShadow%22%20x%3D%22-10%25%22%20y%3D%22-10%25%22%20width%3D%22120%25%22%20height%3D%22120%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2216%22%20stdDeviation%3D%2224%22%20flood-color%3D%22%23000000%22%20flood-opacity%3D%220.35%22%20%2F%3E%0A%20%20%20%20%3C%2Ffilter%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22url(%23bgGrad)%22%20%2F%3E%0A%20%20%3Ccircle%20cx%3D%22400%22%20cy%3D%22280%22%20r%3D%22300%22%20fill%3D%22url(%23glow)%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Outer%20Box%20Container%20--%3E%0A%20%20%3Crect%20x%3D%2280%22%20y%3D%2280%22%20width%3D%22640%22%20height%3D%22640%22%20rx%3D%2244%22%20fill%3D%22rgba(255%2C255%2C255%2C0.08)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.25)%22%20stroke-width%3D%222.5%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Central%20Software%20Emblem%20Frame%20--%3E%0A%20%20%3Cg%20transform%3D%22translate(400%2C%20300)%22%20filter%3D%22url(%23cardShadow)%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-90%22%20y%3D%22-90%22%20width%3D%22180%22%20height%3D%22180%22%20rx%3D%2238%22%20fill%3D%22rgba(255%2C255%2C255%2C0.18)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%223%22%20%2F%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate(0%2C%200)%22%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%22-16%22%20cy%3D%224%22%20r%3D%2224%22%20fill%3D%22%23EA4335%22%2F%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%224%22%20r%3D%2224%22%20fill%3D%22%2334A853%22%2F%3E%3Ccircle%20cx%3D%220%22%20cy%3D%22-16%22%20r%3D%2224%22%20fill%3D%22%234285F4%22%2F%3E%3Ccircle%20cx%3D%220%22%20cy%3D%224%22%20r%3D%2224%22%20fill%3D%22%23FBBC05%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fg%3E%0A%20%20%0A%20%20%3C!--%20Pill%20Badge%20--%3E%0A%20%20%3Crect%20x%3D%22250%22%20y%3D%22440%22%20width%3D%22300%22%20height%3D%2242%22%20rx%3D%2221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.22)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.45)%22%20stroke-width%3D%221.5%22%20%2F%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22467%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2215%22%20font-weight%3D%22900%22%20letter-spacing%3D%221.5%22%3EGOOGLE%20DRIVE%20%26%20PHOTOS%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Title%20%26%20Subtitle%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22540%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2234%22%20font-weight%3D%22900%22%3EGoogle%20One%202TB%20Cloud%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22585%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.9)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22600%22%3EK%C3%A8m%20Tr%E1%BB%A3%20L%C3%BD%20Gemini%20Advanced%20AI%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Bottom%20Store%20Guarantee%20Tag%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22660%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.6)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20letter-spacing%3D%221%22%3EB%E1%BA%A2N%20QUY%E1%BB%80N%20CH%C3%8DNH%20H%C3%83NG%20100%25%20%E2%80%A2%20TPKSTORE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 158,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_10",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_98",
    name: "Bản Quyền Phần Mềm Quản Lý Mật Khẩu 1Password Families 1 Năm",
    slug: "ban-quyen-1password-families-1-nam",
    description: "Lưu trữ không giới hạn mật khẩu, thẻ thanh toán ngân hàng, ghi chú bảo mật cho tối đa 5 thành viên gia đình, mã hóa đầu cuối AES 256-bit chuẩn bảo mật quốc tế và cảnh báo rò rỉ dữ liệu.",
    price: 950000,
    originalPrice: 1350000,
    stock: 999,
    thumbnail: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22bgGrad%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%230A85EA%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23055091%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23022B50%22%20%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22glow%22%20cx%3D%2250%25%22%20cy%3D%2230%25%22%20r%3D%2250%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220.3%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220%22%20%2F%3E%0A%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22cardShadow%22%20x%3D%22-10%25%22%20y%3D%22-10%25%22%20width%3D%22120%25%22%20height%3D%22120%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2216%22%20stdDeviation%3D%2224%22%20flood-color%3D%22%23000000%22%20flood-opacity%3D%220.35%22%20%2F%3E%0A%20%20%20%20%3C%2Ffilter%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22url(%23bgGrad)%22%20%2F%3E%0A%20%20%3Ccircle%20cx%3D%22400%22%20cy%3D%22280%22%20r%3D%22300%22%20fill%3D%22url(%23glow)%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Outer%20Box%20Container%20--%3E%0A%20%20%3Crect%20x%3D%2280%22%20y%3D%2280%22%20width%3D%22640%22%20height%3D%22640%22%20rx%3D%2244%22%20fill%3D%22rgba(255%2C255%2C255%2C0.08)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.25)%22%20stroke-width%3D%222.5%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Central%20Software%20Emblem%20Frame%20--%3E%0A%20%20%3Cg%20transform%3D%22translate(400%2C%20300)%22%20filter%3D%22url(%23cardShadow)%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-90%22%20y%3D%22-90%22%20width%3D%22180%22%20height%3D%22180%22%20rx%3D%2238%22%20fill%3D%22rgba(255%2C255%2C255%2C0.18)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%223%22%20%2F%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate(0%2C%200)%22%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%220%22%20r%3D%2240%22%20fill%3D%22none%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%228%22%2F%3E%3Ccircle%20cx%3D%220%22%20cy%3D%22-6%22%20r%3D%2210%22%20fill%3D%22%23FFFFFF%22%2F%3E%3Crect%20x%3D%22-5%22%20y%3D%22-6%22%20width%3D%2210%22%20height%3D%2222%22%20fill%3D%22%23FFFFFF%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fg%3E%0A%20%20%0A%20%20%3C!--%20Pill%20Badge%20--%3E%0A%20%20%3Crect%20x%3D%22250%22%20y%3D%22440%22%20width%3D%22300%22%20height%3D%2242%22%20rx%3D%2221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.22)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.45)%22%20stroke-width%3D%221.5%22%20%2F%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22467%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2215%22%20font-weight%3D%22900%22%20letter-spacing%3D%221.5%22%3EB%E1%BA%A2O%20M%E1%BA%ACT%20CHU%E1%BA%A8N%20QU%C3%82N%20%C4%90%E1%BB%98I%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Title%20%26%20Subtitle%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22540%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2234%22%20font-weight%3D%22900%22%3E1Password%20Families%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22585%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.9)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22600%22%3EQu%E1%BA%A3n%20L%C3%BD%20M%E1%BA%ADt%20Kh%E1%BA%A9u%205%20Th%C3%A0nh%20Vi%C3%AAn%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Bottom%20Store%20Guarantee%20Tag%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22660%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.6)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20letter-spacing%3D%221%22%3EB%E1%BA%A2N%20QUY%E1%BB%80N%20CH%C3%8DNH%20H%C3%83NG%20100%25%20%E2%80%A2%20TPKSTORE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 94,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_10",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_99",
    name: "Bản Quyền Bộ Đôi Ứng Dụng Sáng Tạo Apple Final Cut Pro & Logic Pro X",
    slug: "ban-quyen-final-cut-pro-logic-pro-x",
    description: "Bộ phần mềm dựng phim và xử lý âm thanh chuyên nghiệp nhất hệ sinh thái macOS, tối ưu hóa phần cứng chip Apple Silicon M-Series cho tốc độ render video ProRes 8K nhanh gấp 4 lần.",
    price: 7990000,
    originalPrice: 9500000,
    stock: 999,
    thumbnail: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22bgGrad%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%231C1C1E%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%232C2C2E%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%233A3A3C%22%20%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22glow%22%20cx%3D%2250%25%22%20cy%3D%2230%25%22%20r%3D%2250%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220.3%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220%22%20%2F%3E%0A%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22cardShadow%22%20x%3D%22-10%25%22%20y%3D%22-10%25%22%20width%3D%22120%25%22%20height%3D%22120%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2216%22%20stdDeviation%3D%2224%22%20flood-color%3D%22%23000000%22%20flood-opacity%3D%220.35%22%20%2F%3E%0A%20%20%20%20%3C%2Ffilter%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22url(%23bgGrad)%22%20%2F%3E%0A%20%20%3Ccircle%20cx%3D%22400%22%20cy%3D%22280%22%20r%3D%22300%22%20fill%3D%22url(%23glow)%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Outer%20Box%20Container%20--%3E%0A%20%20%3Crect%20x%3D%2280%22%20y%3D%2280%22%20width%3D%22640%22%20height%3D%22640%22%20rx%3D%2244%22%20fill%3D%22rgba(255%2C255%2C255%2C0.08)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.25)%22%20stroke-width%3D%222.5%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Central%20Software%20Emblem%20Frame%20--%3E%0A%20%20%3Cg%20transform%3D%22translate(400%2C%20300)%22%20filter%3D%22url(%23cardShadow)%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-90%22%20y%3D%22-90%22%20width%3D%22180%22%20height%3D%22180%22%20rx%3D%2238%22%20fill%3D%22rgba(255%2C255%2C255%2C0.18)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%223%22%20%2F%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate(0%2C%200)%22%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-40%22%20y%3D%22-30%22%20width%3D%2280%22%20height%3D%2260%22%20rx%3D%2210%22%20fill%3D%22%23FF3B30%22%2F%3E%3Cpath%20d%3D%22M-40%20-10%20L40%20-10%20M-20%20-30%20L-30%20-10%20M0%20-30%20L-10%20-10%20M20%20-30%20L10%20-10%20M40%20-30%20L30%20-10%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%224%22%2F%3E%3Cpolygon%20points%3D%22-8%2C6%2014%2C18%20-8%2C30%22%20fill%3D%22%23FFFFFF%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fg%3E%0A%20%20%0A%20%20%3C!--%20Pill%20Badge%20--%3E%0A%20%20%3Crect%20x%3D%22250%22%20y%3D%22440%22%20width%3D%22300%22%20height%3D%2242%22%20rx%3D%2221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.22)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.45)%22%20stroke-width%3D%221.5%22%20%2F%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22467%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2215%22%20font-weight%3D%22900%22%20letter-spacing%3D%221.5%22%3EAPPLE%20PRO%20CREATIVE%20SUITE%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Title%20%26%20Subtitle%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22540%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2234%22%20font-weight%3D%22900%22%3EFinal%20Cut%20%26%20Logic%20Pro%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22585%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.9)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22600%22%3ED%E1%BB%B1ng%20Phim%20%26%20X%E1%BB%AD%20L%C3%BD%20%C3%82m%20Thanh%20Chuy%C3%AAn%20Nghi%E1%BB%87p%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Bottom%20Store%20Guarantee%20Tag%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22660%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.6)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20letter-spacing%3D%221%22%3EB%E1%BA%A2N%20QUY%E1%BB%80N%20CH%C3%8DNH%20H%C3%83NG%20100%25%20%E2%80%A2%20TPKSTORE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 78,
    isFeatured: false,
    isNew: false,
    categoryId: "cat_10",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "prd_100",
    name: "Bản Quyền Phần Mềm Diệt Virus Bitdefender Total Security 5 Thiết Bị 2 Năm",
    slug: "bitdefender-total-security-5-thiet-bi",
    description: "Giải pháp bảo mật đa tầng bảo vệ cùng lúc 5 thiết bị (Windows, macOS, Android, iOS), chống trộm từ xa, chặn webcam nghe lén và bảo vệ quyền riêng tư toàn diện với mức chiếm dụng RAM cực thấp.",
    price: 690000,
    originalPrice: 950000,
    stock: 999,
    thumbnail: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22bgGrad%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23ED1C24%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%239E0B0F%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%234A0002%22%20%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22glow%22%20cx%3D%2250%25%22%20cy%3D%2230%25%22%20r%3D%2250%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220.3%22%20%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220%22%20%2F%3E%0A%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%3Cfilter%20id%3D%22cardShadow%22%20x%3D%22-10%25%22%20y%3D%22-10%25%22%20width%3D%22120%25%22%20height%3D%22120%25%22%3E%0A%20%20%20%20%20%20%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2216%22%20stdDeviation%3D%2224%22%20flood-color%3D%22%23000000%22%20flood-opacity%3D%220.35%22%20%2F%3E%0A%20%20%20%20%3C%2Ffilter%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22url(%23bgGrad)%22%20%2F%3E%0A%20%20%3Ccircle%20cx%3D%22400%22%20cy%3D%22280%22%20r%3D%22300%22%20fill%3D%22url(%23glow)%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Outer%20Box%20Container%20--%3E%0A%20%20%3Crect%20x%3D%2280%22%20y%3D%2280%22%20width%3D%22640%22%20height%3D%22640%22%20rx%3D%2244%22%20fill%3D%22rgba(255%2C255%2C255%2C0.08)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.25)%22%20stroke-width%3D%222.5%22%20%2F%3E%0A%20%20%0A%20%20%3C!--%20Central%20Software%20Emblem%20Frame%20--%3E%0A%20%20%3Cg%20transform%3D%22translate(400%2C%20300)%22%20filter%3D%22url(%23cardShadow)%22%3E%0A%20%20%20%20%3Crect%20x%3D%22-90%22%20y%3D%22-90%22%20width%3D%22180%22%20height%3D%22180%22%20rx%3D%2238%22%20fill%3D%22rgba(255%2C255%2C255%2C0.18)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%223%22%20%2F%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate(0%2C%200)%22%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M-36%20-30%20L0%20-45%20L36%20-30%20L36%2015%20C36%2038%200%2052%200%2052%20C0%2052%20-36%2038%20-36%2015%20Z%22%20fill%3D%22%23FFFFFF%22%2F%3E%3Cpath%20d%3D%22M-18%20-5%20L0%2015%20L18%20-5%22%20fill%3D%22none%22%20stroke%3D%22%23ED1C24%22%20stroke-width%3D%228%22%20stroke-linecap%3D%22round%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fg%3E%0A%20%20%0A%20%20%3C!--%20Pill%20Badge%20--%3E%0A%20%20%3Crect%20x%3D%22250%22%20y%3D%22440%22%20width%3D%22300%22%20height%3D%2242%22%20rx%3D%2221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.22)%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.45)%22%20stroke-width%3D%221.5%22%20%2F%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22467%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2215%22%20font-weight%3D%22900%22%20letter-spacing%3D%221.5%22%3ETOP%201%20AN%20NINH%20QU%E1%BB%90C%20T%E1%BA%BE%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Title%20%26%20Subtitle%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22540%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2234%22%20font-weight%3D%22900%22%3EBitdefender%20Total%20Security%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22585%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.9)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22600%22%3EB%E1%BA%A3o%20V%E1%BB%87%20%C4%90a%20N%E1%BB%81n%20T%E1%BA%A3ng%205%20Thi%E1%BA%BFt%20B%E1%BB%8B%20(2%20N%C4%83m)%3C%2Ftext%3E%0A%20%20%0A%20%20%3C!--%20Bottom%20Store%20Guarantee%20Tag%20--%3E%0A%20%20%3Ctext%20x%3D%22400%22%20y%3D%22660%22%20text-anchor%3D%22middle%22%20fill%3D%22rgba(255%2C255%2C255%2C0.6)%22%20font-family%3D%22-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2Csans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20letter-spacing%3D%221%22%3EB%E1%BA%A2N%20QUY%E1%BB%80N%20CH%C3%8DNH%20H%C3%83NG%20100%25%20%E2%80%A2%20TPKSTORE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
    images: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 88,
    isFeatured: false,
    isNew: true,
    categoryId: "cat_10",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  }
];

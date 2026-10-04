import { removeVietnameseAccents } from "./vietnameseUtils";

export interface CategoryDefinition {
  id: string; // e.g. "cat_1"
  name: string; // Official Vietnamese name
  key: string; // English key e.g. "phone"
  slug: string; // URL slug e.g. "dien-thoai-tablet"
  aliases: string[]; // Normalized aliases (lowercase, unaccented, sorted by length descending)
  rawAliases: string[];
}

const RAW_CATEGORY_CONFIG = [
  {
    id: "cat_1",
    name: "Điện thoại & Tablet",
    key: "phone",
    slug: "dien-thoai-tablet",
    aliasesText: "điện thoại, smartphone, mobile phone, phone, dtdd, điện thoại di động, dien thoai, smartphone Android, Android phone, iPhone, Apple iPhone, Samsung Galaxy, Galaxy, Xiaomi, OPPO, vivo, realme, Google Pixel, điện thoại 5G, điện thoại AI, điện thoại gaming, smartphone giá rẻ, smartphone cao cấp, tablet, máy tính bảng, may tinh bang, iPad, iPad Air, iPad Pro, Android tablet, Galaxy Tab, tablet học tập, tablet gaming"
  },
  {
    id: "cat_2",
    name: "Laptop & Macbook",
    key: "laptop",
    slug: "laptop-macbook",
    aliasesText: "laptop, máy tính xách tay, notebook, ultrabook, gaming laptop, laptop gaming, laptop văn phòng, laptop sinh viên, laptop đồ họa, laptop mỏng nhẹ, laptop AI, laptop Windows, máy tính laptop, may tinh xach tay, macbook, mac book, MacBook Air, MacBook Pro, Apple laptop, laptop Apple, máy Mac, máy tính Mac, laptop M1, laptop M2, laptop M3, laptop M4, laptop Core i5, laptop Core i7, laptop Ryzen, laptop Snapdragon, mac, imac, mac mini"
  },
  {
    id: "cat_3",
    name: "Tai nghe & Âm thanh",
    key: "audio",
    slug: "tai-nghe-am-thanh",
    aliasesText: "tai nghe, headphone, headphones, headset, earphone, earbuds, tai nghe Bluetooth, tai nghe không dây, wireless headphones, wireless earbuds, TWS, tai nghe true wireless, tai nghe gaming, gaming headset, tai nghe chụp tai, over-ear, on-ear, in-ear, tai nghe chống ồn, ANC headphones, AirPods, Galaxy Buds, loa, speaker, Bluetooth speaker, loa Bluetooth, soundbar, loa soundbar, DAC, amplifier, amp, micro, microphone, am thanh"
  },
  {
    id: "cat_4",
    name: "Đồng hồ thông minh",
    key: "watch",
    slug: "dong-ho-thong-minh",
    aliasesText: "smartwatch, smart watch, đồng hồ thông minh, dong ho thong minh, đồng hồ AI, Apple Watch, Galaxy Watch, Garmin watch, Huawei Watch, Xiaomi Watch, Amazfit, fitness watch, sports watch, đồng hồ thể thao, đồng hồ GPS, đồng hồ sức khỏe, fitness tracker, vòng đeo tay thông minh, smart band, Mi Band, wearable, thiết bị đeo thông minh, dong ho, watch"
  },
  {
    id: "cat_5",
    name: "Phụ kiện & Cáp sạc",
    key: "accessory",
    slug: "phu-kien-cap-sac",
    aliasesText: "phụ kiện điện thoại, phụ kiện laptop, phụ kiện công nghệ, accessories, tech accessories, cáp sạc, dây sạc, charging cable, charger cable, USB cable, USB-C cable, Type-C cable, Lightning cable, Thunderbolt cable, cáp USB C, củ sạc, adapter sạc, charger, fast charger, sạc nhanh, GaN charger, sạc GaN, sạc không dây, wireless charger, MagSafe charger, power bank, pin dự phòng, sạc dự phòng, pin sạc dự phòng, sac du phong, pin du phong, pin sac, hub chuyển đổi, cổng chuyển đổi, cong chuyen doi, hub USB, USB-C hub, dock, docking station, adapter, bộ chuyển đổi, bút cảm ứng, but cam ung, apple pencil, bút stylus, cáp hdmi, phu kien"
  },
  {
    id: "cat_6",
    name: "Nhà thông minh (Smart Home)",
    key: "smarthome",
    slug: "nha-thong-minh",
    aliasesText: "smart home, nhà thông minh, nha thong minh, thiết bị nhà thông minh, smart device, IoT device, thiết bị IoT, smart light, đèn thông minh, smart bulb, ổ cắm thông minh, smart plug, công tắc thông minh, smart switch, camera thông minh, smart camera, camera WiFi, chuông cửa thông minh, video doorbell, khóa cửa thông minh, smart lock, robot hút bụi, robot vacuum, cảm biến thông minh, smart sensor, smart thermostat, Google Home, Alexa, HomeKit, Matter, Zigbee, camera, robot, hut bui, den, khoa"
  },
  {
    id: "cat_7",
    name: "Màn hình máy tính",
    key: "monitor",
    slug: "man-hinh-may-tinh",
    aliasesText: "màn hình máy tính, màn hình PC, monitor, computer monitor, PC monitor, display, gaming monitor, màn hình gaming, màn hình văn phòng, màn hình đồ họa, màn hình 4K, 4K monitor, màn hình OLED, OLED monitor, Mini LED monitor, ultrawide monitor, màn hình cong, curved monitor, màn hình 144Hz, 165Hz monitor, 240Hz monitor, màn hình USB-C, portable monitor, màn hình di động, man hinh"
  },
  {
    id: "cat_8",
    name: "Bàn phím & Chuột",
    key: "keyboard_mouse",
    slug: "ban-phim-chuot",
    aliasesText: "bàn phím, keyboard, ban phim, mechanical keyboard, bàn phím cơ, gaming keyboard, bàn phím gaming, keyboard wireless, bàn phím không dây, Bluetooth keyboard, low profile keyboard, custom keyboard, bàn phím custom, chuột, mouse, computer mouse, gaming mouse, chuột gaming, wireless mouse, chuột không dây, Bluetooth mouse, ergonomic mouse, chuột công thái học, trackball, mouse pad, desk mat"
  },
  {
    id: "cat_9",
    name: "Thiết bị mạng & Wi-Fi 7",
    key: "network",
    slug: "thiet-bi-mang",
    aliasesText: "thiết bị mạng, network device, networking, router, WiFi router, bộ phát WiFi, modem, modem WiFi, access point, AP WiFi, mesh WiFi, WiFi mesh, bộ kích sóng WiFi, WiFi extender, repeater, switch mạng, network switch, Ethernet switch, card mạng, network adapter, WiFi adapter, USB WiFi, WiFi 6, Wi-Fi 6, WiFi 6E, Wi-Fi 6E, WiFi 7, Wi-Fi 7, router WiFi 7, mesh WiFi 7, BE router, 802.11be, MLO WiFi, access point WiFi 7, mang, wifi"
  },
  {
    id: "cat_10",
    name: "Phần mềm & Bản quyền",
    key: "software",
    slug: "phan-mem-ban-quyen",
    aliasesText: "phần mềm, software, bản quyền phần mềm, software license, license, licence, bản quyền, key bản quyền, activation key, product key, license key, key phần mềm, phần mềm chính hãng, genuine software, Microsoft 365, Office 365, Microsoft Office, Windows 11, Windows license, Office license, antivirus, phần mềm diệt virus, VPN, VPN software, Adobe Creative Cloud, Photoshop, Premiere Pro, AutoCAD, CAD software, backup software, cloud software, SaaS, phan mem, ban quyen, office, windows, kaspersky"
  }
];

export const CATEGORIES: CategoryDefinition[] = RAW_CATEGORY_CONFIG.map(cat => {
  const parts = cat.aliasesText.split(",").map(s => s.trim()).filter(Boolean);
  const normalizedSet = new Set<string>();
  for (const p of parts) {
    normalizedSet.add(p.toLowerCase());
    normalizedSet.add(removeVietnameseAccents(p));
  }
  normalizedSet.add(cat.key);
  normalizedSet.add(cat.slug);
  normalizedSet.add(removeVietnameseAccents(cat.name));

  const sortedAliases = Array.from(normalizedSet).sort((a, b) => b.length - a.length);
  return {
    id: cat.id,
    name: cat.name,
    key: cat.key,
    slug: cat.slug,
    aliases: sortedAliases,
    rawAliases: parts
  };
});

/**
 * Standard CATEGORY_MAP mapping cat_id -> normalized aliases
 */
export const CATEGORY_MAP: Record<string, string[]> = CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = cat.aliases;
  return acc;
}, {} as Record<string, string[]>);

/**
 * High-accuracy longest-match category resolution.
 * Checks ID, key, slug, name, and aliases with word boundary protection for short words.
 */
export function findCategoryMatch(textOrCat: string): CategoryDefinition | null {
  if (!textOrCat) return null;
  const unaccented = removeVietnameseAccents(textOrCat);
  const cleanOriginal = textOrCat.trim().toLowerCase();

  // 1. Exact ID check (e.g. "cat_1" .. "cat_10")
  const byId = CATEGORIES.find(c => c.id.toLowerCase() === cleanOriginal);
  if (byId) return byId;

  // 2. Exact key check (e.g. "phone", "laptop", "audio", "watch", "accessory", "smarthome", "monitor", "keyboard_mouse", "network", "software")
  const byKey = CATEGORIES.find(c => c.key.toLowerCase() === cleanOriginal || c.slug.toLowerCase() === cleanOriginal);
  if (byKey) return byKey;

  // 3. Exact unaccented name check
  const byName = CATEGORIES.find(c => removeVietnameseAccents(c.name) === unaccented);
  if (byName) return byName;

  // 4. Longest-match alias search over text
  let bestMatch: CategoryDefinition | null = null;
  let maxMatchLen = 0;

  for (const cat of CATEGORIES) {
    for (const alias of cat.aliases) {
      let isMatch = false;
      if (alias.length <= 4) {
        // Enforce word boundaries for short terms like mac, amp, sac, pin, wifi
        isMatch = new RegExp(`(^|\\s|[.,;!?])${alias}($|\\s|[.,;!?])`, "i").test(unaccented);
      } else {
        isMatch = unaccented.includes(alias);
      }

      if (isMatch && alias.length > maxMatchLen) {
        maxMatchLen = alias.length;
        bestMatch = cat;
      }
    }
  }

  return bestMatch;
}

/**
 * Brand synonyms & official brand mappings
 */
export const BRAND_MAPPINGS: Array<{ match: string; brand: string }> = [
  { match: "apple", brand: "Apple" },
  { match: "iphone", brand: "Apple" },
  { match: "ipad", brand: "Apple" },
  { match: "macbook", brand: "Apple" },
  { match: "airpods", brand: "Apple" },
  { match: "mac", brand: "Apple" },
  { match: "imac", brand: "Apple" },
  { match: "may mac", brand: "Apple" },
  { match: "apple watch", brand: "Apple" },

  { match: "samsung", brand: "Samsung" },
  { match: "galaxy tab", brand: "Samsung" },
  { match: "galaxy watch", brand: "Samsung" },
  { match: "galaxy buds", brand: "Samsung" },
  { match: "galaxy", brand: "Samsung" },

  { match: "xiaomi", brand: "Xiaomi" },
  { match: "mi band", brand: "Xiaomi" },
  { match: "redmi", brand: "Xiaomi" },
  { match: "amazfit", brand: "Amazfit" },

  { match: "oppo", brand: "OPPO" },
  { match: "vivo", brand: "vivo" },
  { match: "realme", brand: "realme" },
  { match: "google pixel", brand: "Google" },
  { match: "pixel", brand: "Google" },
  { match: "google", brand: "Google" },

  { match: "huawei", brand: "Huawei" },
  { match: "garmin", brand: "Garmin" },

  { match: "asus", brand: "ASUS" },
  { match: "dell", brand: "Dell" },
  { match: "hp", brand: "HP" },
  { match: "lenovo", brand: "Lenovo" },
  { match: "acer", brand: "Acer" },
  { match: "msi", brand: "MSI" },

  { match: "sony", brand: "Sony" },
  { match: "marshall", brand: "Marshall" },
  { match: "bose", brand: "Bose" },
  { match: "jbl", brand: "JBL" },
  { match: "sennheiser", brand: "Sennheiser" },

  { match: "anker", brand: "Anker" },
  { match: "ugreen", brand: "Ugreen" },
  { match: "baseus", brand: "Baseus" },
  { match: "belkin", brand: "Belkin" },

  { match: "logitech", brand: "Logitech" },
  { match: "keychron", brand: "Keychron" },
  { match: "razer", brand: "Razer" },
  { match: "filco", brand: "Filco" },
  { match: "wooting", brand: "Wooting" },
  { match: "nuphy", brand: "NuPhy" },

  { match: "tp-link", brand: "TP-Link" },
  { match: "tplink", brand: "TP-Link" },
  { match: "netgear", brand: "Netgear" },
  { match: "ubiquiti", brand: "Ubiquiti" },
  { match: "draytek", brand: "DrayTek" },
  { match: "synology", brand: "Synology" },
  { match: "cisco", brand: "Cisco" },

  { match: "microsoft", brand: "Microsoft" },
  { match: "windows 11", brand: "Microsoft" },
  { match: "windows", brand: "Microsoft" },
  { match: "office 365", brand: "Microsoft" },
  { match: "office", brand: "Microsoft" },
  { match: "adobe", brand: "Adobe" },
  { match: "autodesk", brand: "Autodesk" },
  { match: "kaspersky", brand: "Kaspersky" },
  { match: "bitdefender", brand: "Bitdefender" },

  { match: "philips", brand: "Philips" },
  { match: "aqara", brand: "Aqara" },
  { match: "ezviz", brand: "Ezviz" },
  { match: "dreame", brand: "Dreame" },
  { match: "roborock", brand: "Roborock" },
  { match: "ecovacs", brand: "Ecovacs" }
].sort((a, b) => b.match.length - a.match.length);

/**
 * High-accuracy brand resolution from text
 */
export function findBrandMatch(text: string): string | null {
  if (!text) return null;
  const unaccented = removeVietnameseAccents(text);
  for (const b of BRAND_MAPPINGS) {
    let isMatch = false;
    if (b.match.length <= 4) {
      isMatch = new RegExp(`(^|\\s|[.,;!?])${b.match}($|\\s|[.,;!?])`, "i").test(unaccented);
    } else {
      isMatch = unaccented.includes(b.match);
    }
    if (isMatch) return b.brand;
  }
  return null;
}

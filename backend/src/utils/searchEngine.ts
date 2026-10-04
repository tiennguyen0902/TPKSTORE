export function removeVietnameseTones(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

interface CategoryIntent {
  catId: string;
  keywords: string[];
}

export const CATEGORY_INTENT_MAP: CategoryIntent[] = [
  {
    catId: "cat_5",
    keywords: [
      "cuc sac", "cu sac", "sac", "cap sac", "day sac", 
      "pin du phong", "sac du phong", "charger", "powerbank", "magsafe", "dock", "hub"
    ]
  },
  {
    catId: "cat_1",
    keywords: [
      "dien thoai", "smartphone", "di dong", "mobile", "phone", 
      "may tinh bang", "tablet", "ipad", "tab"
    ]
  },
  {
    catId: "cat_2",
    keywords: [
      "laptop", "may tinh xach tay", "macbook", "notebook", "ultrabook", "zenbook", "thinkpad"
    ]
  },
  {
    catId: "cat_3",
    keywords: [
      "tai nghe", "headphone", "earphone", "airpods", "loa", "am thanh", "soundbar", "buds"
    ]
  },
  {
    catId: "cat_4",
    keywords: [
      "dong ho", "smartwatch", "dong ho thong minh", "apple watch", "galaxy watch", "garmin"
    ]
  },
  {
    catId: "cat_6",
    keywords: [
      "nha thong minh", "smart home", "robot hut bui", "hut bui", "khoa cua", "camera", "may loc"
    ]
  },
  {
    catId: "cat_7",
    keywords: [
      "man hinh", "monitor", "man hinh may tinh", "oled", "display"
    ]
  },
  {
    catId: "cat_8",
    keywords: [
      "ban phim", "chuot", "keyboard", "mouse", "ban phim co"
    ]
  },
  {
    catId: "cat_9",
    keywords: [
      "thiet bi mang", "wifi", "wi-fi", "router", "mang", "mesh", "switch"
    ]
  },
  {
    catId: "cat_10",
    keywords: [
      "phan mem", "ban quyen", "office", "windows", "antivirus", "diet virus", "adobe", "chatgpt"
    ]
  }
];

export function scoreProduct(product: any, rawQuery: string): number {
  const qNorm = removeVietnameseTones(rawQuery);
  const qTokens = qNorm.split(/\s+/).filter(Boolean);
  if (qTokens.length === 0) return 0;

  const nameNorm = removeVietnameseTones(product.name || "");
  const descNorm = removeVietnameseTones(product.description || "");
  const catNameNorm = removeVietnameseTones(product.category?.name || "");
  const catSlug = product.category?.slug || "";

  let score = 0;

  // 1. Exact full phrase in Name: Highest Priority
  if (nameNorm.includes(qNorm)) {
    score += 250;
  }

  // 2. Token matching in Name
  const allTokensInName = qTokens.every((tok) => nameNorm.includes(tok));
  if (allTokensInName) {
    score += 150;
  } else {
    const tokensInNameCount = qTokens.filter((tok) => nameNorm.includes(tok)).length;
    score += tokensInNameCount * 35;
  }

  // 3. Category Name Matching
  if (catNameNorm.includes(qNorm)) {
    score += 180;
  }
  const allTokensInCat = qTokens.every((tok) => catNameNorm.includes(tok));
  if (allTokensInCat) {
    score += 120;
  }

  // 4. Category Intent & Synonyms
  for (const intent of CATEGORY_INTENT_MAP) {
    for (const kw of intent.keywords) {
      if (qNorm.includes(kw) || kw.includes(qNorm)) {
        if (product.categoryId === intent.catId || catSlug.includes(kw)) {
          score += 160;
        }
      }
    }
  }

  // 5. Specific Sub-Intent Disambiguation (Phone vs Tablet vs Charger):
  const hasChargerKeyword = ["sac", "cu sac", "cuc sac", "cap sac", "day sac"].some((kw) => qNorm.includes(kw));
  const isPhoneSearch =
    (qNorm.includes("dien thoai") || qNorm.includes("smartphone") || qNorm.includes("phone") || qNorm === "dt") &&
    !hasChargerKeyword;
  const isTabletSearch =
    qNorm.includes("tablet") || qNorm.includes("may tinh bang") || qNorm.includes("ipad") || qNorm.includes("tab");
  const isChargerForPhone =
    hasChargerKeyword && (qNorm.includes("dien thoai") || qNorm.includes("phone") || qNorm.includes("dt"));

  const isPhoneProduct =
    nameNorm.includes("iphone") ||
    nameNorm.includes("galaxy s") ||
    nameNorm.includes("galaxy z") ||
    nameNorm.includes("xiaomi") ||
    nameNorm.includes("pixel") ||
    nameNorm.includes("rog phone") ||
    nameNorm.includes("phone");

  const isTabletProduct = nameNorm.includes("ipad") || nameNorm.includes("tab") || nameNorm.includes("tablet");

  if (isPhoneSearch && isPhoneProduct) {
    score += 180;
  }
  if (isTabletSearch && isTabletProduct) {
    score += 180;
  }
  if (isChargerForPhone && product.categoryId === "cat_5") {
    score += 300;
  }

  // 6. Description match (Carefully avoid false positive accessories matching phones)
  if (descNorm.includes(qNorm)) {
    const isPrimaryCategoryProduct = CATEGORY_INTENT_MAP.some((intent) =>
      intent.keywords.some((kw) => qNorm.includes(kw) || kw.includes(qNorm)) && product.categoryId === intent.catId
    );
    if (isPrimaryCategoryProduct || nameNorm.includes(qNorm)) {
      score += 25;
    }
  } else {
    const tokensInDesc = qTokens.filter((tok) => descNorm.includes(tok)).length;
    score += tokensInDesc * 2;
  }

  return score;
}

export function filterAndRankProducts(products: any[], searchQuery: string): any[] {
  const trimmed = searchQuery.trim();
  if (!trimmed) return products;

  const scored = products
    .map((p) => ({ product: p, score: scoreProduct(p, trimmed) }))
    .filter((item) => item.score > 25)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);

  return scored;
}

"use strict";
/**
 * Vietnamese Natural Language Utilities
 * Normalizes colloquial phrases, price expressions, units, and brand/category terms.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeVietnameseAccents = removeVietnameseAccents;
exports.extractPriceRange = extractPriceRange;
exports.extractSortPreference = extractSortPreference;
exports.extractStockFilter = extractStockFilter;
exports.extractDiscountFilter = extractDiscountFilter;
exports.isContextReferenceQuery = isContextReferenceQuery;
// Mapping of Vietnamese number words to numerical values
const VN_NUMBERS = {
    "khong": 0, "không": 0,
    "mot": 1, "một": 1, "mốt": 1,
    "hai": 2,
    "ba": 3,
    "bon": 4, "bốn": 4, "tư": 4,
    "nam": 5, "năm": 5, "lăm": 5,
    "sau": 6, "sáu": 6,
    "bay": 7, "bảy": 7,
    "tam": 8, "tám": 8,
    "chin": 9, "chín": 9,
    "muoi": 10, "mười": 10, "chuc": 10, "chục": 10,
    "tram": 100, "trăm": 100,
    "nghin": 1000, "nghìn": 1000, "ngan": 1000, "ngàn": 1000, "k": 1000,
    "trieu": 1000000, "triệu": 1000000, "tr": 1000000, "cu": 1000000, "củ": 1000000, "m": 1000000,
    "ty": 1000000000, "tỷ": 1000000000
};
function removeVietnameseAccents(str) {
    if (!str)
        return "";
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .trim();
}
/**
 * Parse colloquial price expressions such as:
 * - "20 củ", "20 triệu", "20tr", "500k", "1 tỷ"
 * - "dưới 20 triệu", "< 20tr", "tối đa 20 củ"
 * - "từ 10 đến 20 triệu", "10-20tr"
 * - "khoảng 30 củ", "tầm 15 triệu"
 * - "trên 15 triệu", "> 15tr"
 */
function extractPriceRange(text) {
    const norm = text.toLowerCase().trim();
    const unaccented = removeVietnameseAccents(norm);
    let minPrice = null;
    let maxPrice = null;
    let targetPrice = null;
    // Helper to convert number string + unit (e.g. "20", "trieu") to number
    function parseAmount(numStr, unitStr) {
        let base = parseFloat(numStr.replace(",", "."));
        if (isNaN(base))
            return 0;
        const unit = (unitStr || "").toLowerCase();
        if (unit.includes("cu") || unit.includes("củ") || unit.includes("trieu") || unit.includes("triệu") || unit === "tr" || unit === "m") {
            return Math.round(base * 1000000);
        }
        if (unit.includes("ty") || unit.includes("tỷ")) {
            return Math.round(base * 1000000000);
        }
        if (unit.includes("k") || unit.includes("nghin") || unit.includes("nghìn") || unit.includes("ngan") || unit.includes("ngàn")) {
            return Math.round(base * 1000);
        }
        // If no unit but number is small like 20, assume million in store context
        if (base > 0 && base <= 150 && !unitStr) {
            return Math.round(base * 1000000);
        }
        return Math.round(base);
    }
    // 1. Range: "từ X đến Y [triệu/củ/k]" or "X - Y [triệu/củ/k]"
    const rangeRegex = /(?:tu|từ)?\s*(\d+(?:[.,]\d+)?)\s*(?:den|đến|-|toi|tới)\s*(\d+(?:[.,]\d+)?)\s*(cu|củ|trieu|triệu|tr|m|k|nghin|nghìn|ngan|ngàn|ty|tỷ)?/i;
    const rangeMatch = norm.match(rangeRegex);
    if (rangeMatch) {
        const unit = rangeMatch[3] || "trieu";
        const p1 = parseAmount(rangeMatch[1], unit);
        const p2 = parseAmount(rangeMatch[2], unit);
        minPrice = Math.min(p1, p2);
        maxPrice = Math.max(p1, p2);
        return { minPrice, maxPrice, targetPrice: null };
    }
    // 2. Below / Under / Max: "dưới X [triệu/củ/k]", "< X", "it hon X", "toi da X", "khong qua X"
    const underRegex = /(?:duoi|dưới|<=?|<|it hon|ít hơn|toi da|tối đa|khong qua|không quá)\s*(\d+(?:[.,]\d+)?)\s*(cu|củ|trieu|triệu|tr|m|k|nghin|nghìn|ngan|ngàn|ty|tỷ)?/i;
    const underMatch = norm.match(underRegex);
    if (underMatch) {
        const unit = underMatch[2] || "trieu";
        maxPrice = parseAmount(underMatch[1], unit);
        return { minPrice: null, maxPrice, targetPrice: null };
    }
    // 3. Above / Min: "tren X [triệu/củ/k]", "> X", "hon X", "toi thieu X"
    const aboveRegex = /(?:tren|trên|>=?|>|hon|hơn|toi thieu|tối thiểu)\s*(\d+(?:[.,]\d+)?)\s*(cu|củ|trieu|triệu|tr|m|k|nghin|nghìn|ngan|ngàn|ty|tỷ)?/i;
    const aboveMatch = norm.match(aboveRegex);
    if (aboveMatch) {
        const unit = aboveMatch[2] || "trieu";
        minPrice = parseAmount(aboveMatch[1], unit);
        return { minPrice, maxPrice: null, targetPrice: null };
    }
    // 4. Around: "khoang X [triệu/củ/k]", "tam X [triệu/củ/k]", "~ X"
    const aroundRegex = /(?:khoang|khoảng|tam|tầm|co|cỡ|~)\s*(\d+(?:[.,]\d+)?)\s*(cu|củ|trieu|triệu|tr|m|k|nghin|nghìn|ngan|ngàn|ty|tỷ)?/i;
    const aroundMatch = norm.match(aroundRegex);
    if (aroundMatch) {
        const unit = aroundMatch[2] || "trieu";
        const center = parseAmount(aroundMatch[1], unit);
        minPrice = Math.round(center * 0.85);
        maxPrice = Math.round(center * 1.15);
        return { minPrice, maxPrice, targetPrice: center };
    }
    // 5. Direct single price: "20 củ", "20 triệu", "20tr", "500k"
    const singleRegex = /(\d+(?:[.,]\d+)?)\s*(cu|củ|trieu|triệu|tr|k|ty|tỷ)/i;
    const singleMatch = norm.match(singleRegex);
    if (singleMatch) {
        const amount = parseAmount(singleMatch[1], singleMatch[2]);
        // By default for queries like "laptop 20 củ", search in budget range up to 20m or around 20m
        maxPrice = amount;
        return { minPrice: null, maxPrice, targetPrice: amount };
    }
    return { minPrice: null, maxPrice: null, targetPrice: null };
}
/**
 * Detect sorting requirements:
 * - "rẻ nhất", "thấp nhất", "gia re" -> price_asc
 * - "đắt nhất", "cao cấp nhất", "xịn nhất" -> price_desc
 * - "đánh giá cao nhất", "tốt nhất" -> rating_desc
 * - "mới nhất" -> newest
 */
function extractSortPreference(text) {
    const unaccented = removeVietnameseAccents(text);
    if (unaccented.includes("re nhat") ||
        unaccented.includes("thap nhat") ||
        unaccented.includes("gia re nhat") ||
        unaccented.includes("it tien nhat")) {
        return "price_asc";
    }
    if (unaccented.includes("dat nhat") ||
        unaccented.includes("cao cap nhat") ||
        unaccented.includes("xin nhat") ||
        unaccented.includes("nhieu tien nhat")) {
        return "price_desc";
    }
    if (unaccented.includes("danh gia cao") ||
        unaccented.includes("tot nhat") ||
        unaccented.includes("hot nhat") ||
        unaccented.includes("pho bien nhat")) {
        return "rating_desc";
    }
    if (unaccented.includes("moi nhat") || unaccented.includes("vua ra mat")) {
        return "newest";
    }
    return null;
}
/**
 * Detect stock availability query:
 * - "còn hàng không", "sẵn hàng", "còn không", "co san khong"
 */
function extractStockFilter(text) {
    const unaccented = removeVietnameseAccents(text);
    if (unaccented.includes("con hang") ||
        unaccented.includes("san hang") ||
        unaccented.includes("co san") ||
        unaccented.includes("con khong")) {
        return true;
    }
    return null;
}
/**
 * Detect discount / promotion query:
 * - "đang giảm giá", "khuyến mãi", "sale", "giam gia", "uu dai"
 */
function extractDiscountFilter(text) {
    const unaccented = removeVietnameseAccents(text);
    return (unaccented.includes("giam gia") ||
        unaccented.includes("khuyen mai") ||
        unaccented.includes("sale") ||
        unaccented.includes("uu dai") ||
        unaccented.includes("giam sau"));
}
/**
 * Detect conversation context references:
 * e.g., "cái nào", "con nào", "sản phẩm này", "giá bao nhiêu", "còn hàng không", "cấu hình nó thế nào"
 */
function isContextReferenceQuery(text) {
    const unaccented = removeVietnameseAccents(text);
    const patterns = [
        "cai nao", "con nao", "chiec nao", "mau nao", "loai nao",
        "san pham nay", "con nay", "cai nay", "chiec nay",
        "gia bao nhieu", "gia no", "con hang khong", "thong so",
        "cau hinh", "pin the nao", "camera the nao", "so sanh chung",
        "mau trang", "mau den", "co mau gi", "xem chi tiet", "mua cai nay"
    ];
    return patterns.some(p => unaccented.includes(p));
}

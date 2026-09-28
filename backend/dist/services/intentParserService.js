"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentParserService = void 0;
const axios_1 = __importDefault(require("axios"));
const vietnameseUtils_1 = require("./vietnameseUtils");
const KNOWN_BRANDS = [
    "samsung", "apple", "iphone", "ipad", "macbook", "airpods",
    "asus", "dell", "hp", "lenovo", "sony", "marshall", "garmin",
    "anker", "philips", "logitech", "keychron", "rain", "microsoft", "kaspersky"
];
const KNOWN_CATEGORIES = [
    { key: "phone", aliases: ["dien thoai", "phone", "smartphone", "tablet", "ipad", "dien thoai & tablet"] },
    { key: "laptop", aliases: ["laptop", "macbook", "may tinh xach tay", "laptop & macbook"] },
    { key: "audio", aliases: ["tai nghe", "headphone", "loa", "am thanh", "soundbar", "tai nghe & am thanh"] },
    { key: "watch", aliases: ["dong ho", "smartwatch", "apple watch", "dong ho thong minh"] },
    { key: "accessory", aliases: ["phu kien", "cap", "sac", "pin", "du phong", "gan", "phu kien & cap sac"] },
    { key: "smarthome", aliases: ["nha thong minh", "smart home", "camera", "robot", "hut bui", "den", "khoa"] },
    { key: "monitor", aliases: ["man hinh", "monitor", "man hinh may tinh"] },
    { key: "keyboard_mouse", aliases: ["ban phim", "chuot", "keyboard", "mouse", "ban phim & chuot"] },
    { key: "network", aliases: ["mang", "wifi", "router", "mesh", "switch", "thiet bi mang"] },
    { key: "software", aliases: ["phan mem", "ban quyen", "office", "windows", "antivirus", "kaspersky"] }
];
class IntentParserService {
    /**
     * Main entry point: Parses natural language into StructuredProductQuery
     */
    static async parse(message, history = [], apiKey, preferredModel) {
        const trimmed = (message || "").trim();
        if (!trimmed) {
            return {
                intent: "general_product_question",
                limit: 10
            };
        }
        // Try parsing via Gemini LLM with JSON output if API key is provided
        if (apiKey) {
            try {
                const llmResult = await this.parseWithGemini(trimmed, history, apiKey, preferredModel);
                if (llmResult) {
                    return this.validateStructuredQuery(llmResult, trimmed);
                }
            }
            catch (err) {
                // Fall back seamlessly to local parser
            }
        }
        // Fast, local rule-based Vietnamese NLP parser
        const localResult = this.parseLocalRuleBased(trimmed, history);
        return this.validateStructuredQuery(localResult, trimmed);
    }
    /**
     * LLM Intent Parser using Gemini
     */
    static async parseWithGemini(message, history, apiKey, model = "gemini-3.8-flash") {
        const recentHistory = (history || []).slice(-4).map(h => ({
            role: h.role === "user" ? "user" : "assistant",
            content: (h.content || h.text || "").trim()
        }));
        const systemPrompt = `You are a high-accuracy Vietnamese intent parser for an e-commerce electronics store (SHOPBEE).
Extract the user's intent and search constraints into a STRICT JSON object.

Allowed intents:
- "product_search": searching for products with criteria (category, brand, price, keywords)
- "product_details": asking for specifications/details of a specific product
- "price_query": asking how much a product costs
- "stock_query": asking if a product is in stock
- "discount_query": asking for items on sale or promotional discounts
- "category_query": asking what categories exist or browsing a category
- "brand_query": asking about a specific brand
- "comparison": comparing 2 or more products
- "recommendation": asking for recommendations based on budget/use-case
- "general_product_question": store policies, shipping, warranty, or general greeting

Expected JSON schema:
{
  "intent": "product_search" | "product_details" | "price_query" | "stock_query" | "discount_query" | "category_query" | "brand_query" | "comparison" | "recommendation" | "general_product_question",
  "category": string | null,
  "brand": string | null,
  "keywords": string[],
  "min_price": number | null,
  "max_price": number | null,
  "in_stock": boolean | null,
  "discount_only": boolean,
  "sort": "price_asc" | "price_desc" | "rating_desc" | "newest" | null,
  "limit": number,
  "target_product_name": string | null,
  "context_reference": boolean
}

Vietnamese price conversion rules:
- "20 củ", "20 triệu", "20tr" = 20000000 VND
- "dưới 20 triệu" = max_price: 20000000
- "từ 10 đến 20 triệu" = min_price: 10000000, max_price: 20000000
- "khoảng 30 củ" = min_price: 26000000, max_price: 34000000
- "rẻ nhất" = sort: "price_asc"
- "đắt nhất" = sort: "price_desc"
- "còn hàng" = in_stock: true
- "đang giảm giá" = discount_only: true
- "cái nào", "con nào", "sản phẩm này" referring to previous bot reply = context_reference: true

Respond ONLY with valid JSON. Do not include markdown codeblocks or other text.`;
        const contents = [
            {
                role: "user",
                parts: [
                    { text: `${systemPrompt}\n\nRecent conversation:\n${JSON.stringify(recentHistory)}\n\nCurrent user message: "${message}"` }
                ]
            }
        ];
        const candidateModels = [
            "gemini-3.6-flash",
            "gemini-3.1-flash-lite",
            "gemini-3.8-flash",
            "gemini-3.7-flash",
            "gemini-3.5-flash-lite",
            model && !["gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-2.0-flash", "gemini-2.5-flash"].includes(model) ? model : null
        ].filter(Boolean);
        const uniqueModels = candidateModels.filter((v, i, a) => a.indexOf(v) === i);
        for (const m of uniqueModels) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
                const resp = await axios_1.default.post(url, {
                    contents,
                    generationConfig: {
                        temperature: 0.1,
                        responseMimeType: "application/json"
                    }
                }, { timeout: 7000 });
                const rawText = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (rawText) {
                    const cleanJson = rawText.trim().replace(/^```json/i, "").replace(/```$/i, "").trim();
                    return JSON.parse(cleanJson);
                }
            }
            catch (e) {
                console.warn(`[INTENT] Gemini parser model ${m} error:`, e?.response?.data?.error?.message || e.message);
                continue;
            }
        }
        return null;
    }
    /**
     * High-Performance Local Rule-Based Vietnamese Parser
     */
    static parseLocalRuleBased(text, history = []) {
        const unaccented = (0, vietnameseUtils_1.removeVietnameseAccents)(text);
        const priceInfo = (0, vietnameseUtils_1.extractPriceRange)(text);
        const sortInfo = (0, vietnameseUtils_1.extractSortPreference)(text);
        const stockInfo = (0, vietnameseUtils_1.extractStockFilter)(text);
        const discountInfo = (0, vietnameseUtils_1.extractDiscountFilter)(text);
        const contextRef = (0, vietnameseUtils_1.isContextReferenceQuery)(text);
        // 1. Detect Brand
        let detectedBrand = null;
        for (const b of KNOWN_BRANDS) {
            if (unaccented.includes(b)) {
                if (b === "iphone" || b === "ipad" || b === "macbook" || b === "airpods") {
                    detectedBrand = "Apple";
                }
                else {
                    detectedBrand = b.charAt(0).toUpperCase() + b.slice(1);
                }
                break;
            }
        }
        // 2. Detect Category
        let detectedCategory = null;
        for (const cat of KNOWN_CATEGORIES) {
            if (cat.aliases.some(alias => unaccented.includes(alias))) {
                detectedCategory = cat.key;
                break;
            }
        }
        // 3. Detect Keywords & Specific Model Codes
        const keywords = [];
        const keywordCandidates = [
            "gaming", "anc", "chong on", "bluetooth", "oled", "4k", "ips", "titan",
            "magsafe", "gan", "lidar", "wifi 7", "mesh", "360", "faceid", "co hoc",
            "s24", "s25", "s23", "ultra", "pro max", "zenbook", "rtx", "airpods"
        ];
        for (const kw of keywordCandidates) {
            if (unaccented.includes(kw)) {
                keywords.push(kw);
            }
        }
        // Capture alphanumeric model tokens (e.g., "xyz 999", "999", "s25", "m3", "rtx 4060")
        // Standalone pure numbers (like "2", "20", "25") from price phrases must NOT be treated as product keywords
        const words = unaccented.split(/\s+/);
        const stopWords = new Set(["tim", "cho", "toi", "xem", "co", "con", "nao", "duoi", "tren", "khoang", "tam", "gia", "re", "dat", "nhat", "muon", "khong", "trieu", "cu", "nghin", "dong", "k"]);
        for (const w of words) {
            if (!stopWords.has(w) && !KNOWN_BRANDS.includes(w) && !keywords.includes(w)) {
                // Alphanumeric tokens (e.g. s24, m3, rtx4060, 4k, 165hz) or specific code like xyz, or 3+ digit pure code (like 999)
                const isAlphanumericCode = /[a-z]+\d+|\d+[a-z]+/.test(w) || w.includes("xyz") || (/^\d{3,}$/.test(w) && !priceInfo.minPrice && !priceInfo.maxPrice);
                if (isAlphanumericCode) {
                    keywords.push(w);
                }
            }
        }
        // 4. Detect Intent
        let intent = "product_search";
        if (stockInfo !== null && (contextRef || detectedBrand || detectedCategory)) {
            intent = "stock_query";
        }
        else if (unaccented.includes("gia bao nhieu") || unaccented.includes("gia no") || unaccented.includes("bao tien")) {
            intent = "price_query";
        }
        else if (discountInfo) {
            intent = "discount_query";
        }
        else if (unaccented.includes("so sanh") || unaccented.includes("khac nhau")) {
            intent = "comparison";
        }
        else if (unaccented.includes("tu van") || unaccented.includes("goi y") || unaccented.includes("nen mua")) {
            intent = "recommendation";
        }
        else if (unaccented.includes("thong so") || unaccented.includes("cau hinh") || unaccented.includes("chi tiet")) {
            intent = "product_details";
        }
        else if (unaccented.includes("bao hanh") ||
            unaccented.includes("giao hang") ||
            unaccented.includes("doi tra") ||
            unaccented.includes("xin chao") ||
            unaccented.includes("cua hang o dau")) {
            intent = "general_product_question";
        }
        return {
            intent,
            category: detectedCategory,
            brand: detectedBrand,
            keywords,
            min_price: priceInfo.minPrice,
            max_price: priceInfo.maxPrice,
            in_stock: stockInfo,
            discount_only: discountInfo,
            sort: sortInfo,
            limit: 10,
            context_reference: contextRef
        };
    }
    /**
     * Backend Validation: sanitizes, clamps numerical bounds, verifies enums
     */
    static validateStructuredQuery(raw, originalText) {
        const validIntents = [
            "product_search",
            "product_details",
            "price_query",
            "stock_query",
            "discount_query",
            "category_query",
            "brand_query",
            "comparison",
            "recommendation",
            "general_product_question"
        ];
        const intent = validIntents.includes(raw.intent) ? raw.intent : "product_search";
        let minPrice = null;
        let maxPrice = null;
        if (typeof raw.min_price === "number" && !isNaN(raw.min_price) && raw.min_price >= 0) {
            minPrice = Math.round(raw.min_price);
        }
        if (typeof raw.max_price === "number" && !isNaN(raw.max_price) && raw.max_price >= 0) {
            maxPrice = Math.round(raw.max_price);
        }
        // Ensure minPrice <= maxPrice if both exist
        if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
            const temp = minPrice;
            minPrice = maxPrice;
            maxPrice = temp;
        }
        const validSorts = ["price_asc", "price_desc", "rating_desc", "newest"];
        const sort = validSorts.includes(raw.sort) ? raw.sort : null;
        const limit = typeof raw.limit === "number" && raw.limit > 0 ? Math.min(raw.limit, 50) : 10;
        const brand = typeof raw.brand === "string" ? raw.brand.trim().slice(0, 50) : null;
        const category = typeof raw.category === "string" ? raw.category.trim().slice(0, 50) : null;
        const keywords = Array.isArray(raw.keywords)
            ? raw.keywords.map((k) => String(k).trim()).filter((k) => k.length > 0).slice(0, 10)
            : [];
        return {
            intent,
            category,
            brand,
            keywords,
            minPrice,
            maxPrice,
            inStock: raw.in_stock === true ? true : null,
            discountOnly: raw.discount_only === true,
            sort,
            limit,
            targetProductName: typeof raw.target_product_name === "string" ? raw.target_product_name.trim().slice(0, 100) : null,
            contextReference: raw.context_reference === true || (0, vietnameseUtils_1.isContextReferenceQuery)(originalText)
        };
    }
}
exports.IntentParserService = IntentParserService;

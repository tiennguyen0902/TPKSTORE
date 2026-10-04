"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentParserService = void 0;
const axios_1 = __importDefault(require("axios"));
const vietnameseUtils_1 = require("./vietnameseUtils");
const categoryDictionary_1 = require("./categoryDictionary");
const KNOWN_BRANDS = categoryDictionary_1.BRAND_MAPPINGS.map(b => b.match);
const KNOWN_CATEGORIES = categoryDictionary_1.CATEGORIES;
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
    static async parseWithGemini(message, history, apiKey, model = "gemini-3.5-flash") {
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
- "external_knowledge": general knowledge questions, technology explanations, coding, math, science, current affairs, advice, or queries not specifically searching for products in the store

Expected JSON schema:
{
  "intent": "product_search" | "product_details" | "price_query" | "stock_query" | "discount_query" | "category_query" | "brand_query" | "comparison" | "recommendation" | "general_product_question" | "external_knowledge",
  "category": "cat_1" | "cat_2" | "cat_3" | "cat_4" | "cat_5" | "cat_6" | "cat_7" | "cat_8" | "cat_9" | "cat_10" | null,
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

Standard 10 Store Categories (MUST use category ID "cat_1" to "cat_10"):
- cat_1: Điện thoại & Tablet (smartphone, iPhone, iPad, Galaxy, Xiaomi, OPPO, vivo, realme, Pixel, máy tính bảng...)
- cat_2: Laptop & Macbook (laptop, máy tính xách tay, macbook, mac, máy mac, imac, mac mini, MacBook Air, MacBook Pro, gaming laptop, ultrabook, M1/M2/M3/M4, Core i5/i7, Ryzen...)
- cat_3: Tai nghe & Âm thanh (tai nghe, headphone, loa, speaker, soundbar, airpods, galaxy buds, bluetooth, anc, microphone...)
- cat_4: Đồng hồ thông minh (smartwatch, đồng hồ thông minh, Apple Watch, Galaxy Watch, Garmin, Huawei Watch, Amazfit, Mi Band...)
- cat_5: Phụ kiện & Cáp sạc (phụ kiện điện thoại/laptop, cáp sạc, củ sạc, sạc nhanh GaN, sạc không dây, MagSafe, pin dự phòng, hub USB...)
- cat_6: Nhà thông minh (Smart Home) (smart home, camera thông minh, camera wifi, robot hút bụi, đèn thông minh, ổ cắm thông minh, smart lock...)
- cat_7: Màn hình máy tính (màn hình máy tính, monitor, màn hình gaming, 4K, OLED, 144Hz, 165Hz, 240Hz, ultrawide, cong...)
- cat_8: Bàn phím & Chuột (bàn phím cơ, mechanical keyboard, chuột gaming, chuột không dây, công thái học, Logitech, Keychron...)
- cat_9: Thiết bị mạng & Wi-Fi 7 (router, wifi, wifi 6, wifi 7, bộ phát wifi, mesh wifi, access point, switch mạng...)
- cat_10: Phần mềm & Bản quyền (phần mềm, bản quyền, software license, Windows 11, Office 365, antivirus, Kaspersky, Bitdefender...)

Category & Brand mapping rules:
- Queries with "mac", "máy mac", "macbook", "imac", "mac mini" MUST map to category: "cat_2", brand: "Apple"
- Queries asking for accessories (e.g. "phụ kiện iPhone", "củ sạc Samsung") MUST map to category: "cat_5", NOT cat_1.
- Queries with "router wifi 7" MUST map to category: "cat_9".
- Queries with "chuột gaming" or "bàn phím" MUST map to category: "cat_8".
- CRITICAL RULE FOR GENERAL CATEGORY QUERIES: If the user is asking about a general category (e.g. "tôi muốn mua điện thoại", "tư vấn laptop", "xem phụ kiện"), set the category ID ("cat_1", "cat_2", "cat_5", etc.) and LEAVE keywords EMPTY []. DO NOT put broad category words (like "điện thoại", "laptop", "phụ kiện") into keywords!
- IMPORTANT FOR SPECIFIC SUBTYPE QUERIES: In categories containing diverse product types, you MUST include the specific subtype in keywords so the store engine filters accurately:
  * In cat_5 (Phụ kiện & Cáp sạc): "sạc dự phòng", "pin dự phòng" -> keywords: ["sạc dự phòng"]; "củ sạc", "trạm sạc" -> keywords: ["củ sạc"]; "cáp sạc", "dây sạc" -> keywords: ["cáp sạc"]; "bút cảm ứng", "apple pencil" -> keywords: ["bút cảm ứng"]; "hub", "dock", "bộ chuyển đổi" -> keywords: ["hub"].
  * In cat_3 (Tai nghe & Âm thanh): "tai nghe", "headphone" -> keywords: ["tai nghe"]; "loa", "loa bluetooth", "soundbar" -> keywords: ["loa"].
  * In cat_8 (Bàn phím & Chuột): "chuột", "chuột gaming" -> keywords: ["chuột"]; "bàn phím", "bàn phím cơ" -> keywords: ["bàn phím"].
  * In cat_6 (Nhà thông minh): "robot hút bụi" -> keywords: ["robot hút bụi"]; "camera" -> keywords: ["camera"].
- Keywords MUST contain specific models (e.g. "s24", "pro max", "blade 100w"), brand names (e.g. "Anker", "Baseus"), technical features (e.g. "magsafe", "gan", "anc", "oled"), or specific product subtypes above.
- Always separate keywords into individual concise search tokens (e.g. keywords: ["m3", "pro"]) instead of long compound sentences.

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
            "gemini-3.5-flash",
            "gemini-3.1-flash-lite",
            "gemini-3.6-flash",
            "gemini-3.7-flash",
            "gemini-3.8-flash",
            "gemini-3.0-pro",
            "gemini-3.5-pro",
            model && /^gemini-3/i.test(model) ? model : null
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
        const detectedBrand = (0, categoryDictionary_1.findBrandMatch)(unaccented);
        // 2. Detect Category (Longest match with boundary safety)
        const matchedCategory = (0, categoryDictionary_1.findCategoryMatch)(unaccented);
        const detectedCategory = matchedCategory ? matchedCategory.id : null;
        // 3. Detect Keywords & Specific Model Codes
        const keywords = [];
        const keywordCandidates = [
            "sac du phong", "pin du phong", "pin sac", "power bank", "cu sac", "tram sac",
            "cap sac", "day sac", "but cam ung", "apple pencil", "hub", "dock",
            "tai nghe", "loa", "chuot", "ban phim", "robot hut bui", "camera",
            "gaming", "anc", "chong on", "bluetooth", "oled", "4k", "ips", "titan",
            "magsafe", "gan", "lidar", "wifi 7", "wifi 6", "mesh", "360", "faceid", "co hoc",
            "s24", "s25", "s23", "ultra", "pro max", "zenbook", "rtx", "airpods",
            "m1", "m2", "m3", "m4", "snapdragon", "ryzen", "core i5", "core i7"
        ];
        for (const kw of keywordCandidates) {
            if (unaccented.includes(kw)) {
                keywords.push(kw);
            }
        }
        // Capture alphanumeric model tokens (e.g., "xyz 999", "999", "s25", "m3", "rtx 4060")
        // Standalone pure numbers (like "2", "20", "25") from price phrases must NOT be treated as product keywords
        const words = unaccented.split(/\s+/);
        const stopWords = new Set([
            "tim", "cho", "toi", "xem", "co", "con", "nao", "duoi", "tren", "khoang", "tam",
            "gia", "re", "dat", "nhat", "muon", "khong", "trieu", "cu", "nghin", "dong", "k",
            "tu", "van", "mua", "can", "chinh", "hang"
        ]);
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
        const isGeneralKnowledge = unaccented.includes("la gi") ||
            unaccented.includes("nhu the nao") ||
            unaccented.includes("tai sao") ||
            unaccented.includes("giai thich") ||
            unaccented.includes("huong dan") ||
            unaccented.includes("viet code") ||
            unaccented.includes("lap trinh") ||
            unaccented.includes("thoi tiet") ||
            unaccented.includes("tin tuc") ||
            unaccented.includes("hom nay") ||
            unaccented.includes("la ai") ||
            unaccented.includes("dinh nghia") ||
            unaccented.includes("nguyen ly") ||
            unaccented.includes("hoat dong ra sao");
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
        else if (isGeneralKnowledge || (!detectedBrand && !detectedCategory && keywords.length === 0 && !priceInfo.minPrice && !priceInfo.maxPrice && !contextRef)) {
            intent = "external_knowledge";
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
            "general_product_question",
            "external_knowledge"
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
            contextReference: raw.context_reference === true || (0, vietnameseUtils_1.isContextReferenceQuery)(originalText),
            rawText: originalText
        };
    }
}
exports.IntentParserService = IntentParserService;

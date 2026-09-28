"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageAnalysisService = void 0;
const axios_1 = __importDefault(require("axios"));
const vietnameseUtils_1 = require("./vietnameseUtils");
class ImageAnalysisService {
    /**
     * Validate image payload (Base64, MIME type, size)
     */
    static validateImage(imageBase64, mimeType) {
        if (!imageBase64 || typeof imageBase64 !== "string" || imageBase64.trim().length === 0) {
            return { valid: false, error: "Dữ liệu hình ảnh trống (Empty image data).", cleanBase64: "", safeMime: "" };
        }
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "").trim();
        if (cleanBase64.length < 50) {
            return { valid: false, error: "Dữ liệu hình ảnh không hợp lệ hoặc bị hỏng.", cleanBase64: "", safeMime: "" };
        }
        // Rough size estimate in MB (base64 length * 0.75)
        const approximateSizeBytes = (cleanBase64.length * 3) / 4;
        const maxSizeBytes = 10 * 1024 * 1024; // 10MB
        if (approximateSizeBytes > maxSizeBytes) {
            return { valid: false, error: "Dung lượng hình ảnh vượt quá giới hạn cho phép (tối đa 10MB).", cleanBase64: "", safeMime: "" };
        }
        let safeMime = (mimeType || "image/jpeg").split(";")[0].trim().toLowerCase();
        const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
        if (!allowedMimes.includes(safeMime)) {
            if (safeMime.startsWith("image/")) {
                safeMime = "image/jpeg";
            }
            else {
                return { valid: false, error: "Định dạng hình ảnh không được hỗ trợ. Vui lòng tải file JPG, PNG hoặc WEBP.", cleanBase64: "", safeMime: "" };
            }
        }
        return { valid: true, cleanBase64, safeMime };
    }
    /**
     * Analyze product image with Gemini Vision Model and extract structured visual attributes & OCR
     */
    static async analyzeImage(options) {
        const { imageBase64, mimeType = "image/jpeg", userText = "", apiKey, preferredModel = "gemini-3.8-flash" } = options;
        const validation = this.validateImage(imageBase64, mimeType);
        if (!validation.valid) {
            throw new Error(validation.error || "Hình ảnh không hợp lệ.");
        }
        const visionSystemPrompt = `You are a high-precision computer vision and product identification AI for an electronics & smart devices e-commerce store (SHOPBEE / TPKSTORE).

Your goal:
1. Examine the uploaded image carefully.
2. Determine if it contains a consumer electronic or tech product (smartphone, laptop, headphones, smartwatch, accessories, smart home, monitor, keyboard, mouse, network gear, etc.).
3. Extract key visible attributes WITHOUT HALLUCINATING:
   - "category": Choose one of: "phone", "laptop", "audio", "watch", "accessory", "smarthome", "monitor", "keyboard_mouse", "network", "software", or null if unknown/not a product.
   - "brand": Detect brand name if logos or design language are visible (e.g. Apple, Samsung, ASUS, Dell, HP, Lenovo, Sony, Marshall, Logitech, Anker, etc.). Otherwise null.
   - "model": Exact or likely product model name if visible or recognizable (e.g. "Galaxy S25", "S24 Ultra", "iPhone 15 Pro", "MacBook Air", "ROG Strix", "WH-1000XM5"). If uncertain, provide the general model family or null.
   - "color": Dominant product color (e.g. "black", "silver", "white", "blue", "gray").
   - "visible_features": Array of distinct visual features (e.g. "triple camera", "notch display", "backlit keyboard", "type-c port", "foldable", "over-ear").
   - "detected_text": Array of OCR text detected on labels, logos, boxes, or screens (e.g. "ASUS", "ROG", "5G", "128GB").
   - "keywords": Useful search keywords (brand, category in Vietnamese and English, design characteristics).
   - "confidence": Float between 0.0 and 1.0 indicating visual identification certainty.
   - "is_product": Boolean true if an electronic/retail product is identified, false if image is unrelated (food, pet, landscape, etc.).
   - "visual_description": A concise, natural Vietnamese description of what is depicted in the image.

${userText ? `User's accompanying note or voice prompt: "${userText}"` : ""}

Respond ONLY with a valid JSON object matching this schema:
{
  "is_product": boolean,
  "category": string | null,
  "brand": string | null,
  "model": string | null,
  "color": string | null,
  "visible_features": string[],
  "detected_text": string[],
  "keywords": string[],
  "confidence": number,
  "visual_description": string
}`;
        const candidateModels = [
            "gemini-3.8-flash",
            "gemini-3.7-flash",
            "gemini-3.5-flash",
            preferredModel && !["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.5-flash"].includes(preferredModel) ? preferredModel : null
        ].filter(Boolean);
        const uniqueModels = candidateModels.filter((v, i, a) => a.indexOf(v) === i);
        let lastError = null;
        for (const m of uniqueModels) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
                const payload = {
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    inlineData: {
                                        mimeType: validation.safeMime,
                                        data: validation.cleanBase64
                                    }
                                },
                                {
                                    text: visionSystemPrompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 1024,
                        responseMimeType: "application/json"
                    }
                };
                const resp = await axios_1.default.post(url, payload, { timeout: 25000 });
                const rawText = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (rawText) {
                    const cleanJson = rawText.trim().replace(/^```json/i, "").replace(/```$/i, "").trim();
                    const parsed = JSON.parse(cleanJson);
                    return this.sanitizeVisualAnalysis(parsed);
                }
            }
            catch (err) {
                lastError = err?.response?.data?.error?.message || err.message;
                console.warn(`[VISION] Gemini Vision model ${m} failed:`, lastError);
                continue;
            }
        }
        throw new Error(`Không thể phân tích hình ảnh qua Google Gemini Vision: ${lastError || "Lỗi kết nối"}`);
    }
    /**
     * Sanitizes and bounds visual analysis data
     */
    static sanitizeVisualAnalysis(raw) {
        const validCategories = [
            "phone", "laptop", "audio", "watch", "accessory",
            "smarthome", "monitor", "keyboard_mouse", "network", "software"
        ];
        const isProduct = raw.is_product !== false;
        let category = typeof raw.category === "string" ? raw.category.trim().toLowerCase() : null;
        if (category && !validCategories.includes(category)) {
            // Map common synonyms
            if (category.includes("phone") || category.includes("mobile") || category.includes("tablet"))
                category = "phone";
            else if (category.includes("laptop") || category.includes("computer") || category.includes("notebook"))
                category = "laptop";
            else if (category.includes("audio") || category.includes("headphone") || category.includes("speaker"))
                category = "audio";
            else if (category.includes("watch") || category.includes("wearable"))
                category = "watch";
            else if (category.includes("monitor") || category.includes("display"))
                category = "monitor";
            else if (category.includes("keyboard") || category.includes("mouse"))
                category = "keyboard_mouse";
            else if (category.includes("router") || category.includes("network") || category.includes("wifi"))
                category = "network";
            else
                category = null;
        }
        const brand = typeof raw.brand === "string" && raw.brand.trim().length > 0 ? raw.brand.trim().slice(0, 50) : null;
        const model = typeof raw.model === "string" && raw.model.trim().length > 0 ? raw.model.trim().slice(0, 80) : null;
        const color = typeof raw.color === "string" && raw.color.trim().length > 0 ? raw.color.trim().slice(0, 30) : null;
        const visible_features = Array.isArray(raw.visible_features)
            ? raw.visible_features.map((f) => String(f).trim()).filter((f) => f.length > 0).slice(0, 10)
            : [];
        const detected_text = Array.isArray(raw.detected_text)
            ? raw.detected_text.map((t) => String(t).trim()).filter((t) => t.length > 0).slice(0, 10)
            : [];
        const keywords = Array.isArray(raw.keywords)
            ? raw.keywords.map((k) => String(k).trim()).filter((k) => k.length > 0).slice(0, 15)
            : [];
        const confidence = typeof raw.confidence === "number" && !isNaN(raw.confidence)
            ? Math.max(0.1, Math.min(1.0, raw.confidence))
            : 0.85;
        const visual_description = typeof raw.visual_description === "string" && raw.visual_description.trim().length > 0
            ? raw.visual_description.trim()
            : `${brand ? brand + " " : ""}${model || category || "Sản phẩm công nghệ"}`;
        return {
            is_product: isProduct,
            category,
            brand,
            model,
            color,
            visible_features,
            detected_text,
            keywords,
            confidence,
            visual_description
        };
    }
    /**
     * Combine visual analysis attributes with optional user text / voice prompt into a StructuredProductQuery
     */
    static buildVisualProductQuery(visual, userText = "") {
        const trimmedText = userText.trim();
        const priceInfo = (0, vietnameseUtils_1.extractPriceRange)(trimmedText);
        const sortInfo = (0, vietnameseUtils_1.extractSortPreference)(trimmedText);
        // Merge keywords from visual analysis + OCR + detected features
        const allKeywords = new Set();
        if (visual.model) {
            allKeywords.add(visual.model);
            const subTokens = visual.model.split(/\s+/).filter(t => t.length > 1);
            subTokens.forEach(t => allKeywords.add(t));
        }
        if (visual.brand) {
            allKeywords.add(visual.brand);
        }
        for (const kw of visual.keywords) {
            if (kw && kw.length > 1)
                allKeywords.add(kw);
        }
        for (const txt of visual.detected_text) {
            if (txt && txt.length > 1)
                allKeywords.add(txt);
        }
        for (const feat of visual.visible_features) {
            if (feat && feat.length > 2)
                allKeywords.add(feat);
        }
        // Also extract user text tokens if user gave specific requirements (e.g. "bản 256gb", "màu đen")
        if (trimmedText) {
            const unaccented = (0, vietnameseUtils_1.removeVietnameseAccents)(trimmedText);
            const words = unaccented.split(/\s+/);
            const stopWords = new Set(["tim", "cho", "toi", "xem", "co", "con", "nao", "duoi", "tren", "khoang", "tam", "gia", "re", "dat", "nhat", "muon", "khong", "trieu", "cu", "nghin", "dong", "k", "hinh", "anh", "nay", "mau"]);
            for (const w of words) {
                if (!stopWords.has(w) && w.length > 1) {
                    allKeywords.add(w);
                }
            }
        }
        return {
            intent: "visual_product_search",
            category: visual.category,
            brand: visual.brand,
            keywords: Array.from(allKeywords).slice(0, 12),
            minPrice: priceInfo.minPrice,
            maxPrice: priceInfo.maxPrice,
            sort: sortInfo,
            limit: 10,
            targetProductName: visual.model || (visual.brand && visual.category ? `${visual.brand} ${visual.category}` : null),
            contextReference: false
        };
    }
}
exports.ImageAnalysisService = ImageAnalysisService;

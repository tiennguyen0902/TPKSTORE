"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroundedChatService = void 0;
const axios_1 = __importDefault(require("axios"));
class GroundedChatService {
    /**
     * Generates a database-grounded response using Gemini (or OpenAI if selected).
     * Strict anti-hallucination: Only reasons over retrieved DB data.
     */
    static async generateResponse(params) {
        const { userMessage, history = [], structuredQuery, retrievedProducts, apiKey, model = "gemini-3.8-flash", openaiApiKey, openaiModel = "gpt-4o-mini", provider = "gemini" } = params;
        const hasResults = retrievedProducts.length > 0;
        const isImageSearch = !!params.isImage && !!params.visualAnalysis;
        const visualInfo = params.visualAnalysis;
        // 1. Build Grounded Context from Real DB Records
        let dbContext = "";
        if (hasResults) {
            dbContext = `DANH SÁCH SẢN PHẨM TÌM THẤY TỪ CƠ SỞ DỮ LIỆU CỬA HÀNG (${retrievedProducts.length} sản phẩm):\n`;
            dbContext += retrievedProducts.map((p, idx) => {
                const cat = p.category?.name || "Công nghệ";
                const origPriceText = p.originalPrice && p.originalPrice > p.price
                    ? `(Giá gốc: ${Number(p.originalPrice).toLocaleString("vi-VN")} đ - ĐANG GIẢM GIÁ)`
                    : "";
                const matchTag = p._matchType === "exact" ? "[KHỚP CHÍNH XÁC / LIKELY MATCH]" : "[SẢN PHẨM TƯƠNG TỰ / SIMILAR]";
                return `${idx + 1}. [ID: ${p.id}] ${p.name} ${matchTag}
- Giá bán thực tế: ${Number(p.price).toLocaleString("vi-VN")} đ ${origPriceText}
- Tồn kho khả dụng: ${p.stock} sản phẩm
- Danh mục: ${cat}
- Đánh giá: ${p.rating || 5.0} ⭐ (${p.reviewCount || 0} lượt đánh giá)
- Mô tả & Cấu hình: ${p.description || "Chính hãng"}
`;
            }).join("\n");
        }
        else {
            dbContext = `KẾT QUẢ TỪ CƠ SỞ DỮ LIỆU: Không tìm thấy sản phẩm nào khớp với bộ lọc yêu cầu (Tồn kho: 0).`;
        }
        // 2. Anti-Hallucination System Prompt
        let visualContextPrompt = "";
        if (isImageSearch && visualInfo) {
            visualContextPrompt = `
KẾT QUẢ PHÂN TÍCH THỊ GIÁC (AI VISION):
- Nhận diện sản phẩm trong ảnh: ${visualInfo.visual_description || "Thiết bị công nghệ"}
- Danh mục: ${visualInfo.category || "Chưa xác định"}
- Thương hiệu: ${visualInfo.brand || "Chưa xác định"}
- Dòng máy / Model: ${visualInfo.model || "Chưa xác định"}
- Màu sắc: ${visualInfo.color || "Chưa xác định"}
- Chữ OCR phát hiện trên sản phẩm/hộp: ${visualInfo.detected_text?.join(", ") || "Không có"}
- Đặc điểm nhận diện: ${visualInfo.visible_features?.join(", ") || "Không có"}
- Độ tin cậy nhận diện: ${Math.round((visualInfo.confidence || 0.8) * 100)}%

HƯỚNG DẪN TRẢ LỜI CHO TÌM KIẾM BẰNG HÌNH ẢNH:
- Nếu CSDL có sản phẩm khớp chính xác ([KHỚP CHÍNH XÁC]): Hãy hào hứng xác nhận đã tìm thấy đúng dòng sản phẩm trong ảnh của khách, cung cấp giá tiền và số lượng còn hàng thực tế.
- Nếu CSDL chỉ có sản phẩm tương tự ([SẢN PHẨM TƯƠNG TỰ]): Hãy nói rõ ràng, thành thật rằng cửa hàng chưa có chính xác mã/thương hiệu trong ảnh, nhưng xin giới thiệu các mẫu tương tự cùng phân khúc đang có sẵn trong kho.
- Nếu CSDL không có sản phẩm nào (0 sản phẩm): Hãy lịch sự thông báo cửa hàng hiện chưa có sản phẩm khớp với hình ảnh này trong kho CSDL.
`;
        }
        const systemPrompt = `Bạn là Trợ lý AI Bán hàng Thông minh của SHOPBEE (STORE AI) - Chuỗi bán lẻ công nghệ và điện tử cao cấp.
Bạn nhận được câu hỏi từ khách hàng (qua chat văn bản, giọng nói tiếng Việt hoặc tìm kiếm bằng hình ảnh).
${visualContextPrompt}
NGUỒN SỰ THẬT DUY NHẤT (SOURCE OF TRUTH):
${dbContext}

QUY TẮC CỐT LÕI BẮT BUỘC:
1. KHÔNG BAO GIỜ BỊA ĐẶT (ZERO HALLUCINATION):
- Bạn CHỈ ĐƯỢC PHÉP tư vấn dựa trên danh sách sản phẩm thực tế được cung cấp ở trên từ CSDL.
- Tuyệt đối không tự bịa ra tên sản phẩm, giá bán, số lượng tồn kho hay chính sách giảm giá nếu CSDL không có.
2. NẾU KHÔNG TÌM THẤY SẢN PHẨM TRONG CSDL:
- Hãy trả lời lịch sự và rõ ràng rằng hiện tại hệ thống cửa hàng SHOPBEE chưa có sản phẩm khớp với tiêu chí yêu cầu (ví dụ: dòng máy chưa kinh doanh hoặc mức giá không có trong kho).
- Tuyệt đối KHÔNG tự sáng tạo ra sản phẩm không có thật trong cửa hàng.
3. VỀ CHÍNH SÁCH MUA HÀNG:
- Nhắc khách hàng về chính sách uy tín của SHOPBEE: Đổi trả 7 ngày miễn phí, bảo hành chính hãng 1 đổi 1 và giao hàng hỏa tốc trong 2 giờ.
4. PHONG CÁCH PHẢN HỒI:
- Trả lời bằng tiếng Việt thân thiện, súc tích, văn phong chuyên nghiệp, định dạng Markdown rõ ràng (in đậm tên máy, giá tiền, gạch đầu dòng các điểm nổi bật).
- Nếu khách hỏi "cái nào", "giá bao nhiêu", "còn hàng không": hãy trả lời trực diện vào sản phẩm đang đề cập.`;
        // Quick replies based on context
        const quickReplies = isImageSearch
            ? (hasResults
                ? ["Xem chi tiết cấu hình", "Kiểm tra tình trạng còn hàng", "Chính sách bảo hành 1 đổi 1", "Sản phẩm tương tự khác"]
                : ["Tìm điện thoại khác", "Xem Laptop AI", "Chính sách bảo hành", "Liên hệ nhân viên hỗ trợ"])
            : (hasResults
                ? [
                    "Chính sách bảo hành 1 đổi 1",
                    "Giao hàng hỏa tốc 2h",
                    "Tư vấn thêm về sản phẩm",
                    "Sản phẩm đang giảm giá khác"
                ]
                : [
                    "Xem điện thoại bán chạy",
                    "Laptop AI nổi bật",
                    "Chính sách bảo hành",
                    "Liên hệ nhân viên hỗ trợ"
                ]);
        // 3. Call LLM (Gemini or OpenAI)
        const normalizedProvider = (provider || "gemini").toLowerCase().trim();
        if (normalizedProvider === "gemini" && apiKey) {
            const geminiResult = await this.callGemini(apiKey, model, systemPrompt, userMessage, history);
            if (geminiResult) {
                return {
                    reply: geminiResult.reply,
                    suggestedProducts: retrievedProducts.slice(0, 4),
                    suggestedQuickReplies: quickReplies,
                    source: `Google Gemini AI (${geminiResult.model})`,
                    provider: "gemini",
                    model: geminiResult.model,
                    structuredQuery,
                    disclaimer: "✨ Phản hồi được xử lý thông minh bởi Google Gemini, đối chiếu trực tiếp từ cơ sở dữ liệu thời gian thực của SHOPBEE."
                };
            }
        }
        if (normalizedProvider === "openai" && openaiApiKey) {
            const openAiResult = await this.callOpenAI(openaiApiKey, openaiModel, systemPrompt, userMessage, history);
            if (openAiResult) {
                return {
                    reply: openAiResult.reply,
                    suggestedProducts: retrievedProducts.slice(0, 4),
                    suggestedQuickReplies: quickReplies,
                    source: `OpenAI Grounded (${openAiResult.model})`,
                    provider: "openai",
                    model: openAiResult.model,
                    structuredQuery,
                    disclaimer: "✨ Phản hồi được đối chiếu trực tiếp từ cơ sở dữ liệu thời gian thực của cửa hàng."
                };
            }
        }
        // 4. Safe Deterministic Fallback if AI provider is unavailable
        const fallbackReply = this.buildDeterministicResponse(userMessage, retrievedProducts, structuredQuery, isImageSearch, visualInfo);
        return {
            reply: fallbackReply,
            suggestedProducts: retrievedProducts.slice(0, 4),
            suggestedQuickReplies: quickReplies,
            source: isImageSearch ? "SHOPBEE Visual Grounded Engine" : "SHOPBEE Database Grounded Engine",
            provider: "local",
            model: "deterministic-rag",
            structuredQuery,
            disclaimer: isImageSearch
                ? "✨ Phản hồi được phân tích từ hình ảnh và đối chiếu trực tiếp từ cơ sở dữ liệu thời gian thực của SHOPBEE."
                : "ℹ️ Phản hồi tự động từ cơ sở dữ liệu sản phẩm của cửa hàng."
        };
    }
    static async callGemini(apiKey, model, systemInstruction, userMessage, history = []) {
        const candidateModels = [
            "gemini-3.6-flash",
            "gemini-3.1-flash-lite",
            "gemini-3.8-flash",
            "gemini-3.7-flash",
            "gemini-3.5-flash-lite",
            model && !["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-2.0-flash", "gemini-2.5-flash"].includes(model) ? model : null
        ].filter(Boolean);
        const uniqueModels = candidateModels.filter((v, i, a) => a.indexOf(v) === i);
        console.log(`[GEMINI] Calling Google Gemini API for chat. Candidates: ${uniqueModels.join(", ")}`);
        const contents = [];
        if (Array.isArray(history) && history.length > 0) {
            for (const h of history.slice(-4)) {
                const role = h.role === "user" ? "user" : "model";
                const text = (h.content || h.text || "").trim();
                if (text) {
                    contents.push({ role, parts: [{ text }] });
                }
            }
        }
        contents.push({
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nKhách hàng hỏi: "${userMessage}"` }]
        });
        for (const m of uniqueModels) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
                const resp = await axios_1.default.post(url, {
                    contents,
                    generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
                }, { timeout: 15000 });
                const candidate = resp.data?.candidates?.[0];
                const parts = candidate?.content?.parts;
                const text = Array.isArray(parts) ? parts.map((p) => p.text || "").join("").trim() : "";
                if (text) {
                    console.log(`[GEMINI] Model ${m} successfully generated reply (${text.length} chars)`);
                    return { reply: text, model: m };
                }
            }
            catch (err) {
                console.warn(`[GEMINI] Model ${m} error:`, err?.response?.data?.error?.message || err.message);
                continue;
            }
        }
        return null;
    }
    static async callOpenAI(apiKey, model, systemInstruction, userMessage, history = []) {
        const messages = [{ role: "system", content: systemInstruction }];
        if (Array.isArray(history) && history.length > 0) {
            for (const h of history.slice(-4)) {
                const role = h.role === "user" ? "user" : "assistant";
                const content = (h.content || h.text || "").trim();
                if (content)
                    messages.push({ role, content });
            }
        }
        messages.push({ role: "user", content: userMessage });
        try {
            const resp = await axios_1.default.post("https://api.openai.com/v1/chat/completions", {
                model: model || "gpt-4o-mini",
                messages,
                temperature: 0.3,
                max_tokens: 1500
            }, {
                headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
                timeout: 20000
            });
            const content = resp.data?.choices?.[0]?.message?.content?.trim();
            if (content) {
                return { reply: content, model: resp.data.model || model };
            }
        }
        catch (e) { }
        return null;
    }
    /**
     * Deterministic Grounded Builder if LLM API is unavailable
     */
    static buildDeterministicResponse(query, products, structuredQuery, isImageSearch, visualInfo) {
        if (products.length === 0) {
            if (isImageSearch && visualInfo) {
                return `Dạ rất tiếc, qua phân tích hình ảnh (**${visualInfo.visual_description || "sản phẩm"}**), hiện tại SHOPBEE chưa tìm thấy sản phẩm nào phù hợp trong kho hàng của cửa hàng.\n\nBạn có thể thử tìm kiếm với các danh mục khác hoặc liên hệ nhân viên cửa hàng để được hỗ trợ kiểm tra nguồn hàng nhập mới nhé!`;
            }
            return `Dạ rất tiếc, hiện tại SHOPBEE chưa tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn trong cơ sở dữ liệu cửa hàng.\n\nBạn có thể thử tìm kiếm với các danh mục khác hoặc liên hệ nhân viên cửa hàng để được hỗ trợ kiểm tra nguồn hàng nhập mới nhé!`;
        }
        const itemsText = products.map((p, i) => {
            const stockBadge = p.stock > 0 ? `(Còn hàng: ${p.stock} máy)` : "(Tạm hết hàng)";
            const origText = p.originalPrice && p.originalPrice > p.price
                ? ` ~~${Number(p.originalPrice).toLocaleString("vi-VN")} đ~~ 🔥 Đang giảm giá!`
                : "";
            const matchBadge = p._matchType === "exact" ? " ⭐ *Khớp chính xác với hình ảnh*" : "";
            return `${i + 1}. **${p.name}**${matchBadge}\n   - Giá: **${Number(p.price).toLocaleString("vi-VN")} đ**${origText}\n   - Trạng thái: ${stockBadge}\n   - Điểm nổi bật: ${p.description?.slice(0, 100)}...`;
        }).join("\n\n");
        const header = isImageSearch && visualInfo
            ? (products.some(p => p._matchType === "exact")
                ? `Dạ chào bạn! Dựa trên hình ảnh bạn vừa tải lên (**${visualInfo.visual_description}**), SHOPBEE đã tìm thấy sản phẩm khớp trong cơ sở dữ liệu cửa hàng:\n\n`
                : `Dạ chào bạn! Dựa trên hình ảnh bạn tải lên (**${visualInfo.visual_description}**), cửa hàng chưa có chính xác dòng máy này nhưng xin giới thiệu các mẫu tương tự cùng phân khúc có sẵn tại SHOPBEE:\n\n`)
            : `Dạ chào bạn! Dựa trên cơ sở dữ liệu thực tế tại SHOPBEE, tôi xin gửi tới bạn các sản phẩm phù hợp nhất:\n\n`;
        return `${header}${itemsText}\n\n✨ **Chính sách ưu đãi độc quyền tại SHOPBEE:**\n- 🛡️ Đổi trả miễn phí trong 7 ngày\n- 🔄 Bảo hành 1 đổi 1 toàn diện\n- ⚡ Giao hàng hỏa tốc trong 2 giờ tại nội thành\n\nBạn cần biết thêm thông tin chi tiết hoặc muốn đặt mua sản phẩm nào không ạ?`;
    }
}
exports.GroundedChatService = GroundedChatService;

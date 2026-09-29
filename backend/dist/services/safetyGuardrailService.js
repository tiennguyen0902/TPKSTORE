"use strict";
/**
 * Safety Guardrail Service
 * Multi-layer content moderation & security protection for AI Chatbot:
 * 1. Pre-filter: Detect prohibited/sensitive topics (18+, violence, illegal, weapons, drugs, gambling, hate speech, political extremism)
 * 2. System Security: Prevent Prompt Injections, Jailbreaks & API Key / Database credential leaks
 * 3. Gemini API Safety Settings: Standard Google AI safety thresholds
 * 4. Post-filter: Sanitize AI output to prevent accidental leakage of sensitive tokens
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetyGuardrailService = exports.GEMINI_SAFETY_SETTINGS = void 0;
// Danh mục các từ khóa & mẫu câu nhạy cảm tiếng Việt và tiếng Anh
const PROHIBITED_PATTERNS = [
    // 1. Tình dục, khiêu dâm, 18+, quấy rối
    {
        category: "SEXUAL_EXPLICIT",
        regex: /(?:khiêu\s*dâm|phim\s*sex|đồi\s*trụy|gái\s*gọi|mua\s*dâm|bán\s*dâm|thủ\s*dâm|ấu\s*dâm|loạn\s*luân|lộ\s*clip\s*(?:nóng|sex)|ảnh\s*nude|nude\s*photo|porn(?:ography)?|hentai|nsfw|xxx|sex\s*video|escort\s*service)/i,
        reason: "Nội dung mang tính chất khiêu dâm, 18+ hoặc không phù hợp thuần phong mỹ tục."
    },
    // 2. Bạo lực, vũ khí, chất nổ, tự hại
    {
        category: "VIOLENCE_AND_WEAPONS",
        regex: /(?:chế\s*tạo\s*(?:bom|thuốc\s*nổ|mìn|vũ\s*khí)|mua\s*súng|buôn\s*súng|chém\s*nhau|giết\s*người|đâm\s*chết|cắt\s*cổ|tự\s*tử|tự\s*sát|tự\s*hại|cắt\s*cổ\s*tay|cách\s*chết\s*nhẹ\s*nhàng|how\s*to\s*make\s*(?:bomb|explosive)|suicide|kill\s*someone)/i,
        reason: "Nội dung liên quan đến bạo lực nguy hiểm, vũ khí, chất nổ hoặc hành vi tự gây thương tích."
    },
    // 3. Ma túy, chất cấm, độc chất nguy hiểm
    {
        category: "ILLEGAL_SUBSTANCES",
        regex: /(?:mua\s*bán\s*ma\s*túy|thuốc\s*lắc|cần\s*sa|heroin|ma\s*túy\s*đá|ketamin|bóng\s*cười|chất\s*độc\s*cyanua|điều\s*chế\s*ma\s*túy|buy\s*drugs|methamphetamine|cocaine)/i,
        reason: "Nội dung liên quan đến chất cấm, ma túy hoặc hóa chất độc hại bị pháp luật nghiêm cấm."
    },
    // 4. Cờ bạc, lừa đảo, tội phạm mạng
    {
        category: "GAMBLING_AND_FRAUD",
        regex: /(?:đánh\s*bạc\s*online|tài\s*xỉu\s*bịp|hack\s*tài\s*khoản|tool\s*hack\s*(?:facebook|zalo|ngân\s*hàng)|rửa\s*tiền|lừa\s*đảo\s*chiếm\s*đoạt|mua\s*bán\s*thẻ\s*tín\s*dụng\s*chùa|cc\s*chùa|ddos\s*attack|botnet|ransomware|keylogger|phishing\s*scam)/i,
        reason: "Nội dung liên quan đến cờ bạc, gian lận, lừa đảo hoặc tấn công mạng."
    },
    // 5. Chính trị cực đoan, chống phá, kích động bạo loạn, thù hằn dân tộc
    {
        category: "HATE_SPEECH_AND_EXTREMISM",
        regex: /(?:lật\s*đổ\s*chính\s*quyền|chống\s*phá\s*nhà\s*nước|khủng\s*bố|phân\s*biệt\s*chủng\s*tộc|kỳ\s*thị\s*(?:vùng\s*miền|dân\s*tộc)|diệt\s*chủng|phát\s*xít|nazism|hate\s*speech|terrorist)/i,
        reason: "Nội dung mang tính chất kích động thù hằn, phân biệt đối xử hoặc vi phạm an ninh."
    },
    // 6. Prompt Injection, Jailbreak & Yêu cầu lộ thông tin bí mật hệ thống
    {
        category: "PROMPT_INJECTION_AND_LEAK",
        regex: /(?:ignore\s*(?:all\s*)?previous\s*instructions|bỏ\s*qua\s*(?:mọi\s*)?chỉ\s*dẫn\s*trước|you\s*are\s*DAN|jailbreak|reveal\s*(?:your\s*)?(?:system\s*prompt|api\s*key|secret)|cho\s*tôi\s*(?:xem\s*)?(?:api\s*key|system\s*prompt|mật\s*khẩu\s*database|database\s*url|jwt\s*secret)|in\s*ra\s*danh\s*sách\s*(?:mật\s*khẩu|user|thẻ\s*tín\s*dụng)\s*trong\s*database)/i,
        reason: "Yêu cầu can thiệp cấu trúc bảo mật hoặc trích xuất dữ liệu nội bộ của hệ thống."
    }
];
// Chuẩn hóa phản hồi từ chối lịch sự, tôn trọng
const STANDARD_REFUSAL_MESSAGES = {
    SEXUAL_EXPLICIT: "Dạ xin lỗi bạn, tôi là Trợ lý AI và được thiết lập để không thảo luận hoặc cung cấp các nội dung mang tính chất nhạy cảm, 18+ hoặc không phù hợp. Bạn cần hỗ trợ gì khác về kiến thức hoặc công nghệ không ạ?",
    VIOLENCE_AND_WEAPONS: "Dạ xin lỗi bạn, tôi không thể hỗ trợ các nội dung liên quan đến bạo lực, vũ khí, chất nổ hoặc hành vi gây nguy hiểm cho bản thân và cộng đồng. Bạn vui lòng đặt câu hỏi khác nhé!",
    ILLEGAL_SUBSTANCES: "Dạ xin lỗi bạn, các nội dung liên quan đến chất cấm, ma túy hay hóa chất độc hại vi phạm chính sách an toàn. Tôi xin phép không cung cấp thông tin này.",
    GAMBLING_AND_FRAUD: "Dạ xin lỗi bạn, tôi không thể hỗ trợ các yêu cầu liên quan đến cờ bạc, công cụ gian lận, lừa đảo hoặc tấn công mạng. Tôi sẵn sàng hỗ trợ bạn về các giải pháp an toàn thông tin và công nghệ chính thống.",
    HATE_SPEECH_AND_EXTREMISM: "Dạ xin lỗi bạn, tôi luôn tuân thủ nguyên tắc tôn trọng, hòa bình và không hỗ trợ các nội dung kích động thù hằn, phân biệt hay thông tin cực đoan.",
    PROMPT_INJECTION_AND_LEAK: "Dạ xin lỗi bạn, toàn bộ thông tin bảo mật hệ thống, cấu hình máy chủ và dữ liệu người dùng được bảo vệ tuyệt đối theo chính sách an toàn thông tin. Tôi không thể thực hiện yêu cầu này.",
    DEFAULT: "Dạ xin lỗi bạn, câu hỏi của bạn chứa nội dung nằm ngoài phạm vi an toàn cho phép. Tôi luôn sẵn sàng giải đáp các thắc mắc về công nghệ, đời sống, khoa học cũng như tư vấn sản phẩm cho bạn!"
};
// Cấu hình Safety Settings chính thức cho Google Gemini API
exports.GEMINI_SAFETY_SETTINGS = [
    {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_LOW_AND_ABOVE"
    },
    {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        category: "HARM_CATEGORY_CIVIC_INTEGRITY",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }
];
class SafetyGuardrailService {
    /**
     * Kiểm tra câu hỏi đầu vào của người dùng trước khi chuyển tới AI
     */
    static validateInput(text) {
        if (!text || typeof text !== "string") {
            return { isSafe: true };
        }
        const trimmed = text.trim();
        if (trimmed.length === 0) {
            return { isSafe: true };
        }
        for (const item of PROHIBITED_PATTERNS) {
            if (item.regex.test(trimmed)) {
                console.warn(`[SAFETY GUARDRAIL] Blocked prompt violation: category=${item.category}`);
                const refusal = STANDARD_REFUSAL_MESSAGES[item.category] || STANDARD_REFUSAL_MESSAGES.DEFAULT;
                return {
                    isSafe: false,
                    category: item.category,
                    reason: item.reason,
                    refusalMessage: refusal
                };
            }
        }
        return { isSafe: true };
    }
    /**
     * Hậu kiểm và làm sạch câu trả lời đầu ra của AI
     * Đảm bảo không rò rỉ secret key, token, email nội bộ hoặc dữ liệu cấu hình
     */
    static sanitizeOutput(output) {
        if (!output || typeof output !== "string")
            return output;
        let sanitized = output;
        // Loại bỏ API key Google / JWT / Password nếu mô hình vô tình sinh ra
        sanitized = sanitized.replace(/AQ\.[A-Za-z0-9_-]{30,}/g, "[BẢO MẬT API KEY]");
        sanitized = sanitized.replace(/AIza[0-9A-Za-z-_]{35}/g, "[BẢO MẬT API KEY]");
        sanitized = sanitized.replace(/postgresql:\/\/[^ \n\r\t]+/gi, "[BẢO MẬT DATABASE_URL]");
        sanitized = sanitized.replace(/store_ai_[A-Za-z0-9_]{10,}/gi, "[BẢO MẬT CREDENTIALS]");
        return sanitized;
    }
}
exports.SafetyGuardrailService = SafetyGuardrailService;

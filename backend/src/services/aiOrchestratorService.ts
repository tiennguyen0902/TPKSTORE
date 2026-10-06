import axios from "axios";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";

export type AIProviderId = "api" | "local";

export interface AIModelInfo {
  id: string;
  name: string;
  provider: AIProviderId;
  description: string;
  isAvailable: boolean;
}

export interface AIHealthStatus {
  provider: AIProviderId;
  isAlive: boolean;
  model: string;
  latencyMs: number;
  message: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  image?: string;
}

export const AI_TOOL_PERMISSIONS: Record<string, string[]> = {
  search_products: ["ADMIN", "MANAGER", "STAFF", "CUSTOMER"],
  compare_products: ["ADMIN", "MANAGER", "STAFF", "CUSTOMER"],
  read_own_orders: ["CUSTOMER"],
  read_inventory: ["ADMIN", "MANAGER", "STAFF"],
  create_export_request: ["ADMIN", "MANAGER", "STAFF"],
  create_import_proposal: ["ADMIN", "MANAGER"],
  approve_stock_ticket: ["ADMIN", "MANAGER"],
  business_metrics: ["ADMIN"],
  customer_analytics: ["ADMIN"],
  generate_business_report: ["ADMIN"]
};

export function canRoleAccessTool(role: string, toolName: string): boolean {
  const allowedRoles = AI_TOOL_PERMISSIONS[toolName];
  if (!allowedRoles) return false;
  return allowedRoles.includes(role);
}

/**
 * Xây dựng ngữ cảnh hệ thống (System Prompt) chuẩn mực theo từng vai trò
 * Tuyệt đối không để lộ dữ liệu nội bộ/doanh thu cho CUSTOMER & STAFF
 */
export function buildRoleContext(role: string, user?: { id?: string; fullName?: string; email?: string }): string {
  const baseInstruction = "Bạn là Trợ lý Trí tuệ Nhân tạo thông minh của TPKSTORE (Hệ thống thiết bị số và công nghệ). Hãy trả lời lịch sự, chính xác và chuyên nghiệp bằng tiếng Việt.";

  switch (role) {
    case "CUSTOMER":
      return `${baseInstruction}
[NGỮ CẢNH VAI TRÒ: KHÁCH HÀNG (CUSTOMER)]
- Bạn chỉ được phép: Tư vấn sản phẩm, so sánh thông số kỹ thuật, gợi ý lựa chọn theo ngân sách, chính sách đổi trả, bảo hành và hướng dẫn mua hàng.
- NẾU người dùng hỏi về doanh thu toàn cửa hàng, lợi nhuận, doanh số bán hàng, báo cáo kinh doanh hoặc danh sách khách hàng khác:
  BẠN PHẢI TỪ CHỐI LỊCH SỰ: "Dạ xin lỗi quý khách, tài khoản Khách hàng không có quyền truy vấn dữ liệu tài chính, doanh thu hoặc quản trị nội bộ của cửa hàng ạ."
- Không bao giờ được tiết lộ thông tin nội bộ của quản lý hoặc nhân viên.`;

    case "STAFF":
      return `${baseInstruction}
[NGỮ CẢNH VAI TRÒ: NHÂN VIÊN BÁN HÀNG TẠI QUẦY (STAFF)]
- Bạn hỗ trợ nhân viên tư vấn khách hàng tại quầy POS, tra cứu thông số sản phẩm, so sánh cấu hình và kiểm tra số lượng tồn kho khả dụng để bán.
- Nhân viên có quyền tạo yêu cầu Xuất kho (EXPORT) khi cần xuất bán.
- Nhân viên KHÔNG CÓ QUYỀN: Xem báo cáo doanh thu toàn cửa hàng, duyệt phiếu kho hoặc thay đổi tồn kho trực tiếp.
- Nếu nhân viên hỏi về tổng doanh thu cửa hàng hoặc lợi nhuận: Hãy thông báo chức năng này chỉ dành riêng cho Quản trị viên (ADMIN).`;

    case "MANAGER":
      return `${baseInstruction}
[NGỮ CẢNH VAI TRÒ: QUẢN LÝ KHO (MANAGER)]
- Bạn hỗ trợ Quản lý kho: Giám sát tồn kho, cảnh báo sản phẩm sắp hết hàng, phân tích xu hướng nhập/xuất kho, đề xuất lập phiếu nhập kho (StockTicket PENDING).
- LƯU Ý BẮT BUỘC: Bạn KHÔNG ĐƯỢC tự ý cập nhật tăng/giảm Product.stock trực tiếp. Mọi biến động kho phải thông qua StockTicket và được xác nhận duyệt có lưu nhật ký StockMovement.
- Không tư vấn hoặc hiển thị dữ liệu tài chính toàn doanh nghiệp ngoài phạm vi kho hàng.`;

    case "ADMIN":
      return `${baseInstruction}
[NGỮ CẢNH VAI TRÒ: QUẢN TRỊ VIÊN TOÀN QUYỀN (ADMIN)]
- Bạn là Trợ lý Quản trị cấp cao: Hỗ trợ phân tích dữ liệu kinh doanh, doanh thu, lợi nhuận gộp, hiệu suất bán hàng, dự báo xu hướng nhu cầu và tổng kết KPI.
- Cung cấp thông tin chi tiết, có số liệu dẫn chứng cụ thể từ hệ thống.`;

    default:
      return `${baseInstruction}
[NGỮ CẢNH MẶC ĐỊNH]
- Chỉ hỗ trợ tư vấn sản phẩm công khai.`;
  }
}

/**
 * Adapter cho AI API Cloud (Google Gemini / OpenAI)
 */
export class ApiAiProvider {
  static readonly id: AIProviderId = "api";

  static async getHealth(): Promise<AIHealthStatus> {
    const startTime = Date.now();
    try {
      const settings = await db.systemSettings.findFirst();
      const apiKey = process.env.GEMINI_API_KEY || settings?.geminiApiKey;
      const model = settings?.geminiModel || "gemini-3.5-flash";

      if (!apiKey) {
        return {
          provider: "api",
          isAlive: false,
          model,
          latencyMs: Date.now() - startTime,
          message: "Chưa cấu hình API Key cho Google Gemini Cloud"
        };
      }

      // Lightweight check
      return {
        provider: "api",
        isAlive: true,
        model,
        latencyMs: Date.now() - startTime,
        message: "Google Gemini Cloud sẵn sàng hoạt động"
      };
    } catch (err: any) {
      return {
        provider: "api",
        isAlive: false,
        model: "unknown",
        latencyMs: Date.now() - startTime,
        message: err.message
      };
    }
  }

  static async listModels(): Promise<AIModelInfo[]> {
    return [
      {
        id: "gemini-3.5-flash",
        name: "Google Gemini 3.5 Flash",
        provider: "api",
        description: "Mô hình đám mây tốc độ cao, độ trễ thấp, hỗ trợ đa phương thức",
        isAvailable: true
      },
      {
        id: "gemini-3.0-pro",
        name: "Google Gemini 3.0 Pro",
        provider: "api",
        description: "Mô hình đám mây chuyên sâu, suy luận logic và phân tích kinh doanh",
        isAvailable: true
      }
    ];
  }
}

/**
 * Adapter cho AI Local (Ollama / Local Microservice)
 */
export class LocalAiProvider {
  static readonly id: AIProviderId = "local";

  static async getHealth(): Promise<AIHealthStatus> {
    const startTime = Date.now();
    try {
      const settings = await db.systemSettings.findFirst();
      const localUrl = process.env.LOCAL_AI_URL || settings?.localAiUrl || "http://localhost:11434";
      const localModel = settings?.localAiModel || "llava";

      // Test Ollama / local service ping with short timeout
      try {
        const res = await axios.get(`${localUrl}/api/tags`, { timeout: 3000 });
        return {
          provider: "local",
          isAlive: true,
          model: localModel,
          latencyMs: Date.now() - startTime,
          message: "Local AI (Ollama) đang hoạt động bình thường"
        };
      } catch (ollamaErr) {
        // Fallback kiểm tra qua AI Microservice Python (nếu có)
        const microserviceUrl = process.env.AI_SERVICE_URL || settings?.aiServiceUrl || "http://ai_service:8000";
        try {
          await axios.get(`${microserviceUrl}/health`, { timeout: 2000 });
          return {
            provider: "local",
            isAlive: true,
            model: "FastAPI-Local-Inference",
            latencyMs: Date.now() - startTime,
            message: "Local AI Microservice sẵn sàng hoạt động"
          };
        } catch (microErr) {
          return {
            provider: "local",
            isAlive: false,
            model: localModel,
            latencyMs: Date.now() - startTime,
            message: "Local AI offline (Không kết nối được Ollama port 11434 hoặc Microservice port 8000)"
          };
        }
      }
    } catch (err: any) {
      return {
        provider: "local",
        isAlive: false,
        model: "llava",
        latencyMs: Date.now() - startTime,
        message: err.message
      };
    }
  }

  static async listModels(): Promise<AIModelInfo[]> {
    return [
      {
        id: "llava",
        name: "LLaVA MultiModal (Local)",
        provider: "local",
        description: "Mô hình thị giác máy tính chạy cục bộ offline trên Ollama",
        isAvailable: true
      },
      {
        id: "llama3",
        name: "Llama 3 (Local)",
        provider: "local",
        description: "Mô hình ngôn ngữ lớn bảo mật cục bộ, không gửi dữ liệu ra ngoài",
        isAvailable: true
      },
      {
        id: "qwen2.5",
        name: "Qwen 2.5 (Local)",
        provider: "local",
        description: "Mô hình mã nguồn mở tối ưu cho tiếng Việt và tác vụ bán hàng",
        isAvailable: true
      }
    ];
  }
}

/**
 * Ghi nhật ký tương tác AI phục vụ Audit & Compliance
 */
export async function logAIInteraction(params: {
  userId?: string | null;
  sessionId?: string;
  query: string;
  response: string;
  type: string;
  provider: "api" | "local";
  model: string;
  role: string;
  latency: number;
  success: boolean;
  actionType?: string;
}) {
  try {
    await db.aIInteraction.create({
      data: {
        id: uuidv4(),
        userId: params.userId || null,
        sessionId: params.sessionId || `sess_${Date.now()}`,
        query: params.query,
        response: params.response,
        type: params.type,
        provider: params.provider,
        model: params.model,
        role: params.role,
        latency: params.latency,
        success: params.success,
        actionType: params.actionType || params.type,
        createdAt: new Date()
      }
    });
  } catch (err) {
    console.warn("Failed to record AIInteraction audit log:", err);
  }
}

export interface AICompletionResult {
  success: boolean;
  text?: string;
  provider: "api" | "local";
  model: string;
  error?: string;
  latencyMs: number;
}

/**
 * Điều phối sinh phản hồi AI dựa trên Provider được chọn:
 * - api: Gọi Google Gemini Cloud API
 * - local: Gọi Ollama Local API hoặc Local Python Microservice
 */
export async function executeAICompletion(params: {
  systemPrompt: string;
  userPrompt: string;
  provider?: "api" | "local";
  model?: string;
}): Promise<AICompletionResult> {
  const startTime = Date.now();
  const provider = params.provider === "local" ? "local" : "api";
  const settings = await db.systemSettings.findFirst();

  if (provider === "local") {
    const localUrl = process.env.LOCAL_AI_URL || settings?.localAiUrl || "http://localhost:11434";
    const localModel = params.model || settings?.localAiModel || process.env.LOCAL_AI_MODEL || "qwen2.5:latest";

    // 1. Thử gọi Ollama /api/chat
    try {
      const ollamaRes = await axios.post(`${localUrl}/api/chat`, {
        model: localModel,
        messages: [
          { role: "system", content: params.systemPrompt },
          { role: "user", content: params.userPrompt }
        ],
        stream: false
      }, { timeout: 30000 });

      const reply = ollamaRes.data?.message?.content || ollamaRes.data?.response;
      if (reply && String(reply).trim()) {
        return {
          success: true,
          text: String(reply).trim(),
          provider: "local",
          model: localModel,
          latencyMs: Date.now() - startTime
        };
      }
    } catch (ollamaErr: any) {
      // 2. Thử gọi Ollama /api/generate
      try {
        const genRes = await axios.post(`${localUrl}/api/generate`, {
          model: localModel,
          prompt: `${params.systemPrompt}\n\n${params.userPrompt}`,
          stream: false
        }, { timeout: 30000 });

        const reply = genRes.data?.response;
        if (reply && String(reply).trim()) {
          return {
            success: true,
            text: String(reply).trim(),
            provider: "local",
            model: localModel,
            latencyMs: Date.now() - startTime
          };
        }
      } catch (genErr: any) {
        // 3. Fallback: Thử qua Python AI Microservice nếu có
        const microserviceUrl = process.env.AI_SERVICE_URL || settings?.aiServiceUrl || "http://ai_service:8000";
        try {
          const microRes = await axios.post(`${microserviceUrl}/api/ai/chat`, {
            message: params.userPrompt,
            system_prompt: params.systemPrompt
          }, { timeout: 15000 });

          const reply = microRes.data?.response || microRes.data?.reply;
          if (reply && String(reply).trim()) {
            return {
              success: true,
              text: String(reply).trim(),
              provider: "local",
              model: "FastAPI-Local",
              latencyMs: Date.now() - startTime
            };
          }
        } catch (microErr) {
          return {
            success: false,
            error: `Mô hình Local AI (Ollama: ${localModel}) không phản hồi hoặc đang ngoại tuyến tại ${localUrl}.`,
            provider: "local",
            model: localModel,
            latencyMs: Date.now() - startTime
          };
        }
      }
    }

    return {
      success: false,
      error: `Không thể kết nối đến Local AI (${localModel}).`,
      provider: "local",
      model: localModel,
      latencyMs: Date.now() - startTime
    };
  } else {
    // Provider: "api" (Google Gemini Cloud)
    const apiKey = (process.env.GEMINI_API_KEY || settings?.geminiApiKey || "").trim();
    if (!apiKey) {
      return {
        success: false,
        error: "Chưa cấu hình Google Gemini API Key trong hệ thống.",
        provider: "api",
        model: "gemini",
        latencyMs: Date.now() - startTime
      };
    }

    const candidateModels = [
      params.model || settings?.geminiModel || "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite"
    ];

    let lastError = "";
    for (const candidate of candidateModels) {
      try {
        const cleanModel = candidate.replace("models/", "").trim();
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;
        const geminiRes = await axios.post(url, {
          contents: [
            {
              role: "user",
              parts: [{ text: `${params.systemPrompt}\n\n${params.userPrompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800
          }
        }, { timeout: 15000 });

        const parts = geminiRes.data?.candidates?.[0]?.content?.parts;
        if (parts && parts.length > 0 && parts[0].text) {
          return {
            success: true,
            text: parts[0].text.trim(),
            provider: "api",
            model: cleanModel,
            latencyMs: Date.now() - startTime
          };
        }
      } catch (err: any) {
        lastError = err.response?.data?.error?.message || err.message;
      }
    }

    return {
      success: false,
      error: `Google Gemini API gặp sự cố hoặc vượt giới hạn: ${lastError}`,
      provider: "api",
      model: candidateModels[0],
      latencyMs: Date.now() - startTime
    };
  }
}

/**
 * Hàm nghiệp vụ Product Advice thực sự dùng AI (Gemini hoặc Ollama theo lựa chọn)
 */
export async function generateProductAdvice(params: {
  question: string;
  productContext: string;
  provider?: "api" | "local";
  model?: string;
}): Promise<AICompletionResult> {
  const systemPrompt = `Bạn là Chuyên gia Tư vấn Bán hàng Trí tuệ Nhân tạo của TPKSTORE (Hệ thống thiết bị số và công nghệ uy tín).
Nhiệm vụ của bạn:
1. Trả lời câu hỏi tư vấn của khách hàng bằng tiếng Việt một cách tự nhiên, lịch sự, chuyên nghiệp và giàu tính thuyết phục.
2. Dựa chính xác vào danh mục và thông số sản phẩm TPKSTORE được cung cấp dưới đây để gợi ý sản phẩm phù hợp nhất.
3. Nếu sản phẩm có trong danh mục, hãy nêu rõ tên máy, mức giá và các điểm nổi bật (hiệu năng, camera, pin, bảo hành).
4. Tuyệt đối không đề cập đến doanh thu nội bộ, giá vốn hàng bán hoặc lợi nhuận của cửa hàng.`;

  const userPrompt = `Câu hỏi của khách hàng: "${params.question}"

Dữ liệu sản phẩm thực tế hiện có tại TPKSTORE:
${params.productContext}

Hãy đưa ra lời tư vấn chi tiết, so sánh ngắn gọn nếu có nhiều máy phù hợp và đề xuất lựa chọn tối ưu nhất.`;

  return executeAICompletion({
    systemPrompt,
    userPrompt,
    provider: params.provider,
    model: params.model
  });
}


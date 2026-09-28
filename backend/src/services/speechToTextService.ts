import axios from "axios";

export interface TranscribeAudioOptions {
  audioBase64: string;
  mimeType?: string;
  apiKey?: string;
  preferredModel?: string;
}

export class SpeechToTextService {
  /**
   * Transcribe Vietnamese audio into text using Google Gemini Multimodal Audio
   */
  public static async transcribe(options: TranscribeAudioOptions): Promise<string> {
    const { audioBase64, mimeType = "audio/webm", apiKey, preferredModel = "gemini-3.8-flash" } = options;

    if (!audioBase64 || audioBase64.trim().length === 0) {
      throw new Error("Dữ liệu âm thanh trống (Empty audio). Vui lòng thử lại.");
    }

    if (!apiKey) {
      throw new Error("Chưa cấu hình API Key của Google Gemini cho tính năng chuyển đổi giọng nói.");
    }

    // Clean base64 data url prefix if present
    const cleanBase64 = audioBase64.replace(/^data:[^;]+;base64,/, "").trim();
    // Normalize mimeType (ensure valid audio type for Gemini)
    let safeMime = mimeType.split(";")[0].trim().toLowerCase();
    if (!safeMime.startsWith("audio/")) {
      safeMime = "audio/webm";
    }

    const candidateModels = [
      "gemini-3.8-flash",
      preferredModel && preferredModel !== "gemini-3.8-flash" && preferredModel !== "gemini-2.0-flash" && preferredModel !== "gemini-2.5-flash" ? preferredModel : null,
      "gemini-3.7-flash"
    ].filter(Boolean) as string[];
    const uniqueModels = candidateModels.filter((v, i, a) => a.indexOf(v) === i);

    const sttPrompt = `Bạn là hệ thống nhận diện giọng nói tiếng Việt độ chính xác cao.
Nhiệm vụ: Chuyển đổi toàn bộ âm thanh tiếng Việt được nói trong bản ghi âm này thành văn bản tiếng Việt chuẩn ngữ pháp và dấu câu.
Lưu ý quan trọng:
- Giữ nguyên các từ ngữ công nghệ, tên nhãn hàng (Samsung, iPhone, iPad, MacBook, ASUS, Dell, Sony, AirPods, v.v.).
- Chuyển đúng các từ chỉ số lượng hoặc giá tiền (ví dụ: "hai mươi triệu", "20 củ", "rẻ nhất", "còn hàng").
- CHỈ TRẢ VỀ DUY NHẤT VĂN BẢN ĐÃ NHẬN DIỆN, không thêm bất kỳ lời chào, ghi chú hay ký hiệu nào khác.`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: safeMime,
                data: cleanBase64
              }
            },
            {
              text: sttPrompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024
      }
    };

    let lastError: any = null;

    for (const m of uniqueModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
        const resp = await axios.post(url, payload, { timeout: 25000 });

        const candidate = resp.data?.candidates?.[0];
        const parts = candidate?.content?.parts;
        const text = Array.isArray(parts) ? parts.map((p: any) => p.text || "").join("").trim() : "";

        if (text) {
          return text;
        }
      } catch (err: any) {
        lastError = err?.response?.data || err?.message || err;
        continue;
      }
    }

    throw new Error(
      `Không thể chuyển đổi âm thanh: ${lastError?.error?.message || lastError || "Lỗi máy chủ Google AI"}`
    );
  }
}

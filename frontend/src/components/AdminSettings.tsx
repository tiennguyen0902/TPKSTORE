import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  Bot, 
  CreditCard, 
  Store, 
  Key, 
  Sparkles, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Loader2, 
  ExternalLink, 
  ShieldCheck, 
  Zap,
  Cpu
} from "lucide-react";
import { SystemSettings } from "../types";
import { api } from "../services/api";

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    storeName: "SHOPBEE STORE AI",
    hotline: "1900 6868",
    supportEmail: "support@shopbee.vn",
    freeShippingThreshold: 500000,
    aiProvider: "gemini",
    geminiApiKey: "",
    geminiModel: "gemini-3.5-flash",
    openaiApiKey: "",
    openaiModel: "gpt-4o-mini",
    aiServiceUrl: "http://localhost:8000",
    vnpayTmnCode: "SANDBOX_STORE_AI",
    momoPartnerCode: "MOMO",
    momoAccessKey: "F8BBA842ECF85",
    momoSecretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz"
  });

  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenAiKey, setShowOpenAiKey] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState<"gemini" | "openai" | "local">("gemini");
  
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{
    valid: boolean;
    provider?: string;
    model?: string;
    message: string;
    sampleResponse?: string;
    availableModels?: string[];
  } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const data = await api.getSettings();
        setSettings(prev => ({ ...prev, ...data }));
        if (data.aiProvider) {
          setActiveAiTab(data.aiProvider as "gemini" | "openai" | "local");
        }
      } catch (err) {
        console.warn("Could not fetch settings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(settings);
      setToastMsg("Đã lưu cấu hình hệ thống thành công!");
      setTimeout(() => setToastMsg(""), 3000);
    } catch (err: any) {
      alert(err.message || "Lỗi lưu cài đặt");
    }
  };

  const handleTestApiKey = async (providerToTest: "gemini" | "openai" | "local") => {
    if (providerToTest !== "local") {
      const key = providerToTest === "gemini" ? settings.geminiApiKey : settings.openaiApiKey;
      if (!key?.trim()) {
        setTestResult({
          valid: false,
          provider: providerToTest,
          message: `Vui lòng nhập ${providerToTest === "gemini" ? "Google Gemini" : "OpenAI"} API Key trước khi kiểm tra.`
        });
        return;
      }
    }

    setIsTestingKey(true);
    setTestResult(null);

    try {
      const res = await api.testAiKey({
        provider: providerToTest,
        apiKey: providerToTest === "gemini" ? settings.geminiApiKey : settings.openaiApiKey,
        model: providerToTest === "gemini" ? settings.geminiModel : providerToTest === "openai" ? settings.openaiModel : settings.localAiModel,
        geminiApiKey: settings.geminiApiKey,
        geminiModel: settings.geminiModel,
        openaiApiKey: settings.openaiApiKey,
        openaiModel: settings.openaiModel,
        localAiUrl: settings.localAiUrl || "http://localhost:11434",
        localAiModel: settings.localAiModel || "llava"
      });
      setTestResult({
        valid: res.valid,
        provider: res.provider || providerToTest,
        model: res.model,
        message: res.message,
        sampleResponse: res.sampleResponse,
        availableModels: (res as any).availableModels
      });

      // Tự động lưu cấu hình vào CSDL khi kiểm tra thành công để người dùng truy cập web có thể sử dụng được ngay lập tức!
      if (res.valid) {
        try {
          const updatedSettings: any = {
            ...settings,
            aiProvider: providerToTest
          };
          if (providerToTest === "gemini") {
            updatedSettings.geminiApiKey = settings.geminiApiKey;
            if (res.model) updatedSettings.geminiModel = res.model;
          } else if (providerToTest === "openai") {
            updatedSettings.openaiApiKey = settings.openaiApiKey;
            if (res.model) updatedSettings.openaiModel = res.model;
          } else if (providerToTest === "local") {
            updatedSettings.localAiUrl = settings.localAiUrl || "http://localhost:11434";
            if (res.model) updatedSettings.localAiModel = res.model;
          }
          await api.updateSettings(updatedSettings);
          setSettings(updatedSettings);
          setToastMsg(`✅ ${providerToTest === "local" ? "Mô hình AI Local" : "API Key"} đã được kiểm tra và KÍCH HOẠT trên toàn hệ thống!`);
          setTimeout(() => setToastMsg(""), 5000);
        } catch (saveErr: any) {
          console.warn("Auto-save settings failed:", saveErr);
        }
      }
    } catch (err: any) {
      setTestResult({
        valid: false,
        provider: providerToTest,
        message: `Lỗi kết nối kiểm tra: ${err.message || "Không thể phản hồi từ server"}`
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900">Cấu Hình Hệ Thống</h1>
        <p className="text-xs text-slate-500 mt-0.5">Thiết lập kết nối AI Google Gemini & OpenAI ChatGPT, Cổng thanh toán VNPAY và thông tin cửa hàng</p>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Store Info */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-rose-600" />
            1. THÔNG TIN CỬA HÀNG
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tên cửa hàng / Thương hiệu</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hotline hỗ trợ</label>
              <input
                type="text"
                value={settings.hotline}
                onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email hỗ trợ khách hàng</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ngưỡng Miễn phí vận chuyển (VND)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: AI Gemini & OpenAI Config */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-rose-600" />
              2. CẤU HÌNH AI GOOGLE GEMINI & OPENAI CHATGPT
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold self-start sm:self-auto">
              <Sparkles className="w-3 h-3 text-rose-600" /> Mới Nhất 2026
            </span>
          </div>

          {/* AI Provider Switch Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-300 gap-1 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={() => {
                setActiveAiTab("gemini");
                setSettings({ ...settings, aiProvider: "gemini" });
                setTestResult(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                activeAiTab === "gemini"
                  ? "bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-600/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              <Bot className="w-4 h-4 text-rose-500" />
              <span>Google Gemini</span>
              {settings.aiProvider === "gemini" && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Đang kích hoạt làm mô hình chính" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveAiTab("openai");
                setSettings({ ...settings, aiProvider: "openai" });
                setTestResult(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                activeAiTab === "openai"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>OpenAI ChatGPT</span>
              {settings.aiProvider === "openai" && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Đang kích hoạt làm mô hình chính" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveAiTab("local");
                setSettings({ ...settings, aiProvider: "local" });
                setTestResult(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                activeAiTab === "local"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>Mô Hình AI Local</span>
              {settings.aiProvider === "local" && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Đang kích hoạt làm mô hình chính" />
              )}
            </button>
          </div>

          {/* TAB 1: GOOGLE GEMINI */}
          {activeAiTab === "gemini" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-rose-50/90 border-2 border-rose-300 text-slate-700 leading-relaxed text-xs space-y-1.5 shadow-sm">
                <p className="font-bold text-rose-800 flex items-center gap-2 text-[13px]">
                  <Zap className="w-4 h-4 text-rose-600 fill-rose-100 shrink-0" />
                  Mô hình Google Gemini (Gemini 3.6 Flash, 3.7 Flash, 3.5 Flash, 2.5 Flash):
                </p>
                <p className="text-slate-700 font-medium">
                  Xử lý siêu tốc mọi câu hỏi trong và ngoài CSDL cửa hàng, hỗ trợ ngữ cảnh lớn và phân tích kỹ thuật chuẩn xác.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-pink-400" />
                    Google Gemini API Key
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>Lấy Key tại Google AI Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showGeminiKey ? "text" : "password"}
                      placeholder="AIzaSy..."
                      value={settings.geminiApiKey}
                      onChange={(e) => {
                        setSettings({ ...settings, geminiApiKey: e.target.value });
                        if (testResult) setTestResult(null);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-10 text-slate-900 font-mono focus:outline-none focus:border-rose-500 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-200 transition-colors"
                      title={showGeminiKey ? "Ẩn API Key" : "Hiện API Key"}
                    >
                      {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestApiKey("gemini")}
                    disabled={isTestingKey}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
                  >
                    {isTestingKey ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang kiểm tra...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Kiểm Tra Gemini</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-slate-700 text-xs">Mô hình AI Gemini Mới Nhất (Tự động cập nhật 2025 - 2026)</label>
                <select
                  value={settings.geminiModel || "gemini-2.0-flash"}
                  onChange={(e) => {
                    setSettings({ ...settings, geminiModel: e.target.value });
                    if (testResult) setTestResult(null);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 text-xs font-medium"
                >
                  <optgroup label="🌟 Thế Hệ Mới Nhất 2025 - 2026 (Khuyên dùng)">
                    <option value="gemini-2.0-flash">gemini-2.0-flash ⚡ (Khuyên dùng - Flash 2.0 GA Siêu nhanh & Đa phương thức)</option>
                    <option value="gemini-2.0-flash-lite">gemini-2.0-flash-lite 🍃 (Flash 2.0 Lite - Siêu nhẹ, độ trễ thấp & tiết kiệm)</option>
                    <option value="gemini-2.5-flash">gemini-2.5-flash 💡 (Bản Flash 2.5 Thế hệ mới)</option>
                    <option value="gemini-2.5-pro">gemini-2.5-pro 🧠 (Bản Pro 2.5 Suy luận chuyên sâu)</option>
                  </optgroup>
                  <optgroup label="💭 Suy Luận Chuyên Sâu & Lập Trình (Reasoning & Code)">
                    <option value="gemini-2.0-flash-thinking-exp-01-21">gemini-2.0-flash-thinking-exp 💭 (Tư duy suy luận Thinking)</option>
                    <option value="gemini-2.0-pro-exp-02-05">gemini-2.0-pro-exp 🔬 (Pro 2.0 Experimental - Trí tuệ toán & code)</option>
                    <option value="gemini-exp-1206">gemini-exp-1206 🧪 (Bản thử nghiệm chất lượng cao)</option>
                    <option value="learnlm-1.5-pro-experimental">learnlm-1.5-pro-experimental 📚 (Chuyên sâu sư phạm & kiến thức)</option>
                  </optgroup>
                  <optgroup label="⚡ Dòng Gemini 1.5 Ổn Định (Long Context 1M - 2M)">
                    <option value="gemini-1.5-flash">gemini-1.5-flash ⭐ (Flash 1.5 Ổn định - Context 1 Triệu Token)</option>
                    <option value="gemini-1.5-flash-latest">gemini-1.5-flash-latest 🔄 (Tự động cập nhật Flash 1.5)</option>
                    <option value="gemini-1.5-flash-8b">gemini-1.5-flash-8b 🚀 (Bản 8B Siêu tốc độ cao)</option>
                    <option value="gemini-1.5-flash-8b-latest">gemini-1.5-flash-8b-latest ⚡ (Bản 8B mới nhất)</option>
                    <option value="gemini-1.5-pro-latest">gemini-1.5-pro-latest 🎯 (Pro 1.5 mới nhất - Context 2 Triệu Token)</option>
                    <option value="gemini-flash-latest">gemini-flash-latest 🔄 (Alias tự động cập nhật Flash)</option>
                    <option value="gemini-pro-latest">gemini-pro-latest 🧠 (Alias tự động cập nhật Pro)</option>
                  </optgroup>
                  <optgroup label="🚀 Thế Hệ Tương Lai 2026 (Future Roadmap)">
                    <option value="gemini-3.8-flash">gemini-3.8-flash 🌟 (Tương lai 2026 - Flash 3.8 Flagship)</option>
                    <option value="gemini-3.7-flash">gemini-3.7-flash ⚡ (Tương lai 2026 - Flash 3.7 Siêu tốc)</option>
                    <option value="gemini-3.6-flash">gemini-3.6-flash 🚀 (Tương lai 2026 - Flash 3.6 Ổn định)</option>
                    <option value="gemini-3.5-flash">gemini-3.5-flash ⭐ (Tương lai 2026 - Flash 3.5)</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite 🍃 (Tương lai 2026 - Flash 3.1 Lite)</option>
                  </optgroup>
                </select>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-500 shrink-0">Hoặc tùy chỉnh Model ID:</span>
                  <input
                    type="text"
                    placeholder="VD: gemini-2.0-flash, gemini-2.5-flash..."
                    value={settings.geminiModel || ""}
                    onChange={(e) => {
                      setSettings({ ...settings, geminiModel: e.target.value.trim() });
                      if (testResult) setTestResult(null);
                    }}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OPENAI CHATGPT */}
          {activeAiTab === "openai" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 text-slate-700 leading-relaxed text-xs space-y-1.5 shadow-sm">
                <p className="font-bold text-emerald-800 flex items-center gap-2 text-[13px]">
                  <Zap className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                  Mô hình OpenAI ChatGPT (GPT-4o, GPT-4o-mini, o3-mini, o1):
                </p>
                <p className="text-slate-700 font-medium">
                  Mô hình mạnh mẽ hàng đầu thế giới từ OpenAI, tư vấn tự nhiên, giàu cảm xúc và giải đáp tri thức toàn diện.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-400" />
                    OpenAI API Key (sk-...)
                  </label>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>Lấy Key tại OpenAI Platform</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showOpenAiKey ? "text" : "password"}
                      placeholder="sk-proj-..."
                      value={settings.openaiApiKey || ""}
                      onChange={(e) => {
                        setSettings({ ...settings, openaiApiKey: e.target.value });
                        if (testResult) setTestResult(null);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-10 text-slate-900 font-mono focus:outline-none focus:border-emerald-500 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOpenAiKey(!showOpenAiKey)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-200 transition-colors"
                      title={showOpenAiKey ? "Ẩn API Key" : "Hiện API Key"}
                    >
                      {showOpenAiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestApiKey("openai")}
                    disabled={isTestingKey}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
                  >
                    {isTestingKey ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang kiểm tra...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Kiểm Tra OpenAI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-slate-700 text-xs">Mô hình OpenAI ChatGPT Mới Nhất</label>
                <select
                  value={settings.openaiModel || "gpt-4o-mini"}
                  onChange={(e) => {
                    setSettings({ ...settings, openaiModel: e.target.value });
                    if (testResult) setTestResult(null);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 text-xs font-medium"
                >
                  <optgroup label="⭐ Mô hình Phổ biến & Tối ưu nhất (Khuyên dùng)">
                    <option value="gpt-4o-mini">gpt-4o-mini ⭐ (Khuyên dùng - Cực nhanh, thông minh, tối ưu chi phí 100%)</option>
                    <option value="gpt-4o">gpt-4o 👑 (Flagship Omni Đa phương thức cao cấp nhất)</option>
                    <option value="chatgpt-4o-latest">chatgpt-4o-latest 🔄 (Bản GPT-4o cập nhật liên tục)</option>
                  </optgroup>
                  <optgroup label="🔬 Dòng Suy luận Chuyên sâu (Reasoning & STEM)">
                    <option value="o3-mini">o3-mini 🔬 (Mô hình Suy luận STEM & Coding mới nhất)</option>
                    <option value="o1">o1 🧩 (Mô hình Suy luận chuyên sâu hàng đầu thế giới)</option>
                    <option value="o1-mini">o1-mini ⚙️ (Suy luận nhanh cho logic & giải thuật)</option>
                    <option value="o1-preview">o1-preview 🔍 (Bản xem trước suy luận chuyên sâu)</option>
                  </optgroup>
                  <optgroup label="⚡ Dòng GPT-4 & GPT-3.5 Tiêu chuẩn">
                    <option value="gpt-4-turbo">gpt-4-turbo 🚀 (Bản Turbo 128k context mạnh mẽ)</option>
                    <option value="gpt-4">gpt-4 🧠 (Bản GPT-4 tiêu chuẩn)</option>
                    <option value="gpt-3.5-turbo">gpt-3.5-turbo 💬 (Bản ChatGPT-3.5 tiết kiệm truyền thống)</option>
                    <option value="gpt-5.4-mini">gpt-5.4-mini 🌟 (Tương lai - GPT-5 Next Gen)</option>
                  </optgroup>
                </select>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-500 shrink-0">Hoặc tùy chỉnh Model ID:</span>
                  <input
                    type="text"
                    placeholder="VD: gpt-4o-mini, o3-mini..."
                    value={settings.openaiModel || ""}
                    onChange={(e) => {
                      setSettings({ ...settings, openaiModel: e.target.value.trim() });
                      if (testResult) setTestResult(null);
                    }}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOCAL AI (Ollama / LLaVA / Multimodal Vision & Voice) */}
          {activeAiTab === "local" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-purple-50/90 border-2 border-purple-300 text-slate-700 leading-relaxed text-xs space-y-1.5 shadow-sm">
                <p className="font-bold text-purple-900 flex items-center gap-2 text-[13px]">
                  <Cpu className="w-4 h-4 text-purple-600 shrink-0" />
                  Mô hình AI Local (Ollama, LLaVA Vision, LLaMA 3.2 Vision, Mistral):
                </p>
                <p className="text-slate-700 font-medium">
                  Chạy hoàn toàn cục bộ trên máy chủ hoặc máy tính cá nhân, <strong>không tốn phí API Key</strong>, bảo mật dữ liệu tuyệt đối 100% và hỗ trợ truy vấn hình ảnh (Multimodal Vision) cùng giọng nói trực tiếp.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Địa chỉ máy chủ AI Local (Server URL)
                  </label>
                  <input
                    type="text"
                    placeholder="http://localhost:11434"
                    value={settings.localAiUrl || "http://localhost:11434"}
                    onChange={(e) => {
                      setSettings({ ...settings, localAiUrl: e.target.value.trim() });
                      if (testResult) setTestResult(null);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-purple-500 text-xs"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Mặc định: Ollama tại <code>http://localhost:11434</code> hoặc LM Studio tại <code>http://localhost:1234/v1</code></p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tên mô hình AI Local (Model Tag)
                  </label>
                  <select
                    value={settings.localAiModel || "llava"}
                    onChange={(e) => {
                      setSettings({ ...settings, localAiModel: e.target.value });
                      if (testResult) setTestResult(null);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-purple-500 text-xs font-medium cursor-pointer"
                  >
                    <optgroup label="👁️ Mô hình Thị giác Đa phương thức (Multimodal Vision - Đọc hình ảnh)">
                      <option value="llava">llava 👁️ (LLaVA v1.6 - Phân tích hình ảnh sản phẩm & chat cực tốt)</option>
                      <option value="llama3.2-vision">llama3.2-vision 🌟 (Llama 3.2 Vision mới nhất 2025-2026)</option>
                      <option value="bakllava">bakllava 📷 (BakLLaVA Vision chuyên sâu)</option>
                    </optgroup>
                    <optgroup label="⚡ Mô hình Ngôn ngữ & Tư vấn bán hàng nhanh">
                      <option value="llama3.2">llama3.2 ⚡ (Llama 3.2 3B siêu nhẹ, phản hồi &lt; 0.5s)</option>
                      <option value="qwen2.5">qwen2.5 🧠 (Qwen 2.5 tiếng Việt chuẩn xác)</option>
                      <option value="mistral">mistral 💬 (Mistral 7B thông minh, ổn định)</option>
                      <option value="phi3">phi3 💡 (Microsoft Phi-3 Mini)</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500 shrink-0">Hoặc tự nhập tên Model cài trong Ollama:</span>
                <input
                  type="text"
                  placeholder="VD: llava:latest, qwen2.5:7b, gemma2:2b..."
                  value={settings.localAiModel || ""}
                  onChange={(e) => {
                    setSettings({ ...settings, localAiModel: e.target.value.trim() });
                    if (testResult) setTestResult(null);
                  }}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleTestApiKey("local")}
                  disabled={isTestingKey}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
                >
                  {isTestingKey ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang kết nối AI Local...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Kiểm Tra Kết Nối AI Local</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const updated: any = { ...settings, aiProvider: "local" };
                    setSettings(updated);
                    await api.updateSettings(updated);
                    setToastMsg("✅ Đã kích hoạt Mô hình AI Local làm trợ lý chính cho toàn hệ thống!");
                    setTimeout(() => setToastMsg(""), 4000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-all shadow-xs"
                >
                  Đặt làm AI mặc định hệ thống
                </button>
              </div>
            </div>
          )}

          {/* Diagnostic Test Result Banner */}
          {testResult && (
            <div
              className={`p-4 rounded-2xl border-2 text-xs animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm ${
                testResult.valid
                  ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
                  : "bg-rose-50/90 border-rose-300 text-rose-950"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {testResult.valid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[13px]">
                      {testResult.valid ? `✅ ${testResult.provider === "openai" ? "OpenAI" : "Google Gemini"} Hoạt Động Hoàn Hảo!` : "❌ Kiểm Tra API Key Thất Bại"}
                    </span>
                    {testResult.model && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-300">
                        Model: {testResult.model}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">{testResult.message}</p>
                  {testResult.sampleResponse && (
                    <div className="p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-800 font-sans text-[11px] italic">
                      <span className="font-semibold text-emerald-600 not-italic">Phản hồi thử nghiệm: </span>
                      "{testResult.sampleResponse}"
                    </div>
                  )}

                  {testResult.valid && (
                    <div className="flex items-center gap-2 text-[11px] text-emerald-800 font-medium bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Đã tự động áp dụng cho Chatbot toàn web: Mọi khách hàng truy cập đều được AI phục vụ ngay!</span>
                    </div>
                  )}

                  {testResult.availableModels && testResult.availableModels.length > 0 && (
                    <div className="mt-2.5 pt-2.5 border-t border-emerald-500/20">
                      <p className="text-[11px] font-semibold text-emerald-800 mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Mô hình {testResult.provider === "openai" ? "OpenAI" : "Google"} khả dụng với API Key này (bấm để chọn ngay):</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {testResult.availableModels.map((m) => {
                          const isSelected = testResult.provider === "openai" ? settings.openaiModel === m : settings.geminiModel === m;
                          return (
                            <button
                              key={m}
                              type="button"
                              onClick={() => {
                                if (testResult.provider === "openai") {
                                  setSettings({ ...settings, openaiModel: m });
                                } else {
                                  setSettings({ ...settings, geminiModel: m });
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all border ${
                                isSelected
                                  ? "bg-rose-600 text-white border-rose-500 font-bold shadow-md shadow-rose-600/30"
                                  : "bg-white text-slate-700 border-slate-300 hover:border-rose-500 hover:text-slate-900"
                              }`}
                            >
                              {m} {isSelected && "✓"}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            API Key được bảo mật tại CSDL Backend và chỉ được kích hoạt an toàn trong môi trường Microservice.
          </p>
        </div>

        {/* Section 3: VNPAY Config */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            3. CỔNG THANH TOÁN VNPAY SANDBOX
          </h3>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">VNPAY TMN Code</label>
            <input
              type="text"
              value={settings.vnpayTmnCode}
              onChange={(e) => setSettings({ ...settings, vnpayTmnCode: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Section 4: MoMo Sandbox Gateway v2 Config */}
        <div className="p-6 rounded-3xl bg-white border border-pink-900/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#a50064] text-slate-900 flex items-center justify-center font-black text-[9px]">
                MM
              </span>
              4. CỔNG THANH TOÁN VÍ MOMO SANDBOX (GATEWAY V2)
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 text-[10px] font-semibold">
              MoMo Developer v2
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Thông số tài khoản thử nghiệm dành cho sinh viên và nhà phát triển (Developers MoMo).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">Partner Code</label>
              <input
                type="text"
                value={settings.momoPartnerCode || "MOMO"}
                onChange={(e) => setSettings({ ...settings, momoPartnerCode: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-pink-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">Access Key</label>
              <input
                type="text"
                value={settings.momoAccessKey || "F8BBA842ECF85"}
                onChange={(e) => setSettings({ ...settings, momoAccessKey: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-pink-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">Secret Key</label>
              <input
                type="password"
                value={settings.momoSecretKey || "K951B6PE1waDMi640xX08PD3vg6EkVlz"}
                onChange={(e) => setSettings({ ...settings, momoSecretKey: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-pink-500 text-xs"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 text-slate-900 font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 hover:scale-105"
        >
          <Save className="w-4 h-4" />
          <span>Lưu Cấu Hình Hệ Thống</span>
        </button>
      </form>
    </div>
  );
};


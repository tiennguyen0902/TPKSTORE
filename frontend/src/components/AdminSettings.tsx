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
    geminiModel: "gemini-3.6-flash",
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
  const [activeAiTab, setActiveAiTab] = useState<"gemini" | "openai">("gemini");
  
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{
    valid: boolean;
    provider?: string;
    model?: string;
    message: string;
    sampleResponse?: string;
  } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const data = await api.getSettings();
        setSettings(prev => ({ ...prev, ...data }));
        if (data.aiProvider) {
          setActiveAiTab(data.aiProvider as "gemini" | "openai");
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

  const handleTestApiKey = async (providerToTest: "gemini" | "openai") => {
    const key = providerToTest === "gemini" ? settings.geminiApiKey : settings.openaiApiKey;
    const model = providerToTest === "gemini" ? settings.geminiModel : settings.openaiModel;

    if (!key?.trim()) {
      setTestResult({
        valid: false,
        provider: providerToTest,
        message: `Vui lòng nhập ${providerToTest === "gemini" ? "Google Gemini" : "OpenAI"} API Key trước khi kiểm tra.`
      });
      return;
    }

    setIsTestingKey(true);
    setTestResult(null);

    try {
      const res = await api.testAiKey({
        provider: providerToTest,
        apiKey: key.trim(),
        model: model
      });
      setTestResult({
        valid: res.valid,
        provider: res.provider || providerToTest,
        model: res.model,
        message: res.message,
        sampleResponse: res.sampleResponse
      });
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
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white">Cấu Hình Hệ Thống</h1>
        <p className="text-xs text-slate-400 mt-0.5">Thiết lập kết nối AI Google Gemini & OpenAI ChatGPT, Cổng thanh toán VNPAY và thông tin cửa hàng</p>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Store Info */}
        <div className="p-6 rounded-3xl bg-[#131c2e] border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-violet-400" />
            1. THÔNG TIN CỬA HÀNG
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Tên cửa hàng / Thương hiệu</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Hotline hỗ trợ</label>
              <input
                type="text"
                value={settings.hotline}
                onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email hỗ trợ khách hàng</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Ngưỡng Miễn phí vận chuyển (VND)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: AI Gemini & OpenAI Config */}
        <div className="p-6 rounded-3xl bg-[#131c2e] border border-slate-800 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-pink-400" />
              2. CẤU HÌNH AI GOOGLE GEMINI & OPENAI CHATGPT
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 text-[10px] font-medium self-start sm:self-auto">
              <Sparkles className="w-3 h-3 text-pink-400" /> Mới Nhất 2026
            </span>
          </div>

          {/* AI Provider Switch Tabs */}
          <div className="flex p-1 bg-[#0e1626] rounded-2xl border border-slate-700/80 gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveAiTab("gemini");
                setSettings({ ...settings, aiProvider: "gemini" });
                setTestResult(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                activeAiTab === "gemini"
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Bot className="w-4 h-4 text-pink-400" />
              <span>Google Gemini AI</span>
              {settings.aiProvider === "gemini" && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Đang kích hoạt làm mô hình chính" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveAiTab("openai");
                setSettings({ ...settings, aiProvider: "openai" });
                setTestResult(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                activeAiTab === "openai"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>OpenAI ChatGPT</span>
              {settings.aiProvider === "openai" && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Đang kích hoạt làm mô hình chính" />
              )}
            </button>
          </div>

          {/* TAB 1: GOOGLE GEMINI */}
          {activeAiTab === "gemini" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-900/30 to-slate-900/40 border border-violet-700/30 text-slate-300 leading-relaxed text-[11px] space-y-1">
                <p className="font-semibold text-violet-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Mô hình Google Gemini (Gemini 3.6 Flash, 3.7 Flash, 3.5 Flash, 2.5 Flash):
                </p>
                <p>
                  Xử lý siêu tốc mọi câu hỏi trong và ngoài CSDL cửa hàng, hỗ trợ ngữ cảnh lớn và phân tích kỹ thuật chuẩn xác.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
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
                      className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-white font-mono focus:outline-none focus:border-violet-500 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors"
                      title={showGeminiKey ? "Ẩn API Key" : "Hiện API Key"}
                    >
                      {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestApiKey("gemini")}
                    disabled={isTestingKey}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-pink-600/20 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
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

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Mô hình AI Gemini Mới Nhất</label>
                <select
                  value={settings.geminiModel || "gemini-3.6-flash"}
                  onChange={(e) => {
                    setSettings({ ...settings, geminiModel: e.target.value });
                    if (testResult) setTestResult(null);
                  }}
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500 text-xs"
                >
                  <option value="gemini-3.6-flash">gemini-3.6-flash ⭐ (Khuyên dùng - Nhanh, Thông minh, Hoạt động 100%)</option>
                  <option value="gemini-3.7-flash">gemini-3.7-flash 🚀 (Bản mới nhất - Phản hồi siêu tốc)</option>
                  <option value="gemini-flash-latest">gemini-flash-latest ⚡ (Tự động cập nhật Flash)</option>
                  <option value="gemini-pro-latest">gemini-pro-latest 🧠 (Tự động cập nhật Pro)</option>
                  <option value="gemini-3.5-flash">gemini-3.5-flash (Bản Flash 3.5)</option>
                  <option value="gemini-2.5-flash">gemini-2.5-flash (Bản Flash 2.5 Thế hệ mới 2026)</option>
                  <option value="gemini-2.0-flash">gemini-2.0-flash (Bản Flash 2.0 Ổn định)</option>
                  <option value="gemini-1.5-flash">gemini-1.5-flash (Bản Flash 1.5 Tiết kiệm)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (Bản Pro 1.5 Chuyên sâu)</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: OPENAI CHATGPT */}
          {activeAiTab === "openai" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-900/30 to-slate-900/40 border border-emerald-700/30 text-slate-300 leading-relaxed text-[11px] space-y-1">
                <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Mô hình OpenAI ChatGPT (GPT-4o-mini, GPT-4o, o3-mini, o1):
                </p>
                <p>
                  Mô hình mạnh mẽ hàng đầu thế giới từ OpenAI, tư vấn tự nhiên, giàu cảm xúc và giải đáp tri thức toàn diện.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
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
                      className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-white font-mono focus:outline-none focus:border-emerald-500 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOpenAiKey(!showOpenAiKey)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors"
                      title={showOpenAiKey ? "Ẩn API Key" : "Hiện API Key"}
                    >
                      {showOpenAiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestApiKey("openai")}
                    disabled={isTestingKey}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
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

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Mô hình OpenAI ChatGPT Mới Nhất</label>
                <select
                  value={settings.openaiModel || "gpt-4o-mini"}
                  onChange={(e) => {
                    setSettings({ ...settings, openaiModel: e.target.value });
                    if (testResult) setTestResult(null);
                  }}
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="gpt-4o-mini">gpt-4o-mini ⭐ (Khuyên dùng - Nhanh, Thông minh, Tối ưu chi phí)</option>
                  <option value="gpt-4o">gpt-4o 👑 (Flagship Đa phương thức cao cấp nhất)</option>
                  <option value="o3-mini">o3-mini 🔬 (Mô hình Suy luận & STEM thế hệ mới nhất)</option>
                  <option value="o1">o1 🧩 (Mô hình Suy luận chuyên sâu hàng đầu)</option>
                  <option value="o1-mini">o1-mini ⚙️ (Suy luận nhanh cho logic & code)</option>
                  <option value="gpt-3.5-turbo">gpt-3.5-turbo (Mô hình ChatGPT tiêu chuẩn)</option>
                  <option value="gpt-5.4-mini">gpt-5.4-mini 🚀 (Chờ OpenAI phát hành chính thức)</option>
                </select>
              </div>
            </div>
          )}

          {/* Diagnostic Test Result Banner */}
          {testResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs animate-in fade-in slide-in-from-top-2 duration-200 ${
                testResult.valid
                  ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                  : "bg-rose-950/40 border-rose-500/50 text-rose-200"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {testResult.valid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[13px]">
                      {testResult.valid ? `✅ ${testResult.provider === "openai" ? "OpenAI" : "Google Gemini"} Hoạt Động Hoàn Hảo!` : "❌ Kiểm Tra API Key Thất Bại"}
                    </span>
                    {testResult.model && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-semibold border border-emerald-500/30">
                        Model: {testResult.model}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">{testResult.message}</p>
                  {testResult.sampleResponse && (
                    <div className="p-2.5 rounded-xl bg-slate-900/70 border border-emerald-500/30 text-slate-200 font-sans text-[11px] italic">
                      <span className="font-semibold text-emerald-400 not-italic">Phản hồi thử nghiệm: </span>
                      "{testResult.sampleResponse}"
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
        <div className="p-6 rounded-3xl bg-[#131c2e] border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            3. CỔNG THANH TOÁN VNPAY SANDBOX
          </h3>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">VNPAY TMN Code</label>
            <input
              type="text"
              value={settings.vnpayTmnCode}
              onChange={(e) => setSettings({ ...settings, vnpayTmnCode: e.target.value })}
              className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Section 4: MoMo Sandbox Gateway v2 Config */}
        <div className="p-6 rounded-3xl bg-[#131c2e] border border-pink-900/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#a50064] text-white flex items-center justify-center font-black text-[9px]">
                MM
              </span>
              4. CỔNG THANH TOÁN VÍ MOMO SANDBOX (GATEWAY V2)
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 text-[10px] font-semibold">
              MoMo Developer v2
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Thông số tài khoản thử nghiệm dành cho sinh viên và nhà phát triển (Developers MoMo).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1 text-xs">Partner Code</label>
              <input
                type="text"
                value={settings.momoPartnerCode || "MOMO"}
                onChange={(e) => setSettings({ ...settings, momoPartnerCode: e.target.value })}
                className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-pink-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 text-xs">Access Key</label>
              <input
                type="text"
                value={settings.momoAccessKey || "F8BBA842ECF85"}
                onChange={(e) => setSettings({ ...settings, momoAccessKey: e.target.value })}
                className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-pink-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 text-xs">Secret Key</label>
              <input
                type="password"
                value={settings.momoSecretKey || "K951B6PE1waDMi640xX08PD3vg6EkVlz"}
                onChange={(e) => setSettings({ ...settings, momoSecretKey: e.target.value })}
                className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-pink-500 text-xs"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 hover:scale-105"
        >
          <Save className="w-4 h-4" />
          <span>Lưu Cấu Hình Hệ Thống</span>
        </button>
      </form>
    </div>
  );
};


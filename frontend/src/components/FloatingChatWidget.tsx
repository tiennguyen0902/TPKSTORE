import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShoppingBag, 
  RotateCcw, 
  AlertCircle,
  ExternalLink,
  Key,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Globe
} from "lucide-react";
import { api } from "../services/api";
import { Product } from "../types";
import { useCart } from "../context/CartContext";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  suggestedProducts?: Product[];
  suggestedQuickReplies?: string[];
  disclaimer?: string;
  source?: string;
  isExternalQuery?: boolean;
  timestamp: string;
}

export const FloatingChatWidget: React.FC<{ onSelectProduct?: (product: Product) => void }> = ({ onSelectProduct }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customKey, setCustomKey] = useState("");
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string; model?: string; sampleResponse?: string } | null>(null);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      sender: "ai",
      text: "Xin chào! 👋 Tôi là **Trợ lý AI Bán hàng & Trí tuệ Đa năng của SHOPBEE**.\n\nTôi có thể:\n1. 🛍️ **Tư vấn sản phẩm**: Tìm theo ngân sách (VD: *'laptop dưới 25 triệu'*, *'tai nghe chống ồn'*), tra cứu chính sách bảo hành & giao hàng 2h.\n2. 🌐 **Giải đáp mọi câu hỏi ngoài CSDL**: Kiến thức khoa học, công nghệ, so sánh kỹ thuật, đời sống nhờ trí tuệ **Google Gemini AI**!\n\nBạn cần hỗ trợ gì hôm nay ạ?",
      suggestedQuickReplies: [
        "Tư vấn Laptop Gaming",
        "Tai nghe chống ồn AI",
        "AI Agent hoạt động thế nào?",
        "Chính sách bảo hành 1 đổi 1"
      ],
      source: "SHOPBEE AI Engine",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const [testProvider, setTestProvider] = useState<"gemini" | "openai">("gemini");

  const handleTestApiKey = async () => {
    setIsTestingKey(true);
    setTestResult(null);
    try {
      const res = await api.testAiKey({
        provider: testProvider,
        apiKey: customKey.trim() || undefined
      });
      setTestResult({
        valid: res.valid,
        model: res.model,
        message: res.message,
        sampleResponse: res.sampleResponse
      });
    } catch (err: any) {
      setTestResult({
        valid: false,
        message: `Lỗi kết nối: ${err.message || "Không thể kiểm tra API Key"}`
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      }));

      const res = await api.chatWithAi(text, history);

      const aiMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: "ai",
        text: res.reply || "Tôi đã nhận được thông tin từ bạn.",
        suggestedProducts: res.suggestedProducts || [],
        suggestedQuickReplies: res.suggestedQuickReplies || [],
        disclaimer: res.disclaimer,
        source: res.source,
        isExternalQuery: res.isExternalQuery,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: "ai",
        text: "Dạ xin lỗi bạn, hệ thống AI tạm thời đang bận kết nối. Bạn có thể tham khảo trực tiếp các danh mục sản phẩm trên website hoặc thử lại sau nhé!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white shadow-2xl shadow-violet-500/50 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-violet-400/40"
        >
          <Bot className="w-7 h-7 animate-pulse-slow" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 border-2 border-[#0b0f19] rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 border-2 border-[#0b0f19] rounded-full" />
          <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap shadow-lg border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            ✨ Chat với AI Tư Vấn & Tri thức mở rộng
          </span>
        </button>
      )}

      {/* Expandable Chat Dialog */}
      {isOpen && (
        <div className="w-[380px] sm:w-[440px] h-[600px] max-h-[85vh] bg-[#111827]/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-violet-900/90 via-purple-900/80 to-slate-900 border-b border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-sm">SHOPBEE AI Smart</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-violet-300 font-medium">CSDL Cửa Hàng & Trí Tuệ Mở Rộng</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* API Key Connection Diagnostic Button */}
              <button
                onClick={() => setShowKeyModal(!showKeyModal)}
                title="Kiểm tra trạng thái kết nối Google Gemini API Key"
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold ${
                  showKeyModal 
                    ? "bg-pink-600 text-white shadow-sm" 
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Key className="w-4 h-4 text-pink-400" />
                <span className="hidden sm:inline text-[10px]">Kiểm tra Key</span>
              </button>

              <button
                onClick={() => setMessages([messages[0]])}
                title="Làm mới đoạn hội thoại"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick API Key Tester Drawer */}
          {showKeyModal && (
            <div className="p-3.5 bg-[#0f172a] border-b border-slate-700/80 text-xs animate-in fade-in slide-in-from-top-2 duration-150 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-pink-400" /> Kiểm Tra Kết Nối AI API Key
                </span>
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="text-slate-400 hover:text-white text-[10px]"
                >
                  Đóng ✕
                </button>
              </div>

              {/* Provider Selection inside Widget */}
              <div className="flex bg-[#1e293b] p-0.5 rounded-lg text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setTestProvider("gemini");
                    setTestResult(null);
                  }}
                  className={`flex-1 py-1 rounded-md transition-all ${
                    testProvider === "gemini"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Google Gemini
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTestProvider("openai");
                    setTestResult(null);
                  }}
                  className={`flex-1 py-1 rounded-md transition-all ${
                    testProvider === "openai"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  OpenAI ChatGPT
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder={testProvider === "gemini" ? "Để trống test Key CSDL, hoặc dán AIzaSy..." : "Để trống test Key CSDL, hoặc dán sk-..."}
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="flex-1 bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
                <button
                  onClick={handleTestApiKey}
                  disabled={isTestingKey}
                  className={`px-3 py-1.5 rounded-lg text-white font-bold text-[11px] flex items-center gap-1 shrink-0 disabled:opacity-50 ${
                    testProvider === "gemini" ? "bg-violet-600 hover:bg-violet-500" : "bg-emerald-600 hover:bg-emerald-500"
                  }`}
                >
                  {isTestingKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  <span>Test Key</span>
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-2.5 rounded-xl border text-[11px] ${
                    testResult.valid
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                      : "bg-rose-950/40 border-rose-500/40 text-rose-200"
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    {testResult.valid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="font-semibold">{testResult.message}</p>
                      {testResult.sampleResponse && (
                        <p className="text-[10px] italic text-slate-300 bg-slate-900/60 p-1.5 rounded border border-emerald-500/20">
                          "{testResult.sampleResponse}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-violet-600/20"
                      : "bg-[#1f293d] text-slate-200 border border-slate-700/80 rounded-bl-none shadow-sm"
                  }`}
                >
                  {/* AI Source & Tri thức mở rộng Badge */}
                  {msg.sender === "ai" && msg.source && (
                    <div className="mb-2 flex items-center justify-between gap-1 pb-1.5 border-b border-slate-700/60 text-[10px]">
                      <span className={`flex items-center gap-1 font-semibold ${
                        msg.isExternalQuery ? "text-pink-300" : "text-violet-300"
                      }`}>
                        {msg.isExternalQuery ? (
                          <>
                            <Globe className="w-3 h-3 text-pink-400 shrink-0" />
                            <span>Tri thức mở rộng (Google Gemini)</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-violet-400 shrink-0" />
                            <span>{msg.source}</span>
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  <div className="whitespace-pre-line break-words">{msg.text}</div>

                  {/* Embedded Product Cards inside AI Message */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-700/60">
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Sản phẩm gợi ý phù hợp:
                      </p>
                      {msg.suggestedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#141c2e] border border-slate-700/70 hover:border-violet-500/50 transition-all gap-2"
                        >
                          <img
                            src={prod.thumbnail}
                            alt={prod.name}
                            className="w-11 h-11 object-cover rounded-lg shrink-0 bg-slate-800"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate text-[11px]">{prod.name}</p>
                            <p className="text-violet-400 font-bold text-xs">{prod.price.toLocaleString("vi-VN")} đ</p>
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              onClick={() => onSelectProduct?.(prod)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] flex items-center gap-1"
                            >
                              <ExternalLink className="w-2.5 h-2.5" /> Xem
                            </button>
                            <button
                              onClick={() => addToCart(prod, 1)}
                              className="px-2 py-1 rounded bg-violet-600 hover:bg-violet-500 text-white text-[10px] flex items-center gap-1"
                            >
                              <ShoppingBag className="w-2.5 h-2.5" /> Thêm
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* AI Disclaimer */}
                  {msg.disclaimer && (
                    <p className="mt-2 text-[9px] text-slate-400 italic flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                      {msg.disclaimer}
                    </p>
                  )}
                </div>

                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>

                {/* Quick Replies below AI Message */}
                {msg.suggestedQuickReplies && msg.suggestedQuickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.suggestedQuickReplies.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(q)}
                        className="px-2.5 py-1 rounded-full bg-violet-600/15 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-[10px] font-medium transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-[#1f293d] rounded-2xl rounded-bl-none border border-slate-700/80 w-24">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#0c121e] border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Nhập câu hỏi (VD: tìm tai nghe dưới 1tr)..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-[#162032] border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white shadow-md shadow-violet-600/30 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

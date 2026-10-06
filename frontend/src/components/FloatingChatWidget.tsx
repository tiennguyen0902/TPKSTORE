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
  Globe,
  Mic,
  MicOff,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Cpu,
  Layers,
  Lock,
  CheckCircle2,
  Paperclip
} from "lucide-react";
import { api } from "../services/api";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { handleImageError, CATEGORY_FALLBACK_IMAGES, DEFAULT_PRODUCT_IMAGE } from "../utils/imageFallback";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  image?: string;
  suggestedProducts?: Product[];
  suggestedQuickReplies?: string[];
  disclaimer?: string;
  source?: string;
  isExternalQuery?: boolean;
  timestamp: string;
}

export const FloatingChatWidget: React.FC<{ 
  onSelectProduct?: (product: Product) => void;
  onRequireAuth?: () => void;
}> = ({ onSelectProduct, onRequireAuth }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"local" | "gemini">("local");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);

  const { addToCart } = useCart();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      sender: "ai",
      text: "Xin chào! 👋 Tôi là **Trợ lý AI Đa phương thức của SHOPBEE**.\n\nTôi hỗ trợ:\n1. 🤖 **Mô hình AI Local (Ollama/LLaVA)**: Hoạt động cục bộ bảo mật, trả lời tốc độ cao.\n2. 🎙️ **Truy vấn bằng Giọng nói**: Bấm biểu tượng Micro để đặt câu hỏi bằng tiếng Việt.\n3. 📷 **Nhận diện bằng Hình ảnh**: Tải ảnh thiết bị/phụ kiện để tôi tìm sản phẩm tương ứng trong kho hàng.\n4. 🛍️ **Tư vấn sản phẩm & Tri thức mở rộng**: Hỗ trợ mọi phân khúc giá, cấu hình, chính sách bảo hành 1 đổi 1 và giao nhanh 2 giờ.\n\nBạn cần hỗ trợ gì hôm nay?",
      suggestedQuickReplies: [
        "Tư vấn Laptop Gaming dưới 25tr",
        "Tìm phụ kiện tai nghe chống ồn",
        "Chính sách bảo hành 1 đổi 1",
        "Kiểm tra mô hình AI Local"
      ],
      source: "SHOPBEE Local AI Vision",
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

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Check if speech synthesis is currently speaking
  useEffect(() => {
    const checkSpeaking = setInterval(() => {
      if (window.speechSynthesis && !window.speechSynthesis.speaking && speakingMsgId) {
        setSpeakingMsgId(null);
      }
    }, 500);
    return () => clearInterval(checkSpeaking);
  }, [speakingMsgId]);

  // Voice Recognition (Speech-to-Text)
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt chưa hỗ trợ Web Speech API. Vui lòng sử dụng Google Chrome, Microsoft Edge hoặc Safari để dùng tính năng giọng nói.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputMessage(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
    }
  };

  // Text-to-Speech (Speak AI Response)
  const toggleSpeakMessage = (msgId: string, text: string) => {
    if (!window.speechSynthesis) {
      alert("Trình duyệt không hỗ trợ Text-to-Speech.");
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown stars, brackets, emojis for cleaner reading
    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/[*_#`~]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\n+/g, ". ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "vi-VN";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setSpeakingMsgId(null);
    };

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Image Upload Handling
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, WEBP).");
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Dung lượng hình ảnh quá lớn (vui lòng chọn ảnh dưới 5MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setSelectedImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
    if (e.target) e.target.value = "";
  };

  // Drag and Drop Image
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageFile(file);
    }
  };

  // Clipboard Paste Image
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageFile(file);
            break;
          }
        }
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if ((!text && !selectedImage) || isLoading) return;

    // Check user AI permission if logged in
    if (user && (user as any).canChatAi === false) {
      alert("Tài khoản của bạn hiện tại chưa được cấp quyền sử dụng AI. Vui lòng liên hệ Quản trị viên để được cấp quyền.");
      return;
    }

    const defaultText = text || (selectedImage ? "Hãy phân tích hình ảnh này và tìm sản phẩm tương tự trong cửa hàng." : "");
    const imagePayload = selectedImage;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: "user",
      text: defaultText,
      image: imagePayload || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setSelectedImage(null);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text
    }));

    const aiMsgId = `msg_a_${Date.now()}`;
    let hasReceivedFirstToken = false;
    setStreamingMsgId(aiMsgId);

    try {
      await api.chatWithAiStream(
        defaultText,
        history,
        selectedProvider,
        imagePayload || undefined,
        (token) => {
          if (!hasReceivedFirstToken) {
            hasReceivedFirstToken = true;
            setIsLoading(false);
            const initialAiMsg: ChatMessage = {
              id: aiMsgId,
              sender: "ai",
              text: token,
              source: selectedProvider === "local" ? "Local Ollama" : "Google Gemini 3.x AI",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            };
            setMessages(prev => [...prev, initialAiMsg]);
          } else {
            setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: m.text + token } : m));
          }
        },
        (meta) => {
          setStreamingMsgId(null);
          setIsLoading(false);
          setMessages(prev => prev.map(m => m.id === aiMsgId ? {
            ...m,
            suggestedProducts: meta.suggestedProducts || [],
            suggestedQuickReplies: meta.suggestedQuickReplies || [],
            source: meta.source || m.source
          } : m));
        },
        (err) => {
          setStreamingMsgId(null);
          setIsLoading(false);
          const isPermissionErr = err.message?.includes("quyền") || err.message?.includes("403");
          const errorMsg: ChatMessage = {
            id: `msg_err_${Date.now()}`,
            sender: "ai",
            text: isPermissionErr 
              ? "🔒 **Tài khoản chưa được cấp quyền AI**: Quản trị viên chưa kích hoạt tính năng chat AI cho tài khoản này. Vui lòng báo Admin cấp quyền trong mục Quản lý Khách hàng!"
              : (selectedProvider === "local" 
                  ? "⚡ **Kết nối Local AI**: Đang sử dụng cơ chế phản hồi cục bộ dự phòng thông minh. Bạn có thể kiểm tra Ollama đang chạy trên máy (port 11434) hoặc chuyển sang Google Gemini trong thanh chọn bên trên nhé!"
                  : "Dạ xin lỗi bạn, hệ thống AI tạm thời đang bận kết nối. Bạn có thể thử đổi sang mô hình Local AI hoặc kiểm tra lại sau nhé!"),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          };
          if (!hasReceivedFirstToken) {
            setMessages(prev => [...prev, errorMsg]);
          } else {
            setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: m.text + "\n\n*(Đã hoàn tất)*" } : m));
          }
        }
      );
    } catch (err: any) {
      setStreamingMsgId(null);
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  // User permission check
  const isChatRestricted = Boolean(user && (user as any).canChatAi === false);

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          id="floating-chat-button"
          title="Chat AI & Voice & Vision"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-rose-600 via-rose-600 to-rose-800 text-white shadow-2xl shadow-rose-500/50 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-rose-400/40"
        >
          <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-[#0b0f19] rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-[#0b0f19] rounded-full" />
          <span className="hidden sm:flex absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap shadow-lg border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-rose-400" />
            <span>Chat AI Voice & Hình Ảnh Local</span>
          </span>
        </button>
      )}

      {/* Expandable Chat Dialog */}
      {isOpen && (
        <div 
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onPaste={handlePaste}
          className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 w-full sm:w-[420px] max-w-full sm:max-w-[calc(100vw-2rem)] h-[90vh] sm:h-[620px] rounded-t-3xl sm:rounded-3xl flex flex-col bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-white text-sm">SHOPBEE AI Multimodal</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-rose-100 font-medium">Giọng nói • Thị giác Vision • Local AI</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setMessages([messages[0]]);
                    setSelectedImage(null);
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    setSpeakingMsgId(null);
                  }}
                  title="Làm mới đoạn hội thoại"
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    setSpeakingMsgId(null);
                  }}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Provider Switcher Selector */}
            <div className="mt-2.5 pt-2 border-t border-rose-500/40 flex items-center justify-between text-[11px]">
              <span className="text-rose-100 font-semibold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-rose-200" /> Mô hình:
              </span>
              <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-lg border border-white/15">
                <button
                  onClick={() => setSelectedProvider("local")}
                  className={`px-2 py-0.5 rounded font-bold transition-all text-[10px] ${
                    selectedProvider === "local" 
                      ? "bg-white text-rose-700 shadow-sm" 
                      : "text-rose-100 hover:text-white"
                  }`}
                  title="Mô hình AI chạy offline trên máy (Ollama/LLaVA - không tốn phí API)"
                >
                  🤖 Local AI
                </button>
                <button
                  onClick={() => setSelectedProvider("gemini")}
                  className={`px-2 py-0.5 rounded font-bold transition-all text-[10px] ${
                    selectedProvider === "gemini" 
                      ? "bg-white text-rose-700 shadow-sm" 
                      : "text-rose-100 hover:text-white"
                  }`}
                  title="Google Gemini Cloud (Thế hệ 3.x+)"
                >
                  ✨ Gemini 3.x
                </button>
              </div>
            </div>
          </div>

          {/* User Restricted Notice Banner */}
          {isChatRestricted && (
            <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="flex-1">
                <p className="font-bold">Quyền Chat AI chưa được kích hoạt</p>
                <p className="text-[10px] text-amber-700">Tài khoản của bạn cần được Quản trị viên cấp quyền trong Cài đặt Quản lý.</p>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-rose-600 text-white rounded-br-none shadow-md shadow-rose-600/20"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  {/* AI Source & Action Tools */}
                  {msg.sender === "ai" && (
                    <div className="mb-2 flex items-center justify-between gap-1 pb-1.5 border-b border-slate-100 text-[10px]">
                      <span className="flex items-center gap-1 font-bold text-rose-600">
                        <Sparkles className="w-3 h-3 text-rose-600 shrink-0" />
                        <span>{msg.source || "SHOPBEE AI"}</span>
                      </span>

                      {/* Text-to-Speech Button */}
                      <button
                        onClick={() => toggleSpeakMessage(msg.id, msg.text)}
                        title={speakingMsgId === msg.id ? "Dừng đọc" : "Đọc câu trả lời bằng giọng nói"}
                        className={`p-1 rounded-md transition-all flex items-center gap-1 ${
                          speakingMsgId === msg.id 
                            ? "bg-rose-100 text-rose-600 animate-pulse font-bold" 
                            : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                        }`}
                      >
                        {speakingMsgId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                            <span className="text-[9px]">Dừng</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[9px]">Nghe</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Attached Image Preview if Message contains an image */}
                  {msg.image && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-white/20 max-w-[200px] shadow-sm">
                      <img 
                        src={msg.image} 
                        alt="Hình ảnh gửi kèm" 
                        className="w-full h-auto max-h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Message Text with Markdown formatting */}
                  <div className="break-words space-y-1 leading-relaxed text-[12px]">
                    {msg.text.split("\n").map((line, lIdx) => {
                      const parts = line.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <span key={lIdx} className="block min-h-[1.25em]">
                          {parts.map((part, pIdx) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                              return (
                                <strong key={pIdx} className={`font-bold ${msg.sender === "user" ? "text-white" : "text-slate-900"}`}>
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return part;
                          })}
                        </span>
                      );
                    })}
                    {streamingMsgId === msg.id && (
                      <span className="inline-block w-1.5 h-3.5 bg-rose-600 animate-pulse ml-0.5 align-middle" />
                    )}
                  </div>

                  {/* Embedded Product Cards inside AI Message */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Sản phẩm gợi ý phù hợp:
                      </p>
                      {msg.suggestedProducts.map((prod) => {
                        const mainImg = prod.thumbnail || (Array.isArray(prod.images) && prod.images[0]) || (prod.categoryId && CATEGORY_FALLBACK_IMAGES[prod.categoryId]) || DEFAULT_PRODUCT_IMAGE;
                        return (
                          <div
                            key={prod.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-300 transition-all gap-2"
                          >
                            <img
                              src={mainImg}
                              alt={prod.name}
                              onError={(e) => handleImageError(e, prod.categoryId)}
                              className="w-11 h-11 object-cover rounded-lg shrink-0 bg-white border border-slate-200"
                              loading="lazy"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 truncate text-[11px]">{prod.name}</p>
                              <p className="text-rose-600 font-black text-xs">{prod.price.toLocaleString("vi-VN")} đ</p>
                            </div>
                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                onClick={() => onSelectProduct?.(prod)}
                                className="px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-[10px] flex items-center gap-1 border border-slate-200 font-semibold"
                              >
                                <ExternalLink className="w-2.5 h-2.5" /> Xem
                              </button>
                              <button
                                onClick={() => addToCart(prod, 1)}
                                className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] flex items-center gap-1 font-semibold shadow-sm"
                              >
                                <ShoppingBag className="w-2.5 h-2.5" /> Thêm
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* AI Disclaimer */}
                  {msg.disclaimer && (
                    <p className="mt-2 text-[9px] text-slate-500 italic flex items-center gap-1 font-medium">
                      <AlertCircle className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                      {msg.disclaimer}
                    </p>
                  )}
                </div>

                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>

                {/* Quick Replies below AI Message */}
                {msg.suggestedQuickReplies && msg.suggestedQuickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.suggestedQuickReplies.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(q)}
                        disabled={isChatRestricted}
                        className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition-all shadow-sm disabled:opacity-40"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl rounded-bl-none border border-slate-200 w-28 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] text-slate-400 font-semibold ml-1">AI trả lời...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Listening Active Wave Indicator */}
          {isListening && (
            <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <span className="text-xs font-bold">Đang lắng nghe giọng nói tiếng Việt... Hãy nói câu hỏi của bạn!</span>
              </div>
              <button 
                onClick={toggleVoiceInput}
                className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded font-bold"
              >
                Dừng lại
              </button>
            </div>
          )}

          {/* Image Selected Preview Strip */}
          {selectedImage && (
            <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-300 shadow-sm bg-white">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã đính kèm ảnh
                  </p>
                  <p className="text-[10px] text-slate-500">Mô hình Multimodal sẽ phân tích ảnh này</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200 transition-colors"
                title="Hủy bỏ ảnh"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            {/* Hidden File Input for Image Upload */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageInputChange}
            />

            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5"
            >
              {/* Image Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isChatRestricted || isLoading}
                title="Tải ảnh lên hoặc dán từ clipboard (Ctrl+V) để hỏi AI"
                className={`p-2.5 rounded-xl border transition-all ${
                  selectedImage 
                    ? "bg-rose-50 border-rose-300 text-rose-600 shadow-inner" 
                    : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600"
                } disabled:opacity-40`}
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              {/* Voice Recognition Mic Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={isChatRestricted || isLoading}
                title={isListening ? "Đang thu âm... Bấm để dừng" : "Hỏi bằng giọng nói tiếng Việt"}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening 
                    ? "bg-red-500 border-red-600 text-white animate-pulse shadow-md shadow-red-500/30" 
                    : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600"
                } disabled:opacity-40`}
              >
                {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                disabled={isChatRestricted || isLoading}
                placeholder={
                  isChatRestricted 
                    ? "Tài khoản chưa được cấp quyền Chat AI..." 
                    : isListening 
                    ? "Đang lắng nghe giọng nói..." 
                    : selectedImage 
                    ? "Nhập câu hỏi về hình ảnh hoặc nhấn Gửi..." 
                    : "Hỏi AI (VD: laptop dưới 20tr, tai nghe)..."
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-rose-500 transition-all disabled:opacity-50"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!inputMessage.trim() && !selectedImage) || isLoading || isChatRestricted}
                className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white shadow-md shadow-rose-600/30 transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Hỗ trợ kéo thả ảnh & dán ảnh trực tiếp (Ctrl+V)</span>
              <span>Web Speech & Vision AI</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

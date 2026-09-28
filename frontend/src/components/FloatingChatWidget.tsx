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
  Loader2,
  Image as ImageIcon,
  UploadCloud
} from "lucide-react";
import { api } from "../services/api";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { HybridSTTService, MicState } from "../services/speechToText";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  isVoice?: boolean;
  imageUrl?: string;
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
  const [micState, setMicState] = useState<MicState>("IDLE");
  const [micError, setMicError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    previewUrl: string;
    base64: string;
    mimeType: string;
  } | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sttServiceRef = useRef<HybridSTTService | null>(null);
  const { addToCart } = useCart();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sttServiceRef.current = new HybridSTTService(api.transcribeAudio);
    return () => {
      sttServiceRef.current?.stopListening().catch(() => {});
    };
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      sender: "ai",
      text: "Xin chào! 👋 Tôi là **Trợ lý AI Bán hàng & Trí tuệ Đa năng của SHOPBEE**.\n\nTôi hỗ trợ bạn qua 3 phương thức linh hoạt:\n1. 🛍️ **Văn bản**: Tìm theo ngân sách (VD: *'laptop dưới 25 triệu'*, *'tai nghe chống ồn'*), tra cứu chính sách bảo hành & giao hàng 2h.\n2. 🎙️ **Giọng nói Tiếng Việt**: Bạn có thể nhấn biểu tượng Micro để nói tự nhiên bằng tiếng Việt.\n3. 🖼️ **Tìm kiếm bằng hình ảnh**: Nhấn biểu tượng ảnh, chụp hoặc dán ảnh (Ctrl+V) để AI nhận diện và tìm kiếm trong kho hàng!\n\nBạn cần hỗ trợ gì hôm nay ạ?",
      suggestedQuickReplies: [
        "Tư vấn Laptop Gaming",
        "Điện thoại nào rẻ nhất?",
        "Tai nghe chống ồn AI",
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

  // Client-side image validation and optimization (resizing to max 1280px for fast upload)
  const processImageFile = async (file: File): Promise<{ file: File; previewUrl: string; base64: string; mimeType: string }> => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Định dạng ảnh không được hỗ trợ. Vui lòng chọn file JPG, PNG, WEBP hoặc GIF.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Dung lượng ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn để AI xử lý nhanh nhất.");
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawBase64 = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const optimizedBase64 = canvas.toDataURL(file.type || "image/jpeg", 0.85);
              resolve({
                file,
                previewUrl: optimizedBase64,
                base64: optimizedBase64,
                mimeType: file.type || "image/jpeg"
              });
              return;
            }
          }
          resolve({
            file,
            previewUrl: rawBase64,
            base64: rawBase64,
            mimeType: file.type || "image/jpeg"
          });
        };
        img.onerror = () => reject(new Error("Không thể xử lý tệp ảnh. Tệp có thể bị hỏng."));
        img.src = rawBase64;
      };
      reader.onerror = () => reject(new Error("Lỗi khi đọc file ảnh từ thiết bị."));
      reader.readAsDataURL(file);
    });
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImageError(null);
      const processed = await processImageFile(file);
      setSelectedImage(processed);
    } catch (err: any) {
      setImageError(err.message || "Lỗi xử lý file ảnh.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          try {
            setImageError(null);
            const processed = await processImageFile(file);
            setSelectedImage(processed);
          } catch (err: any) {
            setImageError(err.message || "Lỗi khi xử lý ảnh từ clipboard.");
          }
          break;
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        try {
          setImageError(null);
          const processed = await processImageFile(file);
          setSelectedImage(processed);
        } catch (err: any) {
          setImageError(err.message || "Lỗi khi thả file ảnh.");
        }
      } else {
        setImageError("Vui lòng thả file hình ảnh (JPG, PNG, WEBP).");
      }
    }
  };

  const handleSendMessage = async (textToSend?: string, isVoice: boolean = false) => {
    const text = (textToSend !== undefined ? textToSend : inputMessage).trim();
    const currentImage = selectedImage;

    // Must have at least text or image
    if ((!text && !currentImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: "user",
      text: text || (currentImage ? "Tìm kiếm sản phẩm theo hình ảnh đính kèm" : ""),
      isVoice,
      imageUrl: currentImage?.previewUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setSelectedImage(null);
    setImageError(null);
    setMicState("IDLE");
    setMicError(null);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
        suggestedProducts: m.suggestedProducts
      }));

      const res = await api.chatWithAi(
        text,
        history,
        undefined,
        isVoice,
        currentImage?.base64,
        currentImage?.mimeType
      );

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

  const handleToggleMic = async () => {
    if (micState === "LISTENING") {
      setMicState("PROCESSING_AUDIO");
      try {
        const transcript = await sttServiceRef.current?.stopListening();
        if (transcript && transcript.trim()) {
          setInputMessage(transcript.trim());
          setMicState("TRANSCRIPT_READY");
          handleSendMessage(transcript.trim(), true);
        } else {
          setMicState("IDLE");
        }
      } catch (e: any) {
        setMicError(e.message || "Lỗi xử lý âm thanh.");
        setMicState("IDLE");
      }
      return;
    }

    setMicError(null);
    try {
      if (!sttServiceRef.current) {
        sttServiceRef.current = new HybridSTTService(api.transcribeAudio);
      }
      await sttServiceRef.current.startListening(
        (transcript, isFinal) => {
          setInputMessage(transcript);
          if (isFinal) {
            setMicState("TRANSCRIPT_READY");
            handleSendMessage(transcript, true);
          }
        },
        (err) => {
          setMicError(err);
          setMicState("IDLE");
        },
        (state) => {
          setMicState(state);
        }
      );
    } catch (err: any) {
      setMicError(err.message || "Không thể khởi động micro.");
      setMicState("IDLE");
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
          id="floating-chat-button"
          title="Chat"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 via-rose-600 to-rose-800 text-white shadow-2xl shadow-rose-500/50 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-rose-400/40"
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
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="relative fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[560px] max-h-[80vh] flex flex-col bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* Drag & Drop Visual Overlay */}
          {isDragging && (
            <div className="absolute inset-0 z-50 bg-rose-600/90 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center animate-in fade-in">
              <UploadCloud className="w-12 h-12 mb-2 animate-bounce" />
              <p className="font-bold text-sm">Thả hình ảnh vào đây</p>
              <p className="text-xs text-rose-100 mt-1">AI sẽ nhận diện và đối chiếu với cơ sở dữ liệu cửa hàng</p>
            </div>
          )}

          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-rose-600 to-rose-700 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-sm">SHOPBEE AI Smart</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] bg-white/20 text-white font-semibold px-1.5 py-0.5 rounded-full backdrop-blur-sm">Gemini 3.8 Flash</span>
                </div>
                <p className="text-[11px] text-rose-100 font-medium">CSDL Cửa Hàng & Google Gemini AI</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                title="Làm mới đoạn hội thoại"
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-rose-600 text-white rounded-br-none shadow-md shadow-rose-600/20"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  {/* Voice Input Badge */}
                  {msg.sender === "user" && msg.isVoice && (
                    <div className="flex items-center gap-1 text-[10px] text-rose-100 font-semibold mb-1 pb-1 border-b border-rose-500/40">
                      <Mic className="w-3 h-3 text-rose-200" />
                      <span>Giọng nói đã nhận diện</span>
                    </div>
                  )}

                  {/* Image Input Preview in User Message */}
                  {msg.sender === "user" && msg.imageUrl && (
                    <div className="mb-2">
                      <img
                        src={msg.imageUrl}
                        alt="Ảnh tìm kiếm"
                        className="max-h-40 max-w-full rounded-xl object-cover border border-white/20 shadow-md cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => window.open(msg.imageUrl, "_blank")}
                      />
                      <div className="flex items-center gap-1 text-[10px] text-rose-100 font-semibold mt-1">
                        <ImageIcon className="w-3 h-3 text-rose-200" />
                        <span>Tìm kiếm bằng hình ảnh</span>
                      </div>
                    </div>
                  )}

                  {/* AI Source & Tri thức mở rộng Badge */}
                  {msg.sender === "ai" && msg.source && (
                    <div className="mb-2 flex items-center justify-between gap-1 pb-1.5 border-b border-slate-100 text-[10px]">
                      <span className={`flex items-center gap-1 font-bold ${
                        msg.isExternalQuery ? "text-pink-600" : "text-rose-600"
                      }`}>
                        {msg.isExternalQuery ? (
                          <>
                            <Globe className="w-3 h-3 text-pink-600 shrink-0" />
                            <span>Tri thức mở rộng (Google Gemini)</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-rose-600 shrink-0" />
                            <span>{msg.source}</span>
                          </>
                        )}
                      </span>
                    </div>
                  )}

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
                  </div>

                  {/* Embedded Product Cards inside AI Message */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Sản phẩm gợi ý phù hợp:
                      </p>
                      {msg.suggestedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-300 transition-all gap-2"
                        >
                          <img
                            src={prod.thumbnail}
                            alt={prod.name}
                            className="w-11 h-11 object-cover rounded-lg shrink-0 bg-white border border-slate-200"
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
                      ))}
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
                        className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition-all shadow-sm"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl rounded-bl-none border border-slate-200 w-24 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            {/* Friendly Microphone Error Banner */}
            {micError && (
              <div className="mb-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center justify-between gap-1.5 animate-in fade-in">
                <span className="flex items-center gap-1.5 truncate">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">{micError}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMicError(null)}
                  className="text-amber-500 hover:text-amber-700 p-0.5 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Friendly Image Error Banner */}
            {imageError && (
              <div className="mb-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center justify-between gap-1.5 animate-in fade-in">
                <span className="flex items-center gap-1.5 truncate">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">{imageError}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setImageError(null)}
                  className="text-amber-500 hover:text-amber-700 p-0.5 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Selected Image Preview with remove/change button */}
            {selectedImage && (
              <div className="mb-2 p-2 bg-rose-50/80 border border-rose-200 rounded-2xl flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={selectedImage.previewUrl}
                    alt="Preview"
                    className="w-10 h-10 object-cover rounded-xl border border-rose-200 shadow-sm shrink-0 bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-900 truncate">
                      {selectedImage.file.name || "Ảnh sản phẩm đã chọn"}
                    </p>
                    <p className="text-[10px] text-rose-600 font-medium">
                      {(selectedImage.file.size / 1024).toFixed(0)} KB • Sẵn sàng tìm kiếm
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2 py-1 text-[10px] font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors"
                  >
                    Đổi ảnh
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-all"
                    title="Xóa ảnh"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  placeholder={
                    selectedImage
                      ? "Thêm ghi chú/ngân sách (VD: dưới 20 triệu, bản màu đen)..."
                      : micState === "LISTENING"
                      ? "🔴 Đang nghe bạn nói... (Nhấn mic hoặc Enter để gửi)"
                      : micState === "PROCESSING_AUDIO" || micState === "TRANSCRIBING"
                      ? "⏳ Đang xử lý giọng nói..."
                      : "Nhập câu hỏi, nhấn mic hoặc tải ảnh..."
                  }
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onPaste={handlePaste}
                  className={`w-full bg-slate-100 border rounded-xl pl-3 pr-16 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${
                    micState === "LISTENING"
                      ? "border-rose-400 bg-rose-50/40 ring-2 ring-rose-200"
                      : selectedImage
                      ? "border-rose-300 bg-rose-50/20"
                      : "border-slate-200 focus:border-rose-500"
                  }`}
                />

                {/* Hidden File Input for Image Upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                />

                <div className="absolute right-1.5 flex items-center gap-0.5">
                  {/* Image Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    title="Tải ảnh hoặc chụp ảnh sản phẩm (JPG, PNG, WEBP)"
                    className={`p-1.5 rounded-lg transition-all ${
                      selectedImage
                        ? "text-rose-600 bg-rose-100"
                        : "text-slate-400 hover:text-rose-600 hover:bg-slate-200/60"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  {/* Microphone Button */}
                  <button
                    type="button"
                    onClick={handleToggleMic}
                    disabled={isLoading || micState === "PROCESSING_AUDIO" || micState === "TRANSCRIBING"}
                    title={
                      micState === "LISTENING"
                        ? "Đang nghe... Nhấn để dừng và gửi"
                        : micState === "REQUEST_MICROPHONE_PERMISSION"
                        ? "Đang yêu cầu quyền truy cập micro..."
                        : micState === "PROCESSING_AUDIO" || micState === "TRANSCRIBING"
                        ? "Đang xử lý giọng nói..."
                        : "Nhập bằng giọng nói (Tiếng Việt)"
                    }
                    className={`p-1.5 rounded-lg transition-all ${
                      micState === "LISTENING"
                        ? "text-red-600 bg-red-100 hover:bg-red-200"
                        : "text-slate-400 hover:text-rose-600 hover:bg-slate-200/60"
                    }`}
                  >
                    {micState === "LISTENING" ? (
                      <span className="relative flex items-center justify-center">
                        <span className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
                        <Mic className="w-4 h-4 text-red-600 shrink-0" />
                      </span>
                    ) : micState === "REQUEST_MICROPHONE_PERMISSION" || micState === "PROCESSING_AUDIO" || micState === "TRANSCRIBING" ? (
                      <Loader2 className="w-4 h-4 text-rose-600 animate-spin shrink-0" />
                    ) : (
                      <Mic className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
                className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white shadow-md shadow-rose-600/30 transition-all shrink-0"
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

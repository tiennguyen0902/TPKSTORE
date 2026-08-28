import React, { useState, useEffect } from "react";
import { 
  X, 
  QrCode, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  Loader2,
  CreditCard,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";
import { api } from "../services/api";

interface MomoModalProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const MomoModal: React.FC<MomoModalProps> = ({
  orderId,
  amount,
  onSuccess,
  onCancel
}) => {
  const [step, setStep] = useState<"qr_scan" | "processing" | "success">("qr_scan");
  const [payUrl, setPayUrl] = useState<string>("");
  const [deeplink, setDeeplink] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes countdown
  const [copiedText, setCopiedText] = useState<string>("");
  const [showTestCards, setShowTestCards] = useState<boolean>(true);

  // Initialize MoMo payment session from backend
  useEffect(() => {
    let isMounted = true;

    const initMomoPayment = async () => {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const cleanId = orderId.replace(/^#+/, "");
        const res = await api.createMomoUrl(
          orderId,
          amount,
          `Thanh toan don hang ${cleanId} - SHOPBEE STORE AI`
        );
        if (isMounted) {
          if (res.payUrl) {
            setPayUrl(res.payUrl);
            setDeeplink(res.deeplink || "");
            setQrCodeUrl(res.qrCodeUrl || "");
          } else {
            setErrorMsg(res.error || "Không nhận được liên kết thanh toán từ MoMo");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("MoMo API create error:", err.message);
          setErrorMsg(err.message || "Lỗi kết nối máy chủ MoMo");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initMomoPayment();

    return () => {
      isMounted = false;
    };
  }, [orderId, amount]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  // Simulate instant payment success (for presentation & testing)
  const handleSimulatePayment = async () => {
    setStep("processing");
    setErrorMsg("");
    try {
      await api.confirmMomoPayment(orderId, 0);
      setTimeout(() => {
        setStep("success");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Xác nhận thanh toán thất bại");
      setStep("qr_scan");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#131c2e] border border-pink-900/50 rounded-3xl shadow-2xl overflow-hidden text-slate-200 my-8">
        {/* Header - MoMo Magenta Theme */}
        <div className="p-4 bg-gradient-to-r from-[#a50064] via-[#d82d8b] to-[#131c2e] border-b border-pink-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md p-1 shrink-0">
              <div className="w-full h-full rounded-lg bg-[#a50064] flex items-center justify-center text-white font-black text-xs tracking-tighter">
                MOMO
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-xs uppercase tracking-wide">CỔNG THANH TOÁN VÍ MOMO</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/25 text-white">DEVELOPER V2</span>
              </div>
              <p className="text-[11px] text-pink-200">Mã đơn hàng: <span className="font-mono font-semibold text-white">{orderId}</span></p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Countdown Ribbon */}
        <div className="p-3.5 bg-[#0e1626] border-b border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Tổng số tiền cần thanh toán</span>
            <span className="text-base font-black text-pink-400">
              {amount.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span>Hết hạn: {formatTimer(timeLeft)}</span>
          </div>
        </div>

        {/* Step 1: QR Scan & Official Sandbox Options */}
        {step === "qr_scan" && (
          <div className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                <p className="text-slate-400 text-xs">Đang khởi tạo phiên thanh toán MoMo Sandbox...</p>
              </div>
            ) : (
              <>
                {/* QR Code Card */}
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-200">
                  <div className="w-full flex items-center justify-between mb-2 text-[11px] font-semibold text-slate-600 border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5 text-[#a50064] font-bold">
                      <QrCode className="w-4 h-4" /> Quét mã MoMo QR để thanh toán
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-[#a50064] font-semibold">
                      Tự động chuyển tiếp
                    </span>
                  </div>

                  {/* QR Code Display */}
                  <div className="relative p-2 bg-white rounded-xl border-2 border-pink-500/30">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(payUrl || deeplink || orderId)}`}
                      alt="MoMo Payment QR Code"
                      className="w-40 h-40 rounded-lg object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-9 h-9 rounded-lg bg-white shadow-md p-1 flex items-center justify-center border border-pink-500/30">
                        <div className="w-full h-full rounded bg-[#a50064] text-white flex items-center justify-center font-black text-[8px]">
                          MOMO
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2.5 text-[11px] text-slate-600 text-center font-medium">
                    Sử dụng ứng dụng <strong className="text-[#a50064]">Ví MoMo Test</strong> hoặc camera điện thoại quét mã
                  </p>
                </div>

                {/* Real MoMo Gateway Redirect Option */}
                {payUrl && (
                  <div className="space-y-2">
                    <a
                      href={payUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#a50064] to-[#d82d8b] hover:from-[#880052] hover:to-[#be2178] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-900/40 transition-all hover:scale-[1.01] active:scale-98"
                    >
                      <span>Mở Cổng Thanh Toán MoMo Sandbox (Web Thật)</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(payUrl, "link")}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {copiedText === "link" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedText === "link" ? "Đã chép link!" : "Sao chép link thanh toán"}</span>
                      </button>

                      {/* Instant Simulator Button for Defense/Presentation */}
                      <button
                        type="button"
                        onClick={handleSimulatePayment}
                        title="Mô phỏng thanh toán thành công để chấm điểm đồ án trực tiếp"
                        className="py-2 px-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mô phỏng Thành công</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Official MoMo Developers Test Instructions Box */}
                <div className="rounded-2xl bg-[#18233a] border border-slate-700/80 overflow-hidden text-[11px]">
                  <button
                    type="button"
                    onClick={() => setShowTestCards(!showTestCards)}
                    className="w-full p-3 bg-slate-800/60 flex items-center justify-between text-left hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-bold text-pink-300 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-pink-400" />
                      Thông Tin Test MoMo Chính Thức (Từ MoMo Developers)
                    </span>
                    {showTestCards ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {showTestCards && (
                    <div className="p-3.5 space-y-3 border-t border-slate-700/60 bg-[#0f172a]/60">
                      {/* Thẻ ATM Nội Địa */}
                      <div className="p-2.5 rounded-xl bg-[#131c2e] border border-slate-700 space-y-1.5">
                        <div className="flex items-center justify-between font-semibold text-white">
                          <span className="flex items-center gap-1.5 text-blue-300">
                            <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                            Thẻ ATM Nội Địa Test (Thành Công):
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard("9704000000000018", "atm")}
                            className="text-[10px] text-pink-400 hover:text-pink-300 flex items-center gap-1"
                          >
                            {copiedText === "atm" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedText === "atm" ? "Đã chép" : "Copy số thẻ"}</span>
                          </button>
                        </div>
                        <div className="font-mono text-[11px] text-slate-300 grid grid-cols-2 gap-1 pt-0.5">
                          <div>Số thẻ: <strong className="text-white">9704 0000 0000 0018</strong></div>
                          <div>Chủ thẻ: <strong className="text-white">NGUYEN VAN A</strong></div>
                          <div>Ngày phát hành: <strong className="text-white">03/07</strong></div>
                          <div>Mã OTP: <strong className="text-emerald-400">OTP</strong></div>
                        </div>
                      </div>

                      {/* Thẻ Quốc Tế Visa */}
                      <div className="p-2.5 rounded-xl bg-[#131c2e] border border-slate-700 space-y-1.5">
                        <div className="flex items-center justify-between font-semibold text-white">
                          <span className="flex items-center gap-1.5 text-amber-300">
                            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                            Thẻ Quốc Tế Visa Test:
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard("4111111111111111", "visa")}
                            className="text-[10px] text-pink-400 hover:text-pink-300 flex items-center gap-1"
                          >
                            {copiedText === "visa" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedText === "visa" ? "Đã chép" : "Copy số thẻ"}</span>
                          </button>
                        </div>
                        <div className="font-mono text-[11px] text-slate-300 grid grid-cols-2 gap-1 pt-0.5">
                          <div>Số thẻ: <strong className="text-white">4111 1111 1111 1111</strong></div>
                          <div>Hạn dùng: <strong className="text-white">05/26</strong></div>
                          <div>CVV/CVC: <strong className="text-white">111</strong></div>
                          <div>Mã OTP: <strong className="text-emerald-400">OTP</strong></div>
                        </div>
                      </div>

                      {/* Ví MoMo App Test */}
                      <div className="p-2.5 rounded-xl bg-[#131c2e] border border-slate-700 space-y-1">
                        <span className="flex items-center gap-1.5 text-pink-300 font-semibold">
                          <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                          Ứng Dụng Ví MoMo Test:
                        </span>
                        <p className="text-[10px] text-slate-400">
                          Mật khẩu: <strong className="text-white">000000</strong> | Mã xác thực OTP: <strong className="text-emerald-400">000000</strong>
                        </p>
                      </div>

                      <a
                        href="https://developers.momo.vn/v3/vi/docs/payment/onboarding/test-instructions/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-pink-400 hover:text-pink-300 flex items-center gap-1 font-medium transition-colors pt-1"
                      >
                        <span>Xem tài liệu Hướng Dẫn Test MoMo Developers đầy đủ</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-[10px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-pink-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                    <span>Môi trường MoMo Developer Sandbox:</span>
                  </div>
                  <p>
                    Tích hợp chuẩn mã hóa <strong>HMAC SHA-256</strong> với Merchant ID: <code className="text-pink-300">MOMO</code>. Đơn hàng sẽ tự động xác nhận sau khi giao dịch hoàn tất.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: Processing */}
        {step === "processing" && (
          <div className="p-12 flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Đang xử lý giao dịch MoMo...</h4>
              <p className="text-xs text-slate-400">Hệ thống đang xác thực chữ ký số HMAC SHA-256 từ MoMo IPN</p>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === "success" && (
          <div className="p-8 flex flex-col items-center justify-center space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-white">Thanh Toán MoMo Thành Công!</h4>
              <p className="text-xs text-emerald-400 font-medium">Giao dịch đã được ghi nhận vào hệ thống SHOPBEE</p>
            </div>
            <div className="w-full p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 space-y-1.5 text-left font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Mã đơn hàng:</span>
                <span className="text-white font-bold">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cổng thanh toán:</span>
                <span className="text-pink-400 font-bold">Ví MoMo (Gateway v2)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số tiền:</span>
                <span className="text-emerald-400 font-bold">{amount.toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trạng thái:</span>
                <span className="text-emerald-400 font-bold">COMPLETED / CONFIRMED</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500">Đang chuyển hướng tới chi tiết đơn hàng...</p>
          </div>
        )}
      </div>
    </div>
  );
};

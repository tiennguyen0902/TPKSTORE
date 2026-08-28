import React, { useState } from "react";
import { X, CreditCard, Shield, CheckCircle2, AlertCircle } from "lucide-react";

interface VnpayModalProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const VnpayModal: React.FC<VnpayModalProps> = ({
  orderId,
  amount,
  onSuccess,
  onCancel
}) => {
  const [step, setStep] = useState<"card_info" | "otp" | "success">("card_info");
  const [cardNumber, setCardNumber] = useState("9704198526191432152");
  const [cardHolder, setCardHolder] = useState("NGUYEN VAN A");
  const [issueDate, setIssueDate] = useState("07/15");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !issueDate) {
      setErrorMsg("Vui lòng nhập đầy đủ thông tin thẻ test.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setErrorMsg("Vui lòng nhập mã OTP test (VD: 123456).");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#131c2e] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-[#131c2e] border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md">
              VNP
            </div>
            <div>
              <h3 className="font-bold text-white text-xs">CỔNG THANH TOÁN VNPAY SANDBOX</h3>
              <p className="text-[10px] text-blue-300">Đơn hàng: {orderId}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Amount Badge */}
        <div className="p-4 bg-[#0e1626] border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Số tiền thanh toán:</span>
          <span className="text-base font-black text-amber-400">
            {amount.toLocaleString("vi-VN")} VNĐ
          </span>
        </div>

        {/* Step 1: Card Info */}
        {step === "card_info" && (
          <form onSubmit={handleCardSubmit} className="p-6 space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300">
              ℹ️ Đây là môi trường thử nghiệm (Sandbox). Bạn có thể sử dụng thông tin thẻ test NCB đã điền sẵn bên dưới.
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Ngân hàng phát hành:</label>
              <input
                type="text"
                disabled
                value="NCB - Ngân hàng Quốc Dân (Sandbox)"
                className="w-full bg-[#1c273e] border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Số thẻ ATM / Thẻ test:</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3 py-2 pl-9 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Tên chủ thẻ:</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3 py-2 text-white uppercase text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Ngày phát hành:</label>
                <input
                  type="text"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Hủy giao dịch
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                {isLoading ? "Đang xác thực thẻ..." : "Tiếp tục thanh toán"}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="p-6 space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
              🔒 Mã OTP đã được gửi đến số điện thoại đăng ký (Mã thử nghiệm mặc định: <strong>123456</strong>).
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nhập mã xác thực OTP:</label>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoFocus
                className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setStep("card_info")}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
              >
                {isLoading ? "Đang xử lý giao dịch..." : "Xác nhận OTP"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Payment Success */}
        {step === "success" && (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-black text-white">Thanh Toán VNPAY Thành Công!</h4>
            <p className="text-xs text-slate-300">
              Giao dịch đã được ghi nhận. Đang chuyển hướng về trang đơn hàng của bạn...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

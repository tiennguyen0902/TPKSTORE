import React, { useState } from "react";
import { 
  Bot, 
  Zap, 
  ShieldCheck, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle, 
  User, 
  Phone, 
  Mail, 
  Lock,
  Sparkles,
  KeyRound,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

interface AuthViewProps {
  onSuccess: (role?: string) => void;
  onBackToStore?: () => void;
  messageBanner?: string;
}

type AuthMode = "login" | "register" | "forgot_password" | "reset_password";

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, onBackToStore, messageBanner }) => {
  const { login, register } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Forgot Password states
  const [otp, setOtp] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);
    try {
      const loggedUser = await login(email, password);
      onSuccess(loggedUser?.role);
    } catch (err: any) {
      setErrorMsg(err.message || "Đăng nhập không thành công.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);
    try {
      const newUser = await register({
        email,
        password,
        fullName,
        phone: phoneNumber
      });
      onSuccess(newUser?.role);
    } catch (err: any) {
      setErrorMsg(err.message || "Đăng ký không thành công.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);
    try {
      const res = await api.forgotPassword(email);
      setReceivedOtp(res.otp || "");
      setSuccessMsg(res.message || "Mã xác thực OTP đã được tạo thành công!");
      setAuthMode("reset_password");
    } catch (err: any) {
      setErrorMsg(err.message || "Không thể gửi yêu cầu khôi phục mật khẩu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword.length < 6) {
      setErrorMsg("Mật khẩu mới phải có tối thiểu 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp. Vui lòng nhập lại.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.resetPassword({
        email,
        otp,
        newPassword
      });
      setSuccessMsg(res.message || "Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.");
      setPassword("");
      setOtp("");
      setReceivedOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setAuthMode("login");
    } catch (err: any) {
      setErrorMsg(err.message || "Đặt lại mật khẩu thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Hero Column */}
        <div className="lg:col-span-6 p-8 md:p-12 bg-gradient-to-br from-rose-50 via-white to-amber-50/50 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <span className="text-2xl font-black text-white">🐝</span>
              </div>
              <div>
                <span className="font-black text-xl text-slate-900 tracking-wider">SHOPBEE</span>
                <p className="text-[10px] text-rose-600 font-bold tracking-widest uppercase">SMART SHOPPING</p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Mua sắm công nghệ <br />
              cùng <span className="text-rose-600">SHOPBEE</span> 🐥
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
              Hệ thống gợi ý cá nhân hóa, đề xuất sản phẩm chính xác theo phong cách và ngân sách của bạn.
            </p>

            <div className="space-y-3.5 mt-8 text-xs text-slate-700">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="font-medium">AI Chatbot tư vấn 24/7 thông minh</span>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="font-medium">Giao hàng siêu tốc trong 2 giờ nội thành</span>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-medium">Bảo hành chính hãng 100% 1 đổi 1</span>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <span className="font-medium">Đổi trả miễn phí trong 7 ngày</span>
              </div>
            </div>
          </div>

          <div className="pt-8 text-[11px] text-slate-400 font-medium">
            © 2026 SHOPBEE STORE AI. All rights reserved.
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-center space-y-5 bg-white">
          {onBackToStore && (
            <div>
              <button
                type="button"
                onClick={onBackToStore}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all hover:scale-105 group shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-rose-600" />
                <span>Quay lại xem sản phẩm</span>
              </button>
            </div>
          )}

          {messageBanner && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 shadow-sm">
              <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{messageBanner}</span>
            </div>
          )}

          <div>
            <h3 className="text-2xl font-black text-slate-900">
              {authMode === "login" && "Đăng nhập"}
              {authMode === "register" && "Đăng ký tài khoản"}
              {authMode === "forgot_password" && "Khôi phục mật khẩu"}
              {authMode === "reset_password" && "Đặt lại mật khẩu mới"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {authMode === "login" && "Chào mừng bạn quay trở lại với SHOPBEE!"}
              {authMode === "register" && "Tạo tài khoản mới để trải nghiệm mua sắm AI"}
              {authMode === "forgot_password" && "Nhập email của bạn để nhận mã xác thực OTP khôi phục tài khoản."}
              {authMode === "reset_password" && `Nhập mã OTP và thiết lập mật khẩu mới cho ${email}`}
            </p>
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-sm animate-in fade-in font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Form Đăng Nhập */}
          {authMode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="me@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("forgot_password");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-[11px] text-rose-600 hover:text-rose-700 transition-colors font-semibold hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 pr-9 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{isLoading ? "Đang xác thực..." : "Đăng nhập"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-slate-500 text-xs">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => { setAuthMode("register"); setErrorMsg(""); setSuccessMsg(""); }}
                  className="text-rose-600 font-bold hover:underline"
                >
                  Đăng ký miễn phí
                </button>
              </div>
            </form>
          )}

          {/* 2. Form Đăng Ký */}
          {authMode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên đầy đủ *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email đăng ký *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số điện thoại</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="0912345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mật khẩu (tối thiểu 6 ký tự) *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 pr-9 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLoading ? "Đang tạo tài khoản..." : "Tạo Tài Khoản"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-slate-500 text-xs">
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); setErrorMsg(""); setSuccessMsg(""); }}
                  className="text-rose-600 font-bold hover:underline"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </form>
          )}

          {/* 3. Form Quên Mật Khẩu (Bước 1: Nhập Email) */}
          {authMode === "forgot_password" && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email tài khoản cần khôi phục</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="me@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{isLoading ? "Đang xử lý..." : "Gửi Mã Xác Thực OTP"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-slate-500 text-xs">
                Đã nhớ lại mật khẩu?{" "}
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); setErrorMsg(""); setSuccessMsg(""); }}
                  className="text-rose-600 font-bold hover:underline"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </form>
          )}

          {/* 4. Form Đặt Lại Mật Khẩu (Bước 2: Nhập OTP & Mật khẩu mới) */}
          {authMode === "reset_password" && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5 text-xs">
              {/* Badge demo OTP */}
              {receivedOtp && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Mã OTP của bạn: <strong className="text-amber-800 text-sm font-mono tracking-widest">{receivedOtp}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtp(receivedOtp)}
                    className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 text-[11px] font-bold transition-colors"
                  >
                    Điền nhanh
                  </button>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã xác thực OTP (6 chữ số) *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 text-slate-900 font-mono text-sm tracking-widest focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mật khẩu mới (tối thiểu 6 ký tự) *</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 pr-9 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Xác nhận mật khẩu mới *</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLoading ? "Đang xác nhận..." : "Xác Nhận Đặt Lại Mật Khẩu"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 flex items-center justify-between text-slate-500 text-xs">
                <button
                  type="button"
                  onClick={() => { setAuthMode("forgot_password"); setErrorMsg(""); }}
                  className="text-slate-500 hover:text-slate-800 hover:underline"
                >
                  ← Gửi lại mã OTP
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); setErrorMsg(""); setSuccessMsg(""); }}
                  className="text-rose-600 font-bold hover:underline"
                >
                  Về trang Đăng nhập
                </button>
              </div>
            </form>
          )}

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Kết nối bảo mật SSL. Thông tin của bạn được mã hóa và bảo vệ an toàn.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

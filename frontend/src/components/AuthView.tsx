import React, { useState } from "react";
import { 
  Bot, 
  Zap, 
  ShieldCheck, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  User, 
  Phone, 
  Mail, 
  Lock 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AuthViewProps {
  onSuccess: (role?: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
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

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-3xl bg-[#111827]/90 border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-xl">
        {/* Left Hero Column */}
        <div className="lg:col-span-6 p-8 md:p-12 bg-gradient-to-br from-[#151c33] via-[#0f172a] to-[#1c1335] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <span className="text-2xl font-black text-white">🐝</span>
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-wider">SHOPBEE</span>
                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">SMART SHOPPING</p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Mua sắm công nghệ <br />
              cùng <span className="text-amber-400">SHOPBEE</span> 🐥
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
              Hệ thống gợi ý cá nhân hóa, đề xuất sản phẩm chính xác theo phong cách và ngân sách của bạn.
            </p>

            <div className="space-y-3.5 mt-8 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <span>AI Chatbot tư vấn 24/7 thông minh</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <span>Giao hàng siêu tốc trong 2 giờ nội thành</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Bảo hành chính hãng 100% 1 đổi 1</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <span>Đổi trả miễn phí trong 7 ngày</span>
              </div>
            </div>
          </div>

          <div className="pt-8 text-[11px] text-slate-500">
            © 2026 SHOPBEE STORE AI. All rights reserved.
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-2xl font-black text-white">
              {isLoginTab ? "Đăng nhập" : "Đăng ký tài khoản"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isLoginTab ? "Chào mừng bạn quay trở lại với SHOPBEE!" : "Tạo tài khoản mới để trải nghiệm mua sắm AI"}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          {isLoginTab ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="me@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#162032] border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-white focus:outline-none focus:border-violet-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-300">Mật khẩu</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Vui lòng liên hệ Admin để khôi phục mật khẩu."); }} className="text-[11px] text-violet-400 hover:text-violet-300">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#162032] border border-slate-700 rounded-xl px-3 py-2.5 pl-9 pr-9 text-white focus:outline-none focus:border-violet-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{isLoading ? "Đang xác thực..." : "Đăng nhập"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-slate-400 text-xs">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => { setIsLoginTab(false); setErrorMsg(""); }}
                  className="text-violet-400 font-bold hover:underline"
                >
                  Đăng ký miễn phí
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Họ và tên đầy đủ *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#162032] border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-white focus:outline-none focus:border-violet-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email đăng ký *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#162032] border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-white focus:outline-none focus:border-violet-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Số điện thoại</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="0912345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-[#162032] border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-white focus:outline-none focus:border-violet-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Mật khẩu (tối thiểu 6 ký tự) *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#162032] border border-slate-700 rounded-xl px-3 py-2.5 pl-9 pr-9 text-white focus:outline-none focus:border-violet-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLoading ? "Đang tạo tài khoản..." : "Tạo Tài Khoản"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-slate-400 text-xs">
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => { setIsLoginTab(true); setErrorMsg(""); }}
                  className="text-violet-400 font-bold hover:underline"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </form>
          )}

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Kết nối bảo mật SSL. Thông tin của bạn được mã hóa và bảo vệ an toàn.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

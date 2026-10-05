import React, { useState } from "react";
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Product, User } from "../types";
import { handleImageError } from "../utils/imageFallback";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingProduct?: Product | null;
  onSuccess: (user: User) => void;
}

type AuthTab = "login" | "register";

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  pendingProduct,
  onSuccess
}) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  // Login form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register form states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Status & error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const clearFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab);
    setErrorMsg("");
    setSuccessMsg("");
    setFieldErrors({});
  };

  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const isValidPhone = (val: string) => {
    if (!val.trim()) return true;
    return /^(0[3|5|7|8|9])[0-9]{8}$/.test(val.trim());
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const errors: Record<string, string> = {};
    if (!email.trim()) {
      errors.email = "Vui lòng nhập địa chỉ email.";
    } else if (!isValidEmail(email)) {
      errors.email = "Email không đúng định dạng.";
    }

    if (!password) {
      errors.password = "Vui lòng nhập mật khẩu.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsLoading(true);
    try {
      const loggedUser = await login(email, password);
      setSuccessMsg("Đăng nhập thành công !");
      setTimeout(() => {
        onSuccess(loggedUser);
      }, 350);
    } catch (err: any) {
      setErrorMsg(err.message || "Đăng nhập không thành công. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const errors: Record<string, string> = {};
    if (!fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ và tên của bạn.";
    }

    if (!email.trim()) {
      errors.email = "Vui lòng nhập email.";
    } else if (!isValidEmail(email)) {
      errors.email = "Email không đúng định dạng.";
    }

    if (phoneNumber.trim() && !isValidPhone(phoneNumber)) {
      errors.phoneNumber = "Số điện thoại phải gồm 10 chữ số (VD: 0912345678).";
    }

    if (!registerPassword) {
      errors.registerPassword = "Vui lòng nhập mật khẩu.";
    } else if (registerPassword.length < 8) {
      errors.registerPassword = "Mật khẩu phải có tối thiểu 8 ký tự.";
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(registerPassword)) {
      errors.registerPassword = "Mật khẩu phải bao gồm cả chữ và số.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsLoading(true);
    try {
      const newUser = await register({
        email,
        password: registerPassword,
        fullName,
        phone: phoneNumber
      });
      setSuccessMsg("Đăng ký thành công!");
      setTimeout(() => {
        onSuccess(newUser);
      }, 350);
    } catch (err: any) {
      setErrorMsg(err.message || "Đăng ký không thành công.");
    } finally {
      setIsLoading(false);
    }
  };

  const productPrice = pendingProduct
    ? (typeof pendingProduct.price === "number" ? pendingProduct.price : Number(pendingProduct.price) || 0)
    : 0;

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[530px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          title="Đóng cửa sổ"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 px-6 py-4 text-white relative">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-rose-100 leading-tight">
                Yêu cầu đăng nhập
              </p>
              <h2 className="text-sm font-semibold text-white leading-tight mt-0.5">
                {activeTab === "login" ? "Đăng nhập để mua hàng" : "Tạo tài khoản để mua hàng"}
              </h2>
            </div>
          </div>
        </div>

        {/* Banner thông báo bo tròn không ngắt dòng và mở rộng border không bị ... */}
        <div className="mx-6 mt-3.5 py-2.5 px-4 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 text-center shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span className="whitespace-nowrap font-semibold">
            Vui lòng đăng nhập tài khoản để tiến hành mua hàng và thanh toán!
          </span>
        </div>

        {/* Selected Product Preview */}
        {pendingProduct && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
            <img
              src={pendingProduct.thumbnail}
              alt={pendingProduct.name}
              onError={(e) => handleImageError(e, pendingProduct.categoryId)}
              className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 text-xs truncate" title={pendingProduct.name}>
                {pendingProduct.name}
              </p>
              <p className="text-rose-600 font-black text-xs mt-0.5">
                {productPrice.toLocaleString("vi-VN")} đ
              </p>
            </div>
          </div>
        )}

        <div className="p-6 pt-4">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-4">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "login"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => switchTab("register")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "register"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Đăng ký mới
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-3.5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-3.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: ĐĂNG NHẬP */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} noValidate className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearFieldError("email");
                    }}
                    className={`w-full bg-slate-50 border rounded-2xl px-3.5 py-2.5 pl-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors ${
                      fieldErrors.email
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    }`}
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFieldError("password");
                    }}
                    className={`w-full bg-slate-50 border rounded-2xl px-3.5 py-2.5 pl-10 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors ${
                      fieldErrors.password
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    }`}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Đăng nhập & Tiếp tục mua hàng</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("register")}
                  className="text-rose-600 font-bold hover:underline"
                >
                  Đăng ký ngay
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ĐĂNG KÝ */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} noValidate className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      clearFieldError("fullName");
                    }}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 pl-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors ${
                      fieldErrors.fullName
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    }`}
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
                {fieldErrors.fullName && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">
                    {fieldErrors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearFieldError("email");
                    }}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 pl-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors ${
                      fieldErrors.email
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    }`}
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="0912345678"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      clearFieldError("phoneNumber");
                    }}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 pl-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors ${
                      fieldErrors.phoneNumber
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    }`}
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
                {fieldErrors.phoneNumber && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">
                    {fieldErrors.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="Tối thiểu 8 ký tự, có chữ và số"
                    value={registerPassword}
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                      clearFieldError("registerPassword");
                    }}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors ${
                      fieldErrors.registerPassword
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    }`}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
                  >
                    {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.registerPassword && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">
                    {fieldErrors.registerPassword}
                  </p>
                )}
              </div>

              {/* Submit Register */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Đăng ký & Mua hàng</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className="text-rose-600 font-bold hover:underline"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

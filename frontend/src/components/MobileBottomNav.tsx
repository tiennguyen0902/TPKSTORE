import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Grid, ShoppingBag, User, Bot, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

interface MobileBottomNavProps {
  currentView: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const { user } = useAuth();

  // Ẩn thanh bottom nav trên trang POS bán hàng để quầy thu ngân tối đa diện tích
  if (currentView === "pos_counter" || currentView === "admin_pos") {
    return null;
  }

  const isHome = currentView === "storefront" || location.pathname === "/";
  const isCatalog = currentView === "catalog" || location.pathname.startsWith("/products");
  const isCart = currentView === "cart" || location.pathname === "/cart";
  const isOrders = currentView === "my_orders" || location.pathname === "/my-orders";
  const isProfile = currentView === "profile" || currentView === "auth" || location.pathname === "/profile" || location.pathname === "/login";

  const handleOpenAi = () => {
    window.dispatchEvent(new CustomEvent("open-ai-chat"));
  };

  return (
    <nav 
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-1.5 py-1 flex items-center justify-around select-none"
      style={{ paddingBottom: "max(4px, env(safe-area-inset-bottom, 0px))" }}
    >
      {/* 1. Trang chủ */}
      <button
        onClick={() => navigate("/")}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
          isHome ? "text-rose-600 font-bold scale-105" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <Home className={`w-5 h-5 ${isHome ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Trang chủ</span>
      </button>

      {/* 2. Sản phẩm */}
      <button
        onClick={() => navigate("/products")}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
          isCatalog ? "text-rose-600 font-bold scale-105" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <Grid className={`w-5 h-5 ${isCatalog ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Sản phẩm</span>
      </button>

      {/* 3. Nút Trợ lý AI trung tâm nổi bật (Signature Center FAB - Không bao giờ bị khuất) */}
      <button
        onClick={handleOpenAi}
        className="flex-1 flex flex-col items-center justify-center relative -top-3 group transition-transform active:scale-95"
        title="Trợ lý AI Thông Minh"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/40 border-2 border-white ring-2 ring-rose-500/20 group-hover:scale-110 transition-transform">
          <Bot className="w-6 h-6 animate-pulse" />
        </div>
        <span className="text-[10px] font-extrabold text-rose-600 -mt-0.5 tracking-tight flex items-center gap-0.5">
          <Sparkles className="w-2.5 h-2.5 text-amber-500" />
          Hỏi AI
        </span>
      </button>

      {/* 4. Giỏ hàng */}
      <button
        onClick={() => navigate("/cart")}
        className={`flex-1 relative flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
          isCart ? "text-rose-600 font-bold scale-105" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <div className="relative">
          <ShoppingBag className={`w-5 h-5 ${isCart ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse">
              {itemCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Giỏ hàng</span>
      </button>

      {/* 5. Tài khoản / Đơn hàng */}
      <button
        onClick={() => navigate(user ? (isOrders ? "/my-orders" : "/profile") : "/login")}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
          isProfile || isOrders ? "text-rose-600 font-bold scale-105" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <User className={`w-5 h-5 ${isProfile || isOrders ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">
          {user ? (isOrders ? "Đơn hàng" : "Tài khoản") : "Đăng nhập"}
        </span>
      </button>
    </nav>
  );
};

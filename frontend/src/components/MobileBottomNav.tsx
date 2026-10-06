import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Grid, ShoppingBag, Package, User } from "lucide-react";
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

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1 flex items-center justify-around select-none">
      {/* 1. Trang chủ */}
      <button
        onClick={() => navigate("/")}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          isHome ? "text-rose-600 font-bold scale-105" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <Home className={`w-5 h-5 ${isHome ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Trang chủ</span>
      </button>

      {/* 2. Sản phẩm */}
      <button
        onClick={() => navigate("/products")}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          isCatalog ? "text-rose-600 font-bold scale-105" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <Grid className={`w-5 h-5 ${isCatalog ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Sản phẩm</span>
      </button>

      {/* 3. Giỏ hàng */}
      <button
        onClick={() => navigate("/cart")}
        className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
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

      {/* 4. Đơn hàng */}
      <button
        onClick={() => navigate(user ? "/my-orders" : "/login")}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          isOrders ? "text-rose-600 font-bold scale-105" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <Package className={`w-5 h-5 ${isOrders ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Đơn hàng</span>
      </button>

      {/* 5. Tài khoản */}
      <button
        onClick={() => navigate(user ? "/profile" : "/login")}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          isProfile ? "text-rose-600 font-bold scale-105" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <User className={`w-5 h-5 ${isProfile ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Tài khoản</span>
      </button>
    </nav>
  );
};

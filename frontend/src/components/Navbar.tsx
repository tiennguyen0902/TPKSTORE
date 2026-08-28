import React, { useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  Package, 
  ChevronDown 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div 
            onClick={() => setCurrentView(user ? "storefront" : "auth")}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-violet-600 flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black text-white tracking-tighter">🐝</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-lg text-white tracking-wider">SHOPBEE</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-400/10 px-1 py-0.2 rounded border border-amber-400/20">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">SMART SHOPPING</p>
            </div>
          </div>

          {/* Category Quick Links (Storefront) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button 
              onClick={() => { setSelectedCategory("dien-thoai-tablet"); setCurrentView("catalog"); }}
              className={`hover:text-white transition-colors ${selectedCategory === "dien-thoai-tablet" && currentView === "catalog" ? "text-violet-400 font-semibold" : ""}`}
            >
              Điện thoại & Tablet
            </button>
            <button 
              onClick={() => { setSelectedCategory("laptop-macbook"); setCurrentView("catalog"); }}
              className={`hover:text-white transition-colors ${selectedCategory === "laptop-macbook" && currentView === "catalog" ? "text-violet-400 font-semibold" : ""}`}
            >
              Laptop & PC
            </button>
            <button 
              onClick={() => { setSelectedCategory("tai-nghe-am-thanh"); setCurrentView("catalog"); }}
              className={`hover:text-white transition-colors ${selectedCategory === "tai-nghe-am-thanh" && currentView === "catalog" ? "text-violet-400 font-semibold" : ""}`}
            >
              Tai nghe & Âm thanh
            </button>
            <button 
              onClick={() => { setSelectedCategory("dong-ho-thong-minh"); setCurrentView("catalog"); }}
              className={`hover:text-white transition-colors ${selectedCategory === "dong-ho-thong-minh" && currentView === "catalog" ? "text-violet-400 font-semibold" : ""}`}
            >
              Đồng hồ thông minh
            </button>
          </nav>

          {/* Search Bar - Bo tròn to sâu (rounded-full) và rộng rãi */}
          <div className="flex-1 max-w-lg lg:max-w-xl relative hidden md:block">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setCurrentView("catalog");
                }}
                className="w-full h-11 bg-[#131c2e] border-2 border-slate-700/80 rounded-full pl-12 pr-5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 hover:border-slate-600 transition-all shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            </div>
          </div>

          {/* Right Action Icons (Đã xóa 3 nút Cập nhật, Studio, Admin Portal khỏi Navbar theo yêu cầu) */}
          <div className="flex items-center gap-3">
            {/* Cart Button with Count Badge */}
            <button 
              onClick={() => setCurrentView("cart")}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5 text-slate-200" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-violet-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-md shadow-violet-600/40 animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              {user ? (
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full bg-[#131c2e] border border-slate-700/80 hover:border-violet-500/50 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-slate-200 max-w-[90px] truncate hidden sm:inline">
                    {user.fullName.split(" ")[0]}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                    user.role === "ADMIN" ? "bg-violet-500/20 text-violet-300" :
                    user.role === "STAFF" ? "bg-blue-500/20 text-blue-300" : "bg-emerald-500/20 text-emerald-300"
                  }`}>
                    {user.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentView("auth")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </button>
              )}

              {/* Dropdown Menu */}
              {showUserDropdown && user && (
                <div className="absolute right-0 mt-2 w-56 bg-[#131c2e] border border-slate-700/90 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white">{user.fullName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button 
                      onClick={() => { setCurrentView("storefront"); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-violet-400" /> Cửa hàng Storefront
                    </button>
                    <button 
                      onClick={() => { setCurrentView("my_orders"); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2"
                    >
                      <Package className="w-3.5 h-3.5 text-blue-400" /> Đơn hàng của tôi
                    </button>
                    <button 
                      onClick={() => { setCurrentView("profile"); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-emerald-400" /> Quản lý thông tin cá nhân
                    </button>

                    {/* Vẫn giữ quyền vào bảng điều khiển Admin cho tài khoản ADMIN */}
                    {user.role === "ADMIN" && (
                      <button 
                        onClick={() => { setCurrentView("admin_dashboard"); setShowUserDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-violet-300 hover:bg-violet-900/30 flex items-center gap-2 font-medium"
                      >
                        <Shield className="w-3.5 h-3.5" /> Bảng điều khiển Admin
                      </button>
                    )}

                    {/* Vẫn giữ quyền vào bảng điều khiển Staff cho tài khoản STAFF */}
                    {user.role === "STAFF" && (
                      <button 
                        onClick={() => { setCurrentView("staff_dashboard"); setShowUserDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-blue-300 hover:bg-blue-900/30 flex items-center gap-2 font-medium"
                      >
                        <Package className="w-3.5 h-3.5" /> Bảng điều khiển Staff
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-800 pt-1">
                    <button 
                      onClick={() => { logout(); setShowUserDropdown(false); setCurrentView("auth"); }}
                      className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

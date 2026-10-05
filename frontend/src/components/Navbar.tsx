import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  Package, 
  Boxes,
  ChevronDown,
  Store 
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
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleCategoryClick = (catSlug: string) => {
    setSelectedCategory(catSlug);
    navigate(`/products?category=${catSlug}`);
  };

  const handleSearchSubmit = () => {
    const q = searchQuery.trim();
    if (q) {
      navigate(`/products?search=${encodeURIComponent(q)}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div 
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-600 to-rose-700 flex items-center justify-center shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black text-white tracking-tighter">🐝</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-lg text-slate-900 tracking-wider">SHOPBEE</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">AI</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight">SMART SHOPPING</p>
            </div>
          </div>

          {/* Category Quick Links (Storefront) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button 
              onClick={() => handleCategoryClick("dien-thoai-tablet")}
              className={`hover:text-rose-600 transition-colors ${selectedCategory === "dien-thoai-tablet" && currentView === "catalog" ? "text-rose-600 font-bold" : ""}`}
            >
              Điện thoại & Tablet
            </button>
            <button 
              onClick={() => handleCategoryClick("laptop-macbook")}
              className={`hover:text-rose-600 transition-colors ${selectedCategory === "laptop-macbook" && currentView === "catalog" ? "text-rose-600 font-bold" : ""}`}
            >
              Laptop & PC
            </button>
            <button 
              onClick={() => handleCategoryClick("tai-nghe-am-thanh")}
              className={`hover:text-rose-600 transition-colors ${selectedCategory === "tai-nghe-am-thanh" && currentView === "catalog" ? "text-rose-600 font-bold" : ""}`}
            >
              Tai nghe & Âm thanh
            </button>
            <button 
              onClick={() => handleCategoryClick("dong-ho-thong-minh")}
              className={`hover:text-rose-600 transition-colors ${selectedCategory === "dong-ho-thong-minh" && currentView === "catalog" ? "text-rose-600 font-bold" : ""}`}
            >
              Đồng hồ thông minh
            </button>
          </nav>

          {/* Search Bar - Bo tròn to sâu (rounded-full) và rộng rãi */}
          <div className="flex-1 max-w-lg lg:max-w-xl relative hidden md:block">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm điện thoại, laptop, phụ kiện AI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchSubmit();
                }}
                className="w-full h-11 bg-slate-100 border border-slate-200 rounded-full pl-12 pr-5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-slate-300 transition-all shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Quick Staff Action Buttons: Separated POS & Warehouse */}
            {user && (user.role === "STAFF" || user.role === "ADMIN" || user.role === "MANAGER") && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => navigate("/pos")}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all shadow-xs ${
                    currentView === "pos_counter"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300"
                  }`}
                  title="Bàn làm việc tư vấn khách hàng và lập đơn tại quầy (POS)"
                >
                  <Store className="w-4 h-4" />
                  <span>Tư Vấn Bán Quầy (POS)</span>
                </button>
                <button
                  onClick={() => navigate("/warehouse")}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all shadow-xs ${
                    currentView === "warehouse_dashboard" || currentView === "staff_dashboard"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300"
                  }`}
                  title="Cổng quản lý và vận hành kho hàng (Warehouse Portal)"
                >
                  <Boxes className="w-4 h-4" />
                  <span>Quản Lý Kho</span>
                </button>
              </div>
            )}

            {/* Cart Button with Count Badge */}
            <button 
              onClick={() => navigate("/cart")}
              className={`relative p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all hover:scale-105 ${
                currentView === "cart" ? "ring-2 ring-rose-500 text-rose-600 bg-rose-50" : ""
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-rose-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-md shadow-rose-600/40 animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              {user ? (
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full bg-slate-100 border border-slate-200 hover:border-rose-400 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-600 to-rose-800 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[90px] truncate hidden sm:inline">
                    {user.fullName.split(" ")[0]}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    user.role === "ADMIN" ? "bg-rose-100 text-rose-700 border border-rose-200" :
                    user.role === "MANAGER" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                    user.role === "STAFF" ? "bg-blue-100 text-blue-800 border border-blue-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}>
                    {user.role === "MANAGER" ? "MANAGER" : user.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ) : (
                <button 
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </button>
              )}

              {/* Dropdown Menu */}
              {showUserDropdown && user && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button 
                      onClick={() => { navigate("/"); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-rose-500" /> Cửa hàng Storefront
                    </button>
                    <button 
                      onClick={() => { navigate("/my-orders"); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                    >
                      <Package className="w-3.5 h-3.5 text-blue-500" /> Đơn hàng của tôi
                    </button>
                    <button 
                      onClick={() => { navigate("/profile"); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-emerald-500" /> Quản lý thông tin cá nhân
                    </button>

                    {/* Quyền Quản lý kho MANAGER */}
                    {user.role === "MANAGER" && (
                      <>
                        <button 
                          onClick={() => { navigate("/pos"); setShowUserDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-bold border-t border-slate-100 mt-1"
                        >
                          <Store className="w-3.5 h-3.5 text-emerald-600" /> 1. Bàn Tư Vấn Bán Quầy (POS)
                        </button>
                        <button 
                          onClick={() => { navigate("/warehouse"); setShowUserDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2 font-bold"
                        >
                          <Boxes className="w-3.5 h-3.5 text-blue-600" /> 2. Cổng Quản Lý Kho Hàng
                        </button>
                        <button 
                          onClick={() => { navigate("/admin/stock-tickets"); setShowUserDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-bold"
                        >
                          <Boxes className="w-3.5 h-3.5 text-rose-600" /> 3. Duyệt Xuất / Nhập Kho
                        </button>
                      </>
                    )}

                    {/* Quyền ADMIN tối cao */}
                    {user.role === "ADMIN" && (
                      <>
                        <button 
                          onClick={() => { navigate("/pos"); setShowUserDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-bold border-t border-slate-100 mt-1"
                        >
                          <Store className="w-3.5 h-3.5 text-emerald-600" /> 1. Bàn Tư Vấn Bán Quầy (POS)
                        </button>
                        <button 
                          onClick={() => { navigate("/warehouse"); setShowUserDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2 font-bold"
                        >
                          <Boxes className="w-3.5 h-3.5 text-blue-600" /> 2. Cổng Quản Lý Kho Hàng
                        </button>
                        <button 
                          onClick={() => { navigate("/admin/dashboard"); setShowUserDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-bold"
                        >
                          <Shield className="w-3.5 h-3.5 text-rose-600" /> 3. Bảng Điều Khiển Admin
                        </button>
                      </>
                    )}

                    {/* Quyền STAFF vận hành */}
                    {user.role === "STAFF" && (
                      <>
                        <button 
                          onClick={() => { navigate("/pos"); setShowUserDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-bold border-t border-slate-100 mt-1"
                        >
                          <Store className="w-3.5 h-3.5 text-emerald-600" /> 1. Bàn Tư Vấn Bán Quầy (POS)
                        </button>
                        <button 
                          onClick={() => { navigate("/warehouse"); setShowUserDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2 font-bold"
                        >
                          <Boxes className="w-3.5 h-3.5 text-blue-600" /> 2. Cổng Quản Lý Kho Hàng
                        </button>
                      </>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button 
                      onClick={() => { logout(); setShowUserDropdown(false); navigate("/login"); }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
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

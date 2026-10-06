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
  Store,
  Menu,
  X,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Tag,
  Sparkles
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  const handleCategoryClick = (catSlug: string) => {
    setSelectedCategory(catSlug);
    navigate(`/products?category=${catSlug}`);
    setShowMobileDrawer(false);
  };

  const handleSearchSubmit = () => {
    const q = searchQuery.trim();
    if (q) {
      navigate(`/products?search=${encodeURIComponent(q)}`);
    } else {
      navigate("/products");
    }
    setShowMobileSearch(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Main Navigation Bar */}
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4 lg:gap-6">
          {/* Left: Mobile Drawer Trigger + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger Button on Mobile / Tablet */}
            <button
              onClick={() => setShowMobileDrawer(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-slate-100 transition-colors shrink-0"
              title="Menu danh mục"
              aria-label="Mở menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-600 to-rose-700 flex items-center justify-center shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform shrink-0">
                <span className="text-lg sm:text-xl font-black text-white tracking-tighter">🐝</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-wider">SHOPBEE</span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-rose-700 bg-rose-50 px-1 sm:px-1.5 py-0.5 rounded border border-rose-200">AI</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium tracking-tight hidden xs:block">SMART SHOPPING</p>
              </div>
            </div>
          </div>

          {/* Category Quick Links (Desktop Storefront) */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 shrink-0">
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

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-xs md:max-w-sm lg:max-w-md relative hidden md:block mx-2 lg:mx-3">
            <div className="relative flex items-center w-full">
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
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* AI Assistant Quick Mobile Button */}
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("open-ai-chat"))}
              className="md:hidden p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shrink-0 flex items-center gap-1"
              title="Chat với Trợ lý AI"
              aria-label="Trợ lý AI"
            >
              <Sparkles className="w-5 h-5 text-rose-600" />
            </button>

            {/* Mobile Search Toggle Button */}
            <button 
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className={`md:hidden p-2 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-slate-100 transition-colors ${
                showMobileSearch ? "text-rose-600 bg-rose-50" : ""
              }`}
              title="Tìm kiếm"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button with Count Badge */}
            <button 
              onClick={() => navigate("/cart")}
              className={`relative p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all hover:scale-105 shrink-0 ${
                currentView === "cart" ? "ring-2 ring-rose-500 text-rose-600 bg-rose-50" : ""
              }`}
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-rose-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-md shadow-rose-600/40 animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile Menu - Tối ưu cực gọn trên mobile */}
            <div className="relative shrink-0">
              {user ? (
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 sm:gap-3 h-10 sm:h-11 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-rose-400 transition-all shrink-0 group shadow-xs"
                  title={user.fullName}
                >
                  {/* Avatar */}
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-rose-200 shrink-0 shadow-inner"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-rose-600 to-rose-800 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-inner">
                      {user.fullName?.charAt(0) || "U"}
                    </div>
                  )}

                  {/* Tên người dùng hiển thị trên màn hình sm trở lên */}
                  <span className="hidden sm:inline-block text-sm font-bold text-slate-800 max-w-[120px] md:max-w-[170px] truncate">
                    {user.fullName}
                  </span>

                  {/* Huy hiệu vai trò hiển thị trên md trở lên */}
                  {user.role && user.role !== "CUSTOMER" && (
                    <span className={`hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase shrink-0 ${
                      user.role === "ADMIN" ? "bg-rose-100 text-rose-700 border border-rose-200" :
                      user.role === "MANAGER" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                      "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}>
                      {user.role === "MANAGER" ? "MANAGER" : user.role}
                    </span>
                  )}

                  <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0 transition-transform duration-200 ${showUserDropdown ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <button 
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all shrink-0"
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

                    {/* Quyền Quản lý kho MANAGER (Chỉ quản lý kho và duyệt nhập xuất kho) */}
                    {user.role === "MANAGER" && (
                      <>
                        <button 
                          onClick={() => { navigate("/warehouse"); setShowUserDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2 font-bold border-t border-slate-100 mt-1"
                        >
                          <Boxes className="w-3.5 h-3.5 text-blue-600" /> Cổng Quản Lý Kho Hàng
                        </button>
                        <button 
                          onClick={() => { navigate("/admin/stock-tickets"); setShowUserDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-bold"
                        >
                          <Boxes className="w-3.5 h-3.5 text-rose-600" /> Duyệt Xuất / Nhập Kho
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
                          <Store className="w-3.5 h-3.5 text-emerald-600" /> Bàn Tư Vấn Bán Quầy (POS)
                        </button>
                        <button 
                          onClick={() => { navigate("/warehouse"); setShowUserDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2 font-bold"
                        >
                          <Boxes className="w-3.5 h-3.5 text-blue-600" /> Cổng Quản Lý Kho Hàng
                        </button>
                        <button 
                          onClick={() => { navigate("/admin/dashboard"); setShowUserDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-bold"
                        >
                          <Shield className="w-3.5 h-3.5 text-rose-600" /> Bảng Điều Khiển Admin
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
                          <Store className="w-3.5 h-3.5 text-emerald-600" /> Bàn Tư Vấn Bán Quầy (POS)
                        </button>
                        <button 
                          onClick={() => { navigate("/warehouse"); setShowUserDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2 font-bold"
                        >
                          <Boxes className="w-3.5 h-3.5 text-blue-600" /> Cổng Quản Lý Kho Hàng
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

      {/* Mobile Search Bar Expandable */}
      {showMobileSearch && (
        <div className="md:hidden px-4 py-2.5 bg-slate-50 border-t border-slate-200 animate-in slide-in-from-top-2 duration-150 shadow-inner">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              placeholder="Tìm điện thoại, laptop, phụ kiện AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit();
              }}
              autoFocus
              className="w-full h-10 bg-white border border-slate-300 rounded-full pl-10 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {showMobileDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setShowMobileDrawer(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  🐝
                </div>
                <span className="font-extrabold text-base text-slate-900">SHOPBEE AI</span>
              </div>
              <button
                onClick={() => setShowMobileDrawer(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">DANH MỤC SẢN PHẨM</p>
                <div className="space-y-1">
                  <button 
                    onClick={() => handleCategoryClick("dien-thoai-tablet")}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2.5 transition-colors"
                  >
                    <Smartphone className="w-4 h-4 text-rose-500" />
                    <span>Điện thoại & Tablet</span>
                  </button>
                  <button 
                    onClick={() => handleCategoryClick("laptop-macbook")}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2.5 transition-colors"
                  >
                    <Laptop className="w-4 h-4 text-blue-500" />
                    <span>Laptop & PC</span>
                  </button>
                  <button 
                    onClick={() => handleCategoryClick("tai-nghe-am-thanh")}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2.5 transition-colors"
                  >
                    <Headphones className="w-4 h-4 text-amber-500" />
                    <span>Tai nghe & Âm thanh</span>
                  </button>
                  <button 
                    onClick={() => handleCategoryClick("dong-ho-thong-minh")}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2.5 transition-colors"
                  >
                    <Watch className="w-4 h-4 text-emerald-500" />
                    <span>Đồng hồ thông minh</span>
                  </button>
                  <button 
                    onClick={() => { setSelectedCategory("all"); navigate("/products"); setShowMobileDrawer(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2.5 transition-colors"
                  >
                    <Tag className="w-4 h-4 text-purple-500" />
                    <span>Xem tất cả sản phẩm</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">ĐIỀU HƯỚNG NHANH</p>
                <div className="space-y-1">
                  <button 
                    onClick={() => { navigate("/cart"); setShowMobileDrawer(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShoppingBag className="w-4 h-4 text-rose-500" /> Giỏ hàng
                    </span>
                    {itemCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                        {itemCount}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => { navigate("/my-orders"); setShowMobileDrawer(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition-colors"
                  >
                    <Package className="w-4 h-4 text-blue-500" /> Đơn hàng của tôi
                  </button>
                  <button 
                    onClick={() => { navigate("/profile"); setShowMobileDrawer(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-emerald-500" /> Quản lý thông tin cá nhân
                  </button>
                </div>
              </div>
            </div>

            {/* Footer with user info or login */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {user.fullName?.charAt(0) || "U"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setShowMobileDrawer(false); navigate("/login"); }}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { navigate("/login"); setShowMobileDrawer(false); }}
                  className="w-full py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-600/20 text-center"
                >
                  Đăng nhập / Đăng ký
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

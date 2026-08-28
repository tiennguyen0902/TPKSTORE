import React from "react";
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  ShoppingBag, 
  Users, 
  Boxes, 
  Cpu, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  Home, 
  LogOut 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigateHome: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  onNavigateHome
}) => {
  const { user, logout } = useAuth();

  const navSections = [
    {
      title: "TỔNG QUAN",
      items: [
        { id: "admin_dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> }
      ]
    },
    {
      title: "QUẢN LÝ BÁN HÀNG",
      items: [
        { id: "admin_products", label: "Sản phẩm", icon: <Package className="w-4 h-4" /> },
        { id: "admin_categories", label: "Danh mục", icon: <Tag className="w-4 h-4" /> },
        { id: "admin_orders", label: "Đơn hàng", icon: <ShoppingBag className="w-4 h-4" /> },
        { id: "admin_customers", label: "Khách hàng", icon: <Users className="w-4 h-4" /> },
        { id: "admin_inventory", label: "Tồn kho", icon: <Boxes className="w-4 h-4" /> }
      ]
    },
    {
      title: "TRÍ TUỆ NHÂN TẠO",
      items: [
        { id: "admin_studio", label: "Architecture Studio", icon: <Cpu className="w-4 h-4 text-violet-400" /> },
        { id: "admin_forecast", label: "AI Analytics & Dự báo", icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
        { id: "admin_inventory_alerts", label: "Cảnh báo tồn kho", icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> }
      ]
    },
    {
      title: "CÀI ĐẶT",
      items: [
        { id: "admin_settings", label: "Cấu hình hệ thống", icon: <Settings className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0a0e17] border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-violet-600 flex items-center justify-center font-black text-white shadow-md">
            🐝
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-white tracking-wider">SHOPBEE</span>
              <span className="text-[9px] uppercase font-bold text-violet-400 bg-violet-400/10 px-1 py-0.2 rounded border border-violet-400/20">ADMIN</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">BẢNG QUẢN TRỊ</p>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="p-4 space-y-6">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase px-3">
                {sec.title}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                          : "text-slate-400 hover:bg-[#131c2e] hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile Info & Actions */}
      <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#080b12]">
        {/* User Card */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#111827] border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.fullName?.charAt(0) || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {user?.fullName || "Thang Quốc Khải (Admin)"}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email || "admin@example.com"}</p>
          </div>
        </div>

        {/* Back & Logout Buttons */}
        <div className="space-y-1 text-xs">
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4 text-violet-400" />
            <span>Về cửa hàng</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

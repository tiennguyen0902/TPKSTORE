import React from "react";
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  ShoppingBag, 
  Users, 
  Boxes, 
  ArrowDownToLine,
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
  const isManager = user?.role === "MANAGER";

  const navSections = isManager ? [
    {
      title: "TỔNG QUAN",
      items: [
        { id: "admin_dashboard", label: "Dashboard Kho", icon: <LayoutDashboard className="w-4 h-4" /> }
      ]
    },
    {
      title: "QUẢN LÝ KHO & KIỂM SOÁT STAFF",
      items: [
        { id: "admin_stock_tickets", label: "Duyệt Xuất / Nhập Kho", icon: <ArrowDownToLine className="w-4 h-4 text-rose-500" /> },
        { id: "admin_inventory", label: "Tồn Kho & Cảnh Báo", icon: <Boxes className="w-4 h-4 text-blue-500" /> },
        { id: "admin_inventory_alerts", label: "Cảnh Báo Cạn Kho AI", icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
        { id: "admin_products", label: "Tra Cứu Tồn Kho SP", icon: <Package className="w-4 h-4 text-slate-500" /> },
        { id: "admin_orders", label: "Đơn Hàng Xuất Kho", icon: <ShoppingBag className="w-4 h-4 text-emerald-500" /> }
      ]
    },
    {
      title: "TRÍ TUỆ NHÂN TẠO",
      items: [
        { id: "admin_forecast", label: "AI Dự Báo Nhu Cầu", icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> }
      ]
    }
  ] : [
    {
      title: "TỔNG QUAN",
      items: [
        { id: "admin_dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> }
      ]
    },
    {
      title: "QUẢN LÝ SẢN PHẨM & KHO",
      items: [
        { id: "admin_stock_tickets", label: "Duyệt Xuất/Nhập Kho", icon: <ArrowDownToLine className="w-4 h-4 text-rose-500" /> },
        { id: "admin_products", label: "Quản Lý Sản Phẩm", icon: <Package className="w-4 h-4 text-rose-600" /> },
        { id: "admin_categories", label: "Danh Mục", icon: <Tag className="w-4 h-4 text-indigo-500" /> },
        { id: "admin_orders", label: "Đơn Hàng", icon: <ShoppingBag className="w-4 h-4 text-emerald-500" /> },
        { id: "admin_customers", label: "Khách Hàng & Phân Quyền", icon: <Users className="w-4 h-4 text-purple-500" /> },
        { id: "admin_inventory", label: "Tồn Kho & Cảnh Báo", icon: <Boxes className="w-4 h-4 text-blue-500" /> }
      ]
    },
    {
      title: "TRÍ TUỆ NHÂN TẠO",
      items: [
        { id: "admin_studio", label: "Architecture Studio", icon: <Cpu className="w-4 h-4 text-rose-400" /> },
        { id: "admin_forecast", label: "AI Dự Báo Doanh Thu", icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
        { id: "admin_inventory_alerts", label: "Cảnh Báo Cạn Kho AI", icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> }
      ]
    },
    {
      title: "CÀI ĐẶT HỆ THỐNG",
      items: [
        { id: "admin_settings", label: "Cấu Hình Hệ Thống", icon: <Settings className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none overflow-y-auto shadow-sm">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-600 to-rose-700 flex items-center justify-center font-black text-white shadow-md shadow-rose-600/30">
            🐝
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-slate-900 tracking-wider">SHOPBEE</span>
              <span className="text-[9px] uppercase font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                {isManager ? "MANAGER" : "ADMIN"}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              {isManager ? "ĐIỀU HÀNH KHO HÀNG" : "BẢNG QUẢN TRỊ TỐI CAO"}
            </p>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="p-4 space-y-6">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase px-3">
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
                          ? "bg-rose-600 text-white shadow-md shadow-rose-600/25"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
      <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50">
        {/* User Card */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-rose-800 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate">
              {user?.fullName || (isManager ? "Trần Quốc Quản" : "Thang Quốc Khải")}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email || (isManager ? "manager@example.com" : "admin@example.com")}</p>
          </div>
        </div>

        {/* Back & Logout Buttons */}
        <div className="space-y-1 text-xs">
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 transition-colors"
          >
            <Home className="w-4 h-4 text-rose-600" />
            <span>Về cửa hàng</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

import React, { useState } from "react";
import { 
  Package, 
  ShoppingBag, 
  Boxes, 
  AlertTriangle, 
  ArrowDownToLine,
  Truck, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Store 
} from "lucide-react";
import { AdminOrders } from "./AdminOrders";
import { AdminProducts } from "./AdminProducts";
import { AdminInventoryAlerts } from "./AdminInventoryAlerts";
import { StockTicketsView } from "./StockTicketsView";

interface StaffDashboardProps {
  onNavigatePos?: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ onNavigatePos }) => {
  const [activeTab, setActiveTab] = useState<"tickets" | "products" | "orders" | "alerts">("tickets");

  return (
    <div className="space-y-6 pb-16">
      {/* Warehouse Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold mb-1 border border-blue-200">
              <Boxes className="w-3.5 h-3.5 text-blue-600" />
              <span>HỆ THỐNG QUẢN LÝ KHO HÀNG (WAREHOUSE PORTAL)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cổng Quản Lý & Vận Hành Kho Hàng
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium max-w-2xl">
              Chuyên trách quản lý phiếu xuất nhập kho 2 lớp, tra cứu tồn kho sản phẩm khả dụng, đóng gói đơn hàng và kiểm soát cảnh báo cạn kho AI.
            </p>
          </div>

          {/* Quick Switch to POS Counter */}
          {onNavigatePos && (
            <div className="shrink-0">
              <button
                type="button"
                onClick={onNavigatePos}
                className="px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-2 shadow-xs transition-all hover:scale-105 active:scale-95"
              >
                <Store className="w-4 h-4 text-emerald-600" />
                <span>Chuyển Sang Bàn Tư Vấn Bán Quầy (POS) ➔</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation Strip (Warehouse Only) */}
        <div className="pt-3 border-t border-slate-100">
          <div className="inline-flex items-center gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs overflow-x-auto max-w-full shadow-xs">
            <button
              onClick={() => setActiveTab("tickets")}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "tickets"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Phiếu Xuất / Nhập Kho</span>
              <span className="px-1.5 py-0.5 rounded-full bg-rose-700/80 text-[10px] font-black uppercase text-rose-100">
                Chính
              </span>
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "products"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>Sản Phẩm Tồn Kho</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "orders"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Đơn Hàng Xuất Kho</span>
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "alerts"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Cảnh Báo Tồn Kho AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab View */}
      {activeTab === "tickets" && <StockTicketsView embeddedRole="STAFF" />}
      {activeTab === "products" && <AdminProducts />}
      {activeTab === "orders" && <AdminOrders />}
      {activeTab === "alerts" && <AdminInventoryAlerts />}
    </div>
  );
};

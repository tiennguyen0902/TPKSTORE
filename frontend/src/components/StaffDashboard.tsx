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
import { CounterPosView } from "./CounterPosView";

export const StaffDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pos" | "tickets" | "products" | "orders" | "alerts">("pos");

  return (
    <div className="space-y-6 pb-16">
      {/* Staff Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold mb-1 border border-rose-200">
              <Package className="w-3.5 h-3.5 text-rose-600" />
              <span>STAFF OPERATIONS & WAREHOUSE PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cổng Vận Hành, Bán Hàng Tại Quầy & Kho Hàng
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Tư vấn lập đơn bán lẻ cho khách vãng lai, quản lý xuất nhập kho và theo dõi cảnh báo tồn kho
            </p>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="pt-3 border-t border-slate-100">
          <div className="inline-flex items-center gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs overflow-x-auto max-w-full shadow-xs">
            <button
              onClick={() => setActiveTab("pos")}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "pos"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Bán Hàng Tại Quầy (POS)</span>
            </button>
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
              <span>Sản Phẩm Kho</span>
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
              <span>Xử Lý Đơn Hàng</span>
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
              <span>Cảnh Báo Tồn Kho</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab View */}
      {activeTab === "pos" && <CounterPosView />}
      {activeTab === "tickets" && <StockTicketsView embeddedRole="STAFF" />}
      {activeTab === "products" && <AdminProducts />}
      {activeTab === "orders" && <AdminOrders />}
      {activeTab === "alerts" && <AdminInventoryAlerts />}
    </div>
  );
};

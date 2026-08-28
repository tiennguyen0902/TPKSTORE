import React, { useState } from "react";
import { 
  Package, 
  ShoppingBag, 
  Boxes, 
  AlertTriangle, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Sparkles 
} from "lucide-react";
import { AdminOrders } from "./AdminOrders";
import { AdminProducts } from "./AdminProducts";
import { AdminInventoryAlerts } from "./AdminInventoryAlerts";

export const StaffDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "alerts">("orders");

  return (
    <div className="space-y-6 pb-16">
      {/* Staff Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-[#131c2e] to-indigo-950/60 border border-blue-500/30 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 text-[11px] font-semibold mb-1">
              <Package className="w-3.5 h-3.5" />
              <span>STAFF OPERATIONS PORTAL</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              Cổng Vận Hành & Bán Hàng Dành Cho Nhân Viên
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Xử lý đơn hàng, theo dõi giao vận, kiểm soát số lượng tồn kho và duyệt nhập hàng thông minh
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-[#18233a] border border-slate-700/80 rounded-2xl text-xs">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "orders" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Xử Lý Đơn Hàng</span>
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "products" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Sản Phẩm</span>
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "alerts" ? "bg-amber-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Cảnh Báo Tồn Kho</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab View */}
      {activeTab === "orders" && <AdminOrders />}
      {activeTab === "products" && <AdminProducts />}
      {activeTab === "alerts" && <AdminInventoryAlerts />}
    </div>
  );
};

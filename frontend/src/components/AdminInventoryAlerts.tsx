import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  Boxes, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Truck, 
  RefreshCw 
} from "lucide-react";
import { api } from "../services/api";
import { InventoryAlert } from "../types";

export const AdminInventoryAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await api.getInventoryAlerts();
      setAlerts(res.alerts || []);
    } catch (err) {
      console.warn("Could not fetch inventory alerts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleApproveReorder = async (alertItem: InventoryAlert) => {
    try {
      await api.approveReorder(alertItem.productId, alertItem.reorderQty);
      setToastMessage(`✓ Đã duyệt nhập ${alertItem.reorderQty} sản phẩm cho "${alertItem.productName}". Tồn kho đã được cập nhật tức thì!`);
      fetchAlerts();
      setTimeout(() => setToastMessage(""), 4000);
    } catch (err: any) {
      alert(err.message || "Lỗi duyệt nhập hàng");
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return <span className="px-2.5 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-black">KHẨN CẤP (CRITICAL)</span>;
      case "HIGH":
        return <span className="px-2.5 py-1 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 text-xs font-black">MỨC CAO (HIGH)</span>;
      case "MEDIUM":
        return <span className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-black">TRUNG BÌNH (MEDIUM)</span>;
      default:
        return <span className="px-2.5 py-1 rounded-lg bg-slate-600/20 text-slate-400 border border-slate-500/30 text-xs font-black">BÌNH THƯỜNG</span>;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>SMART INVENTORY & SAFETY STOCK ALERTS</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            Cảnh Báo & Dự Báo Cạn Kho Thông Minh
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            AI tự động phân tích vận tốc bán (Stock Velocity), Lead Time và đề xuất số lượng nhập hàng an toàn
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? "animate-spin" : ""}`} />
          <span>Quét lại tồn kho</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Alerts List (Matching Screenshot!) */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400 text-xs">Đang quét phân tích tồn kho AI...</div>
      ) : alerts.length === 0 ? (
        <div className="p-16 rounded-3xl bg-[#131c2e] border border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Tất cả sản phẩm đều ở mức tồn kho an toàn</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Không có mặt hàng nào có nguy cơ đứt gãy nguồn cung trong chu kỳ bán hàng hiện tại.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alertItem) => (
            <div
              key={alertItem.productId}
              className={`p-6 rounded-3xl bg-[#131c2e] border transition-all shadow-xl ${
                alertItem.level === "CRITICAL"
                  ? "border-red-500/40 hover:border-red-500/60"
                  : alertItem.level === "HIGH"
                  ? "border-amber-500/40 hover:border-amber-500/60"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Product Info & Reason */}
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    {getLevelBadge(alertItem.level)}
                    <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                      {alertItem.categoryName}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {alertItem.productId}</span>
                  </div>

                  <h3 className="font-extrabold text-white text-base">
                    {alertItem.productName}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed bg-[#0c121e] p-3 rounded-xl border border-slate-800">
                    <strong className="text-amber-400">Phân tích AI:</strong> {alertItem.reason}
                  </p>
                </div>

                {/* Stock Stats & Action Button */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800">
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-[#0c121e] border border-slate-800 min-w-[80px]">
                      <p className="text-[10px] text-slate-400">Tồn kho</p>
                      <p className={`font-black text-sm mt-0.5 ${alertItem.stock <= 3 ? "text-red-400" : "text-amber-400"}`}>
                        {alertItem.stock}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#0c121e] border border-slate-800 min-w-[80px]">
                      <p className="text-[10px] text-slate-400">Cạn kho sau</p>
                      <p className="font-black text-sm text-white mt-0.5">{alertItem.daysRemaining}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#0c121e] border border-slate-800 min-w-[80px]">
                      <p className="text-[10px] text-slate-400">Nên nhập</p>
                      <p className="font-black text-sm text-emerald-400 mt-0.5">+{alertItem.reorderQty}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApproveReorder(alertItem)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Duyệt Nhập Hàng (+{alertItem.reorderQty} SP)</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

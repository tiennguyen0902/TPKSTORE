import React, { useEffect, useState } from "react";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  AlertCircle, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from "lucide-react";
import { Order } from "../types";
import { api } from "../services/api";

interface MyOrdersViewProps {
  onNavigateCatalog: () => void;
}

export const MyOrdersView: React.FC<MyOrdersViewProps> = ({ onNavigateCatalog }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string>("");

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.getMyOrders();
      setOrders(res.orders || []);
    } catch (err) {
      console.warn("Could not fetch user orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${orderId}? Tồn kho sẽ được tự động hoàn lại.`)) {
      return;
    }
    try {
      await api.cancelOrder(orderId);
      setActionMessage(`Đã hủy đơn hàng ${orderId} thành công và hoàn trả tồn kho.`);
      fetchOrders();
      setTimeout(() => setActionMessage(""), 4000);
    } catch (err: any) {
      alert(err.message || "Lỗi hủy đơn");
    }
  };

  const handleReturnRequest = (orderId: string) => {
    alert(`Đã gửi yêu cầu đổi trả cho đơn hàng ${orderId}. Nhân viên CSKH sẽ liên hệ lại trong vòng 2 giờ!`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Giao thành công</span>;
      case "SHIPPING":
        return <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Đang giao hàng</span>;
      case "CONFIRMED":
        return <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Đã xác nhận</span>;
      case "PENDING":
        return <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Chờ xác nhận</span>;
      case "CANCELLED":
        return <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Đã hủy</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-500/20 text-slate-400 text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Đơn Hàng Của Tôi</h1>
          <p className="text-xs text-slate-400 mt-0.5">Theo dõi hành trình đơn hàng và quản lý các giao dịch mua sắm</p>
        </div>
        <button
          onClick={onNavigateCatalog}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Mua thêm sản phẩm</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Orders List */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400 text-xs">Đang tải lịch sử đơn hàng...</div>
      ) : orders.length === 0 ? (
        <div className="p-16 rounded-3xl bg-[#131c2e] border border-slate-800 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">Bạn chưa có đơn hàng nào</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Khám phá ngay các dòng sản phẩm công nghệ AI đỉnh cao tại SHOPBEE và đặt hàng hôm nay.
          </p>
          <button
            onClick={onNavigateCatalog}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
          >
            Bắt đầu mua sắm
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="rounded-3xl bg-[#131c2e] border border-slate-800 overflow-hidden transition-all shadow-md hover:border-slate-700"
              >
                {/* Order Top Bar (Matching Screenshot) */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-sm">{order.id}</span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")} {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Người nhận: <strong className="text-slate-200">{order.customerName}</strong> ({order.phone})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Items preview snippet */}
                <div className="p-5 space-y-3">
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs text-slate-300">
                        <div className="flex items-center gap-2 max-w-[70%]">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                          <span className="truncate">{item.product?.name || `Sản phẩm ID: ${item.productId}`}</span>
                          <span className="text-slate-500 font-bold">x{item.quantity}</span>
                        </div>
                        <span className="font-bold text-white">
                          {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer summary */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-slate-400">
                      Thanh toán:{" "}
                      <strong className="text-white">{order.paymentMethod}</strong> (
                      <span className={order.paymentStatus === "COMPLETED" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                        {order.paymentStatus === "COMPLETED" ? "Đã thanh toán" : "Chưa thanh toán"}
                      </span>
                      )
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs text-slate-400">Tổng tiền: </span>
                        <span className="text-base font-black text-violet-400">
                          {order.finalAmount.toLocaleString("vi-VN")} đ
                        </span>
                      </div>

                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
                      >
                        <span>Chi tiết đơn</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="p-5 bg-[#0c121e] border-t border-slate-800 text-xs space-y-4 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 rounded-2xl bg-[#131c2e] border border-slate-800 space-y-1">
                        <p className="font-bold text-slate-200">Địa chỉ giao hàng:</p>
                        <p className="text-slate-300 leading-relaxed">{order.shippingAddress}</p>
                        {order.note && <p className="text-slate-400 italic mt-1">Ghi chú: "{order.note}"</p>}
                      </div>

                      <div className="p-3 rounded-2xl bg-[#131c2e] border border-slate-800 space-y-1">
                        <p className="font-bold text-slate-200">Chi tiết thanh toán:</p>
                        <p className="text-slate-300 flex justify-between">
                          <span>Tiền hàng:</span> <span>{order.totalAmount.toLocaleString("vi-VN")} đ</span>
                        </p>
                        <p className="text-slate-300 flex justify-between">
                          <span>Phí giao hàng:</span> <span>{order.shippingFee.toLocaleString("vi-VN")} đ</span>
                        </p>
                        <p className="text-slate-300 flex justify-between font-bold text-violet-300 pt-1 border-t border-slate-800">
                          <span>Tổng cộng:</span> <span>{order.finalAmount.toLocaleString("vi-VN")} đ</span>
                        </p>
                      </div>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                      {order.status === "PENDING" && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-semibold"
                        >
                          Hủy đơn hàng này
                        </button>
                      )}

                      {order.status === "DELIVERED" && (
                        <button
                          onClick={() => handleReturnRequest(order.id)}
                          className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Yêu cầu đổi trả 7 ngày
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

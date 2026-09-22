import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { Order } from "../types";
import { api } from "../services/api";
import { Pagination } from "./Pagination";

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "returns">("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  // Phân trang tự động
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAllOrders(statusFilter !== "all" ? statusFilter : undefined, search);
      setOrders(res.orders || []);
    } catch (err) {
      console.warn("Could not fetch admin orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setToastMsg(`Đã cập nhật trạng thái đơn ${orderId} thành "${newStatus}".`);
      fetchOrders();
      setTimeout(() => setToastMsg(""), 3000);
    } catch (err: any) {
      alert(err.message || "Cập nhật trạng thái thất bại");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Giao thành công</span>;
      case "SHIPPING":
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold">Đang giao hàng</span>;
      case "CONFIRMED":
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold">Đã xác nhận</span>;
      case "PROCESSING":
        return <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">Đang đóng gói</span>;
      case "PENDING":
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">Chờ xác nhận</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">Đã hủy</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-500/20 text-slate-400 text-[10px] font-bold">{status}</span>;
    }
  };

  const returnsCount = orders.filter(
    (o) => (o.status as string) === "RETURN_REQUESTED" || (o.status as string) === "RETURNED" || o.status === "CANCELLED"
  ).length;

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "returns") {
      return (o.status as string) === "RETURN_REQUESTED" || (o.status as string) === "RETURNED" || o.status === "CANCELLED";
    }
    return true;
  });

  // Tính toán phân trang tự động
  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;
  const paginatedOrders = filteredOrders.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const handleTabChange = (tab: "all" | "returns") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Quản Lý Đơn Hàng</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Xử lý quy trình giao hàng, đổi trả và trạng thái thanh toán ({totalItems} đơn)
            {totalPages > 1 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-[10px]">
                Trang {safeCurrentPage}/{totalPages}
              </span>
            )}
          </p>
        </div>

        {/* Tabs (Matching Screenshot) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-2xl text-xs overflow-x-auto max-w-full">
          <button
            onClick={() => handleTabChange("all")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === "all" ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tất cả đơn hàng ({orders.length})
          </button>
          <button
            onClick={() => handleTabChange("returns")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === "returns" ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Yêu cầu đổi trả ({returnsCount})
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Tìm theo mã đơn (#ord_1001), khách hàng, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-56 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-rose-500 cursor-pointer shadow-xs"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xác nhận</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="PROCESSING">Đang đóng gói</option>
          <option value="SHIPPING">Đang giao hàng</option>
          <option value="DELIVERED">Giao thành công</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Mã Đơn</th>
                <th className="p-4">Khách Hàng</th>
                <th className="p-4">Ngày Đặt</th>
                <th className="p-4">Tổng Tiền</th>
                <th className="p-4">Thanh Toán</th>
                <th className="p-4">Trạng Thái Đơn</th>
                <th className="p-4 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Đang tải đơn hàng...</td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Không có đơn hàng nào</td>
                </tr>
              ) : (
                paginatedOrders.map((o) => (
                  <React.Fragment key={o.id}>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {o.id}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{o.customerName}</p>
                        <p className="text-[10px] text-slate-400">{o.phone}</p>
                      </td>
                      <td className="p-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="p-4 font-black text-rose-600 whitespace-nowrap">
                        {o.finalAmount.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{o.paymentMethod}</span>
                        <span className={`block text-[10px] font-bold ${o.paymentStatus === "COMPLETED" ? "text-emerald-600" : "text-amber-600"}`}>
                          {o.paymentStatus === "COMPLETED" ? "Đã thanh toán" : "Chờ thanh toán"}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-rose-500 cursor-pointer"
                        >
                          <option value="PENDING">Chờ xác nhận</option>
                          <option value="CONFIRMED">Đã xác nhận</option>
                          <option value="PROCESSING">Đang đóng gói</option>
                          <option value="SHIPPING">Đang giao hàng</option>
                          <option value="DELIVERED">Giao thành công</option>
                          <option value="CANCELLED">Đã hủy</option>
                        </select>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          {expandedId === o.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {expandedId === o.id && (
                      <tr className="bg-slate-50">
                        <td colSpan={7} className="p-4">
                          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <p className="font-bold text-slate-800">Địa chỉ nhận hàng:</p>
                                <p className="text-slate-600 mt-0.5">{o.shippingAddress}</p>
                                {o.note && <p className="text-slate-500 italic mt-1">Ghi chú: {o.note}</p>}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">Danh sách sản phẩm:</p>
                                <div className="space-y-1 mt-1">
                                  {o.items?.map((item) => (
                                    <div key={item.id} className="flex justify-between text-slate-600">
                                      <span>• {item.product?.name || item.productId} x{item.quantity}</span>
                                      <span className="font-bold text-slate-900">{(item.price * item.quantity).toLocaleString("vi-VN")} đ</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Component Phân Trang Tự Động */}
      {totalItems > 0 && (
        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 8, 12, 20]}
          itemLabel="đơn hàng"
        />
      )}
    </div>
  );
};

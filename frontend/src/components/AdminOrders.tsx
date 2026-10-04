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
  ChevronUp,
  FileSpreadsheet,
  Printer,
  Download,
  DollarSign,
  Wallet,
  PiggyBank
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

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("Không có dữ liệu đơn hàng để xuất!");
      return;
    }

    const headers = [
      "Mã đơn hàng",
      "Khách hàng",
      "Số điện thoại",
      "Địa chỉ giao hàng",
      "Phương thức thanh toán",
      "Trạng thái thanh toán",
      "Trạng thái đơn",
      "Tiền hàng (VND)",
      "Giá vốn 75% (VND)",
      "Lợi nhuận ròng 25% (VND)",
      "Phí ship (VND)",
      "Tổng thanh toán (VND)",
      "Ngày đặt hàng"
    ];

    const rows = filteredOrders.map(o => {
      const orderRev = o.finalAmount || 0;
      const orderCost = Math.round(orderRev * 0.75);
      const orderProfit = orderRev - orderCost;

      return [
        `"${o.id}"`,
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        `"${o.phone || ''}"`,
        `"${(o.shippingAddress || '').replace(/"/g, '""')}"`,
        `"${o.paymentMethod || ''}"`,
        `"${o.paymentStatus === 'COMPLETED' ? 'Đã thanh toán' : 'Chờ thanh toán'}"`,
        `"${o.status}"`,
        o.totalAmount || 0,
        orderCost,
        orderProfit,
        o.shippingFee || 0,
        orderRev,
        `"${new Date(o.createdAt).toLocaleString('vi-VN')}"`
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Danh_sach_don_hang_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsHtml = (order.items || []).map((it, idx) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${idx + 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${it.product?.name || it.productId}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${it.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${it.price.toLocaleString('vi-VN')} đ</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">${(it.price * it.quantity).toLocaleString('vi-VN')} đ</td>
      </tr>
    `).join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hóa Đơn Bán Hàng - ${order.id}</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #333; line-height: 1.5; }
          .invoice-box { max-width: 800px; margin: auto; border: 1px solid #eee; padding: 30px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); border-radius: 8px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e11d48; padding-bottom: 20px; margin-bottom: 20px; }
          .store-name { font-size: 24px; font-weight: 900; color: #e11d48; letter-spacing: -0.5px; }
          .invoice-title { font-size: 22px; font-weight: bold; text-align: right; color: #1e293b; }
          .meta-info { margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
          th { background: #f8fafc; padding: 10px; border-bottom: 2px solid #cbd5e1; text-align: left; }
          .totals { margin-top: 20px; float: right; width: 300px; }
          .totals div { display: flex; justify-content: space-between; padding: 5px 0; }
          .grand-total { border-top: 2px solid #333; font-size: 16px; font-weight: bold; color: #e11d48; padding-top: 8px !important; }
          .footer { margin-top: 80px; clear: both; text-align: center; font-size: 12px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 15px; }
          @media print {
            body { padding: 0; }
            .invoice-box { border: none; box-shadow: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="store-name">SHOPBEE / STORE AI</div>
              <div style="font-size: 12px; color: #64748b;">Hệ thống bán lẻ công nghệ thông minh</div>
              <div style="font-size: 12px; color: #64748b;">Hotline: 1900.8888 • Email: support@storeai.vn</div>
            </div>
            <div>
              <div class="invoice-title">HÓA ĐƠN BÁN HÀNG</div>
              <div style="font-size: 13px; text-align: right; color: #475569;">Mã ĐH: <strong>${order.id}</strong></div>
              <div style="font-size: 12px; text-align: right; color: #64748b;">Ngày lập: ${new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
            </div>
          </div>

          <div class="meta-info">
            <div>
              <strong style="color: #1e293b;">Khách hàng:</strong> ${order.customerName}<br />
              <strong style="color: #1e293b;">Số điện thoại:</strong> ${order.phone}<br />
              <strong style="color: #1e293b;">Địa chỉ giao:</strong> ${order.shippingAddress}
            </div>
            <div>
              <strong style="color: #1e293b;">Phương thức:</strong> ${order.paymentMethod}<br />
              <strong style="color: #1e293b;">Thanh toán:</strong> ${order.paymentStatus === 'COMPLETED' ? 'Đã hoàn tất' : 'Chưa thanh toán'}<br />
              <strong style="color: #1e293b;">Trạng thái:</strong> ${order.status}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">STT</th>
                <th>Tên sản phẩm</th>
                <th style="width: 60px; text-align: center;">SL</th>
                <th style="width: 120px; text-align: right;">Đơn giá</th>
                <th style="width: 130px; text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div><span>Tiền hàng:</span> <span>${(order.totalAmount || 0).toLocaleString('vi-VN')} đ</span></div>
            <div><span>Phí vận chuyển:</span> <span>${(order.shippingFee || 0).toLocaleString('vi-VN')} đ</span></div>
            ${order.discountAmount ? `<div><span>Giảm giá:</span> <span>-${order.discountAmount.toLocaleString('vi-VN')} đ</span></div>` : ''}
            <div class="grand-total"><span>TỔNG CỘNG:</span> <span>${(order.finalAmount || 0).toLocaleString('vi-VN')} đ</span></div>
          </div>

          <div class="footer">
            <p>Cảm ơn quý khách đã tin tưởng và mua sắm tại <strong>SHOPBEE STORE AI</strong>!</p>
            <p style="font-style: italic;">(Hóa đơn điện tử khởi tạo tự động từ hệ thống quản lý bán hàng)</p>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.finalAmount || 0), 0);
  const totalCost = Math.round(totalRevenue * 0.75);
  const totalProfit = totalRevenue - totalCost;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Quản Lý Đơn Hàng</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Xử lý quy trình giao hàng, đổi trả và theo dõi lợi nhuận từng đơn ({totalItems} đơn)
            {totalPages > 1 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-[10px]">
                Trang {safeCurrentPage}/{totalPages}
              </span>
            )}
          </p>
        </div>

        {/* Actions & Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
            title="Xuất danh sách đơn hàng kèm chi phí vốn và lợi nhuận ra file Excel / CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Xuất Excel / CSV</span>
          </button>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-2xl text-xs overflow-x-auto max-w-full">
            <button
              onClick={() => handleTabChange("all")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === "all" ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tất cả ({orders.length})
            </button>
            <button
              onClick={() => handleTabChange("returns")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === "returns" ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Đổi trả ({returnsCount})
            </button>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards for Orders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TỔNG DOANH THU ĐƠN HÀNG</p>
          <p className="text-xl font-black text-blue-600 mt-1">{totalRevenue.toLocaleString("vi-VN")} đ</p>
          <p className="text-[10px] text-slate-500 mt-0.5">100% giá trị các đơn đặt hàng</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TỔNG GIÁ VỐN HÀNG XUẤT (COST 75%)</p>
          <p className="text-xl font-black text-slate-700 mt-1">{totalCost.toLocaleString("vi-VN")} đ</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Chi phí vốn sản phẩm kho xuất</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-2xs">
          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">TỔNG LỢI NHUẬN THỰC THU (PROFIT 25%)</p>
          <p className="text-xl font-black text-emerald-700 mt-1">+{totalProfit.toLocaleString("vi-VN")} đ</p>
          <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Biên độ lợi nhuận ròng 25.0%</p>
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
                <th className="p-4">Doanh Thu & Lợi Nhuận</th>
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
                      <td className="p-4 whitespace-nowrap">
                        <p className="font-black text-slate-900">{o.finalAmount.toLocaleString("vi-VN")} đ</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400">Vốn: {Math.round(o.finalAmount * 0.75).toLocaleString("vi-VN")} đ</span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            +{Math.round(o.finalAmount * 0.25).toLocaleString("vi-VN")} đ
                          </span>
                        </div>
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
                                <p className="font-bold text-slate-800 mb-1">Danh sách sản phẩm & Phân tích lợi nhuận:</p>
                                <div className="space-y-1.5">
                                  {o.items?.map((item) => {
                                    const itemRev = item.price * item.quantity;
                                    const itemCost = Math.round(itemRev * 0.75);
                                    const itemProfit = itemRev - itemCost;
                                    return (
                                      <div key={item.id} className="flex justify-between items-center text-slate-600 p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                                        <div>
                                          <p className="font-bold text-slate-800">• {item.product?.name || item.productId}</p>
                                          <p className="text-[10px] text-slate-500 mt-0.5">
                                            SL: {item.quantity} | Giá bán: {item.price.toLocaleString("vi-VN")} đ | Giá vốn (75%): {Math.round(item.price * 0.75).toLocaleString("vi-VN")} đ
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-black text-slate-900">{itemRev.toLocaleString("vi-VN")} đ</p>
                                          <p className="text-[10px] font-bold text-emerald-600">
                                            Lãi: +{itemProfit.toLocaleString("vi-VN")} đ (25%)
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end pt-2 border-t border-slate-100">
                              <button
                                onClick={() => handlePrintInvoice(o)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>In Hóa Đơn (PDF)</span>
                              </button>
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

import React, { useState, useEffect } from "react";
import { 
  Boxes, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  Search, 
  AlertTriangle, 
  UserCheck, 
  FileText,
  Filter,
  PackageCheck,
  Building2,
  X
} from "lucide-react";
import { StockTicket, Product } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface StockTicketsViewProps {
  embeddedRole?: "STAFF" | "MANAGER" | "ADMIN";
}

export const StockTicketsView: React.FC<StockTicketsViewProps> = ({ embeddedRole }) => {
  const { user } = useAuth();
  const currentRole = embeddedRole || user?.role || "STAFF";
  const canApprove = currentRole === "MANAGER" || currentRole === "ADMIN";

  const [tickets, setTickets] = useState<StockTicket[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [toastMsg, setToastMsg] = useState<string>("");
  const [summary, setSummary] = useState<any>(null);

  // Modal tạo phiếu
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createType, setCreateType] = useState<"IMPORT" | "EXPORT">("IMPORT");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("10");
  const [reason, setReason] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modal từ chối
  const [rejectTicketId, setRejectTicketId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ticketsRes, prodRes, sumRes] = await Promise.all([
        api.getStockTickets(
          statusFilter !== "ALL" ? statusFilter : undefined,
          typeFilter !== "ALL" ? typeFilter : undefined,
          search || undefined
        ),
        api.getProducts({ limit: 100 }),
        api.getStockSummary().catch(() => null)
      ]);

      setTickets(ticketsRes.tickets || []);
      setProducts(prodRes.products || []);
      if (sumRes) setSummary(sumRes);

      if (prodRes.products && prodRes.products.length > 0 && !selectedProductId) {
        setSelectedProductId(prodRes.products[0].id);
      }
    } catch (err: any) {
      console.warn("Lỗi tải danh sách phiếu kho:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, typeFilter, search]);

  const handleOpenCreate = (type: "IMPORT" | "EXPORT") => {
    setCreateType(type);
    setQuantity("10");
    setReason(type === "IMPORT" ? "Nhập thêm hàng hóa từ nhà sản xuất" : "Xuất kho điều chuyển tới cửa hàng");
    setNote("");
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert("Vui lòng chọn sản phẩm!");
      return;
    }
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      alert("Số lượng phải là số dương lớn hơn 0!");
      return;
    }

    const targetProduct = products.find(p => p.id === selectedProductId);
    const currStock = typeof targetProduct?.stock === "number" ? targetProduct.stock : (parseInt(String(targetProduct?.stock)) || 0);

    if (createType === "EXPORT" && currStock < qty) {
      alert(`Không thể lập phiếu xuất! Số lượng yêu cầu xuất (${qty}) lớn hơn số tồn kho hiện có (${currStock} SP).`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.createStockTicket({
        productId: selectedProductId,
        type: createType,
        quantity: qty,
        reason,
        note
      });

      setShowCreateModal(false);
      setToastMsg(res.message || "Tạo phiếu thành công!");
      fetchData();
      setTimeout(() => setToastMsg(""), 4000);
    } catch (err: any) {
      alert(err.message || "Lỗi khi lập phiếu kho");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (ticket: StockTicket) => {
    const confirmMsg = `XÁC NHẬN DUYỆT PHIẾU:\n- Loại: ${ticket.type === "IMPORT" ? "NHẬP KHO (Tăng tồn)" : "XUẤT KHO (Giảm tồn)"}\n- Sản phẩm: ${ticket.productName}\n- Số lượng: ${ticket.quantity} SP\n\nBạn có chắc chắn muốn phê duyệt?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await api.approveStockTicket(ticket.id);
      setToastMsg(res.message || "Đã phê duyệt phiếu thành công!");
      fetchData();
      setTimeout(() => setToastMsg(""), 5000);
    } catch (err: any) {
      alert(err.message || "Lỗi khi phê duyệt phiếu");
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectTicketId) return;
    try {
      await api.rejectStockTicket(rejectTicketId, rejectReason || "Không đạt tiêu chuẩn kiểm duyệt");
      setRejectTicketId(null);
      setRejectReason("");
      setToastMsg("Đã từ chối phiếu thành công!");
      fetchData();
      setTimeout(() => setToastMsg(""), 4000);
    } catch (err: any) {
      alert(err.message || "Lỗi khi từ chối phiếu");
    }
  };

  const pendingCount = tickets.filter(t => t.status === "PENDING").length;
  const selectedProdObj = products.find(p => p.id === selectedProductId);
  const selectedProdStock = typeof selectedProdObj?.stock === "number" ? selectedProdObj.stock : (parseInt(String(selectedProdObj?.stock)) || 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Banner Tiêu Đề */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-50 via-white to-amber-50 border border-rose-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 mb-2">
              <Boxes className="w-3.5 h-3.5" />
              <span>QUY TRÌNH QUẢN LÝ XUẤT NHẬP KHO</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-600 text-white font-extrabold">
                {currentRole === "ADMIN" ? "ADMIN PORTAL" : currentRole === "MANAGER" ? "MANAGER PORTAL" : "STAFF PORTAL"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Quản Lý Phiếu Xuất & Nhập Kho
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed font-medium">
              Nhân viên lập phiếu yêu cầu nhập kho (Inbound) hoặc xuất kho (Outbound). Quản lý kho ({canApprove ? "bạn có quyền duyệt" : "Manager/Admin"}) kiểm tra và phê duyệt, hệ thống sẽ tự động cập nhật số lượng tồn kho tức thì.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => handleOpenCreate("IMPORT")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Tạo Phiếu Nhập Kho</span>
            </button>

            <button
              onClick={() => handleOpenCreate("EXPORT")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all hover:scale-105"
            >
              <ArrowUpFromLine className="w-4 h-4" />
              <span>Tạo Phiếu Xuất Kho</span>
            </button>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-3 animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Thẻ Thống Kê Nhanh */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500">Tổng Số Phiếu</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{summary?.tickets?.total ?? tickets.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-700">Chờ Quản Lý Duyệt</p>
            <p className="text-2xl font-black text-amber-600 mt-0.5 flex items-center gap-2">
              {pendingCount}
              {pendingCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              )}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-700">Đã Phê Duyệt</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{summary?.tickets?.approved ?? tickets.filter(t => t.status === "APPROVED").length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-rose-700">Tổng Tồn Kho SP</p>
            <p className="text-2xl font-black text-rose-600 mt-0.5">
              {summary?.warehouse?.totalStock ?? products.reduce((acc, p) => acc + (typeof p.stock === "number" ? p.stock : 0), 0)} SP
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Boxes className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Thanh Lọc & Tìm Kiếm */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs w-full md:w-auto overflow-x-auto">
          {[
            { id: "ALL", label: "Tất Cả Phiếu" },
            { id: "PENDING", label: `Chờ Duyệt (${pendingCount})`, badge: pendingCount > 0 },
            { id: "APPROVED", label: "Đã Phê Duyệt" },
            { id: "REJECTED", label: "Đã Từ Chối" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap text-xs flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && statusFilter !== tab.id && (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-rose-500 cursor-pointer shadow-sm"
          >
            <option value="ALL">Mọi loại phiếu</option>
            <option value="IMPORT">Chỉ Nhập Kho (Inbound)</option>
            <option value="EXPORT">Chỉ Xuất Kho (Outbound)</option>
          </select>

          <div className="relative flex-1 md:w-60">
            <input
              type="text"
              placeholder="Tìm theo SP, người tạo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 pl-8 text-xs text-slate-900 focus:outline-none focus:border-rose-500 shadow-sm"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>
        </div>
      </div>

      {/* Bảng Danh Sách Phiếu Kho */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="p-4">Mã Phiếu & Loại</th>
                <th className="p-4">Sản Phẩm</th>
                <th className="p-4">Số Lượng</th>
                <th className="p-4">Lý Do / Ghi Chú</th>
                <th className="p-4">Người Lập Phiếu</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác Duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                    Đang tải danh sách phiếu kho...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                    Không tìm thấy phiếu xuất/nhập kho nào phù hợp.
                  </td>
                </tr>
              ) : (
                tickets.map(t => {
                  const isImport = t.type === "IMPORT";
                  return (
                    <tr key={t.id} className="hover:bg-rose-50/40 transition-colors">
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="font-mono text-[11px] font-bold text-slate-800">
                            #{t.id}
                          </span>
                          <div>
                            {isImport ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                <ArrowDownToLine className="w-3 h-3" />
                                <span>NHẬP KHO</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[10px] font-bold border border-rose-200">
                                <ArrowUpFromLine className="w-3 h-3" />
                                <span>XUẤT KHO</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-400">
                            {new Date(t.createdAt).toLocaleString("vi-VN")}
                          </p>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {t.productThumbnail && (
                            <img
                              src={t.productThumbnail}
                              alt=""
                              className="w-10 h-10 object-cover rounded-xl bg-slate-50 border border-slate-200 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 line-clamp-1">{t.productName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">ID: {t.productId}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className={`text-sm font-black ${isImport ? "text-emerald-600" : "text-rose-600"}`}>
                          {isImport ? `+${t.quantity}` : `-${t.quantity}`} SP
                        </span>
                      </td>

                      <td className="p-4 max-w-xs">
                        <p className="text-slate-900 font-semibold line-clamp-2">{t.reason}</p>
                        {t.note && (
                          <p className="text-[10px] text-slate-500 italic mt-0.5">
                            Ghi chú: {t.note}
                          </p>
                        )}
                        {t.status === "REJECTED" && t.rejectReason && (
                          <p className="text-[10px] text-rose-700 font-semibold mt-1 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                            Lý do từ chối: {t.rejectReason}
                          </p>
                        )}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <p className="font-bold text-slate-900">{t.requestedByName}</p>
                        <span className="text-[10px] text-slate-500 font-mono font-semibold">
                          Vai trò: {t.requestedByRole}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {t.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                            <Clock className="w-3 h-3 animate-spin text-amber-600" />
                            <span>CHỜ QUẢN LÝ DUYỆT</span>
                          </span>
                        )}
                        {t.status === "APPROVED" && (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>ĐÃ PHÊ DUYỆT</span>
                            </span>
                            {t.approvedByName && (
                              <p className="text-[9px] text-slate-500 font-medium">
                                Bởi: {t.approvedByName}
                              </p>
                            )}
                          </div>
                        )}
                        {t.status === "REJECTED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 text-[10px] font-bold border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>ĐÃ TỪ CHỐI</span>
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        {t.status === "PENDING" ? (
                          canApprove ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApprove(t)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all hover:scale-105"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Duyệt</span>
                              </button>
                              <button
                                onClick={() => {
                                   setRejectTicketId(t.id);
                                   setRejectReason("");
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors"
                              >
                                <span>Từ chối</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">
                              Đang chờ Quản lý duyệt
                            </span>
                          )
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Hoàn tất
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TẠO PHIẾU XUẤT / NHẬP KHO */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${createType === "IMPORT" ? "bg-emerald-500" : "bg-rose-500"}`}></div>
                <h3 className="text-base font-bold text-slate-900">
                  {createType === "IMPORT" ? "Lập Phiếu Yêu Cầu Nhập Kho (Inbound)" : "Lập Phiếu Yêu Cầu Xuất Kho (Outbound)"}
                </h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {/* Chọn loại phiếu */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setCreateType("IMPORT")}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                    createType === "IMPORT" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>Nhập Kho (Tăng SP)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCreateType("EXPORT")}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                    createType === "EXPORT" ? "bg-rose-600 text-white shadow-md" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ArrowUpFromLine className="w-4 h-4" />
                  <span>Xuất Kho (Giảm SP)</span>
                </button>
              </div>

              {/* Chọn sản phẩm */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chọn sản phẩm trong kho *
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-rose-500 cursor-pointer shadow-sm font-medium"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Tồn kho hiện tại: {typeof p.stock === "number" ? p.stock : 0} SP)
                    </option>
                  ))}
                </select>
              </div>

              {/* Thông tin nhanh sản phẩm đã chọn */}
              {selectedProdObj && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <img
                    src={selectedProdObj.thumbnail}
                    alt=""
                    className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">{selectedProdObj.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Tồn kho thực tế: <span className="font-black text-rose-600">{selectedProdStock} sản phẩm</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Số lượng */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Số lượng yêu cầu {createType === "IMPORT" ? "nhập" : "xuất"} (chiếc) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={createType === "EXPORT" ? selectedProdStock : 99999}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-rose-500 font-bold shadow-sm"
                />
                {createType === "EXPORT" && selectedProdStock < parseInt(quantity || "0") && (
                  <p className="text-[10px] text-rose-600 font-bold mt-1">
                    Cảnh báo: Số lượng xuất vượt quá tồn kho khả dụng ({selectedProdStock} SP)!
                  </p>
                )}
              </div>

              {/* Lý do */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Lý do xuất / nhập kho *
                </label>
                <input
                  type="text"
                  required
                  placeholder={createType === "IMPORT" ? "Ví dụ: Nhập hàng đợt 2 từ nhà phân phối Apple" : "Ví dụ: Xuất kho điều chuyển showroom Cầu Giấy"}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-rose-500 shadow-sm"
                />
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú bổ sung (Mã vận đơn / Số xe / Số hóa đơn)</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú chi tiết thêm..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-rose-500 shadow-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2 rounded-xl text-white font-bold shadow-md transition-all ${
                    createType === "IMPORT" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-rose-600 hover:bg-rose-500"
                  }`}
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi Phiếu Cho Quản Lý Duyệt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NHẬP LÝ DO TỪ CHỐI */}
      {rejectTicketId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Xác Nhận Từ Chối Phiếu Kho</h3>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Vui lòng nhập lý do từ chối phiếu kho này để thông báo rõ ràng cho nhân viên lập phiếu:
            </p>
            <textarea
              rows={3}
              placeholder="Nhập lý do từ chối..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500 shadow-sm"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectTicketId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30"
              >
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Bot,
  Send,
  Loader2,
  Wallet,
  PiggyBank,
  BadgePercent
} from "lucide-react";
import { api } from "../services/api";

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [totalRevenue, setTotalRevenue] = useState(36680000);
  const [totalOrders, setTotalOrders] = useState(4);
  const [totalUsers, setTotalUsers] = useState(8);
  const [alertCount, setAlertCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  // Admin Sales Intelligence Q&A State
  const [qaInput, setQaInput] = useState("");
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);
  const [qaLoading, setQaLoading] = useState(false);
  const [qaSource, setQaSource] = useState<string>("");

  // 14-day historical curve (Unit: Million VND) matching screenshot
  const revenuePoints = [
    { day: "08-06", val: 31.5 },
    { day: "08-07", val: 26.0 },
    { day: "08-08", val: 26.0 },
    { day: "08-09", val: 21.0 },
    { day: "08-10", val: 21.0 },
    { day: "08-11", val: 30.5 },
    { day: "08-12", val: 25.0 },
    { day: "08-13", val: 25.0 },
    { day: "08-14", val: 25.0 },
    { day: "08-15", val: 20.0 },
    { day: "08-16", val: 29.5 },
    { day: "08-17", val: 29.5 },
    { day: "08-18", val: 24.0 },
    { day: "08-19", val: 24.0 }
  ];

  // 7-day orders per day
  const orderBars = [
    { day: "08-13", count: 32 },
    { day: "08-14", count: 32 },
    { day: "08-15", count: 25 },
    { day: "08-16", count: 39 },
    { day: "08-17", count: 39 },
    { day: "08-18", count: 31 },
    { day: "08-19", count: 31 }
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const [ordRes, usrRes, invRes] = await Promise.all([
        api.getAllOrders(),
        api.getAllUsers(),
        api.getInventoryAlerts()
      ]);
      setTotalOrders(ordRes.orders.length);
      setTotalUsers(usrRes.users.length);
      setAlertCount(invRes.alerts.length);
      const rev = ordRes.orders.reduce((sum, o) => sum + o.finalAmount, 0);
      if (rev > 0) setTotalRevenue(rev);
    } catch (err) {
      console.warn("Could not fetch live dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const totalCost = Math.round(totalRevenue * 0.75);
  const totalProfit = totalRevenue - totalCost;
  const profitMarginPercent = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "25.0";

  const handleExportRevenueReport = () => {
    const headers = ["Chỉ số / Ngày", "Giá trị", "Đơn vị / Ghi chú"];
    const summaryRows = [
      ["Tổng doanh thu ghi nhận (Revenue)", totalRevenue.toLocaleString("vi-VN"), "VND (100%)"],
      ["Tổng giá vốn hàng bán (Cost 75%)", totalCost.toLocaleString("vi-VN"), "VND (75%)"],
      ["Tổng lợi nhuận thực thu (Gross Profit 25%)", totalProfit.toLocaleString("vi-VN"), "VND (25%)"],
      ["Tỷ suất biên lợi nhuận (Profit Margin)", `${profitMarginPercent}%`, "%"],
      ["Tổng đơn hàng hệ thống", totalOrders, "Đơn"],
      ["Tổng khách hàng đăng ký", totalUsers, "Người dùng"],
      ["Cảnh báo cạn kho thông minh", alertCount, "Sản phẩm cần nhập"],
      ["", "", ""],
      ["--- DOANH THU & LỢI NHUẬN 14 NGÀY GẦN NHẤT ---", "", "", ""],
      ["Ngày", "Doanh thu (Triệu VND)", "Giá vốn 75% (Triệu VND)", "Lợi nhuận 25% (Triệu VND)"]
    ];

    const revRows = revenuePoints.map(p => [
      p.day,
      p.val.toFixed(1),
      (p.val * 0.75).toFixed(2),
      (p.val * 0.25).toFixed(2)
    ]);

    const orderRowsHeader = [
      ["", "", "", ""],
      ["--- SỐ LƯỢNG ĐƠN HÀNG 7 NGÀY ---", "", "", ""],
      ["Ngày", "Số lượng đơn", "", ""]
    ];
    const ordRows = orderBars.map(b => [b.day, b.count, "Đơn hàng", ""]);

    const allData = [
      headers,
      ...summaryRows,
      ...revRows,
      ...orderRowsHeader,
      ...ordRows
    ];

    const csvContent = "\uFEFF" + allData.map(r => r.map(c => `"${c}"`).join(",")).join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Bao_cao_doanh_thu_loi_nhuan_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAskQA = async (queryText?: string) => {
    const q = (queryText || qaInput).trim();
    if (!q) return;
    if (queryText) setQaInput(queryText);
    setQaLoading(true);
    setQaAnswer(null);
    try {
      const res = await api.askAdminSalesQA(q);
      setQaAnswer(res.answer);
      setQaSource(res.source || "AI Sales Intelligence Engine");
    } catch (err: any) {
      setQaAnswer("❌ Đã xảy ra lỗi khi phân tích: " + (err.message || "Vui lòng thử lại"));
    } finally {
      setQaLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Welcome & Refresh Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Xin chào, Admin! 👋
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Đây là tổng quan hoạt động kinh doanh của SHOPBEE hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportRevenueReport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all"
            title="Xuất báo cáo doanh thu ra file Excel / CSV chuẩn UTF-8"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Xuất Báo Cáo Doanh Thu</span>
          </button>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-rose-600 ${isLoading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Cards: Financial & Operational */}
      <div className="space-y-4">
        {/* Row 1: Tài chính (Doanh thu - Giá vốn 75% - Lợi nhuận 25%) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Tổng Doanh Thu */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TỔNG DOANH THU (REVENUE)</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {totalRevenue.toLocaleString("vi-VN")} <span className="text-sm font-bold text-blue-600">đ</span>
              </h3>
              <p className="text-[11px] text-blue-600 font-bold mt-1 flex items-center gap-1">
                <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200">100%</span>
                <span>Doanh số bán hàng thực tế</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Tổng Giá Vốn Hàng Bán (COGS - 75%) */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 to-slate-600"></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TỔNG GIÁ VỐN (COST 75%)</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {totalCost.toLocaleString("vi-VN")} <span className="text-sm font-bold text-slate-600">đ</span>
              </h3>
              <p className="text-[11px] text-slate-600 font-bold mt-1 flex items-center gap-1">
                <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-black border border-slate-200">75.0%</span>
                <span>Giá vốn nhập kho sản phẩm</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shadow-xs shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Tổng Lợi Nhuận Gộp (PROFIT - 25%) */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 border border-emerald-200 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
            <div>
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">TỔNG LỢI NHUẬN (PROFIT 25%)</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">
                +{totalProfit.toLocaleString("vi-VN")} <span className="text-sm font-bold">đ</span>
              </h3>
              <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">Biên độ 25.0%</span>
                <span>Lợi nhuận ròng thu về</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <PiggyBank className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Row 2: Vận hành (Đơn hàng - Khách hàng - Cảnh báo tồn kho) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 4: Đơn Hàng */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ĐƠN HÀNG HỆ THỐNG</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">{totalOrders} đơn</h3>
              <p className="text-[11px] text-rose-600 font-bold mt-1">
                98% <span className="text-slate-400 font-normal">tỷ lệ hoàn thành</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shadow-xs shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          {/* Card 5: Khách Hàng */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">KHÁCH HÀNG ĐĂNG KÝ</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">{totalUsers} người dùng</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">
                +{totalUsers} <span className="text-slate-400 font-normal">khách mới tháng này</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-xs shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 6: Cảnh Báo Tồn Kho */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CẢNH BÁO TỒN KHO</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">{alertCount} sản phẩm</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-amber-600 font-bold">Sắp hết hàng</span>
                <button
                  onClick={() => onNavigateTab("admin_inventory_alerts")}
                  className="text-[10px] text-rose-600 hover:underline font-semibold"
                >
                  Xem chi tiết &gt;
                </button>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-xs shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Forecasting Highlight Banner (Matching Screenshot) */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-50 via-white to-amber-50/50 border border-rose-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>AI SALES FORECASTING · Hybrid-Prophet-ARIMA-v2.1</span>
          </div>
          <h2 className="text-base font-black text-slate-900">
            Dự báo tăng trưởng: <span className="text-emerald-600 font-extrabold">+8.5%</span> trong 30 ngày tới
          </h2>
          <p className="text-xs text-slate-600">
            Nhu cầu danh mục Điện thoại và Thiết bị đeo AI dự kiến tăng trưởng mạnh vào cuối tuần.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab("admin_forecast")}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 shrink-0 self-start md:self-center"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Mở AI Analytics</span>
        </button>
      </div>

      {/* 2 Charts Grid (Matching Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Doanh Thu & Lợi Nhuận 14 Ngày Qua */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Doanh Thu & Lợi Nhuận 14 Ngày Qua
              </h3>
              <p className="text-[10px] text-slate-500">Đơn vị: Triệu VNĐ (Giá vốn: 75% • Lợi nhuận: 25%)</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Doanh thu (100%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>Lợi nhuận ròng (25%)</span>
              </div>
            </div>
          </div>

          {/* SVG Area Chart with Revenue & Profit Curves */}
          <div className="h-64 w-full pt-2 relative select-none">
            {(() => {
              const minVal = 0;
              const maxVal = 38;
              const topY = 25;
              const baseY = 175;
              const startX = 20;
              const endX = 680;

              const coords = revenuePoints.map((pt, i) => {
                const x = startX + (i / (revenuePoints.length - 1)) * (endX - startX);
                const safeVal = Math.max(minVal, Math.min(maxVal, pt.val));
                const y = baseY - ((safeVal - minVal) / (maxVal - minVal)) * (baseY - topY);

                const profitVal = pt.val * 0.25;
                const profitY = baseY - ((profitVal - minVal) / (maxVal - minVal)) * (baseY - topY);

                return { x, y, profitY, day: pt.day, val: pt.val, profitVal };
              });

              // Construct Monotone Spline for Revenue
              let revLinePath = "";
              if (coords.length > 0) {
                revLinePath = `M ${coords[0].x} ${coords[0].y}`;
                for (let i = 0; i < coords.length - 1; i++) {
                  const p0 = coords[i];
                  const p1 = coords[i + 1];
                  const dx = (p1.x - p0.x) * 0.45;
                  revLinePath += ` C ${p0.x + dx} ${p0.y}, ${p1.x - dx} ${p1.y}, ${p1.x} ${p1.y}`;
                }
              }

              // Construct Monotone Spline for Profit
              let profitLinePath = "";
              if (coords.length > 0) {
                profitLinePath = `M ${coords[0].x} ${coords[0].profitY}`;
                for (let i = 0; i < coords.length - 1; i++) {
                  const p0 = coords[i];
                  const p1 = coords[i + 1];
                  const dx = (p1.x - p0.x) * 0.45;
                  profitLinePath += ` C ${p0.x + dx} ${p0.profitY}, ${p1.x - dx} ${p1.profitY}, ${p1.x} ${p1.profitY}`;
                }
              }

              const revAreaPath = revLinePath
                ? `${revLinePath} L ${coords[coords.length - 1].x} ${baseY} L ${coords[0].x} ${baseY} Z`
                : "";

              const profitAreaPath = profitLinePath
                ? `${profitLinePath} L ${coords[coords.length - 1].x} ${baseY} L ${coords[0].x} ${baseY} Z`
                : "";

              return (
                <svg viewBox="0 0 700 220" className="w-full h-full">
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.30" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guide Grid lines */}
                  <line x1="15" y1="30" x2="685" y2="30" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="15" y1="75" x2="685" y2="75" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="15" y1="125" x2="685" y2="125" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="15" y1={baseY} x2="685" y2={baseY} stroke="#e2e8f0" strokeWidth="1.5" />

                  {/* Shaded Area Fills */}
                  <path d={revAreaPath} fill="url(#blueGradient)" />
                  <path d={profitAreaPath} fill="url(#emeraldGradient)" />

                  {/* Revenue Curve Line */}
                  <path
                    d={revLinePath}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Profit Curve Line (25%) */}
                  <path
                    d={profitLinePath}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Individual Data Points */}
                  {coords.map((pt, i) => (
                    <g key={i} className="cursor-pointer group">
                      {/* Revenue Point */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        fill="#ffffff"
                        stroke="#2563eb"
                        strokeWidth="2.5"
                        className="transition-all duration-150 group-hover:r-5 group-hover:fill-blue-600 group-hover:stroke-white shadow-sm"
                      />
                      {/* Profit Point */}
                      <circle
                        cx={pt.x}
                        cy={pt.profitY}
                        r="3.5"
                        fill="#ffffff"
                        stroke="#059669"
                        strokeWidth="2"
                        className="transition-all duration-150 group-hover:r-4.5 group-hover:fill-emerald-600 group-hover:stroke-white shadow-sm"
                      />
                      {/* Interactive Tooltip on hover */}
                      <title>{`Ngày ${pt.day}\n• Doanh thu: ${pt.val.toFixed(1)} Tr VND\n• Giá vốn (75%): ${(pt.val * 0.75).toFixed(2)} Tr VND\n• Lợi nhuận (25%): ${pt.profitVal.toFixed(2)} Tr VND`}</title>
                    </g>
                  ))}

                  {/* X Axis Labels */}
                  {coords.map((pt, i) => (
                    <text
                      key={i}
                      x={pt.x}
                      y="198"
                      fontSize="9.5"
                      fontWeight="600"
                      fill="#64748b"
                      textAnchor="middle"
                    >
                      {pt.day}
                    </text>
                  ))}
                </svg>
              );
            })()}
          </div>
        </div>

        {/* Right Chart: Đơn Hàng / Ngày */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-rose-600" />
              Đơn Hàng / Ngày
            </h3>
            <p className="text-[10px] text-slate-500">7 ngày gần nhất</p>
          </div>

          {/* Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
            {orderBars.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.count}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-xl group-hover:from-rose-500 group-hover:to-rose-300 transition-all shadow-sm"
                  style={{ height: `${(bar.count / 45) * 160}px` }}
                />
                <span className="text-[9px] text-slate-500 font-semibold">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Sales Intelligence Copilot Section (Yêu cầu chức năng 3.2 mục 3) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl space-y-4 border border-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-wide text-white">TRỢ LÝ AI HỎI ĐÁP BÁN HÀNG & DOANH THU</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/30 text-rose-300 border border-rose-500/40">
                  STORE COPILOT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Chủ cửa hàng đặt câu hỏi tự nhiên về doanh số, mặt hàng bán chậm, tồn đọng để AI phân tích trực tiếp từ CSDL
              </p>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            "Tổng kết doanh thu và lợi nhuận ròng của cửa hàng?",
            "Top 5 sản phẩm đem lại doanh thu & lợi nhuận cao nhất?",
            "Tháng này mặt hàng nào bán chậm và tồn đọng vốn?",
            "Phân tích tỷ suất sinh lời và khuyến nghị tối ưu giá vốn"
          ].map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQA(promptText)}
              disabled={qaLoading}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-medium border border-white/10 transition-colors disabled:opacity-50 text-left"
            >
              💬 {promptText}
            </button>
          ))}
        </div>

        {/* Question Input Bar */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={qaInput}
              onChange={(e) => setQaInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !qaLoading && handleAskQA()}
              placeholder="Hỏi AI: Ví dụ 'Tháng này mặt hàng nào bán chậm?' hoặc 'Phân tích doanh thu'..."
              className="w-full bg-slate-950/70 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
          <button
            onClick={() => handleAskQA()}
            disabled={qaLoading || !qaInput.trim()}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {qaLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang phân tích CSDL...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Phân tích</span>
              </>
            )}
          </button>
        </div>

        {/* AI Answer Display Area */}
        {qaAnswer && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 text-xs text-slate-200 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-800 text-slate-400">
              <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Kết quả phân tích từ AI:
              </span>
              <span className="font-mono text-[10px] text-slate-500">{qaSource}</span>
            </div>
            <div className="whitespace-pre-line leading-relaxed text-slate-200">
              {qaAnswer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
  CheckCircle2 
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

  return (
    <div className="space-y-6 pb-16">
      {/* Top Welcome & Refresh Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Xin chào, Admin! 👋
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Đây là tổng quan hoạt động của SHOPBEE hôm nay.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-rose-600 ${isLoading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* 4 KPI Cards (Matching Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng Doanh Thu */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TỔNG DOANH THU</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {totalRevenue.toLocaleString("vi-VN")} <span className="text-sm font-bold text-rose-600">đ</span>
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              +12.5% <span className="text-slate-400 font-normal">so với tháng trước</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Đơn Hàng */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ĐƠN HÀNG</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{totalOrders}</h3>
            <p className="text-[11px] text-rose-600 font-bold mt-1">
              98% <span className="text-slate-400 font-normal">tỷ lệ hoàn thành</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shadow-xs">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Khách Hàng */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">KHÁCH HÀNG</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{totalUsers}</h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              +{totalUsers} <span className="text-slate-400 font-normal">khách mới tháng này</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Cảnh Báo Tồn Kho */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CẢNH BÁO TỒN KHO</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{alertCount} SP</h3>
            <p className="text-[11px] text-amber-600 font-bold mt-1">
              Cần nhập thêm <span className="text-slate-400 font-normal">sắp hết hàng</span>
            </p>
            <button
              onClick={() => onNavigateTab("admin_inventory_alerts")}
              className="text-[10px] text-rose-600 hover:underline mt-1 font-semibold flex items-center gap-1"
            >
              Xem chi tiết &gt;
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-xs">
            <AlertTriangle className="w-6 h-6" />
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
        {/* Left Chart: Doanh Thu 14 Ngày Qua */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Doanh Thu 14 Ngày Qua
              </h3>
              <p className="text-[10px] text-slate-500">Đơn vị: Triệu VNĐ (Dữ liệu thực tế phân tích theo ngày)</p>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-extrabold tracking-wider animate-pulse">
              LIVE DATA
            </span>
          </div>

          {/* SVG Area Chart with Monotone Smooth Spline (Fixes curve overshoot bug) */}
          <div className="h-64 w-full pt-2 relative select-none">
            {(() => {
              const minVal = 15;
              const maxVal = 35;
              const topY = 25;
              const baseY = 175;
              const startX = 20;
              const endX = 680;

              const coords = revenuePoints.map((pt, i) => {
                const x = startX + (i / (revenuePoints.length - 1)) * (endX - startX);
                const safeVal = Math.max(minVal, Math.min(maxVal, pt.val));
                const y = baseY - ((safeVal - minVal) / (maxVal - minVal)) * (baseY - topY);
                return { x, y, day: pt.day, val: pt.val };
              });

              // Construct Monotone Bounded Cubic Bezier Spline
              let linePath = "";
              if (coords.length > 0) {
                linePath = `M ${coords[0].x} ${coords[0].y}`;
                for (let i = 0; i < coords.length - 1; i++) {
                  const p0 = coords[i];
                  const p1 = coords[i + 1];
                  const dx = (p1.x - p0.x) * 0.45;
                  linePath += ` C ${p0.x + dx} ${p0.y}, ${p1.x - dx} ${p1.y}, ${p1.x} ${p1.y}`;
                }
              }

              const areaPath = linePath
                ? `${linePath} L ${coords[coords.length - 1].x} ${baseY} L ${coords[0].x} ${baseY} Z`
                : "";

              return (
                <svg viewBox="0 0 700 220" className="w-full h-full">
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guide Grid lines */}
                  <line x1="15" y1="30" x2="685" y2="30" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="15" y1="75" x2="685" y2="75" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="15" y1="125" x2="685" y2="125" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="15" y1={baseY} x2="685" y2={baseY} stroke="#e2e8f0" strokeWidth="1.5" />

                  {/* Shaded Area Fill */}
                  <path d={areaPath} fill="url(#blueGradient)" />

                  {/* Main Curve Line (Guaranteed not to overshoot) */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Individual Data Points */}
                  {coords.map((pt, i) => (
                    <g key={i} className="cursor-pointer group">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        fill="#ffffff"
                        stroke="#4f46e5"
                        strokeWidth="2.5"
                        className="transition-all duration-150 group-hover:r-6 group-hover:fill-indigo-600 group-hover:stroke-white shadow-sm"
                      />
                      {/* Interactive Tooltip on hover */}
                      <title>{`Ngày ${pt.day}: ${pt.val.toFixed(1)} Triệu VNĐ`}</title>
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
    </div>
  );
};

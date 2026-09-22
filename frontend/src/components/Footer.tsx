import React from "react";
import { ShieldCheck, Truck, RotateCcw, Headphones, Heart } from "lucide-react";

export const Footer: React.FC<{ onNavigateCategory?: (slug: string) => void }> = ({ onNavigateCategory }) => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 pt-12 pb-8 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Banners */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-slate-100">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs">Giao hỏa tốc 2h</p>
              <p className="text-[11px] text-slate-500">Miễn phí từ 500.000đ</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs">Chính hãng 100%</p>
              <p className="text-[11px] text-slate-500">BH 12–24 tháng</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs">Đổi trả 7 ngày</p>
              <p className="text-[11px] text-slate-500">Lỗi 1 đổi 1</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs">AI Tư vấn 24/7</p>
              <p className="text-[11px] text-slate-500">Phản hồi tức thì</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                🐝
              </div>
              <span className="font-extrabold text-base text-slate-900 tracking-wider">SHOPBEE</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed mb-4">
              SHOPBEE — Điểm mua sắm công nghệ số 1 Việt Nam với trải nghiệm AI tư vấn thông minh, giao hàng siêu tốc và bảo hành chính hãng.
            </p>
            <p className="text-[11px] text-slate-500">
              Hotline: <span className="text-rose-600 font-bold">1900 6868</span> (8h00 - 21h30)
            </p>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">Danh Mục Sản Phẩm</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigateCategory?.("dien-thoai-tablet")} className="hover:text-rose-600 transition-colors">Điện thoại & Tablet AI</button></li>
              <li><button onClick={() => onNavigateCategory?.("laptop-macbook")} className="hover:text-rose-600 transition-colors">Laptop Gaming & Ultrabook</button></li>
              <li><button onClick={() => onNavigateCategory?.("tai-nghe-am-thanh")} className="hover:text-rose-600 transition-colors">Tai nghe chống ồn AI ANC</button></li>
              <li><button onClick={() => onNavigateCategory?.("dong-ho-thong-minh")} className="hover:text-rose-600 transition-colors">Smartwatch Health AI</button></li>
              <li><button onClick={() => onNavigateCategory?.("nha-thong-minh")} className="hover:text-rose-600 transition-colors">Thiết bị Smart Home</button></li>
            </ul>
          </div>

          {/* Col 3: Policies */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">Chính Sách & Hỗ Trợ</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-rose-600 cursor-pointer">Chính sách bảo hành 1 đổi 1</li>
              <li className="hover:text-rose-600 cursor-pointer">Chính sách vận chuyển & giao hỏa tốc</li>
              <li className="hover:text-rose-600 cursor-pointer">Thanh toán VNPAY Sandbox & COD</li>
              <li className="hover:text-rose-600 cursor-pointer">Quy định đổi trả và hoàn tiền 7 ngày</li>
              <li className="hover:text-rose-600 cursor-pointer">Bảo mật thông tin khách hàng</li>
            </ul>
          </div>

          {/* Col 4: Project Team Credits */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">Nhóm Thực Hiện Đồ Án</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px]">T</span>
                <div>
                  <p className="text-slate-800 font-semibold">Thang Quốc Khải</p>
                  <p className="text-[10px] text-slate-400">Trưởng nhóm · Architecture · AI · Backend</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">N</span>
                <div>
                  <p className="text-slate-800 font-semibold">Nguyễn Đình Tiến</p>
                  <p className="text-[10px] text-slate-400">Frontend Lead · UI/UX Design</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">P</span>
                <div>
                  <p className="text-slate-800 font-semibold">Nguyễn Hồng Phúc</p>
                  <p className="text-[10px] text-slate-400">Backend Lead · Database · QA</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <p>© 2026 SHOPBEE STORE AI. Phát triển với kiến trúc phân tầng 5 lớp và AI Microservices.</p>
          <p className="flex items-center gap-1 text-slate-500">
            Design with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> & DeepMind AI
          </p>
        </div>
      </div>
    </footer>
  );
};

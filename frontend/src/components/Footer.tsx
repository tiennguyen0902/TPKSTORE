import React from "react";
import { ShieldCheck, Truck, RotateCcw, Headphones, Heart } from "lucide-react";

export const Footer: React.FC<{ onNavigateCategory?: (slug: string) => void }> = ({ onNavigateCategory }) => {
  return (
    <footer className="w-full bg-[#070a12] border-t border-slate-800/80 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Banners */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-slate-800/80">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#131c2e]/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Giao hỏa tốc 2h</p>
              <p className="text-[11px] text-slate-400">Miễn phí từ 500.000đ</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#131c2e]/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Chính hãng 100%</p>
              <p className="text-[11px] text-slate-400">BH 12–24 tháng</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#131c2e]/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Đổi trả 7 ngày</p>
              <p className="text-[11px] text-slate-400">Lỗi 1 đổi 1</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#131c2e]/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">AI Tư vấn 24/7</p>
              <p className="text-[11px] text-slate-400">Phản hồi tức thì</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white">
                🐝
              </div>
              <span className="font-extrabold text-base text-white tracking-wider">SHOPBEE</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              SHOPBEE — Điểm mua sắm công nghệ số 1 Việt Nam với trải nghiệm AI tư vấn thông minh, giao hàng siêu tốc và bảo hành chính hãng.
            </p>
            <p className="text-[11px] text-slate-500">
              Hotline: <span className="text-violet-400 font-semibold">1900 6868</span> (8h00 - 21h30)
            </p>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Danh Mục Sản Phẩm</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigateCategory?.("dien-thoai-tablet")} className="hover:text-violet-400 transition-colors">Điện thoại & Tablet AI</button></li>
              <li><button onClick={() => onNavigateCategory?.("laptop-macbook")} className="hover:text-violet-400 transition-colors">Laptop Gaming & Ultrabook</button></li>
              <li><button onClick={() => onNavigateCategory?.("tai-nghe-am-thanh")} className="hover:text-violet-400 transition-colors">Tai nghe chống ồn AI ANC</button></li>
              <li><button onClick={() => onNavigateCategory?.("dong-ho-thong-minh")} className="hover:text-violet-400 transition-colors">Smartwatch Health AI</button></li>
              <li><button onClick={() => onNavigateCategory?.("nha-thong-minh")} className="hover:text-violet-400 transition-colors">Thiết bị Smart Home</button></li>
            </ul>
          </div>

          {/* Col 3: Policies */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Chính Sách & Hỗ Trợ</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-violet-400 cursor-pointer">Chính sách bảo hành 1 đổi 1</li>
              <li className="hover:text-violet-400 cursor-pointer">Chính sách vận chuyển & giao hỏa tốc</li>
              <li className="hover:text-violet-400 cursor-pointer">Thanh toán VNPAY Sandbox & COD</li>
              <li className="hover:text-violet-400 cursor-pointer">Quy định đổi trả và hoàn tiền 7 ngày</li>
              <li className="hover:text-violet-400 cursor-pointer">Bảo mật thông tin khách hàng</li>
            </ul>
          </div>

          {/* Col 4: Project Team Credits */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Nhóm Thực Hiện Đồ Án</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center font-bold text-[10px]">T</span>
                <div>
                  <p className="text-slate-200 font-semibold">Thang Quốc Khải</p>
                  <p className="text-[10px] text-slate-500">Trưởng nhóm · Architecture · AI · Backend</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold text-[10px]">N</span>
                <div>
                  <p className="text-slate-200 font-semibold">Nguyễn Đình Tiến</p>
                  <p className="text-[10px] text-slate-500">Frontend Lead · UI/UX Design</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-300 flex items-center justify-center font-bold text-[10px]">P</span>
                <div>
                  <p className="text-slate-200 font-semibold">Nguyễn Hồng Phúc</p>
                  <p className="text-[10px] text-slate-500">Backend Lead · Database · QA</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <p>© 2026 SHOPBEE STORE AI. Phát triển với kiến trúc phân tầng 5 lớp và AI Microservices.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Design with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> & DeepMind AI
          </p>
        </div>
      </div>
    </footer>
  );
};

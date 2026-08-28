import React, { useEffect, useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Watch, 
  Zap, 
  Home, 
  Monitor, 
  Keyboard, 
  Wifi, 
  ShieldCheck, 
  Tag, 
  Flame, 
  TrendingUp 
} from "lucide-react";
import { Product, Category } from "../types";
import { ProductCard } from "./ProductCard";
import { api } from "../services/api";

interface StorefrontHomeProps {
  onSelectProduct: (p: Product) => void;
  onNavigateCatalog: (categorySlug?: string) => void;
  onOpenChat: () => void;
}

export const StorefrontHome: React.FC<StorefrontHomeProps> = ({
  onSelectProduct,
  onNavigateCatalog,
  onOpenChat
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [catRes, prodRes, aiRes] = await Promise.all([
          api.getCategories(),
          api.getProducts({ isFeatured: true }),
          api.getAiRecommendations(undefined, 4)
        ]);

        setCategories(catRes.categories || []);
        setFeaturedProducts(prodRes.products || []);
        setAiRecommendations(aiRes.recommendations || []);
      } catch (err) {
        console.warn("Could not load storefront data from server:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case "Smartphone": return <Smartphone className="w-6 h-6 text-indigo-400" />;
      case "Laptop": return <Laptop className="w-6 h-6 text-blue-400" />;
      case "Headphones": return <Headphones className="w-6 h-6 text-purple-400" />;
      case "Watch": return <Watch className="w-6 h-6 text-pink-400" />;
      case "Zap": return <Zap className="w-6 h-6 text-amber-400" />;
      case "Home": return <Home className="w-6 h-6 text-emerald-400" />;
      case "Monitor": return <Monitor className="w-6 h-6 text-cyan-400" />;
      case "Keyboard": return <Keyboard className="w-6 h-6 text-teal-400" />;
      case "Wifi": return <Wifi className="w-6 h-6 text-sky-400" />;
      case "ShieldCheck": return <ShieldCheck className="w-6 h-6 text-violet-400" />;
      default: return <Tag className="w-6 h-6 text-violet-400" />;
    }
  };

  const spotlightProduct = featuredProducts[0];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section (Matching Screenshot) */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#12192e] via-[#0f172a] to-[#18112e] border border-slate-800 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>AI-Powered Shopping Experience 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Mua sắm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">
                Thông Minh
              </span> <br />
              cùng <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">SHOPBEE</span> 🐝
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
              Hệ thống AI tự động phân tích nhu cầu, gợi ý sản phẩm phù hợp với phong cách và ngân sách của bạn.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigateCatalog()}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Khám phá ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenChat}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-sm font-bold border border-slate-700 transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                <Bot className="w-4 h-4 text-violet-400" />
                <span>Chat với AI</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <p className="text-xl font-black text-white">500+</p>
                <p className="text-xs text-slate-400 font-medium">Sản phẩm</p>
              </div>
              <div>
                <p className="text-xl font-black text-white">10K+</p>
                <p className="text-xs text-slate-400 font-medium">Khách hàng hài lòng</p>
              </div>
              <div>
                <p className="text-xl font-black text-white">100%</p>
                <p className="text-xs text-slate-400 font-medium">Bảo hành chính hãng</p>
              </div>
              <div>
                <p className="text-xl font-black text-white">2H</p>
                <p className="text-xs text-slate-400 font-medium">Giao hàng siêu tốc</p>
              </div>
            </div>
          </div>

          {/* Right Hero Spotlight Card (Matching Screenshot) */}
          <div className="lg:col-span-5 flex justify-center">
            {spotlightProduct && (
              <div 
                onClick={() => onSelectProduct(spotlightProduct)}
                className="relative w-full max-w-sm rounded-3xl bg-[#141d33] border border-slate-700/80 p-5 shadow-2xl hover:border-violet-500/60 transition-all cursor-pointer group"
              >
                {/* Product Image */}
                <div className="relative w-full pt-[80%] rounded-2xl overflow-hidden bg-slate-900 mb-4">
                  <img
                    src={spotlightProduct.thumbnail}
                    alt={spotlightProduct.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-extrabold shadow-md">
                    HOT -25%
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-400 text-[11px] font-bold border border-white/10 flex items-center gap-1">
                    ★ {spotlightProduct.rating.toFixed(1)}
                  </span>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-violet-600/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" /> AI Gợi ý #1
                  </div>
                </div>

                {/* Info */}
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                  {spotlightProduct.category?.name || "TAI NGHE & ÂM THANH"}
                </p>
                <h3 className="font-bold text-white text-sm mt-0.5 line-clamp-1 group-hover:text-violet-300 transition-colors">
                  {spotlightProduct.name}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-base font-extrabold text-white">
                      {spotlightProduct.price.toLocaleString("vi-VN")} đ
                    </p>
                    {spotlightProduct.originalPrice && (
                      <p className="text-[11px] text-slate-400 line-through">
                        {spotlightProduct.originalPrice.toLocaleString("vi-VN")} đ
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(spotlightProduct);
                    }}
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/30 transition-all"
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Category Explorer */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              DANH MỤC SẢN PHẨM
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Khám phá theo <span className="text-violet-400">danh mục</span>
            </h2>
          </div>

          <button
            onClick={() => onNavigateCatalog()}
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            <span>Tất cả danh mục</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigateCatalog(cat.slug)}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#131c2e]/70 border border-slate-800 hover:border-violet-500/50 hover:bg-[#18233a] cursor-pointer transition-all duration-200 group text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-violet-600/20 transition-all">
                {getCategoryIcon(cat.icon)}
              </div>
              <h4 className="font-semibold text-xs text-slate-200 group-hover:text-white line-clamp-1">
                {cat.name}
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {cat.productCount ? `${cat.productCount} sản phẩm` : "Xem ngay"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. AI Recommendations Section (Slider / Grid) */}
      {aiRecommendations.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-300 text-[11px] font-semibold mb-1">
                <Sparkles className="w-3 h-3 text-pink-400" />
                AI RECOMMENDATION ENGINE · HYBRID V2.1
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                Gợi ý dành riêng cho bạn <span className="text-xl">✨</span>
              </h2>
            </div>

            <button
              onClick={() => onNavigateCatalog()}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {aiRecommendations.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Featured & Hot Deals Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-semibold mb-1">
              <Flame className="w-3 h-3 text-amber-400" />
              HOT DEALS & NỔI BẬT
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              Sản phẩm bán chạy nhất <TrendingUp className="w-5 h-5 text-emerald-400" />
            </h2>
          </div>

          <button
            onClick={() => onNavigateCatalog()}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Xem thêm</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.slice(0, 8).map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

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
      case "Headphones": return <Headphones className="w-6 h-6 text-rose-400" />;
      case "Watch": return <Watch className="w-6 h-6 text-pink-400" />;
      case "Zap": return <Zap className="w-6 h-6 text-amber-400" />;
      case "Home": return <Home className="w-6 h-6 text-emerald-400" />;
      case "Monitor": return <Monitor className="w-6 h-6 text-cyan-400" />;
      case "Keyboard": return <Keyboard className="w-6 h-6 text-teal-400" />;
      case "Wifi": return <Wifi className="w-6 h-6 text-sky-400" />;
      case "ShieldCheck": return <ShieldCheck className="w-6 h-6 text-rose-400" />;
      default: return <Tag className="w-6 h-6 text-rose-400" />;
    }
  };

  const spotlightProduct = featuredProducts[0];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section (Crisp White & Light Cherry) */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-50/80 via-white to-amber-50/40 border border-rose-100 p-8 md:p-12 shadow-xl shadow-rose-950/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>AI-Powered Shopping Experience 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              Mua sắm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700">
                Thông Minh
              </span> <br />
              cùng <span className="text-rose-600">SHOPBEE</span> 🐝
            </h1>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl font-medium">
              Hệ thống AI tự động phân tích nhu cầu, gợi ý sản phẩm phù hợp với phong cách và ngân sách của bạn.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigateCatalog()}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-sm font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Khám phá ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenChat}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold border border-slate-200 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <Bot className="w-4 h-4 text-rose-600" />
                <span>Chat với AI</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
              <div>
                <p className="text-xl font-black text-slate-900">500+</p>
                <p className="text-xs text-slate-500 font-semibold">Sản phẩm</p>
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">10K+</p>
                <p className="text-xs text-slate-500 font-semibold">Khách hàng hài lòng</p>
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-semibold">Bảo hành chính hãng</p>
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">2H</p>
                <p className="text-xs text-slate-500 font-semibold">Giao hàng siêu tốc</p>
              </div>
            </div>
          </div>

          {/* Right Hero Spotlight Card */}
          <div className="lg:col-span-5 flex justify-center">
            {spotlightProduct && (
              <div 
                onClick={() => onSelectProduct(spotlightProduct)}
                className="relative w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-5 shadow-xl hover:border-rose-300 transition-all cursor-pointer group"
              >
                {/* Product Image */}
                <div className="relative w-full pt-[80%] rounded-2xl overflow-hidden bg-white border border-slate-100 mb-4 flex items-center justify-center">
                  <img
                    src={spotlightProduct.thumbnail}
                    alt={spotlightProduct.name}
                    className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-extrabold shadow-md">
                    HOT -25%
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-amber-500 text-[11px] font-bold border border-slate-200 shadow-sm flex items-center gap-1">
                    ★ {(Number(spotlightProduct.rating) || 5.0).toFixed(1)}
                  </span>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" /> AI Gợi ý #1
                  </div>
                </div>

                {/* Info */}
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                  {spotlightProduct.category?.name || "TAI NGHE & ÂM THANH"}
                </p>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5 line-clamp-1 group-hover:text-rose-600 transition-colors">
                  {spotlightProduct.name}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-base font-black text-rose-600">
                      {(Number(spotlightProduct.price) || 0).toLocaleString("vi-VN")} đ
                    </p>
                    {spotlightProduct.originalPrice && (
                      <p className="text-[11px] text-slate-400 line-through">
                        {(Number(spotlightProduct.originalPrice) || 0).toLocaleString("vi-VN")} đ
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(spotlightProduct);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all"
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              DANH MỤC SẢN PHẨM
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              Khám phá theo <span className="text-rose-600">danh mục</span>
            </h2>
          </div>

          <button
            onClick={() => onNavigateCatalog()}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
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
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 cursor-pointer transition-all duration-200 group text-center shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-rose-100 transition-all">
                {getCategoryIcon(cat.icon)}
              </div>
              <h4 className="font-bold text-xs text-slate-800 group-hover:text-rose-600 line-clamp-1">
                {cat.name}
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
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
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold mb-1">
                <Sparkles className="w-3 h-3 text-rose-600" />
                AI RECOMMENDATION ENGINE · HYBRID V2.1
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
                Gợi ý dành riêng cho bạn <span className="text-xl">✨</span>
              </h2>
            </div>

            <button
              onClick={() => onNavigateCatalog()}
              className="text-xs font-bold text-slate-600 hover:text-rose-600 flex items-center gap-1 transition-colors"
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold mb-1">
              <Flame className="w-3 h-3 text-amber-600" />
              HOT DEALS & NỔI BẬT
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
              Sản phẩm bán chạy nhất <TrendingUp className="w-5 h-5 text-emerald-600" />
            </h2>
          </div>

          <button
            onClick={() => onNavigateCatalog()}
            className="text-xs font-bold text-slate-600 hover:text-rose-600 flex items-center gap-1 transition-colors"
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

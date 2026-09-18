import React from "react";
import { Star, ShoppingBag, Eye } from "lucide-react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();

  const safePrice = typeof product.price === "number" ? product.price : (Number(product.price) || 0);
  const safeOriginalPrice = product.originalPrice ? (typeof product.originalPrice === "number" ? product.originalPrice : (Number(product.originalPrice) || 0)) : null;
  const safeRating = typeof product.rating === "number" ? product.rating : (Number(product.rating) || 5.0);
  const safeReviewCount = typeof product.reviewCount === "number" ? product.reviewCount : (Number(product.reviewCount) || 0);

  const discountPercent = safeOriginalPrice && safeOriginalPrice > safePrice
    ? Math.round(((safeOriginalPrice - safePrice) / safeOriginalPrice) * 100)
    : 0;

  const starCount = Math.min(5, Math.max(1, Math.floor(safeRating)));
  const thumbUrl = product.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#131c2e]/80 border border-slate-800 hover:border-violet-500/50 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-violet-600/10">
      {/* Thumbnail Container */}
      <div className="relative w-full pt-[75%] bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={thumbUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131c2e] via-transparent to-black/20 opacity-60" />

        {/* Badges Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-red-600 to-pink-600 text-white text-[10px] font-extrabold shadow-sm">
              -{discountPercent}% HOT
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-bold shadow-sm">
              MỚI
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-md bg-violet-600/90 text-white text-[10px] font-bold shadow-sm">
              NỔI BẬT
            </span>
          )}
        </div>

        {/* Rating Top Right */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-amber-400 text-[10px] font-bold flex items-center gap-1 z-10 border border-white/10">
          <Star className="w-3 h-3 fill-amber-400" />
          <span>{safeRating.toFixed(1)}</span>
        </div>

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform"
          >
            <Eye className="w-3.5 h-3.5" /> Xem chi tiết
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400 mb-1">
            {product.category?.name || "CÔNG NGHỆ"}
          </p>
          <h3 
            onClick={() => onSelect(product)}
            className="font-semibold text-slate-100 text-xs leading-snug line-clamp-2 hover:text-violet-300 cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
            <span className="text-amber-400 flex items-center">
              {"★".repeat(starCount)}
            </span>
            <span>({safeReviewCount})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <p className="text-white font-extrabold text-sm tracking-tight">
              {safePrice.toLocaleString("vi-VN")} <span className="text-xs font-medium text-violet-400">đ</span>
            </p>
            {safeOriginalPrice && safeOriginalPrice > safePrice && (
              <p className="text-[10px] text-slate-500 line-through">
                {safeOriginalPrice.toLocaleString("vi-VN")} đ
              </p>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/20 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
};

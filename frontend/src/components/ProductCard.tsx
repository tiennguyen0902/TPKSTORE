import React from "react";
import { Star, ShoppingBag, Eye } from "lucide-react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { handleImageError } from "../utils/imageFallback";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onBuy?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onBuy }) => {
  const { user } = useAuth();
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
    <div className="group relative flex flex-col rounded-2xl bg-white border border-slate-200 hover:border-rose-300 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-rose-950/5">
      {/* Thumbnail Container */}
      <div className="relative w-full pt-[75%] bg-white overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={thumbUrl}
          alt={product.name}
          onError={(e) => handleImageError(e, product.categoryId)}
          className="absolute inset-0 w-full h-full object-contain p-3.5 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-extrabold shadow-sm">
              -{discountPercent}% HOT
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-bold shadow-sm">
              MỚI
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold shadow-sm">
              NỔI BẬT
            </span>
          )}
        </div>

        {/* Rating Top Right */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-amber-500 text-[10px] font-bold flex items-center gap-1 z-10 border border-slate-200 shadow-sm">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{safeRating.toFixed(1)}</span>
        </div>

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform border border-slate-200"
          >
            <Eye className="w-3.5 h-3.5 text-rose-600" /> Xem chi tiết
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 mb-1">
            {product.category?.name || "CÔNG NGHỆ"}
          </p>
          <h3 
            onClick={() => onSelect(product)}
            className="font-bold text-slate-800 text-xs leading-snug line-clamp-2 hover:text-rose-600 cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mt-1.5 text-[11px] text-slate-500">
            <span className="text-amber-400 flex items-center">
              {"★".repeat(starCount)}
            </span>
            <span>({safeReviewCount})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <p className="text-rose-600 font-black text-sm tracking-tight">
              {safePrice.toLocaleString("vi-VN")} <span className="text-xs font-bold">đ</span>
            </p>
            {safeOriginalPrice && safeOriginalPrice > safePrice && (
              <p className="text-[10px] text-slate-400 line-through">
                {safeOriginalPrice.toLocaleString("vi-VN")} đ
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              title="Thêm vào giỏ hàng"
              className="p-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-rose-600 border border-slate-200 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onBuy) {
                  onBuy(product);
                } else {
                  onSelect(product);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

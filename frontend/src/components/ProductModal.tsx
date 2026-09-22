import React, { useState, useEffect } from "react";
import { 
  X, 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  Plus, 
  Minus 
} from "lucide-react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
  onGoToCheckout?: () => void;
}

// Helpers an toàn tuyệt đối chống crash React
export function getSafeStock(stockVal: any): number {
  if (typeof stockVal === "number" && !isNaN(stockVal)) {
    return Math.max(0, Math.floor(stockVal));
  }
  if (typeof stockVal === "object" && stockVal !== null) {
    if (typeof stockVal.decrement === "number") {
      return Math.max(0, 25 - stockVal.decrement);
    }
    if (typeof stockVal.increment === "number") {
      return 25 + stockVal.increment;
    }
    return 10;
  }
  const parsed = parseInt(String(stockVal), 10);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

export function getSafeRating(ratingVal: any): number {
  const num = Number(ratingVal);
  if (isNaN(num) || num <= 0) return 5.0;
  return Math.min(5, Math.max(1, num));
}

export function getSafePrice(priceVal: any): number {
  const num = Number(priceVal);
  return isNaN(num) ? 0 : Math.max(0, num);
}

export function getSafeImages(imagesVal: any, thumbnailVal?: string): string[] {
  const list: string[] = [];
  if (thumbnailVal && typeof thumbnailVal === "string" && thumbnailVal.trim()) {
    list.push(thumbnailVal.trim());
  }

  if (Array.isArray(imagesVal)) {
    for (const item of imagesVal) {
      if (typeof item === "string" && item.trim() && !list.includes(item.trim())) {
        list.push(item.trim());
      }
    }
  } else if (typeof imagesVal === "string" && imagesVal.trim()) {
    try {
      const parsed = JSON.parse(imagesVal);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (typeof item === "string" && item.trim() && !list.includes(item.trim())) {
            list.push(item.trim());
          }
        }
      } else if (!list.includes(imagesVal.trim())) {
        list.push(imagesVal.trim());
      }
    } catch {
      if (!list.includes(imagesVal.trim())) {
        list.push(imagesVal.trim());
      }
    }
  }

  return list.length > 0
    ? list
    : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onSelectProduct,
  onGoToCheckout
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      const images = getSafeImages(product.images, product.thumbnail);
      setSelectedImage(images[0] || product.thumbnail || "");

      // Fetch AI Similar Products
      const fetchSimilar = async () => {
        try {
          const res = await api.getAiRecommendations(product.id, 3);
          setSimilarProducts(res.recommendations || []);
        } catch (err) {
          console.warn("Could not fetch similar products:", err);
        }
      };
      fetchSimilar();
    }
  }, [product]);

  if (!product) return null;

  const safeStock = getSafeStock(product.stock);
  const safePrice = getSafePrice(product.price);
  const safeOriginalPrice = product.originalPrice ? getSafePrice(product.originalPrice) : null;
  const safeRating = getSafeRating(product.rating);
  const safeImages = getSafeImages(product.images, product.thumbnail);

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    onClose();
    onGoToCheckout?.();
  };

  const discountPercent = safeOriginalPrice && safeOriginalPrice > safePrice
    ? Math.round(((safeOriginalPrice - safePrice) / safeOriginalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-y-auto flex flex-col my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Main Content */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative w-full pt-[85%] rounded-2xl bg-slate-50 overflow-hidden border border-slate-200">
              <img
                src={selectedImage || product.thumbnail || safeImages[0]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-bold shadow-md">
                  Giảm {discountPercent}%
                </span>
              )}
            </div>

            {/* Gallery thumbnails */}
            {safeImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {safeImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${selectedImage === img ? "border-rose-500 shadow-md shadow-rose-500/20" : "border-slate-200 opacity-70 hover:opacity-100"}`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Badges / Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-slate-700">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Giao 2h siêu tốc</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>BH 12 tháng</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                <RotateCcw className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Đổi trả 7 ngày</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase tracking-wider">
                  {product.category?.name || "Công nghệ"}
                </span>
                <span className="text-xs text-slate-400">Mã: {product.id}</span>
              </div>

              <h2 className="text-lg md:text-xl font-black text-slate-900 leading-snug mb-2">
                {product.name}
              </h2>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 text-xs mb-4">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-800">{safeRating.toFixed(1)}</span>
                  <span className="text-slate-500">({product.reviewCount || 0} đánh giá)</span>
                </div>
                <div className="text-slate-500">
                  Tồn kho: <span className={`font-bold ${safeStock > 5 ? "text-emerald-600" : "text-amber-600"}`}>{safeStock} sản phẩm</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-amber-50 border border-rose-100 mb-4 shadow-sm">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-rose-600">
                    {safePrice.toLocaleString("vi-VN")} <span className="text-sm font-bold">VNĐ</span>
                  </span>
                  {safeOriginalPrice && safeOriginalPrice > safePrice && (
                    <span className="text-xs text-slate-400 line-through font-medium">
                      {safeOriginalPrice.toLocaleString("vi-VN")} VNĐ
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                  ✓ Miễn phí giao hàng cho đơn hàng trên 500.000 VNĐ
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Đặc điểm nổi bật & Thông số:</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-line font-medium">
                  {product.description || "Không có mô tả chi tiết."}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-bold text-slate-700">Số lượng:</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(safeStock, quantity + 1))}
                    disabled={quantity >= safeStock}
                    className="p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={safeStock <= 0}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-xs font-bold border border-slate-300 transition-all active:scale-98 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-rose-600" />
                  <span>{addedToast ? "✓ Đã thêm vào giỏ" : "Thêm vào giỏ"}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={safeStock <= 0}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all active:scale-98"
                >
                  <span>{safeStock <= 0 ? "Hết hàng" : "Mua ngay"}</span>
                </button>
              </div>

              {addedToast && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-700 font-semibold animate-in fade-in">
                  ✓ Đã thêm {quantity} sản phẩm vào giỏ hàng thành công!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products Block (AI Recommendations) */}
        {similarProducts.length > 0 && (
          <div className="p-6 md:p-8 bg-slate-50/80 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Sản phẩm tương tự được AI đề xuất (Similar Products):
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {similarProducts.map((p) => {
                const pPrice = getSafePrice(p.price);
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 cursor-pointer transition-all hover:-translate-y-1 shadow-sm"
                  >
                    <img src={p.thumbnail} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-50 border border-slate-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                      <p className="text-xs font-black text-rose-600 mt-0.5">{pPrice.toLocaleString("vi-VN")} đ</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

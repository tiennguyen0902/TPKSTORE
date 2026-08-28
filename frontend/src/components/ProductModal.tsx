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
  Minus, 
  Check 
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
      setSelectedImage(product.thumbnail || (product.images && product.images[0]) || "");

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

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#111827] border border-slate-700/80 rounded-3xl shadow-2xl overflow-y-auto flex flex-col my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Main Content */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative w-full pt-[85%] rounded-2xl bg-slate-900 overflow-hidden border border-slate-800">
              <img
                src={selectedImage || product.thumbnail}
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
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${selectedImage === img ? "border-violet-500 shadow-md shadow-violet-500/20" : "border-slate-800 opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Badges / Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-slate-300">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#162032] border border-slate-800">
                <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Giao 2h siêu tốc</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#162032] border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>BH 12 tháng</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#162032] border border-slate-800">
                <RotateCcw className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Đổi trả 7 ngày</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30 text-[10px] font-bold uppercase tracking-wider">
                  {product.category?.name || "Công nghệ"}
                </span>
                <span className="text-xs text-slate-400">Mã: {product.id}</span>
              </div>

              <h2 className="text-lg md:text-xl font-bold text-white leading-snug mb-2">
                {product.name}
              </h2>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 text-xs mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-white">{product.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({product.reviewCount} đánh giá)</span>
                </div>
                <div className="text-slate-400">
                  Tồn kho: <span className={`font-semibold ${product.stock > 5 ? "text-emerald-400" : "text-amber-400"}`}>{product.stock} sản phẩm</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#172138] to-[#1a1c3b] border border-slate-700/80 mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-white">
                    {product.price.toLocaleString("vi-VN")} <span className="text-sm font-bold text-violet-400">VNĐ</span>
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">
                      {product.originalPrice.toLocaleString("vi-VN")} VNĐ
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  ✓ Miễn phí giao hàng cho đơn hàng trên 500.000 VNĐ
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Đặc điểm nổi bật & Thông số:</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#131c2e] p-3 rounded-xl border border-slate-800 whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-semibold text-slate-300">Số lượng:</span>
                <div className="flex items-center border border-slate-700 rounded-xl bg-[#131c2e] overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
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
                  disabled={product.stock <= 0}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-100 text-xs font-bold border border-slate-700 transition-all active:scale-98 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-violet-400" />
                  <span>{addedToast ? "✓ Đã thêm vào giỏ" : "Thêm vào giỏ"}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all active:scale-98"
                >
                  <span>Mua ngay</span>
                </button>
              </div>

              {addedToast && (
                <div className="p-2 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-300 font-medium animate-in fade-in">
                  ✓ Đã thêm {quantity} sản phẩm vào giỏ hàng thành công!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products Block (AI Recommendations) */}
        {similarProducts.length > 0 && (
          <div className="p-6 md:p-8 bg-[#0c121e] border-t border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Sản phẩm tương tự được AI đề xuất (Similar Products):
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {similarProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#141c2e] border border-slate-800 hover:border-violet-500/50 cursor-pointer transition-all hover:-translate-y-1"
                >
                  <img src={p.thumbnail} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                    <p className="text-xs font-bold text-violet-400 mt-0.5">{p.price.toLocaleString("vi-VN")} đ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
  Cpu,
  FileText,
  BadgeCheck,
  CheckCircle2,
  Share2,
  Copy,
  Layers,
  Palette,
  HardDrive,
  Check
} from "lucide-react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";
import { getProductSpecifications, SpecGroup } from "../data/productSpecs";
import { getProductVariants, ProductVariantGroup, ColorVariant, OptionItem } from "../data/productVariants";
import { handleImageError } from "../utils/imageFallback";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
  onGoToCheckout?: () => void;
}

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
    : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"];
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
  const [activeTab, setActiveTab] = useState<"specs" | "desc" | "warranty">("specs");
  const [copiedLink, setCopiedLink] = useState(false);

  // Variant States (Màu sắc & Cấu hình / Dung lượng chính hãng)
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
  const [selectedOption, setSelectedOption] = useState<OptionItem | null>(null);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setActiveTab("specs");
      const images = getSafeImages(product.images, product.thumbnail);
      setSelectedImage(images[0] || product.thumbnail || "");

      // Nạp cấu hình biến thể màu & dung lượng thật từ hãng
      const v = getProductVariants(product);
      if (v) {
        setSelectedColor(v.colors && v.colors.length > 0 ? v.colors[0] : null);
        const defOpt = v.options?.find(o => o.isDefault) || (v.options && v.options.length > 0 ? v.options[0] : null);
        setSelectedOption(defOpt || null);
      } else {
        setSelectedColor(null);
        setSelectedOption(null);
      }

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

  const variantData: ProductVariantGroup | null = getProductVariants(product);
  const safeStock = getSafeStock(product.stock);
  const basePrice = getSafePrice(product.price);
  const priceDiff = selectedOption?.priceDiff || 0;
  const currentPrice = Math.max(0, basePrice + priceDiff);
  const currentOriginalPrice = product.originalPrice 
    ? Math.max(0, getSafePrice(product.originalPrice) + priceDiff) 
    : null;
  const safeRating = getSafeRating(product.rating);
  const safeImages = getSafeImages(product.images, product.thumbnail);
  const specGroups: SpecGroup[] = getProductSpecifications(product);

  const variantSummary = [
    selectedColor ? selectedColor.name : "",
    selectedOption ? selectedOption.name : ""
  ].filter(Boolean).join(" • ");

  const handleAddToCart = async () => {
    const productWithVariant: Product = {
      ...product,
      price: currentPrice,
      originalPrice: currentOriginalPrice || product.originalPrice,
      name: variantSummary ? `${product.name} (${variantSummary})` : product.name
    };
    await addToCart(productWithVariant, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  const handleBuyNow = async () => {
    const productWithVariant: Product = {
      ...product,
      price: currentPrice,
      originalPrice: currentOriginalPrice || product.originalPrice,
      name: variantSummary ? `${product.name} (${variantSummary})` : product.name
    };
    await addToCart(productWithVariant, quantity);
    onClose();
    onGoToCheckout?.();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + "/#product-" + product.id);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const discountPercent = currentOriginalPrice && currentOriginalPrice > currentPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-y-auto flex flex-col my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shadow-md"
          title="Đóng cửa sổ"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Main Content */}
        <div className="p-5 sm:p-7 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery & Guarantees (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Main Featured Image */}
            <div className="relative w-full pt-[85%] rounded-2xl bg-white overflow-hidden border border-slate-200 shadow-inner group flex items-center justify-center">
              <img
                src={selectedImage || product.thumbnail || safeImages[0]}
                alt={product.name}
                onError={(e) => handleImageError(e, product.categoryId)}
                className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />

              {/* Discount Tag */}
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black shadow-lg">
                  TIẾT KIỆM {discountPercent}%
                </span>
              )}

              {/* Share button */}
              <button 
                onClick={handleCopyLink}
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 text-xs font-semibold shadow-md border border-slate-200 flex items-center gap-1.5 transition-all"
                title="Sao chép liên kết sản phẩm"
              >
                {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copiedLink ? "Đã chép" : "Chia sẻ"}</span>
              </button>
            </div>

            {/* Gallery thumbnails */}
            {safeImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {safeImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${selectedImage === img ? "border-rose-600 shadow-md shadow-rose-600/20 scale-102" : "border-slate-200 opacity-70 hover:opacity-100"}`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumb ${idx}`} 
                      onError={(e) => handleImageError(e, product.categoryId)}
                      className="w-full h-full object-contain p-1 bg-white" 
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Commitments / Trust badges */}
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-700 pt-1">
              <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <Truck className="w-4 h-4 text-blue-600 mb-1" />
                <span className="font-bold text-slate-900">Giao nhanh 2h</span>
                <span className="text-[10px] text-slate-500">Nội thành Hà Nội & HCM</span>
              </div>
              <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="font-bold text-slate-900">100% Chính hãng</span>
                <span className="text-[10px] text-slate-500">Bảo hành 12 - 24 tháng</span>
              </div>
              <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <RotateCcw className="w-4 h-4 text-rose-600 mb-1" />
                <span className="font-bold text-slate-900">Đổi mới 30 ngày</span>
                <span className="text-[10px] text-slate-500">Nếu lỗi nhà sản xuất</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Specs Tabs & Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category & Featured badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold uppercase tracking-wider">
                  {product.category?.name || "Thiết bị công nghệ"}
                </span>
                {product.isFeatured && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                    ★ Nổi bật
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-snug mb-2.5">
                {product.name}
              </h1>

              {/* Rating & Stock */}
              <div className="flex flex-wrap items-center gap-4 text-xs mb-4">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-black text-slate-900 text-sm">{safeRating.toFixed(1)}</span>
                  <span className="text-slate-500">({product.reviewCount || 0} nhận xét của khách hàng)</span>
                </div>
                <div className="text-slate-500 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Tồn kho: <span className="font-bold text-emerald-700">{safeStock} sản phẩm sẵn sàng giao</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/80 via-white to-amber-50/80 border border-rose-200/80 mb-4 shadow-sm">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
                    {currentPrice.toLocaleString("vi-VN")} <span className="text-base font-bold">VNĐ</span>
                  </span>
                  {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                    <span className="text-sm text-slate-400 line-through font-semibold">
                      {currentOriginalPrice.toLocaleString("vi-VN")} VNĐ
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-xs font-black">
                      Tiết kiệm {((currentOriginalPrice || 0) - currentPrice).toLocaleString("vi-VN")} đ
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-700 mt-2 flex items-center gap-1.5 font-bold">
                  <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500.000 VNĐ
                </p>
              </div>

              {/* PRODUCT VARIANTS SELECTION (MÀU SẮC & DUNG LƯỢNG / CẤU HÌNH THẬT TỪ HÃNG) */}
              {variantData && (
                <div className="mb-5 p-4 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-4 shadow-sm">
                  {/* 1. Chọn Màu Sắc Chính Hãng */}
                  {variantData.colors && variantData.colors.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-xs mb-2.5">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5 shrink-0">
                          <Palette className="w-4 h-4 text-rose-600" />
                          <span>Màu sắc:</span>
                        </span>
                        <span className="font-bold text-rose-600">
                          {selectedColor?.name || ""}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {variantData.colors.map((c, cIdx) => {
                          const isSelected = selectedColor?.name === c.name;
                          const isLight = ["#FFFFFF", "#F2F1ED", "#FDFDFD", "#F5F5F7", "#F4F3ED", "#E2E4E5", "#E1E2E4", "#DCDDDF", "#D6D4CD", "#ECECEC", "#EAEAE8"].includes(c.hex.toUpperCase());
                          return (
                            <button
                              key={cIdx}
                              type="button"
                              onClick={() => setSelectedColor(c)}
                              className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                                isSelected
                                  ? "bg-rose-50/70 border-rose-500 text-rose-700 shadow-2xs"
                                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
                              }`}
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-black/15 shrink-0 shadow-inner flex items-center justify-center"
                                style={{ backgroundColor: c.hex }}
                              >
                                {isSelected && (
                                  <Check className={`w-2.5 h-2.5 stroke-[3] ${isLight ? "text-slate-900" : "text-white"}`} />
                                )}
                              </span>
                              <span>{c.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Chọn Dung Lượng / Cấu Hình Chính Hãng */}
                  {variantData.options && variantData.options.length > 0 && (
                    <div className="pt-3 border-t border-slate-200/80">
                      <div className="flex items-center gap-2 text-xs mb-2.5">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5 shrink-0">
                          <HardDrive className="w-4 h-4 text-rose-600" />
                          <span>Phiên bản:</span>
                        </span>
                        <span className="font-bold text-rose-600">
                          {selectedOption?.name || ""}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {variantData.options.map((opt, oIdx) => {
                          const isSelected = selectedOption?.name === opt.name;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => setSelectedOption(opt)}
                              className={`group relative p-2.5 rounded-xl border text-left cursor-pointer flex flex-col justify-between transition-colors ${
                                isSelected
                                  ? "bg-rose-50/50 border-rose-500 shadow-2xs"
                                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className={`text-xs font-black ${isSelected ? "text-rose-600" : "text-slate-800"}`}>
                                  {opt.name}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium leading-tight">
                                {opt.priceDiff === 0 ? (
                                  <span className="text-emerald-600 font-bold">Giá chuẩn</span>
                                ) : opt.priceDiff > 0 ? (
                                  <span className="text-rose-600 font-bold">+{opt.priceDiff.toLocaleString("vi-VN")} đ</span>
                                ) : (
                                  <span className="text-emerald-600 font-bold">{opt.priceDiff.toLocaleString("vi-VN")} đ</span>
                                )}
                              </div>
                              {opt.description && (
                                <p className="text-[9px] text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-600">
                                  {opt.description}
                                </p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TABS NAVIGATION */}
              <div className="flex border-b border-slate-200 mb-4 gap-2">
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-[1px] ${
                    activeTab === "specs"
                      ? "border-rose-600 text-rose-600 bg-rose-50/40 rounded-t-xl"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span>THÔNG SỐ KỸ THUẬT</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px]">Chi tiết</span>
                </button>

                <button
                  onClick={() => setActiveTab("desc")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-[1px] ${
                    activeTab === "desc"
                      ? "border-rose-600 text-rose-600 bg-rose-50/40 rounded-t-xl"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>ĐẶC ĐIỂM NỔI BẬT</span>
                </button>

                <button
                  onClick={() => setActiveTab("warranty")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-[1px] ${
                    activeTab === "warranty"
                      ? "border-rose-600 text-rose-600 bg-rose-50/40 rounded-t-xl"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>CHÍNH SÁCH BẢO HÀNH</span>
                </button>
              </div>

              {/* TAB 1: THÔNG SỐ KỸ THUẬT CHI TIẾT */}
              {activeTab === "specs" && (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                  {specGroups.map((group, gIdx) => (
                    <div key={gIdx} className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                      <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-rose-600" />
                          {group.groupName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {group.specs.length} thông số
                        </span>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {group.specs.map((item, sIdx) => (
                          <div 
                            key={sIdx} 
                            className={`grid grid-cols-12 p-2.5 text-xs transition-colors ${
                              sIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                            } hover:bg-rose-50/30`}
                          >
                            <div className="col-span-5 font-semibold text-slate-500 pr-2">
                              {item.label}
                            </div>
                            <div className="col-span-7 font-bold text-slate-900 break-words">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: ĐẶC ĐIỂM NỔI BẬT & MÔ TẢ */}
              {activeTab === "desc" && (
                <div className="max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                    <p className="whitespace-pre-line text-slate-800 font-normal leading-relaxed text-sm">
                      {product.description}
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col gap-2 text-slate-600">
                      <p className="font-bold text-slate-900">Cam kết chất lượng từ TPKSTORE:</p>
                      <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Sản phẩm mới 100% nguyên seal từ nhà sản xuất.
                      </p>
                      <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Đầy đủ tem chống hàng giả, hóa đơn VAT điện tử hợp lệ.
                      </p>
                      <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Kích hoạt bảo hành điện tử chính hãng theo số Serial/IMEI.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BẢO HÀNH & GIAO HÀNG */}
              {activeTab === "warranty" && (
                <div className="max-h-[300px] overflow-y-auto pr-1 scrollbar-thin space-y-3 text-xs text-slate-700">
                  <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200">
                    <h5 className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" /> Chính sách bảo hành chính hãng:
                    </h5>
                    <p className="text-slate-600 leading-relaxed">
                      Bảo hành 12 đến 24 tháng tại tất cả các trung tâm bảo hành ủy quyền của hãng trên toàn quốc. Đổi mới ngay trong 30 ngày đầu tiên nếu máy phát sinh lỗi phần cứng từ nhà sản xuất.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                    <h5 className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-emerald-600" /> Vận chuyển & Giao nhận:
                    </h5>
                    <p className="text-slate-600 leading-relaxed">
                      Giao hàng hỏa tốc trong 2 giờ tại nội thành Hà Nội và TP. Hồ Chí Minh. Miễn phí vận chuyển toàn quốc với đơn hàng từ 500.000 VNĐ. Khách hàng được quyền đồng kiểm tra hàng trước khi thanh toán.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                    <h5 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4 text-amber-600" /> Hỗ trợ kỹ thuật trọn đời:
                    </h5>
                    <p className="text-slate-600 leading-relaxed">
                      Đội ngũ kỹ sư TPKSTORE hỗ trợ cài đặt phần mềm, chuyển dữ liệu từ máy cũ sang máy mới miễn phí 100%, tư vấn trực tuyến 24/7 qua hệ thống Trợ lý AI.
                    </p>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mt-5 mb-4">
                <span className="text-xs font-bold text-slate-800">Số lượng mua:</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-xs font-black text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(safeStock, quantity + 1))}
                    disabled={quantity >= safeStock}
                    className="p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Tổng: <span className="font-bold text-rose-600">{(currentPrice * quantity).toLocaleString("vi-VN")} đ</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={safeStock <= 0}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-xs font-bold border border-slate-300 transition-all active:scale-98 shadow-sm cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-rose-600" />
                  <span>{addedToast ? "✓ Đã thêm vào giỏ hàng" : "Thêm vào giỏ hàng"}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={safeStock <= 0}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all active:scale-98 cursor-pointer"
                >
                  <span>{safeStock <= 0 ? "Hết hàng" : "Mua ngay (Giao 2h)"}</span>
                </button>
              </div>

              {addedToast && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-bold animate-in fade-in flex items-center justify-center gap-1.5 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đã thêm {quantity} x {product.name} {variantSummary ? `(${variantSummary})` : ""} vào giỏ hàng thành công!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products Block (AI Recommendations) */}
        {similarProducts.length > 0 && (
          <div className="p-5 sm:p-7 md:p-8 bg-slate-50/90 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-3.5">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Sản phẩm tương tự được AI đề xuất (Similar Devices):
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {similarProducts.map((p) => {
                const pPrice = getSafePrice(p.price);
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 cursor-pointer transition-all hover:-translate-y-1 shadow-sm"
                  >
                    <img 
                      src={p.thumbnail} 
                      alt={p.name} 
                      onError={(e) => handleImageError(e, p.categoryId)}
                      className="w-14 h-14 rounded-xl object-contain p-1 bg-white border border-slate-100 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate hover:text-rose-600">{p.name}</p>
                      <p className="text-xs font-black text-rose-600 mt-1">{pPrice.toLocaleString("vi-VN")} đ</p>
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

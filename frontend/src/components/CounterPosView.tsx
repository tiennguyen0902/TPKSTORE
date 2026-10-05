import React, { useState, useEffect } from "react";
import { 
  Store, 
  Search, 
  UserCheck, 
  UserPlus, 
  Phone, 
  User as UserIcon, 
  ShieldCheck, 
  Award, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Printer, 
  RefreshCw, 
  AlertCircle, 
  Banknote, 
  QrCode, 
  Smartphone,
  History,
  Clock,
  Sparkles,
  ArrowRight,
  Bot,
  MessageSquare,
  Send,
  X,
  Zap,
  Check,
  Boxes
} from "lucide-react";
import { Product, Category } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface CounterPosViewProps {
  onNavigateWarehouse?: () => void;
}

export const CounterPosView: React.FC<CounterPosViewProps> = ({ onNavigateWarehouse }) => {
  const { user } = useAuth();

  // 1. Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 2. Customer Identification State (Walk-in Phone & Points)
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isLookingUpCustomer, setIsLookingUpCustomer] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{
    found: boolean;
    id?: string;
    fullName?: string;
    phone?: string;
    loyaltyPoints?: number;
    totalOrders?: number;
    totalSpent?: number;
    recentOrders?: any[];
  } | null>(null);
  const [showRecentOrdersModal, setShowRecentOrdersModal] = useState(false);

  // 3. In-Store Counter Cart State
  const [cartItems, setCartItems] = useState<{
    product: Product;
    quantity: number;
  }[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY" | "MOMO">("COD");
  const [consultantNote, setConsultantNote] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  // 4. Receipt & Electronic Warranty Modal
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [warrantySlip, setWarrantySlip] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // 5. Staff AI Sales Copilot State
  const [showAiAdvisorModal, setShowAiAdvisorModal] = useState(false);
  const [aiAdvisorQuery, setAiAdvisorQuery] = useState("");
  const [isAiAdvising, setIsAiAdvising] = useState(false);
  const [addedProductToast, setAddedProductToast] = useState<string | null>(null);
  const [aiAdvisorResult, setAiAdvisorResult] = useState<{
    reply: string;
    suggestedProducts?: Product[];
    query: string;
  } | null>(null);

  const handleConsultAi = async (customQuery?: string) => {
    const q = (customQuery || aiAdvisorQuery).trim();
    if (!q || isAiAdvising) return;

    setIsAiAdvising(true);
    setAiAdvisorQuery(q);
    try {
      const res = await api.chatWithAi(
        `[VAI TRÒ: BẠN LÀ TRỢ LÝ AI TƯ VẤN BÁN HÀNG CHO NHÂN VIÊN TẠI QUẦY CỬA HÀNG TPKSTORE/SHOPBEE]. 
Khách hàng đang đứng tại quầy và có nhu cầu sau: "${q}". 
Hãy đưa ra kịch bản tư vấn súc tích, chuyên nghiệp cho nhân viên bán hàng (gồm: lời chào, gợi ý dòng máy phù hợp nhất trong kho, nêu 2-3 điểm mạnh cốt lõi, tư vấn thêm bảo hành điện tử chính hãng 12-24 tháng và ưu đãi). Đừng nói dông dài.`,
        [],
        "local"
      );

      setAiAdvisorResult({
        query: q,
        reply: res.reply || "Dạ, hệ thống đã phân tích nhu cầu của khách hàng. Dưới đây là các sản phẩm phù hợp đang có sẵn trong kho hàng showroom:",
        suggestedProducts: res.suggestedProducts || []
      });
    } catch (err) {
      console.warn("AI consult error:", err);
      const matched = products.filter(p => 
        q.toLowerCase().split(" ").some(word => word.length > 2 && (p.name.toLowerCase().includes(word) || p.category?.name?.toLowerCase()?.includes(word)))
      ).slice(0, 4);

      setAiAdvisorResult({
        query: q,
        reply: `Dạ em chào anh/chị! Với nhu cầu "${q}", showroom TPKSTORE xin tư vấn cho anh/chị các mẫu máy bán chạy hàng đầu sau đây. Tất cả sản phẩm đều được kích hoạt bảo hành điện tử chính hãng theo số điện thoại của anh/chị ạ:`,
        suggestedProducts: matched.length > 0 ? matched : products.slice(0, 3)
      });
    } finally {
      setIsAiAdvising(false);
    }
  };

  // Load products & categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingProducts(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            search: productSearch || undefined,
            limit: 50
          }),
          api.getCategories()
        ]);
        setProducts(prodRes.products || []);
        setCategories(catRes.categories || []);
      } catch (err) {
        console.warn("Could not load POS products:", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchData();
  }, [productSearch, selectedCategory]);

  // Handle Customer Phone Lookup
  const handleLookupPhone = async (phoneToLookup?: string) => {
    const rawPhone = (phoneToLookup || customerPhone).trim();
    if (!rawPhone || rawPhone.length < 8) return;

    setIsLookingUpCustomer(true);
    setOrderError("");
    try {
      const res = await api.lookupCustomer(rawPhone);
      if (res.found && res.customer) {
        setCustomerInfo({
          found: true,
          id: res.customer.id,
          fullName: res.customer.fullName,
          phone: res.customer.phone,
          loyaltyPoints: res.customer.loyaltyPoints || 0,
          totalOrders: res.customer.totalOrders || 0,
          totalSpent: res.customer.totalSpent || 0,
          recentOrders: res.customer.recentOrders || []
        });
        setCustomerName(res.customer.fullName || "");
      } else {
        setCustomerInfo({
          found: false
        });
        if (!customerName) {
          setCustomerName("Khách hàng vãng lai");
        }
      }
    } catch (err) {
      console.warn("Lookup failed:", err);
      setCustomerInfo({ found: false });
    } finally {
      setIsLookingUpCustomer(false);
    }
  };

  // Debounced auto-lookup when 10 digits entered
  useEffect(() => {
    const clean = customerPhone.replace(/\D/g, "");
    if (clean.length === 10) {
      handleLookupPhone(clean);
    } else if (clean.length === 0) {
      setCustomerInfo(null);
    }
  }, [customerPhone]);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setOrderError("");
    if (product.stock <= 0) {
      setOrderError(`Sản phẩm "${product.name}" hiện đã hết hàng trong kho.`);
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          setOrderError(`Chỉ còn ${product.stock} sản phẩm "${product.name}" trong kho.`);
          return prev;
        }
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setOrderError("");
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stock) {
              setOrderError(`Kho chỉ còn ${item.product.stock} sản phẩm.`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number }[];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Submit in-store counter order
  const handleCreatePosOrder = async () => {
    if (!customerPhone.trim()) {
      setOrderError("Vui lòng nhập Số điện thoại khách hàng để kích hoạt bảo hành điện tử và tích điểm!");
      return;
    }

    const cleanPhone = customerPhone.trim().replace(/\D/g, "");
    if (cleanPhone.length < 9) {
      setOrderError("Số điện thoại không hợp lệ (phải gồm ít nhất 9-10 chữ số).");
      return;
    }

    if (cartItems.length === 0) {
      setOrderError("Đơn hàng tại quầy phải có ít nhất 1 sản phẩm.");
      return;
    }

    setIsSubmittingOrder(true);
    setOrderError("");

    try {
      const res = await api.createPosOrder({
        customerName: customerName.trim() || "Khách hàng vãng lai",
        phone: customerPhone.trim(),
        shippingAddress: "Mua trực tiếp tại quầy - TPKSTORE",
        paymentMethod,
        paymentStatus: "COMPLETED",
        status: "DELIVERED",
        discountAmount,
        note: consultantNote.trim() || "Khách mua trực tiếp tại quầy",
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      });

      setCompletedOrder(res.order);
      setWarrantySlip(res.warrantyInfo);
      setShowReceiptModal(true);

      // Refresh product stock
      const prodRes = await api.getProducts({
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        search: productSearch || undefined,
        limit: 50
      });
      setProducts(prodRes.products || []);
    } catch (err: any) {
      setOrderError(err.message || "Lập đơn hàng tại quầy thất bại.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Reset for next walk-in customer
  const handleResetForNextCustomer = () => {
    setCartItems([]);
    setCustomerPhone("");
    setCustomerName("");
    setCustomerInfo(null);
    setDiscountAmount(0);
    setConsultantNote("");
    setOrderError("");
    setShowReceiptModal(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner: Sales Consultation & Retail POS */}
      <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white via-white to-slate-50/70 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
        {/* Decorative background glows */}
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          {/* Left Column: POS Identity, Title & Feature highlights */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/90 text-emerald-800 text-xs font-bold border border-emerald-200/80 mb-2.5 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span className="tracking-wide uppercase font-extrabold text-[11px]">Quầy Bán Lẻ & Tư Vấn Khách Hàng (Retail POS)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Bàn Làm Việc Tư Vấn &amp; Bán Hàng <span className="inline-block whitespace-nowrap">Tại Quầy</span>
            </h1>

            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
              Tối ưu cho khách ghé showroom: Tra cứu SĐT tích điểm &amp; bảo hành điện tử chính hãng, đồng hành cùng{" "}
              <strong className="text-purple-600 font-bold">Trợ Lý AI Tư Vấn Bán Hàng</strong> để gợi ý cấu hình và chốt đơn nhanh chóng.
            </p>
          </div>

          {/* Right Column: Staff Profile & Quick POS Actions */}
          <div className="flex flex-col sm:items-end justify-center gap-3 shrink-0">
            {/* Staff Profile Card */}
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-slate-200/90 px-3.5 py-2 rounded-2xl shadow-2xs hover:border-slate-300 transition-colors w-full sm:w-auto">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-rose-600/20">
                  {user?.fullName?.charAt(0) || "S"}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" title="Trực ca quầy" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-slate-900 truncate max-w-[170px]">
                    {user?.fullName || "Nhân viên bán hàng"}
                  </p>
                  <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-wider border border-rose-200/60">
                    {user?.role || "STAFF"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>Ca trực quầy showroom</span>
                </p>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowAiAdvisorModal(true)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-purple-400/30 cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse group-hover:rotate-12 transition-transform" />
                <span>AI Tư Vấn Bán Hàng</span>
                <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] uppercase font-black tracking-wider">
                  Copilot
                </span>
              </button>

              {onNavigateWarehouse && (
                <button
                  type="button"
                  onClick={onNavigateWarehouse}
                  className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200/80 flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
                  title="Chuyển sang Cổng Quản Lý Kho Hàng"
                >
                  <Boxes className="w-4 h-4 text-blue-600" />
                  <span>Quản Lý Kho ➔</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {orderError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{orderError}</span>
        </div>
      )}

      {/* Main POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Product Catalog & Quick Search (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Tìm nhanh: gõ điện thoại, sạc, laptop, chuột, iPhone, Samsung..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              {productSearch && (
                <button
                  onClick={() => setProductSearch("")}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Quick Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedCategory === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Tất cả ({products.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    selectedCategory === c.slug
                      ? "bg-rose-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm min-h-[420px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Danh Sách Sản Phẩm Tại Cửa Hàng ({products.length})
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Bấm (+) để thêm nhanh vào đơn</span>
            </div>

            {isLoadingProducts ? (
              <div className="py-20 text-center text-slate-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
                Đang tải dữ liệu sản phẩm...
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-xs">
                Không tìm thấy sản phẩm phù hợp. Thử tìm từ khóa khác!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.map((p) => {
                  const inCart = cartItems.find((ci) => ci.product.id === p.id);
                  const isOutOfStock = p.stock <= 0;

                  return (
                    <div
                      key={p.id}
                      onClick={() => !isOutOfStock && handleAddToCart(p)}
                      className={`group p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer relative ${
                        isOutOfStock
                          ? "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                          : inCart
                          ? "bg-rose-50/40 border-rose-300 ring-2 ring-rose-500/20"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="w-full h-28 rounded-xl bg-slate-100 mb-2 overflow-hidden flex items-center justify-center relative">
                        <img
                          src={p.thumbnail}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        {/* Stock badge */}
                        <div className="absolute top-1.5 right-1.5">
                          {p.stock <= 0 ? (
                            <span className="px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-bold">
                              Hết hàng
                            </span>
                          ) : p.stock < 5 ? (
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-bold">
                              Kho: {p.stock}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-600/90 text-white text-[9px] font-bold">
                              Kho: {p.stock}
                            </span>
                          )}
                        </div>

                        {inCart && (
                          <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black shadow-xs">
                            x{inCart.quantity}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">
                          {p.category?.name || "Công nghệ"}
                        </p>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug mt-0.5 group-hover:text-rose-600 transition-colors">
                          {p.name}
                        </h4>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs font-black text-rose-600">
                          {p.price.toLocaleString("vi-VN")} đ
                        </span>
                        <button
                          disabled={isOutOfStock}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Customer Info & In-Store Counter Cart (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Section 1: Customer Phone & Loyalty Lookup Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <UserIcon className="w-4 h-4 text-rose-600" />
                1. Thông Tin Khách Hàng Tại Quầy
              </h3>
              {customerInfo?.found && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Khách thân thiết
                </span>
              )}
            </div>

            {/* Phone Input with Instant Lookup */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Số Điện Thoại Khách Hàng <span className="text-rose-600">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="tel"
                    placeholder="VD: 0912345678 (Nhập để tra cứu/tích điểm)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLookupPhone()}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all text-slate-900"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <button
                  type="button"
                  onClick={() => handleLookupPhone()}
                  disabled={isLookingUpCustomer || !customerPhone.trim()}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 shrink-0"
                >
                  {isLookingUpCustomer ? "..." : "Tra cứu"}
                </button>
              </div>
            </div>

            {/* Customer Recognition Badge */}
            {customerInfo?.found ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {customerInfo.fullName?.charAt(0) || "K"}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">{customerInfo.fullName}</p>
                      <p className="text-[11px] text-emerald-800 font-medium">SĐT: {customerInfo.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      {customerInfo.loyaltyPoints?.toLocaleString("vi-VN")} điểm
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{customerInfo.totalOrders} đơn đã mua</p>
                  </div>
                </div>

                {customerInfo.recentOrders && customerInfo.recentOrders.length > 0 && (
                  <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Bảo hành gần nhất: <strong className="text-slate-900">{customerInfo.recentOrders[0].id}</strong></span>
                    <button
                      type="button"
                      onClick={() => setShowRecentOrdersModal(true)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold underline flex items-center gap-0.5"
                    >
                      <History className="w-3 h-3" />
                      Xem lịch sử
                    </button>
                  </div>
                )}
              </div>
            ) : customerPhone.length >= 9 && !isLookingUpCustomer ? (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <UserPlus className="w-4 h-4 text-amber-600" />
                  <span>Khách Hàng Vãng Lai Mới (Tạo nhanh hồ sơ tại quầy)</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Số điện thoại này chưa có trên hệ thống. Hệ thống sẽ <strong>tự động tạo hồ sơ khách hàng vãng lai</strong> để lưu lịch sử bảo hành và tích điểm sau khi hoàn tất đơn!
                </p>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Tên Khách Hàng (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Anh Minh, Chị Lan (hoặc để mặc định)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">
                * Nhập 10 số điện thoại để tra cứu điểm tích lũy và lịch sử bảo hành của khách.
              </p>
            )}
          </div>

          {/* Section 2: In-Store Counter Cart */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-rose-600" />
                2. Giỏ Hàng Tại Quầy ({cartItems.length} món)
              </h3>
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCartItems([])}
                  className="text-[11px] text-red-500 hover:text-red-700 font-bold transition-colors"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                Chưa có sản phẩm nào trong đơn hàng.
                <br />
                <span className="text-[11px] text-slate-400">Chọn sản phẩm bên trái để bắt đầu lập đơn!</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                        <p className="text-[11px] text-rose-600 font-black">
                          {item.product.price.toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.product.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-900 text-xs">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.product.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Phương Thức Thanh Toán Tại Quầy
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === "COD"
                      ? "bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white"
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Tiền mặt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("VNPAY")}
                  className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === "VNPAY"
                      ? "bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white"
                  }`}
                >
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span>QR VNPAY</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("MOMO")}
                  className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === "MOMO"
                      ? "bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white"
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-pink-600" />
                  <span>Ví MoMo</span>
                </button>
              </div>
            </div>

            {/* Discount / Loyalty Points Deduction */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Tiền hàng:</span>
                <span className="font-bold text-slate-900">{subtotal.toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Giảm giá / Chiết khấu tại quầy:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    placeholder="0"
                    value={discountAmount || ""}
                    onChange={(e) => setDiscountAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 px-2 py-1 text-right border border-slate-200 rounded-lg text-xs font-bold text-rose-600 focus:outline-none focus:border-rose-500"
                  />
                  <span>đ</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Phí nhận hàng tại quầy:</span>
                <span className="font-bold text-emerald-600">0 đ (Miễn phí)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm font-black text-slate-900">TỔNG THANH TOÁN:</span>
                <span className="text-lg font-black text-rose-600">
                  {finalTotal.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            {/* Consultant Note */}
            <div>
              <input
                type="text"
                placeholder="Ghi chú đơn hàng (mã bảo hành, phụ kiện tặng kèm...)"
                value={consultantNote}
                onChange={(e) => setConsultantNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-rose-500 text-slate-800"
              />
            </div>

            {/* Action CTA Button */}
            <button
              type="button"
              onClick={handleCreatePosOrder}
              disabled={isSubmittingOrder || cartItems.length === 0}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmittingOrder ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Đang xử lý xuất đơn...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>XUẤT ĐƠN & KÍCH HOẠT BẢO HÀNH</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Printable Retail Receipt & Electronic Warranty Slip */}
      {showReceiptModal && completedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-600 to-rose-700 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md shadow-rose-600/30 mb-2">
                🐝
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-wider">TPKSTORE / SHOPBEE AI</h2>
              <p className="text-[11px] text-slate-500 font-medium">HÓA ĐƠN BÁN LẺ & PHIẾU BẢO HÀNH ĐIỆN TỬ</p>
              <p className="text-[10px] text-slate-400">Tòa nhà Keangnam Landmark 72, Hà Nội • Hotline: 1900 6868</p>
            </div>

            {/* Order Metadata */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div>
                <p className="text-slate-400 text-[10px]">MÃ ĐƠN HÀNG:</p>
                <p className="font-extrabold text-slate-900">{completedOrder.id}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">THỜI GIAN LẬP:</p>
                <p className="font-semibold text-slate-900">{new Date(completedOrder.createdAt).toLocaleString("vi-VN")}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">KHÁCH HÀNG (SĐT BẢO HÀNH):</p>
                <p className="font-black text-rose-600">{completedOrder.customerName} ({completedOrder.phone})</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">TƯ VẤN VIÊN:</p>
                <p className="font-semibold text-slate-900">{warrantySlip?.consultant || user?.fullName}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2 text-xs">
              <div className="flex font-bold text-slate-400 uppercase text-[10px] border-b pb-1">
                <span className="flex-1">Sản Phẩm</span>
                <span className="w-12 text-center">SL</span>
                <span className="w-24 text-right">Thành Tiền</span>
              </div>
              {completedOrder.items?.map((it: any) => (
                <div key={it.id} className="flex items-center text-slate-800 py-1 border-b border-slate-100">
                  <span className="flex-1 font-semibold pr-2">{it.product?.name || "Sản phẩm công nghệ"}</span>
                  <span className="w-12 text-center font-bold">x{it.quantity}</span>
                  <span className="w-24 text-right font-black text-slate-900">
                    {(it.price * it.quantity).toLocaleString("vi-VN")} đ
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 text-xs pt-2 border-t border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Tổng tiền hàng:</span>
                <span>{completedOrder.totalAmount?.toLocaleString("vi-VN")} đ</span>
              </div>
              {completedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Chiết khấu tại quầy:</span>
                  <span>-{completedOrder.discountAmount?.toLocaleString("vi-VN")} đ</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t">
                <span>TỔNG ĐÃ THANH TOÁN ({completedOrder.paymentMethod}):</span>
                <span className="text-rose-600">{completedOrder.finalAmount?.toLocaleString("vi-VN")} đ</span>
              </div>
            </div>

            {/* Warranty & Loyalty Points Notification */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>CHÍNH SÁCH BẢO HÀNH ĐIỆN TỬ</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                • Bảo hành chính hãng 12 - 24 tháng kích hoạt tự động theo SĐT <strong>{completedOrder.phone}</strong>.
                <br />
                • Khách hàng được cộng <strong>+{warrantySlip?.loyaltyPointsEarned || Math.floor(completedOrder.finalAmount / 10000)} điểm tích lũy</strong> vào hồ sơ khách hàng.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                In Hóa Đơn / Phiếu Bảo Hành
              </button>
              <button
                type="button"
                onClick={handleResetForNextCustomer}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors flex items-center justify-center gap-2 shadow-md shadow-rose-600/30"
              >
                <span>Tạo Đơn Cho Khách Tiếp Theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Recent Orders & Warranty History of Customer */}
      {showRecentOrdersModal && customerInfo && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Lịch Sử Mua Hàng & Bảo Hành</h3>
                <p className="text-xs text-slate-500">Khách hàng: {customerInfo.fullName} • {customerInfo.phone}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowRecentOrdersModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {customerInfo.recentOrders?.map((ord: any) => (
                <div key={ord.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900">{ord.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Ngày mua: {new Date(ord.createdAt).toLocaleDateString("vi-VN")} • Tổng tiền: {ord.finalAmount?.toLocaleString("vi-VN")} đ
                  </p>
                  <div className="space-y-1 pt-1 border-t border-slate-200/60">
                    {ord.items?.map((it: any) => (
                      <div key={it.id} className="flex justify-between text-[11px] text-slate-700">
                        <span>• {it.product?.name}</span>
                        <span className="font-bold">x{it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowRecentOrdersModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: Staff AI Sales Copilot (Trợ lý AI tư vấn chốt đơn cho nhân viên) */}
      {showAiAdvisorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Trợ Lý AI Đồng Hành Tư Vấn Khách Hàng
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-black uppercase">
                      Sales Copilot
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Gợi ý cấu hình máy, kịch bản tư vấn theo tầm tiền, so sánh đối đầu & kiểm tra tồn kho
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiAdvisorModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Consultation Presets */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>Nhu cầu khách hàng ghé quầy phổ biến:</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Điện thoại chụp ảnh đẹp & pin trâu 15-20tr",
                  "So sánh Galaxy Z Fold6 vs iPhone 16 Pro Max",
                  "Laptop mỏng nhẹ văn phòng & đồ họa dưới 25tr",
                  "Chính sách bảo hành 1 đổi 1 & kích hoạt qua SĐT",
                  "Gợi ý phụ kiện sạc nhanh & tai nghe mua kèm"
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleConsultAi(preset)}
                    className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-semibold border border-purple-200/70 transition-all text-left flex items-center gap-1"
                  >
                    <span>💬</span>
                    <span>{preset}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập nhu cầu hoặc băn khoăn của khách ghé showroom..."
                value={aiAdvisorQuery}
                onChange={(e) => setAiAdvisorQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConsultAi();
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <button
                type="button"
                disabled={isAiAdvising || !aiAdvisorQuery.trim()}
                onClick={() => handleConsultAi()}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-1.5 transition-all"
              >
                {isAiAdvising ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Tư Vấn</span>
              </button>
            </div>

            {/* AI Result Area */}
            {isAiAdvising && (
              <div className="p-8 text-center space-y-3 bg-purple-50/50 rounded-2xl border border-purple-100">
                <RefreshCw className="w-7 h-7 text-purple-600 animate-spin mx-auto" />
                <p className="text-xs font-bold text-purple-900">AI Copilot đang phân tích kho hàng & soạn kịch bản tư vấn...</p>
                <p className="text-[11px] text-purple-600">Đang chọn lọc các dòng máy còn hàng tại showroom TPKSTORE</p>
              </div>
            )}

            {aiAdvisorResult && !isAiAdvising && (
              <div className="space-y-4 pt-1">
                {/* Sales Talk Script */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                    <span>Kịch bản gợi ý nhân viên nói với khách:</span>
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pl-1 border-l-2 border-purple-400">
                    {aiAdvisorResult.reply}
                  </div>
                </div>

                {/* Suggested In-Stock Products */}
                {aiAdvisorResult.suggestedProducts && aiAdvisorResult.suggestedProducts.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>Sản phẩm phù hợp có sẵn trong kho:</span>
                      <span className="text-[11px] text-slate-500 font-normal">Bấm "Thêm vào đơn" để chốt nhanh</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {aiAdvisorResult.suggestedProducts.map((p) => {
                        const isAdded = addedProductToast === p.name;
                        return (
                          <div 
                            key={p.id}
                            className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 transition-all flex flex-col justify-between gap-2 shadow-xs"
                          >
                            <div className="flex gap-2.5 items-center">
                              <img 
                                src={p.thumbnail || p.images?.[0] || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80"}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-100 shrink-0 p-1"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-slate-900 truncate" title={p.name}>
                                  {p.name}
                                </h4>
                                <p className="text-xs font-black text-rose-600 mt-0.5">
                                  {p.price.toLocaleString("vi-VN")} đ
                                </p>
                                <span className={`text-[10px] font-bold ${p.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                                  {p.stock > 0 ? `Còn ${p.stock} máy tại kho` : "Hết hàng"}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={p.stock <= 0}
                              onClick={() => {
                                handleAddToCart(p);
                                setAddedProductToast(p.name);
                                setTimeout(() => setAddedProductToast(null), 2500);
                              }}
                              className={`w-full py-1.5 px-3 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 ${
                                isAdded 
                                  ? "bg-emerald-600 text-white"
                                  : "bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 border border-purple-200"
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Đã thêm vào giỏ quầy!</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Thêm Vào Đơn Quầy</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAiAdvisorModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Đóng Cửa Sổ Tư Vấn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

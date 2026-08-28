import React from "react";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2 
} from "lucide-react";
import { useCart } from "../context/CartContext";

interface CartViewProps {
  onNavigateCatalog: () => void;
  onProceedToCheckout: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  onNavigateCatalog,
  onProceedToCheckout
}) => {
  const { 
    items, 
    itemCount, 
    subtotal, 
    shippingFee, 
    isFreeShipping, 
    freeShippingThreshold, 
    total, 
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCart();

  const remainingForFreeShip = Math.max(0, freeShippingThreshold - subtotal);
  const freeShipProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10 text-violet-400" />
        </div>
        <h2 className="text-2xl font-black text-white">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Hãy khám phá các thiết bị công nghệ và tiện ích AI hàng đầu tại SHOPBEE để thêm vào giỏ hàng.
        </p>
        <button
          onClick={onNavigateCatalog}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Khám phá sản phẩm ngay</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Giỏ Hàng Của Bạn</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Bạn đang có <span className="text-violet-400 font-bold">{itemCount}</span> sản phẩm trong giỏ hàng
          </p>
        </div>

        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold self-start transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Xóa tất cả</span>
        </button>
      </div>

      {/* Free Shipping Progress Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#12192e] to-[#1a1c3b] border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-slate-300">
            {isFreeShipping ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Bạn đã đủ điều kiện MIỄN PHÍ VẬN CHUYỂN!
              </span>
            ) : (
              <span>
                Mua thêm <span className="text-amber-400 font-bold">{remainingForFreeShip.toLocaleString("vi-VN")} đ</span> để được <strong className="text-emerald-400">Free Ship</strong>
              </span>
            )}
          </span>
          <span className="text-slate-400">{freeShipProgress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${freeShipProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const prod = item.product;
            if (!prod) return null;
            const itemTotal = prod.price * item.quantity;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-[#131c2e]/80 border border-slate-800 gap-4"
              >
                {/* Product thumbnail & title */}
                <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                  <img
                    src={prod.thumbnail}
                    alt={prod.name}
                    className="w-20 h-20 object-cover rounded-xl bg-slate-900 border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                      {prod.category?.name || "CÔNG NGHỆ"}
                    </span>
                    <h3 className="font-semibold text-white text-xs sm:text-sm line-clamp-1 mt-0.5">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Đơn giá: <span className="text-white font-bold">{prod.price.toLocaleString("vi-VN")} đ</span>
                    </p>
                  </div>
                </div>

                {/* Quantity steppers + Item Total + Delete */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-700 rounded-xl bg-[#0c121e] overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 px-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 px-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="font-black text-white text-sm whitespace-nowrap min-w-[90px] text-right">
                    {itemTotal.toLocaleString("vi-VN")} <span className="text-xs text-violet-400 font-bold">đ</span>
                  </p>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Continue shopping link */}
          <button
            onClick={onNavigateCatalog}
            className="inline-flex items-center gap-2 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tiếp tục mua sắm sản phẩm khác</span>
          </button>
        </div>

        {/* Right Column: Order Summary (Matching Screenshot) */}
        <div className="lg:col-span-4">
          <div className="p-6 rounded-3xl bg-[#131c2e] border border-slate-800 space-y-5 sticky top-24 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Tóm Tắt Đơn Hàng
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Tạm tính ({itemCount} sản phẩm):</span>
                <span className="font-bold text-white">{subtotal.toLocaleString("vi-VN")} đ</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Phí vận chuyển:</span>
                <span className={`font-semibold ${isFreeShipping ? "text-emerald-400" : "text-white"}`}>
                  {isFreeShipping ? "Miễn phí (Đơn > 500k)" : `${shippingFee.toLocaleString("vi-VN")} đ`}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Giảm giá khuyến mãi:</span>
                <span className="text-slate-400">-0đ</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-baseline justify-between">
              <span className="text-sm font-bold text-white">Tổng thanh toán:</span>
              <span className="text-xl font-black text-violet-400">
                {total.toLocaleString("vi-VN")} đ
              </span>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] active:scale-98"
            >
              <span>Tiến Hành Thanh Toán</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="space-y-1.5 pt-2 text-[10px] text-slate-400 text-center">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Bảo mật thanh toán SSL 256-bit
              </p>
              <p>✓ Hỗ trợ Ví MoMo QR & Thanh toán COD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

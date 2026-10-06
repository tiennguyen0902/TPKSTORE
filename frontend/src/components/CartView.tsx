import React, { useState } from "react";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck 
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
    total, 
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCart();

  const [inputQuantities, setInputQuantities] = useState<Record<string, string>>({});

  const handleCommitQuantity = (itemId: string, maxStock?: number) => {
    const rawVal = inputQuantities[itemId];
    if (rawVal === undefined) return;

    let parsed = parseInt(rawVal, 10);
    if (isNaN(parsed) || parsed < 1) {
      parsed = 1;
    }
    if (maxStock !== undefined && maxStock > 0 && parsed > maxStock) {
      alert(`Số lượng tồn kho chỉ còn tối đa ${maxStock} sản phẩm.`);
      parsed = maxStock;
    }
    updateQuantity(itemId, parsed);
    setInputQuantities(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const handleStepQuantity = (itemId: string, currentQty: number, delta: number, maxStock?: number) => {
    const rawVal = inputQuantities[itemId];
    const base = rawVal !== undefined ? (parseInt(rawVal, 10) || currentQty) : currentQty;
    const nextQty = base + delta;

    if (nextQty < 1) {
      if (window.confirm("Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?")) {
        removeItem(itemId);
      }
      return;
    }

    if (maxStock !== undefined && maxStock > 0 && nextQty > maxStock) {
      alert(`Số lượng trong kho chỉ còn tối đa ${maxStock} sản phẩm.`);
      return;
    }

    setInputQuantities(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    updateQuantity(itemId, nextQty);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
          Hãy khám phá các thiết bị công nghệ và tiện ích AI hàng đầu tại SHOPBEE để thêm vào giỏ hàng.
        </p>
        <button
          onClick={onNavigateCatalog}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Giỏ Hàng Của Bạn</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bạn đang có <span className="text-rose-600 font-bold">{itemCount}</span> sản phẩm trong giỏ hàng
          </p>
        </div>

        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold self-start transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Xóa tất cả</span>
        </button>
      </div>

      {/* Main Grid: Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const prod = item.product;
            if (!prod) return null;
            const itemTotal = prod.price * item.quantity;
            const prodStock = typeof prod.stock === "number" ? prod.stock : (parseInt(String(prod.stock)) || 999);

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Product thumbnail & title */}
                <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                  <img
                    src={prod.thumbnail}
                    alt={prod.name}
                    className="w-20 h-20 object-cover rounded-xl bg-slate-50 border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                      {prod.category?.name || "CÔNG NGHỆ"}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 mt-0.5">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Đơn giá: <span className="text-slate-800 font-bold">{prod.price.toLocaleString("vi-VN")} đ</span>
                    </p>
                  </div>
                </div>

                {/* Quantity steppers + Item Total + Delete */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-5 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  {/* Quantity Stepper with Editable Input & Plus/Minus */}
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden shadow-2xs hover:border-slate-400 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
                    <button
                      type="button"
                      onClick={() => handleStepQuantity(item.id, item.quantity, -1, prodStock)}
                      title="Giảm số lượng (-)"
                      className="p-1.5 px-2.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer select-none"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      aria-label="Số lượng sản phẩm"
                      value={inputQuantities[item.id] !== undefined ? inputQuantities[item.id] : item.quantity}
                      onChange={(e) => {
                        const sanitized = e.target.value.replace(/[^0-9]/g, "");
                        setInputQuantities(prev => ({ ...prev, [item.id]: sanitized }));
                      }}
                      onBlur={() => handleCommitQuantity(item.id, prodStock)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      onFocus={(e) => e.target.select()}
                      className="w-10 text-center text-xs font-bold text-slate-900 bg-white border-x border-slate-200 py-1 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleStepQuantity(item.id, item.quantity, 1, prodStock)}
                      title="Tăng số lượng (+)"
                      className="p-1.5 px-2.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer select-none"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="font-black text-rose-600 text-sm whitespace-nowrap min-w-[90px] text-right">
                    {itemTotal.toLocaleString("vi-VN")} <span className="text-xs font-bold">đ</span>
                  </p>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-rose-50 transition-colors"
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
            className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tiếp tục mua sắm sản phẩm khác</span>
          </button>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 sticky top-24 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Tóm Tắt Đơn Hàng
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600 font-medium">
                <span>Tạm tính ({itemCount} sản phẩm):</span>
                <span className="font-bold text-slate-900">{subtotal.toLocaleString("vi-VN")} đ</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 font-medium">
                <span>Phí vận chuyển:</span>
                <span className={`font-semibold ${isFreeShipping ? "text-emerald-600" : "text-slate-900"}`}>
                  {isFreeShipping ? "Miễn phí (Đơn > 500k)" : `${shippingFee.toLocaleString("vi-VN")} đ`}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 font-medium">
                <span>Giảm giá khuyến mãi:</span>
                <span className="text-slate-400">-0đ</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
              <span className="text-xl font-black text-rose-600">
                {total.toLocaleString("vi-VN")} đ
              </span>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-98"
            >
              <span>Tiến Hành Thanh Toán</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="space-y-1.5 pt-2 text-[10px] text-slate-500 text-center font-medium">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Bảo mật thanh toán SSL 256-bit
              </p>
              <p>✓ Hỗ trợ Ví MoMo QR & Thanh toán COD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

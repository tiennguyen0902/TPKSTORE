import React, { useState } from "react";
import { 
  CheckCircle2, 
  Package, 
  ShoppingBag, 
  Copy, 
  Check, 
  MapPin, 
  Phone, 
  User, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Sparkles, 
  X,
  Truck
} from "lucide-react";

export interface OrderSuccessData {
  id: string;
  customerName?: string;
  phone?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  totalAmount?: number;
  finalAmount?: number;
  shippingFee?: number;
  discountAmount?: number;
  items?: Array<{
    productId?: string;
    productName?: string;
    productThumbnail?: string;
    quantity: number;
    price?: number;
    product?: {
      name?: string;
      thumbnail?: string;
      price?: number;
    };
  }>;
}

interface OrderSuccessModalProps {
  isOpen: boolean;
  orderData: OrderSuccessData | null;
  onClose: () => void;
  onViewOrders: () => void;
  onContinueShopping: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  orderData,
  onClose,
  onViewOrders,
  onContinueShopping
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !orderData) return null;

  const orderId = orderData.id;
  const finalAmount = orderData.finalAmount ?? orderData.totalAmount ?? 0;
  const paymentMethod = orderData.paymentMethod || "COD";
  const items = orderData.items || [];

  const handleCopyOrderId = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(() => {});
  };

  const getPaymentName = (method: string) => {
    switch (method) {
      case "VNPAY":
        return "Cổng thanh toán VNPAY";
      case "MOMO":
        return "Ví điện tử MoMo";
      default:
        return "Thanh toán khi nhận hàng (COD)";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Celebration Banner */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 text-center overflow-hidden shrink-0">
          {/* Background decorative circles */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-400/20 rounded-full blur-lg pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Success Icon */}
          <div className="relative inline-flex items-center justify-center mb-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-950/20 animate-bounce duration-1000">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
            </div>
            <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow-md animate-spin duration-3000">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>Đặt Hàng Thành Công!</span>
            <span className="text-xl">🎉</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-50 mt-1 max-w-md mx-auto leading-relaxed font-medium">
            Cảm ơn bạn đã mua sắm tại <strong>SHOPBEE TPKSTORE</strong>. Đơn hàng của bạn đã được ghi nhận vào hệ thống và đang được xử lý đóng gói!
          </p>

          {/* Order ID Pill with Copy button */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold">
            <span className="text-emerald-100">Mã đơn hàng:</span>
            <strong className="text-white font-mono tracking-wider">{orderId}</strong>
            <button
              onClick={handleCopyOrderId}
              className="p-1 rounded-md hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-[11px]"
              title="Sao chép mã đơn"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-amber-300" />
                  <span className="text-amber-300 text-[10px]">Đã chép</span>
                </>
              ) : (
                <Copy className="w-3 h-3 text-white/80" />
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Order Details Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Fast Delivery & Warranty Promise */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-emerald-950 text-[11px]">Giao Siêu Tốc 2 Giờ</p>
                <p className="text-[10px] text-emerald-800 font-medium mt-0.5">
                  Đơn hàng được chuẩn bị & bàn giao đơn vị vận chuyển ngay trong ngày.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-700 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-blue-950 text-[11px]">Bảo Hành Điện Tử 12-24T</p>
                <p className="text-[10px] text-blue-800 font-medium mt-0.5">
                  Tự động kích hoạt theo số điện thoại: <strong>{orderData.phone || "Số đặt hàng"}</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Information */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <p className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>Thông tin nhận hàng</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500">Người nhận:</span>
                <strong className="text-slate-900">{orderData.customerName || "Khách hàng"}</strong>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500">Số điện thoại:</span>
                <strong className="text-slate-900 font-mono">{orderData.phone || "---"}</strong>
              </div>

              <div className="sm:col-span-2 flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-500 shrink-0">Địa chỉ:</span>
                <span className="text-slate-900 font-medium">{orderData.shippingAddress || "Mua tại showroom"}</span>
              </div>

              <div className="sm:col-span-2 flex items-center gap-2 pt-1 border-t border-slate-200">
                <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500">Thanh toán:</span>
                <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 font-bold text-[10px]">
                  {getPaymentName(paymentMethod)}
                </span>
                <span className="ml-auto text-emerald-700 font-bold text-[10px] bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Đã tiếp nhận
                </span>
              </div>
            </div>
          </div>

          {/* Products Summary (if items present) */}
          {items.length > 0 && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
              <p className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Sản phẩm đã mua ({items.length})</span>
                <span className="text-[11px] text-slate-500 font-normal">Đóng gói an toàn</span>
              </p>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1 divide-y divide-slate-100">
                {items.map((item, idx) => {
                  const name = item.product?.name || item.productName || `Sản phẩm #${idx + 1}`;
                  const thumb = item.product?.thumbnail || item.productThumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop&q=80";
                  const price = item.product?.price ?? item.price ?? 0;

                  return (
                    <div key={idx} className="flex items-center gap-3 pt-2 first:pt-0">
                      <img
                        src={thumb}
                        alt={name}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-50 border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 line-clamp-1 text-[11px]">{name}</p>
                        <p className="text-[10px] text-slate-500">Số lượng: x{item.quantity}</p>
                      </div>
                      <span className="font-black text-slate-900 text-xs shrink-0">
                        {(price * item.quantity).toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Total Calculation */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">Tổng thanh toán:</span>
                <span className="text-base font-black text-rose-600">
                  {finalAmount.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-2.5 shrink-0">
          <button
            onClick={onContinueShopping}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2 order-2 sm:order-1"
          >
            <ShoppingBag className="w-4 h-4 text-slate-500" />
            <span>Tiếp Tục Mua Sắm</span>
          </button>

          <button
            onClick={onViewOrders}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <Package className="w-4 h-4" />
            <span>Theo Dõi Đơn Hàng Của Tôi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

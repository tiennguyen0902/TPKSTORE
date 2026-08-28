import React, { useState } from "react";
import { 
  ArrowLeft, 
  CreditCard, 
  Banknote, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  FileText, 
  ShieldCheck, 
  AlertCircle 
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { VnpayModal } from "./VnpayModal";

interface CheckoutViewProps {
  onBackToCart: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onBackToCart,
  onOrderSuccess
}) => {
  const { items, subtotal, shippingFee, isFreeShipping, total, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.fullName || "Lê Hoàng Nam");
  const [phone, setPhone] = useState(user?.phone || "0912345678");
  const [shippingAddress, setShippingAddress] = useState("Số 45 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội");
  const [note, setNote] = useState("Giao hàng giờ hành chính");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY">("COD");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // VNPAY Modal state
  const [showVnpayModal, setShowVnpayModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string>("");

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !shippingAddress) {
      setErrorMsg("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await api.createOrder({
        customerName,
        phone,
        shippingAddress,
        note,
        paymentMethod,
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      });

      const orderId = res.order.id;

      if (paymentMethod === "VNPAY") {
        setPendingOrderId(orderId);
        setShowVnpayModal(true);
      } else {
        await clearCart();
        onOrderSuccess(orderId);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVnpaySuccess = async () => {
    try {
      await api.confirmVnpayIpn(pendingOrderId, "00");
    } catch (err) {
      console.warn("IPN confirm error:", err);
    }
    await clearCart();
    setShowVnpayModal(false);
    onOrderSuccess(pendingOrderId);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <button
          onClick={onBackToCart}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white">Thanh Toán & Đặt Hàng</h1>
          <p className="text-xs text-slate-400">Vui lòng kiểm tra thông tin giao hàng và chọn phương thức thanh toán</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Info & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer Info */}
          <div className="p-6 rounded-3xl bg-[#131c2e] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-violet-400" />
              1. Thông Tin Nhận Hàng
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Họ và tên người nhận *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-white focus:outline-none focus:border-violet-500"
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Số điện thoại liên hệ *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-white focus:outline-none focus:border-violet-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Địa chỉ chi tiết (Số nhà, Tòa nhà, Phường/Xã, Tỉnh/TP) *</label>
                <textarea
                  required
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Số 45 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội"
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-violet-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Ghi chú đơn hàng (Tùy chọn)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Giao trong giờ hành chính, gọi trước khi tới..."
                    className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-white focus:outline-none focus:border-violet-500"
                  />
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="p-6 rounded-3xl bg-[#131c2e] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              2. Phương Thức Thanh Toán
            </h3>

            <div className="space-y-3 text-xs">
              {/* Option 1: COD */}
              <label
                onClick={() => setPaymentMethod("COD")}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "bg-violet-600/15 border-violet-500 shadow-sm"
                    : "bg-[#18233a] border-slate-700 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => {}}
                    className="accent-violet-600"
                  />
                  <div>
                    <p className="font-bold text-white flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-400" />
                      Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Kiểm tra hàng và thanh toán tiền mặt cho shipper khi giao tới
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  Tiện lợi
                </span>
              </label>

              {/* Option 2: VNPAY Sandbox */}
              <label
                onClick={() => setPaymentMethod("VNPAY")}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "VNPAY"
                    ? "bg-violet-600/15 border-violet-500 shadow-sm"
                    : "bg-[#18233a] border-slate-700 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "VNPAY"}
                    onChange={() => {}}
                    className="accent-violet-600"
                  />
                  <div>
                    <p className="font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      Cổng thanh toán VNPAY Sandbox
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Hỗ trợ quét mã VNPAY-QR, Thẻ ATM nội địa, Thẻ quốc tế Visa/Mastercard
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                  Khuyên dùng
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Confirmation */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-[#131c2e] border border-slate-800 space-y-5 sticky top-24 shadow-xl text-xs">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Chi Tiết Đơn Hàng ({items.length} mặt hàng)
            </h3>

            {/* Items list */}
            <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
              {items.map((i) => (
                <div key={i.id} className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#18233a]">
                  <img src={i.product?.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate text-[11px]">{i.product?.name}</p>
                    <p className="text-[10px] text-slate-400">SL: {i.quantity} x {i.product?.price.toLocaleString("vi-VN")} đ</p>
                  </div>
                  <span className="font-bold text-white text-xs">
                    {((i.product?.price || 0) * i.quantity).toLocaleString("vi-VN")} đ
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>Tạm tính tiền hàng:</span>
                <span className="font-bold text-white">{subtotal.toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Phí giao hàng:</span>
                <span className={`font-semibold ${isFreeShipping ? "text-emerald-400" : "text-white"}`}>
                  {isFreeShipping ? "Miễn phí (Free Ship)" : `${shippingFee.toLocaleString("vi-VN")} đ`}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Giảm giá:</span>
                <span className="text-slate-400">-0đ</span>
              </div>
            </div>

            {/* Final Total */}
            <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
              <span className="text-sm font-bold text-white">Tổng cộng:</span>
              <span className="text-xl font-black text-violet-400">
                {total.toLocaleString("vi-VN")} đ
              </span>
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={isLoading || items.length === 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white font-black text-sm shadow-xl shadow-violet-600/30 transition-all hover:scale-[1.02] active:scale-98"
            >
              {isLoading ? "Đang xử lý đơn hàng..." : paymentMethod === "VNPAY" ? "Thanh Toán Qua VNPAY" : "Xác Nhận Đặt Hàng"}
            </button>

            <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Bằng việc đặt hàng, bạn đồng ý với các điều khoản mua sắm của SHOPBEE.
            </p>
          </div>
        </div>
      </form>

      {/* VNPAY Sandbox Simulator Modal */}
      {showVnpayModal && (
        <VnpayModal
          orderId={pendingOrderId}
          amount={total}
          onSuccess={handleVnpaySuccess}
          onCancel={() => setShowVnpayModal(false)}
        />
      )}
    </div>
  );
};

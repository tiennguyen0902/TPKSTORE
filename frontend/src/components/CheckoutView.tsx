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
import { MomoModal } from "./MomoModal";

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
  const [shippingAddress, setShippingAddress] = useState(user?.address || "Số 45 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội");
  const [note, setNote] = useState("Giao hàng giờ hành chính");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY" | "MOMO">("COD");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  React.useEffect(() => {
    if (user) {
      if (user.fullName) setCustomerName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.address) setShippingAddress(user.address);
    }
  }, [user]);

  // Payment Modals state
  const [showVnpayModal, setShowVnpayModal] = useState(false);
  const [showMomoModal, setShowMomoModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string>("");

  // Field validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const isValidPhone = (val: string) => {
    return /^(0[3|5|7|8|9])[0-9]{8}$/.test(val.trim());
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const errors: Record<string, string> = {};
    if (!customerName.trim()) {
      errors.customerName = "Vui lòng nhập họ và tên người nhận hàng.";
    }

    if (!phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại người nhận hàng.";
    } else if (!isValidPhone(phone)) {
      errors.phone = "Số điện thoại không hợp lệ (phải gồm 10 chữ số, VD: 0912345678).";
    }

    if (!shippingAddress.trim()) {
      errors.shippingAddress = "Vui lòng nhập địa chỉ giao hàng chi tiết (số nhà, đường, phường/xã...).";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsLoading(true);

    try {
      const res = await api.createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        shippingAddress: shippingAddress.trim(),
        note: note.trim(),
        paymentMethod,
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      });

      const orderId = res.order.id;

      if (paymentMethod === "VNPAY") {
        setPendingOrderId(orderId);
        setShowVnpayModal(true);
      } else if (paymentMethod === "MOMO") {
        setPendingOrderId(orderId);
        setShowMomoModal(true);
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

  const handleMomoSuccess = async () => {
    await clearCart();
    setShowMomoModal(false);
    onOrderSuccess(pendingOrderId);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={onBackToCart}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Thanh Toán & Đặt Hàng</h1>
          <p className="text-xs text-slate-500 font-medium">Vui lòng kiểm tra thông tin giao hàng và chọn phương thức thanh toán</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form noValidate onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Info & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer Info */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              1. Thông Tin Nhận Hàng
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Họ và tên người nhận <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => { setCustomerName(e.target.value); clearFieldError("customerName"); }}
                    placeholder="Nguyễn Văn A"
                    className={`w-full bg-white border rounded-xl px-3 py-2.5 pl-9 text-slate-900 focus:outline-none transition-colors ${
                      fieldErrors.customerName 
                        ? "border-rose-500 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/10" 
                        : "border-slate-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    }`}
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                {fieldErrors.customerName && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.customerName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Số điện thoại liên hệ <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); clearFieldError("phone"); }}
                    placeholder="0912345678"
                    className={`w-full bg-white border rounded-xl px-3 py-2.5 pl-9 text-slate-900 focus:outline-none transition-colors ${
                      fieldErrors.phone 
                        ? "border-rose-500 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/10" 
                        : "border-slate-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    }`}
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.phone}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Địa chỉ chi tiết (Số nhà, Tòa nhà, Phường/Xã, Tỉnh/TP) <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => { setShippingAddress(e.target.value); clearFieldError("shippingAddress"); }}
                  placeholder="Số 45 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội"
                  className={`w-full bg-white border rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none leading-relaxed transition-colors ${
                    fieldErrors.shippingAddress 
                      ? "border-rose-500 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/10" 
                      : "border-slate-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  }`}
                />
                {fieldErrors.shippingAddress && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.shippingAddress}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú đơn hàng (Tùy chọn)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Giao trong giờ hành chính, gọi trước khi tới..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 pl-9 text-slate-900 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  />
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              2. Phương Thức Thanh Toán
            </h3>

            <div className="space-y-3 text-xs">
              {/* Option 1: COD */}
              <label
                onClick={() => setPaymentMethod("COD")}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "bg-rose-50/80 border-rose-500 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => {}}
                    className="accent-rose-600"
                  />
                  <div>
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kiểm tra hàng và thanh toán tiền mặt cho shipper khi giao tới
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 2: VNPAY Sandbox */}
              <label
                onClick={() => setPaymentMethod("VNPAY")}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "VNPAY"
                    ? "bg-blue-50/80 border-blue-500 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "VNPAY"}
                    onChange={() => {}}
                    className="accent-blue-600"
                  />
                  <div>
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      Cổng thanh toán VNPAY Sandbox
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Hỗ trợ quét mã VNPAY-QR, Thẻ ATM nội địa, Thẻ quốc tế Visa/Mastercard
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 3: MoMo Sandbox (Gateway v2) */}
              <label
                onClick={() => setPaymentMethod("MOMO")}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "MOMO"
                    ? "bg-pink-50/80 border-pink-500 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "MOMO"}
                    onChange={() => {}}
                    className="accent-pink-600"
                  />
                  <div>
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[#a50064] text-white flex items-center justify-center font-black text-[7px]">
                        MM
                      </span>
                      Ví Điện Tử MoMo Sandbox (Gateway v2)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Quét mã MoMo QR hoặc mở trực tiếp Cổng thanh toán MoMo Sandbox
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Confirmation */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 sticky top-24 shadow-xl text-xs">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Chi Tiết Đơn Hàng ({items.length} mặt hàng)
            </h3>

            {/* Items list */}
            <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
              {items.map((i) => (
                <div key={i.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <img src={i.product?.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate text-[11px]">{i.product?.name}</p>
                    <p className="text-[10px] text-slate-500">SL: {i.quantity} x {i.product?.price.toLocaleString("vi-VN")} đ</p>
                  </div>
                  <span className="font-black text-rose-600 text-xs">
                    {((i.product?.price || 0) * i.quantity).toLocaleString("vi-VN")} đ
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Tạm tính tiền hàng:</span>
                <span className="font-bold text-slate-900">{subtotal.toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Phí giao hàng:</span>
                <span className={`font-semibold ${isFreeShipping ? "text-emerald-600" : "text-slate-900"}`}>
                  {isFreeShipping ? "Miễn phí (Free Ship)" : `${shippingFee.toLocaleString("vi-VN")} đ`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Giảm giá:</span>
                <span className="text-slate-400">-0đ</span>
              </div>
            </div>

            {/* Final Total */}
            <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-sm font-bold text-slate-900">Tổng cộng:</span>
              <span className="text-xl font-black text-rose-600">
                {total.toLocaleString("vi-VN")} đ
              </span>
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={isLoading || items.length === 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-40 text-white font-black text-sm shadow-xl shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-98"
            >
              {isLoading 
                ? "Đang xử lý đơn hàng..." 
                : paymentMethod === "MOMO"
                ? "Thanh Toán Qua Ví MoMo"
                : paymentMethod === "VNPAY" 
                ? "Thanh Toán Qua VNPAY" 
                : "Xác Nhận Đặt Hàng"}
            </button>

            <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Bằng việc đặt hàng, bạn đồng ý với các điều khoản mua sắm của SHOPBEE.
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

      {/* MoMo Gateway v2 Simulator Modal */}
      {showMomoModal && (
        <MomoModal
          orderId={pendingOrderId}
          amount={total}
          onSuccess={handleMomoSuccess}
          onCancel={() => setShowMomoModal(false)}
        />
      )}
    </div>
  );
};

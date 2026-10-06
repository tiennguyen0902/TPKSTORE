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
  AlertCircle,
  Store,
  Search,
  Award,
  CheckCircle2,
  UserPlus
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
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
  const { showToast } = useToast();

  const isStaff = user?.role === "STAFF" || user?.role === "ADMIN";
  const [isCounterMode, setIsCounterMode] = useState(isStaff);

  const [customerName, setCustomerName] = useState(isStaff ? "Khách lẻ" : (user?.fullName || "Lê Hoàng Nam"));
  const [phone, setPhone] = useState(isStaff ? "" : (user?.phone || "0912345678"));
  const [shippingAddress, setShippingAddress] = useState(isStaff ? "Mua trực tiếp tại quầy - TPKSTORE" : (user?.address || "Số 45 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội"));
  const [note, setNote] = useState("Giao hàng giờ hành chính");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY" | "MOMO">("COD");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Customer Lookup state for Staff POS
  const [lookupCustomerInfo, setLookupCustomerInfo] = useState<any>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const handleLookupPhone = async (lookupVal?: string) => {
    const raw = (lookupVal || phone).trim();
    if (!raw || raw.length < 8) return;
    setIsLookingUp(true);
    try {
      const res = await api.lookupCustomer(raw);
      if (res.found && res.customer) {
        setLookupCustomerInfo(res.customer);
        setCustomerName(res.customer.fullName || "");
        if (res.customer.address && !isCounterMode) {
          setShippingAddress(res.customer.address);
        }
      } else {
        setLookupCustomerInfo({ isNew: true });
        if (!customerName || customerName.includes("Staff") || customerName.includes("Admin")) {
          setCustomerName("Khách lẻ");
        }
      }
    } catch {
      setLookupCustomerInfo({ isNew: true });
    } finally {
      setIsLookingUp(false);
    }
  };

  React.useEffect(() => {
    if (user && !isCounterMode) {
      if (user.fullName) setCustomerName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.address) setShippingAddress(user.address);
    }
  }, [user, isCounterMode]);

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

  const effectiveShippingFee = isCounterMode ? 0 : (isFreeShipping ? 0 : shippingFee);
  const effectiveTotal = isCounterMode ? subtotal : (subtotal + effectiveShippingFee);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const errors: Record<string, string> = {};
    if (!customerName.trim()) {
      errors.customerName = "Vui lòng nhập họ và tên khách hàng nhận máy.";
    }

    if (!phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại để kích hoạt bảo hành điện tử và tích điểm.";
    } else if (!isValidPhone(phone)) {
      errors.phone = "Số điện thoại không hợp lệ (phải gồm 10 chữ số, VD: 0912345678).";
    }

    if (!shippingAddress.trim()) {
      errors.shippingAddress = "Vui lòng nhập địa chỉ nhận hàng.";
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
        shippingAddress: isCounterMode ? "Mua trực tiếp tại quầy - TPKSTORE" : shippingAddress.trim(),
        note: isCounterMode ? `${note.trim()} [Mua tại quầy]` : note.trim(),
        paymentMethod,
        isCounterOrder: isCounterMode,
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
        showToast(`Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại TPKSTORE.`, "success");
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
    showToast(`Thanh toán VNPAY & Đặt hàng thành công! Mã đơn: ${pendingOrderId}`, "success");
    onOrderSuccess(pendingOrderId);
  };

  const handleMomoSuccess = async () => {
    await clearCart();
    setShowMomoModal(false);
    showToast(`Thanh toán MoMo & Đặt hàng thành công! Mã đơn: ${pendingOrderId}`, "success");
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
          <p className="text-xs text-slate-500 font-medium">Vui lòng kiểm tra thông tin khách hàng và chọn phương thức thanh toán</p>
        </div>
      </div>

      {/* Staff Counter Consultation Mode Banner */}
      {isStaff && (
        <div className="p-4 rounded-3xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-blue-950 uppercase tracking-wider">
                  Chế Độ Tư Vấn & Bán Hàng Tại Quầy (POS Mode)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-200/70 text-blue-800 text-[10px] font-bold">
                  {user?.role}
                </span>
              </div>
              <p className="text-[11px] text-blue-800 font-medium mt-0.5">
                Lên đơn cho khách lẻ chỉ với <strong className="text-blue-950">Số điện thoại</strong> (tự động miễn phí giao hàng, kích hoạt bảo hành điện tử và tích điểm).
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 self-end sm:self-center">
            <input
              type="checkbox"
              checked={isCounterMode}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsCounterMode(checked);
                if (checked) {
                  setCustomerName("Khách lẻ");
                  setPhone("");
                  setShippingAddress("Mua trực tiếp tại quầy - TPKSTORE");
                  setNote("Khách mua trực tiếp tại quầy");
                } else if (user) {
                  setCustomerName(user.fullName || "");
                  setPhone(user.phone || "");
                  setShippingAddress(user.address || "");
                  setNote("Giao hàng giờ hành chính");
                }
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      )}

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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600" />
                {isCounterMode ? "1. Thông Tin Khách Hàng (Tích Điểm & Bảo Hành)" : "1. Thông Tin Nhận Hàng"}
              </h3>
              {isCounterMode && (
                <span className="text-[11px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-full">
                  Nhận tại quầy TPKSTORE
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              {/* Phone Field (Top priority in counter mode) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Số điện thoại khách hàng <span className="text-rose-600">*</span>
                  <span className="text-[11px] text-slate-400 font-normal ml-1">
                    (Dùng để tra cứu điểm tích lũy & bảo hành điện tử)
                  </span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        clearFieldError("phone");
                        if (e.target.value.replace(/\D/g, "").length === 10) {
                          handleLookupPhone(e.target.value);
                        }
                      }}
                      onBlur={() => handleLookupPhone()}
                      placeholder="0912345678"
                      className={`w-full bg-white border rounded-xl px-3 py-2.5 pl-9 text-slate-900 focus:outline-none transition-colors font-bold ${
                        fieldErrors.phone 
                          ? "border-rose-500 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/10" 
                          : "border-slate-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                      }`}
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                  {isCounterMode && (
                    <button
                      type="button"
                      onClick={() => handleLookupPhone()}
                      disabled={isLookingUp || !phone.trim()}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 disabled:opacity-50 transition-colors shrink-0"
                    >
                      {isLookingUp ? "..." : "Tra cứu"}
                    </button>
                  )}
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.phone}</span>
                  </p>
                )}

                {/* Customer recognition card */}
                {lookupCustomerInfo?.fullName ? (
                  <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-900">
                        Khách thân thiết: <strong>{lookupCustomerInfo.fullName}</strong>
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black text-[11px]">
                      {lookupCustomerInfo.loyaltyPoints?.toLocaleString("vi-VN") || 0} điểm
                    </span>
                  </div>
                ) : lookupCustomerInfo?.isNew && phone.length >= 9 ? (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Khách hàng mới tại quầy: Hệ thống sẽ tự động kích hoạt bảo hành theo SĐT này.</span>
                  </div>
                ) : null}
              </div>

              {/* Customer Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Họ và tên khách hàng <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => { setCustomerName(e.target.value); clearFieldError("customerName"); }}
                    placeholder="Nguyễn Văn A (hoặc Khách lẻ)"
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

              {/* Address Field */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isCounterMode ? "Địa chỉ nhận hàng (Mặc định tại quầy)" : "Địa chỉ chi tiết (Số nhà, Phường/Xã, Tỉnh/TP)"} <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={isCounterMode ? 1 : 2}
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
                <span className={`font-semibold ${isCounterMode || isFreeShipping ? "text-emerald-600" : "text-slate-900"}`}>
                  {isCounterMode 
                    ? "Miễn phí (Nhận tại quầy)" 
                    : isFreeShipping 
                    ? "Miễn phí (Free Ship)" 
                    : `${shippingFee.toLocaleString("vi-VN")} đ`}
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
                {effectiveTotal.toLocaleString("vi-VN")} đ
              </span>
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={isLoading || items.length === 0}
              className={`w-full py-4 rounded-2xl text-white font-black text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-40 ${
                isCounterMode 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30"
                  : "bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-rose-600/30"
              }`}
            >
              {isLoading 
                ? "Đang xử lý đơn hàng..." 
                : isCounterMode
                ? "Xác Nhận Xuất Đơn & Kích Hoạt Bảo Hành Tại Quầy"
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

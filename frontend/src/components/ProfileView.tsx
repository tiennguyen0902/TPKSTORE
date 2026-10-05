import React, { useState, useEffect, useRef } from "react";
import { User, Lock, Save, CheckCircle2, AlertCircle, MapPin, Home, Camera, Loader2, Check, X, Eye } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export const ProfileView: React.FC = () => {
  const { user, updateUser } = useAuth();

  // Profile state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  // Address state (Địa chỉ của tôi)
  const [receiverName, setReceiverName] = useState(user?.fullName || "");
  const [receiverPhone, setReceiverPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification messages
  const [profileMsg, setProfileMsg] = useState("");
  const [addressMsg, setAddressMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Avatar upload & preview state
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarSuccessMsg, setAvatarSuccessMsg] = useState("");
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [pendingAvatarPreview, setPendingAvatarPreview] = useState<string | null>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);

  // Field validation errors
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const clearProfileError = (field: string) => {
    if (profileErrors[field]) setProfileErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };
  const clearAddressError = (field: string) => {
    if (addressErrors[field]) setAddressErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };
  const clearPasswordError = (field: string) => {
    if (passwordErrors[field]) setPasswordErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const isValidPhone = (val: string) => {
    return /^(0[3|5|7|8|9])[0-9]{8}$/.test(val.trim());
  };

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
      setAvatar(user.avatar || "");
      setReceiverName(user.fullName || "");
      setReceiverPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  // Cập nhật thông tin cá nhân cơ bản
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setProfileMsg("");

    const errors: Record<string, string> = {};
    if (!fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ và tên của bạn.";
    }
    if (phone.trim() && !isValidPhone(phone)) {
      errors.phone = "Số điện thoại không hợp lệ (phải gồm 10 chữ số, VD: 0912345678).";
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }
    setProfileErrors({});

    try {
      await api.updateProfile({ fullName: fullName.trim(), phone: phone.trim(), avatar: avatar.trim(), address });
      updateUser({ fullName: fullName.trim(), phone: phone.trim(), avatar: avatar.trim(), address });
      setProfileMsg("Cập nhật thông tin cá nhân thành công!");
      setTimeout(() => setProfileMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Lỗi cập nhật thông tin");
    }
  };

  // Chọn file ảnh avatar để xem trước (preview trước khi xác nhận)
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError("");
    setAvatarSuccessMsg("");

    // Kiểm tra dung lượng file (tối đa 3MB)
    if (file.size > 3 * 1024 * 1024) {
      setAvatarError("Dung lượng ảnh vượt quá giới hạn 3MB. Vui lòng chọn ảnh nhỏ hơn.");
      if (avatarFileRef.current) avatarFileRef.current.value = "";
      return;
    }

    // Kiểm tra định dạng ảnh
    if (!file.type.startsWith("image/")) {
      setAvatarError("File đã chọn không phải định dạng ảnh hợp lệ (chấp nhận JPEG, PNG, WebP, GIF).");
      if (avatarFileRef.current) avatarFileRef.current.value = "";
      return;
    }

    // Đọc preview bằng FileReader
    const reader = new FileReader();
    reader.onload = () => {
      setPendingAvatarFile(file);
      setPendingAvatarPreview(reader.result as string);
    };
    reader.onerror = () => {
      setAvatarError("Không thể đọc file ảnh. Vui lòng thử lại.");
    };
    reader.readAsDataURL(file);

    if (avatarFileRef.current) avatarFileRef.current.value = "";
  };

  // Xác nhận đổi avatar sau khi xem trước
  const handleConfirmAvatarChange = async () => {
    if (!pendingAvatarFile) return;

    setAvatarError("");
    setAvatarSuccessMsg("");
    setAvatarUploading(true);

    try {
      const result = await api.uploadAvatar(pendingAvatarFile);
      setAvatar(result.avatar);
      updateUser({ avatar: result.avatar });
      setPendingAvatarFile(null);
      setPendingAvatarPreview(null);
      setAvatarSuccessMsg("Đổi ảnh đại diện thành công!");
      setTimeout(() => setAvatarSuccessMsg(""), 4000);
    } catch (err: any) {
      setAvatarError(err.message || "Upload ảnh thất bại");
    } finally {
      setAvatarUploading(false);
    }
  };

  // Hủy xem trước avatar
  const handleCancelAvatarChange = () => {
    setPendingAvatarFile(null);
    setPendingAvatarPreview(null);
    setAvatarError("");
    if (avatarFileRef.current) avatarFileRef.current.value = "";
  };

  // Cập nhật Địa chỉ của tôi (Địa chỉ nhận hàng)
  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setAddressMsg("");

    const errors: Record<string, string> = {};
    if (!receiverName.trim()) {
      errors.receiverName = "Vui lòng nhập họ tên người nhận hàng.";
    }
    if (!receiverPhone.trim()) {
      errors.receiverPhone = "Vui lòng nhập số điện thoại nhận hàng.";
    } else if (!isValidPhone(receiverPhone)) {
      errors.receiverPhone = "Số điện thoại không hợp lệ (phải gồm 10 chữ số, VD: 0912345678).";
    }
    if (!address.trim()) {
      errors.address = "Vui lòng nhập địa chỉ nhận hàng chi tiết.";
    }

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }
    setAddressErrors({});

    try {
      await api.updateProfile({ 
        fullName: receiverName.trim() || fullName, 
        phone: receiverPhone.trim() || phone, 
        address: address.trim(), 
        avatar 
      });
      updateUser({ 
        fullName: receiverName.trim() || fullName, 
        phone: receiverPhone.trim() || phone, 
        address: address.trim(), 
        avatar 
      });
      setAddressMsg("Cập nhật địa chỉ nhận hàng thành công!");
      setTimeout(() => setAddressMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Lỗi cập nhật địa chỉ");
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setPasswordMsg("");

    const errors: Record<string, string> = {};
    if (!currentPassword) {
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
    }
    if (!newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới.";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Mật khẩu mới phải có tối thiểu 8 ký tự.";
    } else if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      errors.newPassword = "Mật khẩu mới phải chứa ít nhất một chữ cái và một chữ số.";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận lại mật khẩu mới.";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp với mật khẩu mới.";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    setPasswordErrors({});

    try {
      await api.changePassword(currentPassword, newPassword);
      setPasswordMsg("Đổi mật khẩu thành công! Các phiên đăng nhập trên thiết bị khác đã được thu hồi.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMsg(""), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "Lỗi đổi mật khẩu");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900">Quản Lý Tài Khoản Cá Nhân</h1>
        <p className="text-xs text-slate-500 mt-0.5">Cập nhật hồ sơ người dùng, sổ địa chỉ nhận hàng và cấu hình bảo mật</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Avatar & Role Card */}
        <div className="md:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
            {/* Avatar với nút upload & preview */}
            <div className="relative w-28 h-28 mx-auto">
              <div className={`w-28 h-28 rounded-full overflow-hidden border-4 ${pendingAvatarPreview ? 'border-amber-500 ring-4 ring-amber-400/30' : 'border-rose-100'} bg-slate-100 shadow-md relative`}>
                <img
                  src={pendingAvatarPreview || avatar || user?.avatar || "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
                {pendingAvatarPreview && (
                  <span className="absolute bottom-1 inset-x-0 bg-amber-600/90 text-white text-[9px] font-black uppercase py-0.5 tracking-wider text-center">
                    Xem trước
                  </span>
                )}
              </div>
              {/* Nút chọn ảnh */}
              <button
                type="button"
                onClick={() => avatarFileRef.current?.click()}
                disabled={avatarUploading}
                title="Đổi ảnh đại diện (tối đa 3MB)"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {avatarUploading
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Camera className="w-3.5 h-3.5" />}
              </button>
              {/* Hidden file input */}
              <input
                ref={avatarFileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
            </div>

            {/* Thông báo lỗi avatar */}
            {avatarError && (
              <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{avatarError}</span>
              </div>
            )}

            {/* Thông báo thành công đổi avatar */}
            {avatarSuccessMsg && (
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-center gap-1.5 font-bold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{avatarSuccessMsg}</span>
              </div>
            )}

            {/* Khối Preview trước khi xác nhận đổi avatar */}
            {pendingAvatarPreview && (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-2.5 shadow-sm animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <span>Xem trước ảnh đại diện</span>
                </div>
                {pendingAvatarFile && (
                  <p className="text-[11px] text-slate-600 truncate px-1">
                    {pendingAvatarFile.name} ({(pendingAvatarFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={avatarUploading}
                    onClick={handleConfirmAvatarChange}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all disabled:opacity-60"
                  >
                    {avatarUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Xác nhận đổi avatar</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={avatarUploading}
                    onClick={handleCancelAvatarChange}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-60"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Hủy</span>
                  </button>
                </div>
              </div>
            )}

            {!pendingAvatarPreview && (
              <p className="text-[10px] text-slate-400">
                Nhấn vào biểu tượng 📷 để chọn ảnh (JPEG/PNG/WebP, tối đa 3MB)
              </p>
            )}

            <div>
              <h3 className="font-black text-base text-slate-900">{user?.fullName || "Người dùng"}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            </div>

            {user?.address && (
              <div className="text-left p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Địa chỉ mặc định:
                </p>
                <p className="text-[11px] text-slate-700 line-clamp-2" title={user.address}>
                  {user.address}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-8 space-y-6">
          {/* Card 1: THÔNG TIN CÁ NHÂN */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm text-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-rose-600" />
              THÔNG TIN CÁ NHÂN
            </h3>

            {profileMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{profileMsg}</span>
              </div>
            )}

            <form noValidate onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Họ và tên <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); clearProfileError("fullName"); }}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white text-xs transition-colors ${
                    profileErrors.fullName 
                      ? "border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20" 
                      : "border-slate-300 focus:border-rose-500"
                  }`}
                />
                {profileErrors.fullName && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{profileErrors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); clearProfileError("phone"); }}
                  placeholder="0912..."
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white text-xs transition-colors ${
                    profileErrors.phone 
                      ? "border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20" 
                      : "border-slate-300 focus:border-rose-500"
                  }`}
                />
                {profileErrors.phone && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{profileErrors.phone}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu Thay Đổi</span>
              </button>
            </form>
          </div>

          {/* Card 2: ĐỊA CHỈ CỦA TÔI */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                ĐỊA CHỈ CỦA TÔI
              </h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                Địa chỉ giao hàng mặc định
              </span>
            </div>

            {addressMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{addressMsg}</span>
              </div>
            )}

            {/* Thông tin địa chỉ hiện tại */}
            {user?.address && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">{receiverName || user.fullName}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-600 font-mono">{receiverPhone || user.phone || "Chưa có SĐT"}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Mặc định
                  </span>
                </div>
                <p className="text-slate-600 text-xs flex items-start gap-1.5">
                  <Home className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{user.address}</span>
                </p>
              </div>
            )}

            {/* Form cập nhật / thêm địa chỉ */}
            <form noValidate onSubmit={handleUpdateAddress} className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Họ tên người nhận <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => { setReceiverName(e.target.value); clearAddressError("receiverName"); }}
                    placeholder="Ví dụ: Lê Hoàng Nam"
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white text-xs transition-colors ${
                      addressErrors.receiverName 
                        ? "border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20" 
                        : "border-slate-300 focus:border-emerald-500"
                    }`}
                  />
                  {addressErrors.receiverName && (
                    <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{addressErrors.receiverName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số điện thoại nhận hàng <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={receiverPhone}
                    onChange={(e) => { setReceiverPhone(e.target.value); clearAddressError("receiverPhone"); }}
                    placeholder="0912..."
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white text-xs transition-colors ${
                      addressErrors.receiverPhone 
                        ? "border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20" 
                        : "border-slate-300 focus:border-emerald-500"
                    }`}
                  />
                  {addressErrors.receiverPhone && (
                    <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{addressErrors.receiverPhone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Địa chỉ nhận hàng chi tiết (Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố) <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); clearAddressError("address"); }}
                  placeholder="Ví dụ: Số 45 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội"
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white text-xs resize-none transition-colors ${
                    addressErrors.address 
                      ? "border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20" 
                      : "border-slate-300 focus:border-emerald-500"
                  }`}
                />
                {addressErrors.address && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{addressErrors.address}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu Địa Chỉ Của Tôi</span>
              </button>
            </form>
          </div>

          {/* Card 3: ĐỔI MẬT KHẨU */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm text-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-600" />
              ĐỔI MẬT KHẨU
            </h3>

            {passwordMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{passwordMsg}</span>
              </div>
            )}

            <form noValidate onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mật khẩu hiện tại <span className="text-rose-600">*</span>
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); clearPasswordError("currentPassword"); }}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white text-xs transition-colors ${
                    passwordErrors.currentPassword 
                      ? "border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20" 
                      : "border-slate-300 focus:border-rose-500"
                  }`}
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{passwordErrors.currentPassword}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mật khẩu mới <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); clearPasswordError("newPassword"); }}
                    placeholder="Tối thiểu 8 ký tự, gồm chữ và số"
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white text-xs transition-colors ${
                      passwordErrors.newPassword 
                        ? "border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20" 
                        : "border-slate-300 focus:border-rose-500"
                    }`}
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{passwordErrors.newPassword}</span>
                    </p>
                  )}
                  {!passwordErrors.newPassword && (
                    <p className="mt-1 text-[10px] text-slate-400">Tối thiểu 8 ký tự, bắt buộc có chữ cái và chữ số</p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Xác nhận mật khẩu mới <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); clearPasswordError("confirmPassword"); }}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white text-xs transition-colors ${
                      passwordErrors.confirmPassword 
                        ? "border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20" 
                        : "border-slate-300 focus:border-rose-500"
                    }`}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{passwordErrors.confirmPassword}</span>
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-all flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Cập Nhật Mật Khẩu</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

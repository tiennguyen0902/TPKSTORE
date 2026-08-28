import React, { useState, useEffect } from "react";
import { User, Lock, Save, CheckCircle2, AlertCircle, MapPin, Home } from "lucide-react";
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
    try {
      setErrorMsg("");
      await api.updateProfile({ fullName, phone, avatar, address });
      updateUser({ fullName, phone, avatar, address });
      setProfileMsg("Cập nhật thông tin cá nhân thành công!");
      setTimeout(() => setProfileMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Lỗi cập nhật thông tin");
    }
  };

  // Cập nhật Địa chỉ của tôi (Địa chỉ nhận hàng)
  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMsg("");
      await api.updateProfile({ 
        fullName: receiverName || fullName, 
        phone: receiverPhone || phone, 
        address, 
        avatar 
      });
      updateUser({ 
        fullName: receiverName || fullName, 
        phone: receiverPhone || phone, 
        address, 
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
    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    try {
      setErrorMsg("");
      await api.changePassword(currentPassword, newPassword);
      setPasswordMsg("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Lỗi đổi mật khẩu");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white">Quản Lý Tài Khoản Cá Nhân</h1>
        <p className="text-xs text-slate-400 mt-0.5">Cập nhật hồ sơ người dùng, sổ địa chỉ nhận hàng và cấu hình bảo mật</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Avatar & Role Card */}
        <div className="md:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-[#131c2e] border border-slate-800 text-center space-y-4 shadow-xl">
            <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-violet-500/30 bg-slate-800 shadow-lg">
              <img
                src={avatar || user?.avatar || "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="font-black text-base text-white">{user?.fullName || "Người dùng"}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            </div>

            {user?.address && (
              <div className="text-left p-3 rounded-2xl bg-[#18233a]/80 border border-slate-700/60 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Địa chỉ mặc định:
                </p>
                <p className="text-[11px] text-slate-200 line-clamp-2" title={user.address}>
                  {user.address}
                </p>
              </div>
            )}

            <div className="pt-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                user?.role === "ADMIN" ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" :
                user?.role === "STAFF" ? "bg-blue-600/20 text-blue-300 border border-blue-500/30" :
                "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
              }`}>
                Vai trò: {user?.role || "CUSTOMER"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-8 space-y-6">
          {/* Card 1: THÔNG TIN CÁ NHÂN */}
          <div className="p-6 rounded-3xl bg-[#131c2e] border border-slate-800 space-y-4 shadow-xl text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-violet-400" />
              THÔNG TIN CÁ NHÂN
            </h3>

            {profileMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{profileMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912..."
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Link ảnh đại diện (Avatar URL)</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-600/30 transition-all flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu Thay Đổi</span>
              </button>
            </form>
          </div>

          {/* Card 2: ĐỊA CHỈ CỦA TÔI */}
          <div className="p-6 rounded-3xl bg-[#131c2e] border border-slate-800 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                ĐỊA CHỈ CỦA TÔI
              </h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                Địa chỉ giao hàng mặc định
              </span>
            </div>

            {addressMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{addressMsg}</span>
              </div>
            )}

            {/* Thông tin địa chỉ hiện tại */}
            {user?.address && (
              <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-700/60 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-white text-xs">{receiverName || user.fullName}</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400 font-mono">{receiverPhone || user.phone || "Chưa có SĐT"}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Mặc định
                  </span>
                </div>
                <p className="text-slate-300 text-xs flex items-start gap-1.5">
                  <Home className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{user.address}</span>
                </p>
              </div>
            )}

            {/* Form cập nhật / thêm địa chỉ */}
            <form onSubmit={handleUpdateAddress} className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Họ tên người nhận</label>
                  <input
                    type="text"
                    required
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="Ví dụ: Lê Hoàng Nam"
                    className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Số điện thoại nhận hàng</label>
                  <input
                    type="tel"
                    required
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    placeholder="0912..."
                    className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Địa chỉ nhận hàng chi tiết (Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố)
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ví dụ: Số 45 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội"
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs resize-none"
                />
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
          <div className="p-6 rounded-3xl bg-[#131c2e] border border-slate-800 space-y-4 shadow-xl text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-pink-400" />
              ĐỔI MẬT KHẨU
            </h3>

            {passwordMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-pink-400" />
                <span>Cập Nhật Mật Khẩu</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

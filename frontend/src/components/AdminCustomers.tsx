import React, { useState, useEffect } from "react";
import { Users, Search, ShieldCheck, Lock, Unlock, CheckCircle2 } from "lucide-react";
import { User } from "../types";
import { api } from "../services/api";

export const AdminCustomers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAllUsers(roleFilter !== "all" ? roleFilter : undefined, search);
      setUsers(res.users || []);
    } catch (err) {
      console.warn("Could not fetch users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.updateUserRole(userId, newRole);
      setToastMsg(`Đã cập nhật vai trò người dùng thành "${newRole}".`);
      fetchUsers();
      setTimeout(() => setToastMsg(""), 3000);
    } catch (err: any) {
      alert(err.message || "Lỗi cập nhật vai trò");
    }
  };

  const handleToggleActive = async (userId: string) => {
    try {
      await api.toggleUserActive(userId);
      setToastMsg("Đã thay đổi trạng thái tài khoản thành công!");
      fetchUsers();
      setTimeout(() => setToastMsg(""), 3000);
    } catch (err: any) {
      alert(err.message || "Lỗi thao tác");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Quản Lý Khách Hàng & Người Dùng</h1>
          <p className="text-xs text-slate-400 mt-0.5">Phân quyền RBAC, kiểm soát truy cập và quản trị tài khoản hệ thống</p>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Tìm theo họ tên, email, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#131c2e] border border-slate-700/80 rounded-xl px-3.5 py-2 pl-9 text-xs text-white focus:outline-none focus:border-violet-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-56 bg-[#131c2e] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 cursor-pointer"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="ADMIN">Quản trị viên (ADMIN)</option>
          <option value="STAFF">Nhân viên (STAFF)</option>
          <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-[#131c2e] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c121e] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Người Dùng</th>
                <th className="p-4">Email</th>
                <th className="p-4">Số Điện Thoại</th>
                <th className="p-4">Vai Trò (RBAC)</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Khóa / Mở Khóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Đang tải danh sách người dùng...</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#18233a] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar || "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"} alt="" className="w-10 h-10 object-cover rounded-full bg-slate-900 border border-slate-700 shrink-0" />
                        <div>
                          <p className="font-bold text-white line-clamp-1">{u.fullName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">ID: {u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{u.email}</td>
                    <td className="p-4 text-slate-400 font-mono">{u.phone || "Chưa cập nhật"}</td>
                    <td className="p-4 whitespace-nowrap">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className={`border rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer ${
                          u.role === "ADMIN" ? "bg-violet-600/20 text-violet-300 border-violet-500/40" :
                          u.role === "STAFF" ? "bg-blue-600/20 text-blue-300 border-blue-500/40" :
                          "bg-emerald-600/20 text-emerald-300 border-emerald-500/40"
                        }`}
                      >
                        <option value="ADMIN" className="bg-[#131c2e] text-white">ADMIN</option>
                        <option value="STAFF" className="bg-[#131c2e] text-white">STAFF</option>
                        <option value="CUSTOMER" className="bg-[#131c2e] text-white">CUSTOMER</option>
                      </select>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {u.isActive ? "Đang hoạt động" : "Bị khóa"}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(u.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          u.isActive
                            ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
                            : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {u.isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Tag, 
  Edit2, 
  Trash2, 
  X, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Watch, 
  Zap, 
  Home, 
  Monitor, 
  Keyboard, 
  Wifi, 
  ShieldCheck 
} from "lucide-react";
import { Category } from "../types";
import { api } from "../services/api";

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Tag");
  const [toastMsg, setToastMsg] = useState("");

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCategories();
      setCategories(res.categories || []);
    } catch (err) {
      console.warn("Could not fetch categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setIcon("Tag");
    setShowModal(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || "");
    setIcon(c.icon || "Tag");
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await api.deleteCategory(id);
      setToastMsg("Đã xóa danh mục thành công!");
      fetchCategories();
      setTimeout(() => setToastMsg(""), 3000);
    } catch (err: any) {
      alert(err.message || "Xóa danh mục thất bại");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const autoSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const payload = { name, slug: autoSlug, description, icon };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, payload);
        setToastMsg("Cập nhật danh mục thành công!");
      } else {
        await api.createCategory(payload);
        setToastMsg("Tạo danh mục mới thành công!");
      }

      setShowModal(false);
      fetchCategories();
      setTimeout(() => setToastMsg(""), 3000);
    } catch (err: any) {
      alert(err.message || "Lỗi lưu danh mục");
    }
  };

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case "Smartphone": return <Smartphone className="w-5 h-5 text-indigo-400" />;
      case "Laptop": return <Laptop className="w-5 h-5 text-blue-400" />;
      case "Headphones": return <Headphones className="w-5 h-5 text-purple-400" />;
      case "Watch": return <Watch className="w-5 h-5 text-pink-400" />;
      case "Zap": return <Zap className="w-5 h-5 text-amber-400" />;
      case "Home": return <Home className="w-5 h-5 text-emerald-400" />;
      case "Monitor": return <Monitor className="w-5 h-5 text-cyan-400" />;
      case "Keyboard": return <Keyboard className="w-5 h-5 text-teal-400" />;
      case "Wifi": return <Wifi className="w-5 h-5 text-sky-400" />;
      case "ShieldCheck": return <ShieldCheck className="w-5 h-5 text-violet-400" />;
      default: return <Tag className="w-5 h-5 text-violet-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Quản Lý Danh Mục</h1>
          <p className="text-xs text-slate-400 mt-0.5">Danh sách các nhóm sản phẩm công nghệ trong hệ thống ({categories.length} danh mục)</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục Mới</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Grid of Categories (Matching Screenshot!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-3xl bg-[#131c2e] border border-slate-800 hover:border-violet-500/40 transition-all space-y-3 shadow-lg group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#18233a] flex items-center justify-center group-hover:scale-110 transition-transform">
                {getCategoryIcon(cat.icon)}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white text-sm">{cat.name}</h3>
              <p className="text-[10px] text-violet-400 font-mono mt-0.5">slug: {cat.slug}</p>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {cat.description || "Chưa có mô tả chi tiết."}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">Số lượng sản phẩm:</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                {cat.productCount || 0} sản phẩm
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#131c2e] border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tên danh mục *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Slug URL</label>
                <input
                  type="text"
                  placeholder="tu-dong-tao-neu-de-trong"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Icon đại diện</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="Smartphone">Smartphone</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Headphones">Headphones</option>
                  <option value="Watch">Watch</option>
                  <option value="Zap">Zap</option>
                  <option value="Home">Home</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Keyboard">Keyboard</option>
                  <option value="Wifi">Wifi</option>
                  <option value="ShieldCheck">ShieldCheck</option>
                  <option value="Tag">Tag</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Mô tả danh mục</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#18233a] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold"
                >
                  {editingCategory ? "Lưu Thay Đổi" : "Tạo Danh Mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

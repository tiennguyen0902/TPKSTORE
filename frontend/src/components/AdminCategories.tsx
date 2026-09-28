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
  ShieldCheck,
  AlertCircle
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
  const [formErrorMsg, setFormErrorMsg] = useState("");
  const [categoryErrors, setCategoryErrors] = useState<Record<string, string>>({});

  const clearCategoryError = (field: string) => {
    if (categoryErrors[field]) {
      setCategoryErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

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
    setCategoryErrors({});
    setFormErrorMsg("");
    setShowModal(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || "");
    setIcon(c.icon || "Tag");
    setCategoryErrors({});
    setFormErrorMsg("");
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
    setFormErrorMsg("");

    const errors: Record<string, string> = {};
    if (!name.trim()) {
      errors.name = "Vui lòng nhập tên danh mục.";
    }

    if (Object.keys(errors).length > 0) {
      setCategoryErrors(errors);
      return;
    }
    setCategoryErrors({});

    try {
      const autoSlug = slug.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
      const payload = { name: name.trim(), slug: autoSlug, description: description.trim(), icon };

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
      setFormErrorMsg(err.message || "Lỗi lưu danh mục");
    }
  };

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case "Smartphone": return <Smartphone className="w-5 h-5 text-indigo-400" />;
      case "Laptop": return <Laptop className="w-5 h-5 text-blue-400" />;
      case "Headphones": return <Headphones className="w-5 h-5 text-rose-400" />;
      case "Watch": return <Watch className="w-5 h-5 text-pink-400" />;
      case "Zap": return <Zap className="w-5 h-5 text-amber-400" />;
      case "Home": return <Home className="w-5 h-5 text-emerald-400" />;
      case "Monitor": return <Monitor className="w-5 h-5 text-cyan-400" />;
      case "Keyboard": return <Keyboard className="w-5 h-5 text-teal-400" />;
      case "Wifi": return <Wifi className="w-5 h-5 text-sky-400" />;
      case "ShieldCheck": return <ShieldCheck className="w-5 h-5 text-rose-400" />;
      default: return <Tag className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Quản Lý Danh Mục</h1>
          <p className="text-xs text-slate-500 mt-0.5">Danh sách các nhóm sản phẩm công nghệ trong hệ thống ({categories.length} danh mục)</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục Mới</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Grid of Categories (Matching Screenshot!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-rose-500/40 transition-all space-y-3 shadow-lg group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                {getCategoryIcon(cat.icon)}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 hover:text-slate-900"
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
              <h3 className="font-bold text-slate-900 text-sm">{cat.name}</h3>
              <p className="text-[10px] text-rose-400 font-mono mt-0.5">slug: {cat.slug}</p>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {cat.description || "Chưa có mô tả chi tiết."}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
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
          <div className="w-full max-w-md bg-white border border-slate-300 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formErrorMsg}</span>
              </div>
            )}

            <form noValidate onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên danh mục <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thiết bị thông minh"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearCategoryError("name"); }}
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-900 focus:outline-none transition-colors ${
                    categoryErrors.name 
                      ? "border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20" 
                      : "border-slate-300 focus:border-rose-500"
                  }`}
                />
                {categoryErrors.name && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{categoryErrors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Slug URL</label>
                <input
                  type="text"
                  placeholder="tu-dong-tao-neu-de-trong"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Icon đại diện</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-rose-500"
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
                <label className="block font-semibold text-slate-700 mb-1">Mô tả danh mục</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md shadow-rose-600/30"
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

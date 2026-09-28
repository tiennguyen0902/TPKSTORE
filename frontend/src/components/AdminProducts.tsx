import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Package,
  Upload,
  Image as ImageIcon,
  Check,
  Lock,
  ShieldAlert
} from "lucide-react";
import { Product, Category } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Pagination } from "./Pagination";

// Danh mục hình ảnh sản phẩm mẫu sắc nét sẵn sàng chọn nhanh
const PRODUCT_IMAGE_PRESETS = [
  { name: "Tai nghe AI", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80" },
  { name: "Laptop AI", url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80" },
  { name: "Smartwatch", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80" },
  { name: "Bàn phím cơ", url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80" },
  { name: "Chuột công thái", url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80" },
  { name: "Củ sạc GaN", url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80" },
  { name: "Màn hình 4K", url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80" },
  { name: "Tablet AI Pad", url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80" },
  { name: "Robot hút bụi", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80" },
  { name: "Router Wi-Fi 7", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80" },
  { name: "Gói AI Pro", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80" }
];

export const AdminProducts: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Phân trang tự động
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [toastMsg, setToastMsg] = useState("");
  const [formErrorMsg, setFormErrorMsg] = useState("");
  const [productErrors, setProductErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearProductError = (field: string) => {
    if (productErrors[field]) {
      setProductErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({
          search: search || undefined,
          category: selectedCat !== "all" ? selectedCat : undefined
        }),
        api.getCategories()
      ]);
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
      if (catRes.categories && catRes.categories.length > 0 && !categoryId) {
        setCategoryId(catRes.categories[0].id);
      }
    } catch (err) {
      console.warn("Could not fetch admin products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setCurrentPage(1);
  }, [search, selectedCat]);

  const handleOpenAdd = () => {
    if (!isAdmin) {
      alert("Quyền hạn bị từ chối: Quản lý sản phẩm (Thêm mới, sửa, xóa) chỉ dành riêng cho tài khoản Quản trị viên (ADMIN).");
      return;
    }
    setEditingProduct(null);
    setName("");
    setPrice("");
    setOriginalPrice("");
    setStock("20");
    setThumbnail(PRODUCT_IMAGE_PRESETS[0].url);
    setDescription("");
    setIsFeatured(false);
    setIsNew(true);
    setProductErrors({});
    setFormErrorMsg("");
    setShowModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    if (!isAdmin) {
      alert("Quyền hạn bị từ chối: Quản lý sản phẩm (Thêm mới, sửa, xóa) chỉ dành riêng cho tài khoản Quản trị viên (ADMIN).");
      return;
    }
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.categoryId);
    setPrice(p.price.toString());
    setOriginalPrice(p.originalPrice ? p.originalPrice.toString() : "");
    const numStock = typeof p.stock === "number" ? p.stock : (typeof p.stock === "object" && p.stock && "decrement" in (p.stock as any) ? Math.max(0, 25 - (p.stock as any).decrement) : (parseInt(String(p.stock)) || 0));
    setStock(numStock.toString());
    setThumbnail(p.thumbnail || PRODUCT_IMAGE_PRESETS[0].url);
    setDescription(p.description);
    setIsFeatured(p.isFeatured);
    setIsNew(p.isNew);
    setProductErrors({});
    setFormErrorMsg("");
    setShowModal(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setProductErrors(prev => ({ ...prev, thumbnail: "Vui lòng chọn ảnh có dung lượng dưới 8MB!" }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setThumbnail(reader.result);
          clearProductError("thumbnail");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      alert("Quyền hạn bị từ chối: Quản lý sản phẩm chỉ dành riêng cho tài khoản Quản trị viên (ADMIN).");
      return;
    }
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await api.deleteProduct(id);
      setToastMsg("Đã xóa sản phẩm thành công!");
      fetchData();
      setTimeout(() => setToastMsg(""), 3000);
    } catch (err: any) {
      alert(err.message || "Lỗi khi xóa sản phẩm");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("Quyền hạn bị từ chối: Quản lý sản phẩm chỉ dành riêng cho tài khoản Quản trị viên (ADMIN).");
      return;
    }

    setFormErrorMsg("");
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = "Vui lòng nhập tên sản phẩm.";
    }

    const currentCategoryId = categoryId || (categories[0]?.id ?? "");
    if (!currentCategoryId) {
      errors.categoryId = "Vui lòng chọn danh mục cho sản phẩm.";
    }

    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      errors.price = "Giá bán sản phẩm phải lớn hơn 0 VND.";
    }

    const parsedStock = parseInt(stock);
    if (stock === "" || isNaN(parsedStock) || parsedStock < 0) {
      errors.stock = "Số lượng tồn kho ban đầu phải từ 0 trở lên.";
    }

    if (!thumbnail) {
      errors.thumbnail = "Vui lòng chọn hoặc tải lên hình ảnh cho sản phẩm.";
    }

    if (Object.keys(errors).length > 0) {
      setProductErrors(errors);
      return;
    }
    setProductErrors({});

    try {
      const payload = {
        name: name.trim(),
        categoryId: currentCategoryId,
        price: parsedPrice,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        stock: parsedStock,
        thumbnail,
        description: description.trim(),
        isFeatured,
        isNew
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        setToastMsg("Đã cập nhật sản phẩm thành công!");
      } else {
        await api.createProduct(payload);
        setToastMsg("Đã thêm mới sản phẩm thành công!");
      }

      setShowModal(false);
      fetchData();
      setTimeout(() => setToastMsg(""), 3000);
    } catch (err: any) {
      setFormErrorMsg(err.message || "Lỗi khi lưu sản phẩm");
    }
  };

  // Tính toán phân trang
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedProducts = products.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-rose-600" />
            <span>Quản Lý Sản Phẩm Kho Hàng</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Danh sách toàn bộ sản phẩm ({totalItems} SP)
            {totalPages > 1 && (
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                Trang {safeCurrentPage}/{totalPages}
              </span>
            )}
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Sản Phẩm Mới</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Quản lý sản phẩm chỉ cho ADMIN</span>
          </div>
        )}
      </div>

      {!isAdmin && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-amber-900">
                Chế độ tra cứu tồn kho ({user?.role === "MANAGER" ? "Quản lý kho" : "Nhân viên"})
              </p>
              <p className="text-[11px] text-amber-700 font-normal">
                Quyền thêm mới, sửa đổi thông số giá cả và xóa sản phẩm được phân cấp chỉ cho Quản trị viên (ADMIN) kiểm soát.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 shrink-0">
            ADMIN ONLY
          </span>
        </div>
      )}

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, mã SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-900 focus:outline-none focus:border-rose-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="w-full sm:w-56 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-rose-500 cursor-pointer shadow-sm"
        >
          <option value="all">Tất cả danh mục ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="p-4">Sản Phẩm</th>
                <th className="p-4">Danh Mục</th>
                <th className="p-4">Giá Bán</th>
                <th className="p-4">Tồn Kho</th>
                <th className="p-4">Đặc Điểm</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">Đang tải sản phẩm...</td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">Không tìm thấy sản phẩm nào</td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-rose-50/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={prod.thumbnail} alt="" className="w-12 h-12 object-cover rounded-xl bg-slate-50 border border-slate-200 shrink-0 shadow-sm" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">ID: {prod.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                        {prod.category?.name || "Công nghệ"}
                      </span>
                    </td>
                    <td className="p-4 font-black text-rose-600 whitespace-nowrap">
                      {prod.price.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {(() => {
                        const stockNum = typeof prod.stock === "number" ? prod.stock : (typeof prod.stock === "object" && prod.stock && "decrement" in (prod.stock as any) ? Math.max(0, 25 - (prod.stock as any).decrement) : (parseInt(String(prod.stock)) || 0));
                        return (
                          <span className={`font-bold px-2.5 py-1 rounded-lg ${stockNum <= 5 ? "text-rose-700 bg-rose-50 border border-rose-200" : "text-emerald-700 bg-emerald-50 border border-emerald-200"}`}>
                            {stockNum} SP
                          </span>
                        );
                      })()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {prod.isFeatured && (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                            Nổi bật
                          </span>
                        )}
                        {prod.isNew && (
                          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                            Mới
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      {isAdmin ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            title="Chỉnh sửa sản phẩm (Admin)"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            title="Xóa sản phẩm (Admin)"
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic flex items-center justify-end gap-1">
                          <Lock className="w-3 h-3 text-slate-400" /> Chỉ xem
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Component Phân Trang Tự Động */}
      {totalItems > 0 && (
        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 8, 12, 20, 50]}
          itemLabel="sản phẩm"
        />
      )}

      {/* Add / Edit Modal - CẢI TIẾN CHỌN HÌNH ẢNH & BỎ ADD LINK */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-600"></div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingProduct ? "Chỉnh Sửa Thông Tin Sản Phẩm" : "Thêm Hàng Hóa Mới Vào Kho"}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formErrorMsg}</span>
              </div>
            )}

            <form noValidate onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên sản phẩm <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearProductError("name"); }}
                  className={`w-full bg-white border rounded-xl px-3 py-2 text-slate-900 focus:outline-none shadow-sm transition-colors ${
                    productErrors.name 
                      ? "border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20" 
                      : "border-slate-300 focus:border-rose-500"
                  }`}
                />
                {productErrors.name && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{productErrors.name}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Danh mục <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => { setCategoryId(e.target.value); clearProductError("categoryId"); }}
                    className={`w-full bg-white border rounded-xl px-3 py-2 text-slate-900 focus:outline-none cursor-pointer shadow-sm font-medium transition-colors ${
                      productErrors.categoryId 
                        ? "border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20" 
                        : "border-slate-300 focus:border-rose-500"
                    }`}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {productErrors.categoryId && (
                    <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{productErrors.categoryId}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tồn kho ban đầu <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => { setStock(e.target.value); clearProductError("stock"); }}
                    className={`w-full bg-white border rounded-xl px-3 py-2 text-slate-900 focus:outline-none shadow-sm font-bold transition-colors ${
                      productErrors.stock 
                        ? "border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20" 
                        : "border-slate-300 focus:border-rose-500"
                    }`}
                  />
                  {productErrors.stock && (
                    <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{productErrors.stock}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Giá bán (VND) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="VD: 500000"
                    value={price}
                    onChange={(e) => { setPrice(e.target.value); clearProductError("price"); }}
                    className={`w-full bg-white border rounded-xl px-3 py-2 text-slate-900 focus:outline-none shadow-sm font-bold transition-colors ${
                      productErrors.price 
                        ? "border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20" 
                        : "border-slate-300 focus:border-rose-500"
                    }`}
                  />
                  {productErrors.price && (
                    <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{productErrors.price}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá gốc niêm yết (VND)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="VD: 650000"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-rose-500 shadow-sm"
                  />
                </div>
              </div>

              {/* PHẦN CHỌN HÌNH ẢNH SẢN PHẨM - BỎ ADD LINK HOÀN TOÀN */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-rose-600" />
                    <span>Chọn Hình Ảnh Sản Phẩm *</span>
                  </label>
                  <span className="text-[10px] text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full font-bold border border-rose-200">
                    File Upload & Thư Viện Mẫu
                  </span>
                </div>

                {/* Input file ẩn */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileChange}
                />

                {/* Khung tải ảnh từ máy tính hoặc xem trước */}
                {thumbnail ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-rose-200 shadow-sm">
                    <img
                      src={thumbnail}
                      alt="Xem trước ảnh sản phẩm"
                      className="w-16 h-16 object-cover rounded-xl border border-rose-300 shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 font-bold text-[11px] truncate">
                        Ảnh sản phẩm đã được chọn
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {thumbnail.startsWith("data:") ? "Tệp tải lên từ máy tính của bạn" : "Ảnh từ thư viện mẫu"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Tải ảnh khác từ máy</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setThumbnail("")}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition-colors border border-slate-200"
                        >
                          Gỡ ảnh
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-5 border-2 border-dashed border-rose-300 hover:border-rose-500 bg-white hover:bg-rose-50/40 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-slate-900 font-bold text-xs">
                        Bấm vào đây để chọn file ảnh từ máy tính
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Hỗ trợ định dạng PNG, JPG, JPEG, WebP (Tối đa 8MB)
                      </p>
                    </div>
                  </div>
                )}

                {/* Hoặc chọn nhanh từ danh mục ảnh mẫu sắc nét */}
                <div className="pt-2 border-t border-rose-100">
                  <p className="text-[10px] text-slate-600 font-bold mb-1.5">
                    Hoặc bấm chọn nhanh hình ảnh từ thư viện thiết bị công nghệ:
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1">
                    {PRODUCT_IMAGE_PRESETS.map((preset, idx) => {
                      const isSelected = thumbnail === preset.url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => { setThumbnail(preset.url); clearProductError("thumbnail"); }}
                          className={`group relative rounded-xl overflow-hidden border transition-all text-left ${
                            isSelected
                              ? "border-rose-500 ring-2 ring-rose-500/50 scale-105"
                              : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-12 object-cover"
                          />
                          <div className="p-1 bg-slate-50 text-[9px] text-slate-700 font-semibold truncate text-center border-t border-slate-100">
                            {preset.name}
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {productErrors.thumbnail && (
                  <p className="mt-1.5 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{productErrors.thumbnail}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả thông số chi tiết</label>
                <textarea
                  rows={3}
                  placeholder="Thông số kỹ thuật, cấu hình, công nghệ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-rose-500 shadow-sm font-medium"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-rose-600"
                  />
                  <span>Sản phẩm nổi bật</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="accent-rose-600"
                  />
                  <span>Sản phẩm mới</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30"
                >
                  {editingProduct ? "Lưu Thay Đổi" : "Tạo Sản Phẩm Vào Kho"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

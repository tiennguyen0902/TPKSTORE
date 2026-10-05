import React, { useEffect, useState, useRef } from "react";
import { Filter, SlidersHorizontal, ArrowUpDown, Tag, Search, RotateCcw } from "lucide-react";
import { Product, Category } from "../types";
import { ProductCard } from "./ProductCard";
import { Pagination } from "./Pagination";
import { api } from "../services/api";

interface CatalogViewProps {
  initialCategory?: string;
  onCategoryChange?: (categorySlug: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectProduct: (p: Product) => void;
  onBuyProduct?: (p: Product) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  initialCategory,
  onCategoryChange,
  searchQuery,
  setSearchQuery,
  onSelectProduct,
  onBuyProduct
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Phân trang tự động
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(9);
  const productsTopRef = useRef<HTMLDivElement>(null);

  // Đồng bộ category khi props từ Navbar / Footer thay đổi
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Tải danh sách danh mục
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        setCategories(res.categories || []);
      } catch (err) {
        console.warn("Could not fetch categories:", err);
      }
    };
    fetchCats();
  }, []);

  // Tải danh sách sản phẩm theo bộ lọc từ API
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      try {
        let minPrice: number | undefined;
        let maxPrice: number | undefined;

        if (selectedPriceRange === "under_2m") {
          minPrice = 0;
          maxPrice = 2000000;
        } else if (selectedPriceRange === "2m_5m") {
          minPrice = 2000000;
          maxPrice = 5000000;
        } else if (selectedPriceRange === "5m_15m") {
          minPrice = 5000000;
          maxPrice = 15000000;
        } else if (selectedPriceRange === "over_15m") {
          minPrice = 15000000;
        }

        const res = await api.getProducts({
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          search: searchQuery || undefined,
          minPrice,
          maxPrice,
          sortBy
        });

        setProducts(res.products || []);
      } catch (err) {
        console.warn("Could not fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategory, selectedPriceRange, sortBy, searchQuery]);

  // Tự động phân trang về Trang 1 khi bấm BẤT KỲ chức năng nào (danh mục, khoảng giá, sắp xếp, tìm kiếm)
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedPriceRange, sortBy, searchQuery]);

  const handleSelectCategory = (catSlug: string) => {
    setSelectedCategory(catSlug);
    onCategoryChange?.(catSlug);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    onCategoryChange?.("all");
    setSelectedPriceRange("all");
    setSortBy("newest");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const currentCategory = categories.find(
    (c) => c.slug === selectedCategory || c.id === selectedCategory
  );

  const pageTitle = selectedCategory === "all" ? "Tất Cả Sản Phẩm" : (currentCategory?.name || "Danh Mục Sản Phẩm");

  // Lọc phòng thủ 2 lớp (Client-side defensive filter)
  const displayedProducts = products.filter((p) => {
    if (selectedCategory && selectedCategory !== "all") {
      const targetSlug = currentCategory?.slug || selectedCategory;
      const targetId = currentCategory?.id || selectedCategory;
      const isMatch =
        p.categoryId === targetId ||
        p.categoryId === targetSlug ||
        p.category?.slug === targetSlug ||
        p.category?.id === targetId;

      if (!isMatch) return false;
    }
    return true;
  });

  // Tính toán phân trang tự động
  const totalItems = displayedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;
  const paginatedProducts = displayedProducts.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (productsTopRef.current) {
      productsTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{pageTitle}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Hiển thị {totalItems} sản phẩm{" "}
            {currentCategory ? `thuộc danh mục "${currentCategory.name}"` : "công nghệ chính hãng chất lượng cao"}
            {totalPages > 1 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">
                Trang {safeCurrentPage}/{totalPages}
              </span>
            )}
          </p>
        </div>

        {/* Sort and Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-rose-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-white">Mới nhất</option>
              <option value="price_asc" className="bg-white">Giá tăng dần</option>
              <option value="price_desc" className="bg-white">Giá giảm dần</option>
              <option value="rating_desc" className="bg-white">Đánh giá cao</option>
            </select>
          </div>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đặt lại bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Category Filter */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <Tag className="w-4 h-4 text-rose-600" />
              <span>Danh Mục Ngành Hàng</span>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => handleSelectCategory("all")}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === "all"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                Tất cả danh mục ({categories.length})
              </button>

              {categories.map((cat) => {
                const isActive =
                  selectedCategory === cat.slug ||
                  selectedCategory === cat.id ||
                  (currentCategory && currentCategory.id === cat.id);

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isActive
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {cat.productCount !== undefined && (
                      <span className="text-[10px] opacity-70">({cat.productCount})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>Khoảng Giá (VND)</span>
            </div>

            <div className="space-y-1 text-xs">
              {[
                { id: "all", label: "Tất cả mức giá" },
                { id: "under_2m", label: "Dưới 2.000.000 đ" },
                { id: "2m_5m", label: "2.000.000 đ - 5.000.000 đ" },
                { id: "5m_15m", label: "5.000.000 đ - 15.000.000 đ" },
                { id: "over_15m", label: "Trên 15.000.000 đ" }
              ].map((range) => (
                <label
                  key={range.id}
                  onClick={() => setSelectedPriceRange(range.id)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer select-none font-medium"
                >
                  <input
                    type="radio"
                    name="price_range"
                    checked={selectedPriceRange === range.id}
                    onChange={() => {}}
                    className="accent-rose-600"
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Products Grid */}
        <div className="lg:col-span-3 space-y-6" ref={productsTopRef}>
          {isLoading ? (
            <div className="p-16 text-center text-slate-500 text-xs font-medium">
              Đang tải danh sách sản phẩm...
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {paginatedProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={onSelectProduct}
                    onBuy={onBuyProduct}
                  />
                ))}
              </div>

              {/* Component Phân Trang Tự Động */}
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[6, 9, 12, 18, 24]}
                itemLabel="sản phẩm"
              />
            </>
          ) : (
            <div className="p-16 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm">
              <Search className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">Không tìm thấy sản phẩm nào</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Không có sản phẩm nào khớp với danh mục "{pageTitle}" hoặc bộ lọc hiện tại. Vui lòng thử lại với tiêu chí khác.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

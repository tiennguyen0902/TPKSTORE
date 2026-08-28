import React, { useEffect, useState } from "react";
import { Filter, SlidersHorizontal, ArrowUpDown, Tag, Search, RotateCcw } from "lucide-react";
import { Product, Category } from "../types";
import { ProductCard } from "./ProductCard";
import { api } from "../services/api";

interface CatalogViewProps {
  initialCategory?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectProduct: (p: Product) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  initialCategory,
  searchQuery,
  setSearchQuery,
  onSelectProduct
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

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

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange("all");
    setSortBy("newest");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#12192e] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Tất Cả Sản Phẩm</h1>
          <p className="text-xs text-slate-400 mt-1">
            Hiển thị {products.length} sản phẩm công nghệ chính hãng chất lượng cao
          </p>
        </div>

        {/* Sort and Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18233a] border border-slate-700 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-violet-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-[#12192e]">Mới nhất</option>
              <option value="price_asc" className="bg-[#12192e]">Giá tăng dần</option>
              <option value="price_desc" className="bg-[#12192e]">Giá giảm dần</option>
              <option value="rating_desc" className="bg-[#12192e]">Đánh giá cao</option>
            </select>
          </div>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
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
          <div className="p-5 rounded-3xl bg-[#12192e] border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              <Tag className="w-4 h-4 text-violet-400" />
              <span>Danh Mục Ngành Hàng</span>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === "all"
                    ? "bg-violet-600 text-white font-semibold shadow-md shadow-violet-600/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Tất cả danh mục ({categories.length})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                    selectedCategory === cat.slug || selectedCategory === cat.id
                      ? "bg-violet-600 text-white font-semibold shadow-md shadow-violet-600/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {cat.productCount !== undefined && (
                    <span className="text-[10px] opacity-70">({cat.productCount})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="p-5 rounded-3xl bg-[#12192e] border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
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
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name="price_range"
                    checked={selectedPriceRange === range.id}
                    onChange={() => {}}
                    className="accent-violet-600"
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Products Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="p-16 text-center text-slate-400 text-xs">
              Đang tải danh sách sản phẩm...
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            <div className="p-16 rounded-3xl bg-[#12192e] border border-slate-800 text-center space-y-3">
              <Search className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="font-bold text-white text-base">Không tìm thấy sản phẩm nào</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Không có sản phẩm nào khớp với bộ lọc hoặc từ khóa tìm kiếm. Vui lòng thử lại với tiêu chí khác.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

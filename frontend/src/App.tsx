import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { FloatingChatWidget } from "./components/FloatingChatWidget";
import { StorefrontHome } from "./components/StorefrontHome";
import { CatalogView } from "./components/CatalogView";
import { CartView } from "./components/CartView";
import { CheckoutView } from "./components/CheckoutView";
import { MyOrdersView } from "./components/MyOrdersView";
import { ProfileView } from "./components/ProfileView";
import { AuthView } from "./components/AuthView";
import { ProductModal } from "./components/ProductModal";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminProducts } from "./components/AdminProducts";
import { AdminCategories } from "./components/AdminCategories";
import { AdminOrders } from "./components/AdminOrders";
import { AdminCustomers } from "./components/AdminCustomers";
import { AdminInventoryAlerts } from "./components/AdminInventoryAlerts";
import { AdminAiForecast } from "./components/AdminAiForecast";
import { ArchitectureStudio } from "./components/ArchitectureStudio";
import { AdminSettings } from "./components/AdminSettings";
import { StaffDashboard } from "./components/StaffDashboard";
import { Product } from "./types";
import { ShieldAlert } from "lucide-react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { api } from "./services/api";

const VIEW_TO_PATH: Record<string, string> = {
  storefront: "/",
  catalog: "/products",
  cart: "/cart",
  checkout: "/checkout",
  my_orders: "/my-orders",
  profile: "/profile",
  auth: "/login",
  staff_dashboard: "/staff",
  admin_dashboard: "/admin/dashboard",
  admin_products: "/admin/products",
  admin_categories: "/admin/categories",
  admin_orders: "/admin/orders",
  admin_customers: "/admin/customers",
  admin_inventory: "/admin/inventory",
  admin_studio: "/admin/studio",
  admin_forecast: "/admin/forecast",
  admin_inventory_alerts: "/admin/inventory-alerts",
  admin_settings: "/admin/settings"
};

interface ParsedRoute {
  view: string;
  category?: string;
  search?: string;
  productIdOrSlug?: string;
}

function parseUrl(pathname: string, search: string): ParsedRoute {
  const params = new URLSearchParams(search);
  const categoryParam = params.get("category") || undefined;
  const searchParam = params.get("search") || undefined;

  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/" || path === "") {
    return { view: "storefront", category: categoryParam, search: searchParam };
  }

  if (path.startsWith("/products/")) {
    const idOrSlug = decodeURIComponent(path.slice("/products/".length));
    return {
      view: "catalog",
      productIdOrSlug: idOrSlug,
      category: categoryParam,
      search: searchParam
    };
  }

  if (path === "/products" || path === "/catalog") {
    return { view: "catalog", category: categoryParam, search: searchParam };
  }

  if (path === "/cart") return { view: "cart" };
  if (path === "/checkout") return { view: "checkout" };
  if (path === "/my-orders" || path === "/orders") return { view: "my_orders" };
  if (path === "/profile") return { view: "profile" };
  if (path === "/login" || path === "/auth") return { view: "auth" };
  if (path === "/staff") return { view: "staff_dashboard" };

  // Admin routes
  if (path === "/admin" || path === "/admin/dashboard") return { view: "admin_dashboard" };
  if (path === "/admin/products") return { view: "admin_products" };
  if (path === "/admin/categories") return { view: "admin_categories" };
  if (path === "/admin/orders") return { view: "admin_orders" };
  if (path === "/admin/customers") return { view: "admin_customers" };
  if (path === "/admin/inventory") return { view: "admin_inventory" };
  if (path === "/admin/studio") return { view: "admin_studio" };
  if (path === "/admin/forecast") return { view: "admin_forecast" };
  if (path === "/admin/inventory-alerts" || path === "/admin/alerts") return { view: "admin_inventory_alerts" };
  if (path === "/admin/settings") return { view: "admin_settings" };

  return { view: "storefront", category: categoryParam, search: searchParam };
}

const MainApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Khởi tạo state từ URL hiện tại để khi refresh/F5 hoặc gõ URL trực tiếp sẽ hiển thị đúng view
  const parsedInitial = parseUrl(location.pathname, location.search);
  const [currentView, setCurrentView] = useState<string>(parsedInitial.view);
  const [searchQuery, setSearchQuery] = useState<string>(parsedInitial.search || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(parsedInitial.category || "all");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [postAuthTarget, setPostAuthTarget] = useState<string | null>(null);
  const [authBanner, setAuthBanner] = useState<string>("");

  // Helper chuyển trang tương ứng với URL
  const handleNavigateView = (view: string) => {
    if (view === "catalog") {
      if (selectedCategory && selectedCategory !== "all") {
        navigate(`/products?category=${selectedCategory}`);
      } else {
        navigate("/products");
      }
      return;
    }
    const targetPath = VIEW_TO_PATH[view] || "/";
    navigate(targetPath);
  };

  // Helper chọn danh mục & chuyển trang catalog kèm query param URL
  const handleSelectCategory = (catSlug?: string) => {
    const slug = catSlug && catSlug !== "all" ? catSlug : "all";
    setSelectedCategory(slug);
    if (slug !== "all") {
      navigate(`/products?category=${slug}`);
    } else {
      navigate("/products");
    }
  };

  // Bấm vào sản phẩm: mở modal xem chi tiết và cập nhật URL /products/:idOrSlug
  const handleSelectProduct = (product: Product) => {
    setActiveProduct(product);
    const identifier = product.slug || product.id;
    navigate(`/products/${identifier}`);
  };

  // Đóng modal sản phẩm: trả URL về /products (hoặc giữ danh mục đã lọc)
  const handleCloseProductModal = () => {
    setActiveProduct(null);
    if (selectedCategory && selectedCategory !== "all") {
      navigate(`/products?category=${selectedCategory}`);
    } else {
      navigate("/products");
    }
  };

  // Lắng nghe thay đổi URL (từ back/forward, direct link, F5 refresh, hoặc navigate)
  useEffect(() => {
    const parsed = parseUrl(location.pathname, location.search);

    // Đồng bộ view
    if (parsed.view !== currentView) {
      setCurrentView(parsed.view);
    }

    // Đồng bộ danh mục từ URL params (?category=...)
    if (parsed.category) {
      if (parsed.category !== selectedCategory) {
        setSelectedCategory(parsed.category);
      }
    } else if (location.pathname === "/" || location.pathname === "/products") {
      if (selectedCategory !== "all" && !location.search.includes("category=")) {
        setSelectedCategory("all");
      }
    }

    // Đồng bộ từ khóa tìm kiếm (?search=...)
    if (parsed.search !== undefined) {
      if (parsed.search !== searchQuery) {
        setSearchQuery(parsed.search);
      }
    }

    // Đồng bộ modal sản phẩm theo URL /products/:idOrSlug
    if (parsed.productIdOrSlug) {
      const targetIdOrSlug = parsed.productIdOrSlug;
      if (!activeProduct || (activeProduct.id !== targetIdOrSlug && activeProduct.slug !== targetIdOrSlug)) {
        api.getProduct(targetIdOrSlug)
          .then((product) => {
            if (product) {
              setActiveProduct(product);
              if (product.category?.slug) {
                setSelectedCategory(product.category.slug);
              }
            }
          })
          .catch((err) => {
            console.warn("Không tìm thấy sản phẩm từ URL:", err);
          });
      }
    } else {
      if (activeProduct) {
        setActiveProduct(null);
      }
    }
  }, [location.pathname, location.search]);

  // Tự động chuyển hướng & Bảo vệ các view yêu cầu tài khoản
  useEffect(() => {
    if (!isLoading) {
      if (user && currentView === "auth") {
        const target = postAuthTarget || "storefront";
        setPostAuthTarget(null);
        setAuthBanner("");
        handleNavigateView(target);
      } else if (!user) {
        const protectedViews = ["checkout", "my_orders", "profile"];
        if (protectedViews.includes(currentView)) {
          setPostAuthTarget(currentView);
          setAuthBanner("Vui lòng đăng nhập tài khoản để tiến hành mua hàng và thanh toán!");
          navigate("/login");
        }
      }
    }
  }, [user, isLoading, currentView, postAuthTarget]);

  // Bấm vào Chatbot AI: mở trợ lý AI tư vấn bình thường
  const handleOpenChat = () => {
    const el = document.querySelector("#floating-chat-button") as HTMLElement;
    if (el) el.click();
  };

  // Bấm đến bước mua hàng / thanh toán: ĐẾN BƯỚC NÀY MỚI BẮT ĐĂNG NHẬP
  const handleProceedToBuy = () => {
    if (!user) {
      setPostAuthTarget("checkout");
      setAuthBanner("Vui lòng đăng nhập tài khoản để tiến hành mua hàng và thanh toán đơn hàng!");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  const isAdminRoute = currentView.startsWith("admin_");

  // Route Protection: Admin Portal
  if (isAdminRoute && user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
        <Navbar
          currentView={currentView}
          setCurrentView={handleNavigateView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleSelectCategory}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#131c2e] border border-slate-800 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-white">Yêu Cầu Quyền Quản Trị Viên</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khu vực này yêu cầu đăng nhập bằng tài khoản Quản trị viên (ADMIN). Vui lòng đăng nhập để tiếp tục.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Về cửa hàng
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </main>
        <Footer onNavigateCategory={handleSelectCategory} />
      </div>
    );
  }

  // Route Protection: Staff Portal
  if (currentView === "staff_dashboard" && user?.role !== "STAFF" && user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
        <Navbar
          currentView={currentView}
          setCurrentView={handleNavigateView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleSelectCategory}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#131c2e] border border-slate-800 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-white">Yêu Cầu Quyền Nhân Viên Vận Hành</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cổng vận hành yêu cầu tài khoản Nhân viên (STAFF) hoặc Quản trị viên (ADMIN).
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Về cửa hàng
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </main>
        <Footer onNavigateCategory={handleSelectCategory} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-violet-600 selection:text-white">
      {/* If Admin view -> Render Admin Layout with Sidebar */}
      {isAdminRoute ? (
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar
            activeTab={currentView}
            setActiveTab={handleNavigateView}
            onNavigateHome={() => navigate("/")}
          />
          <main className="flex-1 overflow-y-auto bg-[#0b0f19] p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {currentView === "admin_dashboard" && <AdminDashboard onNavigateTab={handleNavigateView} />}
              {currentView === "admin_products" && <AdminProducts />}
              {currentView === "admin_categories" && <AdminCategories />}
              {currentView === "admin_orders" && <AdminOrders />}
              {currentView === "admin_customers" && <AdminCustomers />}
              {currentView === "admin_inventory" && <AdminInventoryAlerts />}
              {currentView === "admin_studio" && <ArchitectureStudio />}
              {currentView === "admin_forecast" && <AdminAiForecast />}
              {currentView === "admin_inventory_alerts" && <AdminInventoryAlerts />}
              {currentView === "admin_settings" && <AdminSettings />}
            </div>
          </main>
        </div>
      ) : (
        /* Customer & Staff Storefront Layout */
        <>
          <Navbar
            currentView={currentView}
            setCurrentView={handleNavigateView}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleSelectCategory}
          />

          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
            {/* View Đăng nhập / Đăng ký: Chỉ hiển thị khi CHƯA đăng nhập */}
            {currentView === "auth" && !user && (
              <AuthView 
                messageBanner={authBanner}
                onBackToStore={() => {
                  setAuthBanner("");
                  setPostAuthTarget(null);
                  navigate("/");
                }}
                onSuccess={() => {
                  const target = postAuthTarget || "storefront";
                  setPostAuthTarget(null);
                  setAuthBanner("");
                  handleNavigateView(target);
                }} 
              />
            )}

            {/* Màn hình chính Storefront: Hiện khi view là storefront hoặc nếu người dùng đã đăng nhập */}
            {(currentView === "storefront" || (currentView === "auth" && user)) && (
              <StorefrontHome
                onSelectProduct={handleSelectProduct}
                onNavigateCatalog={handleSelectCategory}
                onOpenChat={handleOpenChat}
              />
            )}

            {currentView === "catalog" && (
              <CatalogView
                initialCategory={selectedCategory}
                onCategoryChange={handleSelectCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentView === "cart" && (
              <CartView
                onNavigateCatalog={() => navigate("/products")}
                onProceedToCheckout={handleProceedToBuy}
              />
            )}

            {currentView === "checkout" && (
              <CheckoutView
                onBackToCart={() => navigate("/cart")}
                onOrderSuccess={(orderId) => {
                  navigate("/my-orders");
                }}
              />
            )}

            {currentView === "my_orders" && (
              <MyOrdersView onNavigateCatalog={() => navigate("/products")} />
            )}

            {currentView === "profile" && <ProfileView />}

            {currentView === "staff_dashboard" && <StaffDashboard />}
          </main>

          <Footer onNavigateCategory={handleSelectCategory} />
        </>
      )}

      {/* Floating AI Chatbot Widget - Khách có thể chat với AI tư vấn bình thường */}
      <FloatingChatWidget 
        onSelectProduct={handleSelectProduct}
      />

      {/* Global Product Details Modal */}
      {activeProduct && (
        <ErrorBoundary
          fallbackTitle="Không thể hiển thị thông tin sản phẩm"
          fallbackMessage="Đã xảy ra sự cố khi tải chi tiết sản phẩm này. Bạn có thể đóng cửa sổ và thử lại."
          onReset={() => handleCloseProductModal()}
        >
          <ProductModal
            product={activeProduct}
            onClose={handleCloseProductModal}
            onSelectProduct={handleSelectProduct}
            onGoToCheckout={() => {
              setActiveProduct(null);
              handleProceedToBuy();
            }}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

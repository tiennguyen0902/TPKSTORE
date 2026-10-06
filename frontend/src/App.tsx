import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider, useToast } from "./context/ToastContext";
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
import { StockTicketsView } from "./components/StockTicketsView";
import { CounterPosView } from "./components/CounterPosView";
import { LoginModal } from "./components/LoginModal";
import { Product } from "./types";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
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
  pos_counter: "/pos",
  warehouse_dashboard: "/warehouse",
  staff_dashboard: "/warehouse",
  admin_dashboard: "/admin/dashboard",
  admin_pos: "/admin/pos",
  admin_products: "/admin/products",
  admin_categories: "/admin/categories",
  admin_orders: "/admin/orders",
  admin_customers: "/admin/customers",
  admin_inventory: "/admin/inventory",
  admin_stock_tickets: "/admin/stock-tickets",
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
  if (path === "/pos" || path === "/ban-hang-pos") return { view: "pos_counter" };
  if (path === "/warehouse" || path === "/staff" || path === "/kho") return { view: "warehouse_dashboard" };

  // Admin routes
  if (path === "/admin" || path === "/admin/dashboard") return { view: "admin_dashboard" };
  if (path === "/admin/pos") return { view: "admin_pos" };
  if (path === "/admin/products") return { view: "admin_products" };
  if (path === "/admin/categories") return { view: "admin_categories" };
  if (path === "/admin/orders") return { view: "admin_orders" };
  if (path === "/admin/customers") return { view: "admin_customers" };
  if (path === "/admin/inventory") return { view: "admin_inventory" };
  if (path === "/admin/stock-tickets" || path === "/admin/tickets") return { view: "admin_stock_tickets" };
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

  // Quản lý Modal Popup đăng nhập khi mua hàng
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginModalProduct, setLoginModalProduct] = useState<Product | null>(null);
  const { showToast } = useToast();

  // Mở popup đăng nhập và lưu lại sản phẩm khách đang chọn mua
  const handleTriggerLoginModal = (targetProduct?: Product | null) => {
    const prod = targetProduct || activeProduct || null;
    setLoginModalProduct(prod);
    setIsLoginModalOpen(true);
  };

  // Đăng nhập thành công: hiển thị thông báo "Đăng nhập thành công !" toàn hệ thống ở góc trái
  const showLoginSuccessToast = () => {
    showToast("Đăng nhập thành công !", "success");
  };

  // Đăng nhập thành công từ Popup: quay lại đúng sản phẩm đã chọn mua
  const handleLoginModalSuccess = (loggedInUser: any) => {
    setIsLoginModalOpen(false);
    showLoginSuccessToast();

    if (loginModalProduct) {
      // Đảm bảo quay lại đúng sản phẩm của khách hàng đã chọn mua
      setActiveProduct(loginModalProduct);
      const identifier = loginModalProduct.slug || loginModalProduct.id;
      navigate(`/products/${identifier}`);
    } else if (currentView === "cart") {
      navigate("/checkout");
    }
  };

  // Xử lý khi khách bấm nút "Mua ngay" trên thẻ sản phẩm hoặc banner
  const handleBuyProduct = (product: Product) => {
    if (!user) {
      handleTriggerLoginModal(product);
      return;
    }
    handleSelectProduct(product);
  };

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
      if (user && user.role === "MANAGER" && currentView === "admin_dashboard") {
        handleNavigateView("admin_stock_tickets");
      }
    }
  }, [user, isLoading, currentView, postAuthTarget]);

  // Bấm vào Chatbot AI: mở trợ lý AI tư vấn bình thường
  const handleOpenChat = () => {
    const el = document.querySelector("#floating-chat-button") as HTMLElement;
    if (el) el.click();
  };

  // Bấm đến bước mua hàng / thanh toán: Bật popup đăng nhập nếu chưa đăng nhập
  const handleProceedToBuy = () => {
    if (!user) {
      handleTriggerLoginModal(activeProduct);
      return;
    }
    navigate("/checkout");
  };

  // Nếu phiên đăng nhập đang được đồng bộ và chưa có thông tin user, hiển thị loading nhẹ nhàng tránh giật màn hình
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-10 h-10 border-3 border-rose-600/20 border-t-rose-600 rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-500">Đang đồng bộ phiên làm việc...</p>
      </div>
    );
  }

  const isAdminRoute = currentView.startsWith("admin_");

  // Giới hạn quyền hạn Quản lý kho (MANAGER): Chỉ có quyền quản lý kho và duyệt nhập xuất kho
  const isManagerRestrictedView = !isLoading && user?.role === "MANAGER" && (
    currentView === "pos_counter" ||
    (isAdminRoute && currentView !== "admin_inventory" && currentView !== "admin_stock_tickets")
  );

  if (isManagerRestrictedView) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
        <Navbar
          currentView={currentView}
          setCurrentView={handleNavigateView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleSelectCategory}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Giới Hạn Quyền Quản Lý Kho</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tài khoản Quản lý kho (MANAGER) chỉ có quyền quản lý kho hàng và duyệt phiếu nhập/xuất kho, không có quyền thao tác bán hàng tại quầy (POS) hoặc các chức năng quản trị khác.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => navigate("/warehouse")}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-colors"
              >
                Quản lý kho hàng
              </button>
              <button
                onClick={() => navigate("/admin/stock-tickets")}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-colors"
              >
                Duyệt xuất / nhập kho
              </button>
            </div>
          </div>
        </main>
        <Footer onNavigateCategory={handleSelectCategory} />
      </div>
    );
  }

  // Route Protection: Admin & Warehouse Manager Portal
  if (!isLoading && isAdminRoute && user?.role !== "ADMIN" && user?.role !== "MANAGER") {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
        <Navbar
          currentView={currentView}
          setCurrentView={handleNavigateView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleSelectCategory}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Yêu Cầu Quyền Quản Trị Hoặc Quản Lý Kho</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Khu vực này yêu cầu đăng nhập bằng tài khoản Quản trị viên (ADMIN) hoặc Quản lý kho (MANAGER). Vui lòng đăng nhập để tiếp tục.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Về cửa hàng
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
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

  // Route Protection: Staff POS & Warehouse Portal
  const isStaffArea = currentView === "pos_counter" || currentView === "warehouse_dashboard" || currentView === "staff_dashboard";
  if (!isLoading && isStaffArea && user?.role !== "STAFF" && user?.role !== "ADMIN" && user?.role !== "MANAGER") {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
        <Navbar
          currentView={currentView}
          setCurrentView={handleNavigateView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleSelectCategory}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Yêu Cầu Quyền Nhân Viên Vận Hành</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Khu vực yêu cầu tài khoản Nhân viên (STAFF), Quản lý kho (MANAGER) hoặc Quản trị viên (ADMIN).
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Về cửa hàng
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* If Admin view -> Render Admin Layout with Sidebar */}
      {isAdminRoute ? (
        <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
          <AdminSidebar
            activeTab={currentView}
            setActiveTab={handleNavigateView}
            onNavigateHome={() => navigate("/")}
          />
          <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {currentView === "admin_dashboard" && <AdminDashboard onNavigateTab={handleNavigateView} />}
              {currentView === "admin_pos" && <CounterPosView onNavigateWarehouse={() => navigate("/admin/stock-tickets")} />}
              {currentView === "admin_stock_tickets" && <StockTicketsView embeddedRole={user?.role as any} />}
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
                  showLoginSuccessToast();
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
                onBuyProduct={handleBuyProduct}
              />
            )}

            {currentView === "catalog" && (
              <CatalogView
                initialCategory={selectedCategory}
                onCategoryChange={handleSelectCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectProduct={handleSelectProduct}
                onBuyProduct={handleBuyProduct}
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

            {currentView === "pos_counter" && (
              <CounterPosView onNavigateWarehouse={() => navigate("/warehouse")} />
            )}

            {(currentView === "warehouse_dashboard" || currentView === "staff_dashboard") && (
              <StaffDashboard onNavigatePos={() => navigate("/pos")} />
            )}
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
            onRequireLogin={(prod) => {
              handleTriggerLoginModal(prod);
            }}
            onGoToCheckout={() => {
              if (!user) {
                handleTriggerLoginModal(activeProduct);
                return;
              }
              setActiveProduct(null);
              navigate("/checkout");
            }}
          />
        </ErrorBoundary>
      )}

      {/* Global Login Popup Modal: Hiển thị popup đăng nhập khi bấm mua hàng */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        pendingProduct={loginModalProduct}
        onSuccess={handleLoginModalSuccess}
      />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

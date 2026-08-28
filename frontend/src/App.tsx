import React, { useState } from "react";
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

const MainApp: React.FC = () => {
  const { user } = useAuth();
  // Trang chủ mặc định khi vào dự án là phần Đăng nhập / Đăng ký (auth)
  const [currentView, setCurrentView] = useState<string>("auth");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const isAdminRoute = currentView.startsWith("admin_");

  // Route Protection: Admin Portal
  if (isAdminRoute && user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
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
                onClick={() => setCurrentView("storefront")}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Về cửa hàng
              </button>
              <button
                onClick={() => setCurrentView("auth")}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </main>
        <Footer onNavigateCategory={(catSlug) => {
          setSelectedCategory(catSlug);
          setCurrentView("catalog");
        }} />
      </div>
    );
  }

  // Route Protection: Staff Portal
  if (currentView === "staff_dashboard" && user?.role !== "STAFF" && user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
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
                onClick={() => setCurrentView("storefront")}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Về cửa hàng
              </button>
              <button
                onClick={() => setCurrentView("auth")}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </main>
        <Footer onNavigateCategory={(catSlug) => {
          setSelectedCategory(catSlug);
          setCurrentView("catalog");
        }} />
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
            setActiveTab={setCurrentView}
            onNavigateHome={() => setCurrentView("storefront")}
          />
          <main className="flex-1 overflow-y-auto bg-[#0b0f19] p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {currentView === "admin_dashboard" && <AdminDashboard onNavigateTab={setCurrentView} />}
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
            setCurrentView={setCurrentView}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
            {/* View Đăng nhập / Đăng ký (Mặc định khi mở dự án) */}
            {currentView === "auth" && (
              <AuthView 
                onSuccess={(role) => {
                  if (role === "ADMIN") {
                    setCurrentView("admin_dashboard");
                  } else if (role === "STAFF") {
                    setCurrentView("staff_dashboard");
                  } else {
                    setCurrentView("storefront");
                  }
                }} 
              />
            )}

            {currentView === "storefront" && (
              <StorefrontHome
                onSelectProduct={(p) => setActiveProduct(p)}
                onNavigateCatalog={(catSlug) => {
                  if (catSlug) setSelectedCategory(catSlug);
                  setCurrentView("catalog");
                }}
                onOpenChat={() => {
                  const el = document.querySelector("button[title='Chat']") as HTMLElement;
                  if (el) el.click();
                }}
              />
            )}

            {currentView === "catalog" && (
              <CatalogView
                initialCategory={selectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectProduct={(p) => setActiveProduct(p)}
              />
            )}

            {currentView === "cart" && (
              <CartView
                onNavigateCatalog={() => setCurrentView("catalog")}
                onProceedToCheckout={() => setCurrentView("checkout")}
              />
            )}

            {currentView === "checkout" && (
              <CheckoutView
                onBackToCart={() => setCurrentView("cart")}
                onOrderSuccess={(orderId) => {
                  setCurrentView("my_orders");
                }}
              />
            )}

            {currentView === "my_orders" && (
              <MyOrdersView onNavigateCatalog={() => setCurrentView("catalog")} />
            )}

            {currentView === "profile" && <ProfileView />}

            {currentView === "staff_dashboard" && <StaffDashboard />}
          </main>

          <Footer onNavigateCategory={(catSlug) => {
            setSelectedCategory(catSlug);
            setCurrentView("catalog");
          }} />

          {/* Floating AI Chatbot Widget */}
          <FloatingChatWidget onSelectProduct={(p) => setActiveProduct(p)} />
        </>
      )}

      {/* Global Product Details Modal */}
      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onSelectProduct={(p) => setActiveProduct(p)}
          onGoToCheckout={() => {
            setActiveProduct(null);
            setCurrentView("checkout");
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}

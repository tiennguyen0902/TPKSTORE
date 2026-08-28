import { User, Product, Category, CartData, Order, InventoryAlert, ForecastData, SystemSettings } from "../types";

const API_BASE = "http://localhost:5000/api";

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("store_ai_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Đăng nhập thất bại");
    return data;
  },

  async register(data: { email: string; password: string; fullName: string; phone?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Đăng ký thất bại");
    return json;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Chưa xác thực");
    return data;
  },

  async updateProfile(data: { fullName?: string; phone?: string; address?: string; avatar?: string }) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Cập nhật thất bại");
    return json;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Đổi mật khẩu thất bại");
    return json;
  },

  // Products & Categories
  async getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    isFeatured?: boolean;
    isNew?: boolean;
  }): Promise<{ total: number; products: Product[] }> {
    const url = new URL(`${API_BASE}/products`);
    if (params) {
      if (params.category) url.searchParams.append("category", params.category);
      if (params.search) url.searchParams.append("search", params.search);
      if (params.minPrice !== undefined) url.searchParams.append("minPrice", params.minPrice.toString());
      if (params.maxPrice !== undefined) url.searchParams.append("maxPrice", params.maxPrice.toString());
      if (params.sortBy) url.searchParams.append("sortBy", params.sortBy);
      if (params.isFeatured !== undefined) url.searchParams.append("isFeatured", params.isFeatured.toString());
      if (params.isNew !== undefined) url.searchParams.append("isNew", params.isNew.toString());
    }
    const res = await fetch(url.toString());
    return res.json();
  },

  async getProduct(idOrSlug: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
    if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
    return res.json();
  },

  async createProduct(data: any) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Thêm sản phẩm thất bại");
    return json;
  },

  async updateProduct(id: string, data: any) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Cập nhật sản phẩm thất bại");
    return json;
  },

  async deleteProduct(id: string) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Xóa sản phẩm thất bại");
    return json;
  },

  async getCategories(): Promise<{ total: number; categories: Category[] }> {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },

  async createCategory(data: any) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Tạo danh mục thất bại");
    return json;
  },

  async updateCategory(id: string, data: any) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Cập nhật danh mục thất bại");
    return json;
  },

  async deleteCategory(id: string) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Xóa danh mục thất bại");
    return json;
  },

  // Cart
  async getCart(): Promise<CartData> {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error("Lỗi tải giỏ hàng");
    return res.json();
  },

  async addToCart(productId: string, quantity: number = 1) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/cart/items`, {
      method: "POST",
      headers,
      body: JSON.stringify({ productId, quantity })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Lỗi thêm giỏ hàng");
    return json;
  },

  async updateCartQuantity(cartItemId: string, quantity: number) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/cart/items/${cartItemId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ quantity })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Lỗi sửa số lượng");
    return json;
  },

  async removeCartItem(cartItemId: string) {
    const res = await fetch(`${API_BASE}/cart/items/${cartItemId}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async clearCart() {
    const res = await fetch(`${API_BASE}/cart`, {
      method: "DELETE",
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Orders
  async createOrder(data: {
    customerName: string;
    phone: string;
    shippingAddress: string;
    note?: string;
    paymentMethod: "COD" | "VNPAY" | "MOMO";
    items?: { productId: string; quantity: number }[];
  }) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Đặt hàng thất bại");
    return json;
  },

  async getMyOrders(): Promise<{ total: number; orders: Order[] }> {
    const res = await fetch(`${API_BASE}/orders/my`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAllOrders(status?: string, search?: string): Promise<{ total: number; orders: Order[] }> {
    const url = new URL(`${API_BASE}/orders`);
    if (status) url.searchParams.append("status", status);
    if (search) url.searchParams.append("search", search);
    const res = await fetch(url.toString(), {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async updateOrderStatus(orderId: string, status: string) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/status`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Cập nhật trạng thái thất bại");
    return json;
  },

  async cancelOrder(orderId: string) {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/cancel`, {
      method: "POST",
      headers: { ...getAuthHeader() }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Hủy đơn hàng thất bại");
    return json;
  },

  // Payment VNPAY
  async createVnpayUrl(orderId: string, amount: number, bankCode?: string) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/payment/create-vnpay-url`, {
      method: "POST",
      headers,
      body: JSON.stringify({ orderId, amount, bankCode })
    });
    return res.json();
  },

  async confirmVnpayIpn(orderId: string, responseCode: string = "00") {
    const res = await fetch(`${API_BASE}/payment/vnpay-ipn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, responseCode, transactionNo: `VNPAY_${Date.now()}` })
    });
    return res.json();
  },

  // Payment MoMo Sandbox (MoMo Gateway v2)
  async createMomoUrl(orderId: string, amount: number, orderInfo?: string, redirectUrl?: string) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/payment/create-momo-url`, {
      method: "POST",
      headers,
      body: JSON.stringify({ orderId, amount, orderInfo, redirectUrl })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Không thể tạo liên kết thanh toán MoMo");
    return json;
  },

  async confirmMomoPayment(orderId: string, resultCode: number = 0, transId?: string) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/payment/momo-confirm`, {
      method: "POST",
      headers,
      body: JSON.stringify({ orderId, resultCode, transId: transId || `MOMO_${Date.now()}` })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Xác nhận thanh toán MoMo thất bại");
    return json;
  },

  // AI Services
  async testAiKey(params: {
    provider?: "gemini" | "openai";
    apiKey?: string;
    model?: string;
    geminiApiKey?: string;
    geminiModel?: string;
    openaiApiKey?: string;
    openaiModel?: string;
  }): Promise<{
    status: string;
    valid: boolean;
    provider?: string;
    model?: string;
    message: string;
    sampleResponse?: string;
  }> {
    const res = await fetch(`${API_BASE}/ai/test-key`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(params)
    });
    return res.json();
  },

  async testGeminiKey(geminiApiKey?: string, geminiModel?: string) {
    return this.testAiKey({ provider: "gemini", geminiApiKey, geminiModel });
  },

  async testOpenAiKey(openaiApiKey?: string, openaiModel?: string) {
    return this.testAiKey({ provider: "openai", openaiApiKey, openaiModel });
  },

  async getAiRecommendations(targetProductId?: string, limit: number = 4) {
    const res = await fetch(`${API_BASE}/ai/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetProductId, limit })
    });
    return res.json();
  },

  async chatWithAi(message: string, history: any[] = [], provider?: "gemini" | "openai") {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, provider })
    });
    return res.json();
  },

  async getAiForecast(days: number = 30): Promise<{ status: string; data: ForecastData }> {
    const res = await fetch(`${API_BASE}/ai/forecast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days })
    });
    return res.json();
  },

  async getInventoryAlerts(): Promise<{ status: string; alerts: InventoryAlert[] }> {
    const res = await fetch(`${API_BASE}/ai/inventory-alerts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    return res.json();
  },

  async approveReorder(productId: string, reorderQty: number) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/ai/reorder-approve`, {
      method: "POST",
      headers,
      body: JSON.stringify({ productId, reorderQty })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Duyệt nhập hàng thất bại");
    return json;
  },

  async analyzeArchitecture(components: any[], connections: any[]) {
    const res = await fetch(`${API_BASE}/ai/analyze-architecture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ components, connections })
    });
    return res.json();
  },

  // Admin User Management & Settings
  async getAllUsers(role?: string, search?: string): Promise<{ total: number; users: User[] }> {
    const url = new URL(`${API_BASE}/users`);
    if (role) url.searchParams.append("role", role);
    if (search) url.searchParams.append("search", search);
    const res = await fetch(url.toString(), {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async updateUserRole(userId: string, role: string) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/users/${userId}/role`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ role })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Cập nhật vai trò thất bại");
    return json;
  },

  async toggleUserActive(userId: string) {
    const res = await fetch(`${API_BASE}/users/${userId}/toggle-active`, {
      method: "PUT",
      headers: { ...getAuthHeader() }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Thao tác thất bại");
    return json;
  },

  async getSettings(): Promise<SystemSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  async updateSettings(data: Partial<SystemSettings>) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/settings`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Lưu cài đặt thất bại");
    return json;
  }
};

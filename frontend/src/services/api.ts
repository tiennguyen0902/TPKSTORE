import { User, Product, Category, CartData, Order, InventoryAlert, ForecastData, SystemSettings, StockTicket } from "../types";

const API_BASE = 
  import.meta.env.VITE_API_BASE || 
  (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && (window.location.port === "5173" || window.location.port === "3000")
    ? "http://localhost:5000/api" 
    : "/api");

function buildUrl(path: string): URL {
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:5000";
  return new URL(`${API_BASE}${path.startsWith('/') ? path : '/' + path}`, origin);
}

let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("store_ai_refresh_token");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });
    if (!res.ok) {
      localStorage.removeItem("store_ai_access_token");
      localStorage.removeItem("store_ai_refresh_token");
      return null;
    }
    const data = await res.json();
    if (data?.tokens?.accessToken) {
      localStorage.setItem("store_ai_access_token", data.tokens.accessToken);
      if (data.tokens.refreshToken) {
        localStorage.setItem("store_ai_refresh_token", data.tokens.refreshToken);
      }
      return data.tokens.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchWithAuth(url: string | URL, init: RequestInit = {}): Promise<Response> {
  const currentToken = localStorage.getItem("store_ai_access_token");
  const headers = new Headers(init.headers || {});
  if (currentToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${currentToken}`);
  }

  let res = await fetch(url.toString(), { ...init, headers });

  // If 401 or 403 (token expired or invalid), attempt silent auto-refresh
  if (res.status === 401 || res.status === 403) {
    const cloned = res.clone();
    let isExpired = false;
    try {
      const data = await cloned.json();
      if (data.error && (data.error.includes("hết hạn") || data.error.includes("không hợp lệ") || data.error.includes("Token đã bị"))) {
        isExpired = true;
      }
    } catch {}

    if (isExpired) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await tryRefreshToken();
        isRefreshing = false;
        onRefreshed(newToken);

        if (newToken) {
          headers.set("Authorization", `Bearer ${newToken}`);
          return fetch(url.toString(), { ...init, headers });
        }
      } else {
        const retryToken = await new Promise<string | null>((resolve) => {
          subscribeTokenRefresh(resolve);
        });
        if (retryToken) {
          headers.set("Authorization", `Bearer ${retryToken}`);
          return fetch(url.toString(), { ...init, headers });
        }
      }
    }
  }

  return res;
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("store_ai_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res: Response, defaultError: string = "Thao tác thất bại") {
  const text = await res.text();
  let json: any = {};
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Máy chủ Backend không phản hồi đúng định dạng JSON (${res.status} ${res.statusText}). Vui lòng đảm bảo Backend API (cổng 5000) đang chạy.`);
  }
  if (!res.ok) throw new Error(json.error || defaultError);
  return json;
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res, "Đăng nhập thất bại");
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
    const currentRefreshToken = localStorage.getItem("store_ai_refresh_token");
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ currentPassword, newPassword, currentRefreshToken })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Đổi mật khẩu thất bại");
    if (json.tokens?.accessToken) {
      localStorage.setItem("store_ai_access_token", json.tokens.accessToken);
    }
    if (json.tokens?.refreshToken) {
      localStorage.setItem("store_ai_refresh_token", json.tokens.refreshToken);
    }
    return json;
  },

  async uploadAvatar(file: File): Promise<{ message: string; avatar: string; user: any }> {
    return new Promise((resolve, reject) => {
      // Kiểm tra kích thước phía client trước khi upload
      if (file.size > 3 * 1024 * 1024) {
        reject(new Error("Ảnh phải có kích thước nhỏ hơn 3MB."));
        return;
      }
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        reject(new Error("Chỉ chấp nhận file ảnh định dạng JPEG, PNG, GIF hoặc WebP."));
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result as string;
          const res = await fetch(`${API_BASE}/auth/upload-avatar`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...getAuthHeader() },
            body: JSON.stringify({ base64, mimeType: file.type })
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Upload avatar thất bại");
          resolve(json);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error("Đọc file ảnh thất bại."));
      reader.readAsDataURL(file);
    });
  },

  async forgotPassword(email: string): Promise<{ message: string; otp?: string; email: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Gửi yêu cầu khôi phục thất bại");
    return json;
  },

  async resetPassword(data: { email: string; otp: string; newPassword: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Đặt lại mật khẩu thất bại");
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
    limit?: number;
    page?: number;
  }): Promise<{ total: number; products: Product[] }> {
    const url = buildUrl("/products");
    if (params) {
      if (params.category) url.searchParams.append("category", params.category);
      if (params.search) url.searchParams.append("search", params.search);
      if (params.minPrice !== undefined) url.searchParams.append("minPrice", params.minPrice.toString());
      if (params.maxPrice !== undefined) url.searchParams.append("maxPrice", params.maxPrice.toString());
      if (params.sortBy) url.searchParams.append("sortBy", params.sortBy);
      if (params.isFeatured !== undefined) url.searchParams.append("isFeatured", params.isFeatured.toString());
      if (params.isNew !== undefined) url.searchParams.append("isNew", params.isNew.toString());
      if (params.limit !== undefined) url.searchParams.append("limit", params.limit.toString());
      if (params.page !== undefined) url.searchParams.append("page", params.page.toString());
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
    const res = await fetchWithAuth(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return handleResponse(res, "Thêm sản phẩm thất bại");
  },

  async updateProduct(id: string, data: any) {
    const res = await fetchWithAuth(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return handleResponse(res, "Cập nhật sản phẩm thất bại");
  },

  async deleteProduct(id: string) {
    const res = await fetchWithAuth(`${API_BASE}/products/${id}`, {
      method: "DELETE"
    });
    return handleResponse(res, "Xóa sản phẩm thất bại");
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

  // Customer Lookup & Quick Walk-in Registration (Retail POS & Staff Consultation)
  async lookupCustomer(phone: string): Promise<{
    found: boolean;
    message?: string;
    customer?: {
      id: string;
      fullName: string;
      phone: string;
      email: string;
      address?: string;
      role: string;
      totalOrders: number;
      totalSpent: number;
      loyaltyPoints: number;
      recentOrders: any[];
    };
  }> {
    const url = buildUrl("/users/lookup");
    url.searchParams.append("phone", phone);
    const headers: Record<string, string> = { ...getAuthHeader() };
    const res = await fetchWithAuth(url.toString(), { headers });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Lỗi tra cứu khách hàng");
    return json;
  },

  async quickCreateCustomer(data: { fullName: string; phone: string; address?: string }) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/users/quick-customer`, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Lỗi tạo hồ sơ khách lẻ");
    return json;
  },

  // Orders
  async createOrder(data: {
    customerName: string;
    phone: string;
    shippingAddress: string;
    note?: string;
    paymentMethod: "COD" | "VNPAY" | "MOMO";
    items?: { productId: string; quantity: number }[];
    isCounterOrder?: boolean;
    isWalkIn?: boolean;
    discountAmount?: number;
    paymentStatus?: "COMPLETED" | "PENDING";
    status?: "DELIVERED" | "CONFIRMED" | "PENDING";
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

  async createPosOrder(data: {
    customerName?: string;
    phone: string;
    shippingAddress?: string;
    note?: string;
    paymentMethod: "COD" | "VNPAY" | "MOMO";
    items: { productId: string; quantity: number }[];
    discountAmount?: number;
    paymentStatus?: "COMPLETED" | "PENDING";
    status?: "DELIVERED" | "CONFIRMED" | "PENDING";
  }) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/orders/pos`, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Lập đơn hàng tại quầy thất bại");
    return json;
  },

  async getMyOrders(): Promise<{ total: number; orders: Order[] }> {
    const res = await fetch(`${API_BASE}/orders/my`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAllOrders(status?: string, search?: string): Promise<{ total: number; orders: Order[] }> {
    const url = buildUrl("/orders");
    if (status) url.searchParams.append("status", status);
    if (search) url.searchParams.append("search", search);
    const res = await fetch(url.toString(), {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getOrder(orderId: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}`, {
      headers: { ...getAuthHeader() }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Không tìm thấy đơn hàng");
    return json;
  },

  async updateOrderStatus(orderId: string, status: string, paymentStatus?: string) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/status`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status, paymentStatus })
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
    provider?: "gemini" | "local";
    apiKey?: string;
    model?: string;
    geminiApiKey?: string;
    geminiModel?: string;
    localAiUrl?: string;
    localAiModel?: string;
  }): Promise<{
    status: string;
    valid: boolean;
    provider?: string;
    model?: string;
    message: string;
    sampleResponse?: string;
    availableModels?: string[];
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

  async testLocalAi(localAiUrl?: string, localAiModel?: string) {
    return this.testAiKey({ provider: "local", localAiUrl, localAiModel });
  },

  async getAiRecommendations(targetProductId?: string, limit: number = 4) {
    const res = await fetch(`${API_BASE}/ai/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetProductId, limit })
    });
    return res.json();
  },

  async chatWithAi(
    message: string,
    history: any[] = [],
    provider?: "gemini" | "local",
    image?: string,
    isVoice?: boolean,
    imageBase64?: string,
    imageMimeType?: string
  ) {
    const imgPayload = image || imageBase64;
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ 
        message, 
        history, 
        provider, 
        image: imgPayload, 
        imageBase64: imgPayload, 
        imageMimeType, 
        isVoice 
      })
    });
    return res.json();
  },

  async chatWithAiStream(
    message: string,
    history: any[] = [],
    provider = "local",
    image?: string,
    onToken?: (token: string) => void,
    onComplete?: (metadata: any) => void,
    onError?: (err: any) => void
  ) {
    try {
      const res = await fetch(`${API_BASE}/ai/chat-stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
        body: JSON.stringify({ message, history, provider, image })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Lỗi kết nối máy chủ AI (${res.status})`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Không thể khởi tạo luồng đọc dữ liệu thời gian thực");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data:")) {
            const jsonStr = trimmed.slice(5).trim();
            if (!jsonStr) continue;
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.token && onToken) {
                onToken(parsed.token);
              }
              if (parsed.done && onComplete) {
                onComplete(parsed);
              }
            } catch (e) {}
          }
        }
      }
    } catch (err: any) {
      if (onError) onError(err);
      else throw err;
    }
  },

  async transcribeAudio(audioBlob: Blob): Promise<{ transcript: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Data = (reader.result as string) || "";
          const res = await fetch(`${API_BASE}/ai/speech-to-text`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audioBase64: base64Data,
              mimeType: audioBlob.type || "audio/webm"
            })
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "Lỗi chuyển đổi giọng nói.");
          }
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error("Lỗi đọc dữ liệu ghi âm."));
      reader.readAsDataURL(audioBlob);
    });
  },

  async getAiProviders(): Promise<{ providers: any[] }> {
    const res = await fetch(`${API_BASE}/ai/providers`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() }
    });
    return res.json();
  },

  async getAiModels(): Promise<{ models: any[] }> {
    const res = await fetch(`${API_BASE}/ai/models`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() }
    });
    return res.json();
  },

  async createStockProposal(productId?: string, quantity?: number, reason?: string) {
    const res = await fetch(`${API_BASE}/ai/stock-proposal`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ productId, quantity, reason })
    });
    return handleResponse(res, "Tạo đề xuất nhập kho thất bại");
  },

  async getAiForecast(days: number = 30): Promise<{ status: string; data?: ForecastData; message?: string; metrics?: any }> {
    const res = await fetch(`${API_BASE}/ai/forecast`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ days })
    });
    return res.json();
  },

  async getInventoryAlerts(): Promise<{ status: string; alerts: InventoryAlert[] }> {
    const res = await fetch(`${API_BASE}/ai/inventory-alerts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() }
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

  async askAdminSalesQA(question: string): Promise<{ answer: string; source: string; metrics: any }> {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/ai/admin-qa`, {
      method: "POST",
      headers,
      body: JSON.stringify({ question })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Không thể xử lý câu hỏi");
    return json;
  },

  // Admin User Management & Settings
  async getAllUsers(role?: string, search?: string): Promise<{ total: number; users: User[] }> {
    const url = buildUrl("/users");
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

  async toggleUserChatAi(userId: string) {
    const res = await fetch(`${API_BASE}/users/${userId}/toggle-chat-ai`, {
      method: "PUT",
      headers: { ...getAuthHeader() }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Thao tác thất bại");
    return json;
  },

  async grantAllChatAi() {
    const res = await fetch(`${API_BASE}/users/grant-all-chat-ai`, {
      method: "POST",
      headers: { ...getAuthHeader() }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Thao tác thất bại");
    return json;
  },

  async getSettings(): Promise<SystemSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      headers: { ...getAuthHeader() }
    });
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
  },

  // Stock Inbound / Outbound Tickets Management (Warehouse Manager & Staff)
  async getStockTickets(status?: string, type?: string, search?: string, mine?: boolean, staff?: string): Promise<{ total: number; tickets: StockTicket[] }> {
    const url = buildUrl("/inventory/tickets");
    if (status && status !== "ALL") url.searchParams.append("status", status);
    if (type && type !== "ALL") url.searchParams.append("type", type);
    if (search) url.searchParams.append("search", search);
    if (mine) url.searchParams.append("mine", "true");
    if (staff && staff !== "ALL") url.searchParams.append("staff", staff);
    const res = await fetch(url.toString(), {
      headers: { ...getAuthHeader() }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Không thể tải danh sách phiếu kho");
    return data;
  },

  async getStockSummary() {
    const res = await fetch(`${API_BASE}/inventory/summary`, {
      headers: { ...getAuthHeader() }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Không thể lấy thống kê kho");
    return data;
  },

  async createStockTicket(data: { productId: string; type: "IMPORT" | "EXPORT"; quantity: number; reason: string; note?: string }): Promise<{ message: string; ticket: StockTicket }> {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/inventory/tickets`, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Tạo phiếu xuất/nhập kho thất bại");
    return json;
  },

  async approveStockTicket(ticketId: string): Promise<{ message: string; ticket: StockTicket; newStock?: number }> {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/inventory/tickets/${ticketId}/approve`, {
      method: "PUT",
      headers
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Phê duyệt phiếu thất bại");
    return json;
  },

  async rejectStockTicket(ticketId: string, reason?: string): Promise<{ message: string; ticket: StockTicket }> {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/inventory/tickets/${ticketId}/reject`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ reason })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Từ chối phiếu thất bại");
    return json;
  },

  async adjustInventory(data: { productId: string; actualStock: number; reason?: string; note?: string }) {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeader() };
    const res = await fetch(`${API_BASE}/inventory/adjustment`, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Điều chỉnh tồn kho thất bại");
    return json;
  }
};

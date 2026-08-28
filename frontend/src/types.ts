export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  isActive: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  thumbnail: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  categoryId: string;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product?: Product;
  quantity: number;
}

export interface CartData {
  cartId: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
  total: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  shippingAddress: string;
  note?: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELLED";
  paymentMethod: "COD" | "VNPAY";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface InventoryAlert {
  productId: string;
  productName: string;
  categoryName: string;
  stock: number;
  level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  levelText: string;
  reason: string;
  daysRemaining: string;
  confidence: string;
  reorderQty: number;
  leadTime: string;
}

export interface ForecastData {
  metrics: {
    modelName: string;
    forecastGrowth: string;
    mape: string;
    rmse: string;
    r2Score: string;
    confidenceLevel: string;
  };
  historical: {
    date: string;
    fullDate: string;
    actualRevenue: number;
    ordersCount: number;
  }[];
  forecast: {
    date: string;
    fullDate: string;
    predictedRevenue: number;
    upperBound: number;
    lowerBound: number;
    predictedOrders: number;
  }[];
  insights: {
    id: number;
    category: string;
    title: string;
    description: string;
    impact: string;
  }[];
}

export interface SystemSettings {
  storeName: string;
  hotline: string;
  supportEmail: string;
  freeShippingThreshold: number;
  aiProvider?: "gemini" | "openai";
  geminiApiKey: string;
  geminiModel: string;
  openaiApiKey?: string;
  openaiModel?: string;
  aiServiceUrl: string;
  vnpayTmnCode: string;
}

export interface ArchitectureComponent {
  id: string;
  name: string;
  type: "service" | "database" | "proxy" | "gateway" | "client";
  layer: "Presentation Layer" | "Application Layer" | "Domain Layer" | "Repository Layer" | "Infrastructure Layer";
  description: string;
  status: "active" | "standby" | "warning";
}

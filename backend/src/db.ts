import { 
  User, 
  Category, 
  Product, 
  CartItem, 
  Order, 
  OrderItem, 
  SystemSettings,
  INITIAL_USERS, 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_SETTINGS 
} from "./mockData";
import { v4 as uuidv4 } from "uuid";

class DatabaseStore {
  public users: User[] = [...INITIAL_USERS];
  public categories: Category[] = [...INITIAL_CATEGORIES];
  public products: Product[] = [...INITIAL_PRODUCTS];
  public carts: { id: string; userId: string; createdAt: string; updatedAt: string }[] = [];
  public cartItems: CartItem[] = [];
  public orders: Order[] = [...INITIAL_ORDERS];
  public refreshTokens: { id: string; tokenHash: string; userId: string; expiresAt: string; createdAt: string }[] = [];
  public blacklistedTokens: Set<string> = new Set();
  public aiInteractions: { id: string; userId?: string; sessionId: string; query: string; response: string; type: string; createdAt: string }[] = [];
  public settings: SystemSettings = { ...INITIAL_SETTINGS };

  constructor() {
    // Initialize carts for demo users
    for (const u of this.users) {
      const cartId = `cart_${u.id}`;
      this.carts.push({
        id: cartId,
        userId: u.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      // Add initial cart items for Lê Hoàng Nam (usr_customer_1) to match mockup
      if (u.id === "usr_customer_1") {
        this.cartItems.push(
          {
            id: "ci_1",
            cartId,
            productId: "prd_1",
            quantity: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "ci_2",
            cartId,
            productId: "prd_5",
            quantity: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        );
      }
    }
  }

  // Get product with category attached
  public getProductWithCategory(product: Product): Product {
    const category = this.categories.find(c => c.id === product.categoryId);
    return { ...product, category };
  }

  public getAllProducts(filter?: {
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isFeatured?: boolean;
    isNew?: boolean;
    sortBy?: string;
  }): Product[] {
    let list = this.products.map(p => this.getProductWithCategory(p));

    if (filter) {
      if (filter.categoryId && filter.categoryId !== "all") {
        list = list.filter(p => p.categoryId === filter.categoryId || p.category?.slug === filter.categoryId);
      }
      if (filter.search) {
        const q = filter.search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (filter.minPrice !== undefined) {
        list = list.filter(p => p.price >= filter.minPrice!);
      }
      if (filter.maxPrice !== undefined) {
        list = list.filter(p => p.price <= filter.maxPrice!);
      }
      if (filter.isFeatured !== undefined) {
        list = list.filter(p => p.isFeatured === filter.isFeatured);
      }
      if (filter.isNew !== undefined) {
        list = list.filter(p => p.isNew === filter.isNew);
      }
      if (filter.sortBy === "price_asc") {
        list.sort((a, b) => a.price - b.price);
      } else if (filter.sortBy === "price_desc") {
        list.sort((a, b) => b.price - a.price);
      } else if (filter.sortBy === "rating_desc") {
        list.sort((a, b) => b.rating - a.rating);
      } else if (filter.sortBy === "newest") {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return list;
  }

  public getProductByIdOrSlug(idOrSlug: string): Product | null {
    const p = this.products.find(item => item.id === idOrSlug || item.slug === idOrSlug);
    if (!p) return null;
    return this.getProductWithCategory(p);
  }

  // Cart operations
  public getOrCreateUserCart(userId: string) {
    let cart = this.carts.find(c => c.userId === userId);
    if (!cart) {
      cart = {
        id: `cart_${userId}`,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.carts.push(cart);
    }
    const items = this.cartItems
      .filter(ci => ci.cartId === cart!.id)
      .map(ci => {
        const p = this.getProductByIdOrSlug(ci.productId);
        return { ...ci, product: p || undefined };
      });
    return { cart, items };
  }

  public addToCart(userId: string, productId: string, quantity: number = 1) {
    const { cart } = this.getOrCreateUserCart(userId);
    const existing = this.cartItems.find(ci => ci.cartId === cart.id && ci.productId === productId);
    if (existing) {
      existing.quantity += quantity;
      existing.updatedAt = new Date().toISOString();
      return existing;
    } else {
      const newItem: CartItem = {
        id: `ci_${uuidv4().substring(0, 8)}`,
        cartId: cart.id,
        productId,
        quantity: Math.max(1, quantity),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.cartItems.push(newItem);
      return newItem;
    }
  }

  public updateCartItemQuantity(userId: string, cartItemId: string, quantity: number) {
    const { cart } = this.getOrCreateUserCart(userId);
    const item = this.cartItems.find(ci => ci.id === cartItemId && ci.cartId === cart.id);
    if (!item) return null;
    if (quantity <= 0) {
      this.cartItems = this.cartItems.filter(ci => ci.id !== cartItemId);
      return { deleted: true };
    }
    item.quantity = quantity;
    item.updatedAt = new Date().toISOString();
    return item;
  }

  public removeCartItem(userId: string, cartItemId: string) {
    const { cart } = this.getOrCreateUserCart(userId);
    this.cartItems = this.cartItems.filter(ci => !(ci.id === cartItemId && ci.cartId === cart.id));
    return true;
  }

  public clearCart(userId: string) {
    const { cart } = this.getOrCreateUserCart(userId);
    this.cartItems = this.cartItems.filter(ci => ci.cartId !== cart.id);
  }

  // Order operations with Atomic Stock Decrement
  public createOrder(data: {
    userId: string;
    customerName: string;
    phone: string;
    shippingAddress: string;
    note?: string;
    paymentMethod: "COD" | "VNPAY";
    items: { productId: string; quantity: number }[];
  }): Order {
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];
    const orderId = `#ord_${1000 + this.orders.length + 1}`;

    // Verify stock and compute snapshot price
    for (const item of data.items) {
      const prod = this.products.find(p => p.id === item.productId);
      if (!prod) {
        throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
      }
      if (prod.stock < item.quantity) {
        throw new Error(`Sản phẩm "${prod.name}" chỉ còn ${prod.stock} trong kho`);
      }
      
      // Deduct stock atomically
      prod.stock -= item.quantity;
      prod.updatedAt = new Date().toISOString();

      const itemTotal = prod.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        id: `oit_${uuidv4().substring(0, 8)}`,
        orderId,
        productId: prod.id,
        product: prod,
        quantity: item.quantity,
        price: prod.price,
        createdAt: new Date().toISOString()
      });
    }

    const shippingFee = totalAmount >= this.settings.freeShippingThreshold ? 0 : 30000;
    const discountAmount = 0;
    const finalAmount = totalAmount + shippingFee - discountAmount;

    const newOrder: Order = {
      id: orderId,
      userId: data.userId,
      customerName: data.customerName,
      phone: data.phone,
      shippingAddress: data.shippingAddress,
      note: data.note,
      totalAmount,
      shippingFee,
      discountAmount,
      finalAmount,
      status: "PENDING",
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === "VNPAY" ? "COMPLETED" : "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: orderItems
    };

    this.orders.unshift(newOrder);

    // Clear cart after checkout
    this.clearCart(data.userId);

    return newOrder;
  }

  // Cancel order & refund stock
  public cancelOrder(orderId: string, userId?: string) {
    const order = this.orders.find(o => o.id === orderId && (!userId || o.userId === userId));
    if (!order) return null;
    if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
      throw new Error("Chỉ có thể hủy đơn hàng đang ở trạng thái Chờ xử lý hoặc Đã xác nhận.");
    }

    order.status = "CANCELLED";
    order.updatedAt = new Date().toISOString();

    // Refund stock to inventory
    if (order.items) {
      for (const item of order.items) {
        const prod = this.products.find(p => p.id === item.productId);
        if (prod) {
          prod.stock += item.quantity;
          prod.updatedAt = new Date().toISOString();
        }
      }
    }
    return order;
  }
}

export const db = new DatabaseStore();

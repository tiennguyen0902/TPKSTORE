import fs from "fs";
import path from "path";
import { PrismaClient, Role, OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
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

// Initialize Prisma Client
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
});

export class DatabaseStore {
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

  public isPgConnected: boolean = false;
  private readonly dataDir: string;
  private readonly dataFilePath: string;

  constructor() {
    this.dataDir = path.resolve(__dirname, "../data");
    this.dataFilePath = path.join(this.dataDir, "store.json");

    // Initialize carts for demo users in memory
    for (const u of this.users) {
      const cartId = `cart_${u.id}`;
      this.carts.push({
        id: cartId,
        userId: u.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
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

    // Load file backup if it exists
    this.loadFromFile();
  }

  /**
   * Khởi tạo kết nối PostgreSQL và đồng bộ dữ liệu
   */
  public async init() {
    console.log("---------------------------------------------------");
    console.log("🔌 Đang kiểm tra kết nối Cơ sở dữ liệu PostgreSQL...");
    try {
      await prisma.$connect();
      this.isPgConnected = true;
      console.log("✅ KẾT NỐI POSTGRESQL THÀNH CÔNG qua Prisma ORM!");

      // Kiểm tra xem database đã có dữ liệu chưa, nếu chưa có thì tự động seed
      const userCount = await prisma.user.count();
      if (userCount === 0) {
        console.log("🌱 Database PostgreSQL trống. Đang tự động nạp dữ liệu ban đầu (Seeding)...");
        await this.seedToPostgres();
      }

      // Tải dữ liệu mới nhất từ PostgreSQL vào bộ nhớ
      await this.syncFromPostgres();
      console.log(`📊 Đã đồng bộ từ PostgreSQL: ${this.users.length} người dùng, ${this.products.length} sản phẩm, ${this.orders.length} đơn hàng.`);
    } catch (err: any) {
      this.isPgConnected = false;
      console.warn("⚠️  CHƯA THỂ KẾT NỐI POSTGRESQL CỤC BỘ TẠI PORT 5432.");
      console.warn(`   Lỗi: ${err.message?.split("\n")[0] || err}`);
      console.log("🛡️  ĐÃ KÍCH HOẠT CHẾ ĐỘ LƯU TRỮ BỀN VỮNG (Persistent Storage: backend/data/store.json).");
      console.log("   Mọi tài khoản tạo mới và đơn hàng mua sắm sẽ ĐƯỢC LƯU VĨNH VIỄN vào file!");
      console.log("💡 Để kết nối PostgreSQL: Bạn có thể lấy chuỗi kết nối miễn phí tại https://neon.tech hoặc https://supabase.com và dán vào biến DATABASE_URL trong file .env");
    }
    console.log("---------------------------------------------------");
  }

  /**
   * Nạp dữ liệu ban đầu vào PostgreSQL
   */
  public async seedToPostgres() {
    try {
      // 1. Settings
      await prisma.systemSettings.upsert({
        where: { id: "default_settings" },
        update: {},
        create: {
          id: "default_settings",
          freeShippingThreshold: this.settings.freeShippingThreshold || 500000,
          aiProvider: this.settings.aiProvider?.toUpperCase() || "GEMINI",
          geminiApiKey: this.settings.geminiApiKey || "",
          geminiModel: this.settings.geminiModel || "gemini-2.5-flash",
          openaiApiKey: this.settings.openaiApiKey || "",
          openaiModel: this.settings.openaiModel || "",
          aiServiceUrl: this.settings.aiServiceUrl || "http://localhost:8000",
          vnpayTmnCode: this.settings.vnpayTmnCode || "SANDBOX_STORE_AI",
          momoPartnerCode: this.settings.momoPartnerCode || "MOMO",
          momoAccessKey: this.settings.momoAccessKey || "",
          momoSecretKey: this.settings.momoSecretKey || ""
        }
      });

      // 2. Categories
      for (const c of this.categories) {
        await prisma.category.upsert({
          where: { id: c.id },
          update: {},
          create: {
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description || "",
            icon: c.icon || "",
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt)
          }
        });
      }

      // 3. Products
      for (const p of this.products) {
        await prisma.product.upsert({
          where: { id: p.id },
          update: {},
          create: {
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price,
            originalPrice: p.originalPrice,
            stock: p.stock,
            thumbnail: p.thumbnail,
            images: p.images,
            rating: p.rating,
            reviewCount: p.reviewCount,
            isFeatured: p.isFeatured,
            isNew: p.isNew,
            categoryId: p.categoryId,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt)
          }
        });
      }

      // 4. Users
      for (const u of this.users) {
        await prisma.user.upsert({
          where: { id: u.id },
          update: {},
          create: {
            id: u.id,
            email: u.email,
            passwordHash: u.passwordHash,
            fullName: u.fullName,
            phone: u.phone || "",
            address: u.address || "",
            avatar: u.avatar || "",
            role: u.role as Role,
            isActive: u.isActive,
            createdAt: new Date(u.createdAt),
            updatedAt: new Date(u.updatedAt)
          }
        });

        await prisma.cart.upsert({
          where: { userId: u.id },
          update: {},
          create: {
            id: `cart_${u.id}`,
            userId: u.id
          }
        });
      }

      // 5. Orders
      for (const o of this.orders) {
        const exists = await prisma.order.findUnique({ where: { id: o.id } });
        if (!exists) {
          await prisma.order.create({
            data: {
              id: o.id,
              userId: o.userId,
              totalAmount: o.totalAmount,
              shippingFee: o.shippingFee,
              discountAmount: o.discountAmount,
              finalAmount: o.finalAmount,
              status: o.status as OrderStatus,
              paymentMethod: o.paymentMethod as PaymentMethod,
              paymentStatus: o.paymentStatus as PaymentStatus,
              shippingAddress: o.shippingAddress,
              phone: o.phone,
              customerName: o.customerName,
              note: o.note || "",
              createdAt: new Date(o.createdAt),
              updatedAt: new Date(o.updatedAt),
              items: {
                create: (o.items || []).map(it => ({
                  id: it.id,
                  productId: it.productId,
                  quantity: it.quantity,
                  price: it.price,
                  createdAt: new Date(it.createdAt)
                }))
              }
            }
          });
        }
      }
      console.log("✅ Đã hoàn tất nạp dữ liệu mẫu vào PostgreSQL!");
    } catch (err) {
      console.error("Lỗi khi seed dữ liệu vào PostgreSQL:", err);
    }
  }

  /**
   * Đồng bộ dữ liệu từ PostgreSQL về mảng dữ liệu phục vụ truy vấn
   */
  public async syncFromPostgres() {
    if (!this.isPgConnected) return;
    try {
      const [pgUsers, pgCategories, pgProducts, pgOrders, pgSettings] = await Promise.all([
        prisma.user.findMany(),
        prisma.category.findMany(),
        prisma.product.findMany({ include: { category: true } }),
        prisma.order.findMany({ include: { items: { include: { product: true } } }, orderBy: { createdAt: "desc" } }),
        prisma.systemSettings.findFirst()
      ]);

      this.users = pgUsers.map(u => ({
        id: u.id,
        email: u.email,
        passwordHash: u.passwordHash,
        fullName: u.fullName,
        phone: u.phone || undefined,
        address: u.address || undefined,
        avatar: u.avatar || undefined,
        role: u.role as any,
        isActive: u.isActive,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString()
      }));

      this.categories = pgCategories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || undefined,
        icon: c.icon || undefined,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString()
      }));

      this.products = pgProducts.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice || undefined,
        stock: p.stock,
        thumbnail: p.thumbnail,
        images: p.images,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        categoryId: p.categoryId,
        category: p.category ? {
          id: p.category.id,
          name: p.category.name,
          slug: p.category.slug,
          description: p.category.description || undefined,
          icon: p.category.icon || undefined,
          createdAt: p.category.createdAt.toISOString(),
          updatedAt: p.category.updatedAt.toISOString()
        } : undefined,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString()
      }));

      this.orders = pgOrders.map(o => ({
        id: o.id,
        userId: o.userId,
        totalAmount: o.totalAmount,
        shippingFee: o.shippingFee,
        discountAmount: o.discountAmount,
        finalAmount: o.finalAmount,
        status: o.status as any,
        paymentMethod: o.paymentMethod as any,
        paymentStatus: o.paymentStatus as any,
        shippingAddress: o.shippingAddress,
        phone: o.phone,
        customerName: o.customerName,
        note: o.note || undefined,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
        items: o.items.map(it => ({
          id: it.id,
          orderId: it.orderId,
          productId: it.productId,
          quantity: it.quantity,
          price: it.price,
          product: it.product as any,
          createdAt: it.createdAt.toISOString()
        }))
      }));

      if (pgSettings) {
        this.settings = {
          storeName: "SHOPBEE",
          hotline: "1900 6868",
          supportEmail: "support@store-ai.example.com",
          freeShippingThreshold: pgSettings.freeShippingThreshold,
          aiProvider: (pgSettings.aiProvider?.toLowerCase() === "openai" ? "openai" : "gemini") as "gemini" | "openai",
          geminiApiKey: pgSettings.geminiApiKey || "",
          geminiModel: pgSettings.geminiModel || "gemini-2.5-flash",
          openaiApiKey: pgSettings.openaiApiKey || "",
          openaiModel: pgSettings.openaiModel || "gpt-5.4-mini",
          aiServiceUrl: pgSettings.aiServiceUrl || "http://localhost:8000",
          vnpayTmnCode: pgSettings.vnpayTmnCode || "SANDBOX_STORE_AI",
          momoPartnerCode: pgSettings.momoPartnerCode || "MOMO",
          momoAccessKey: pgSettings.momoAccessKey || "",
          momoSecretKey: pgSettings.momoSecretKey || ""
        };
      }

      // Lưu lại bản sao ra file store.json
      this.saveToFile();
    } catch (err) {
      console.error("Lỗi khi đồng bộ từ PostgreSQL:", err);
    }
  }

  /**
   * Lưu trữ trạng thái vào file JSON trên ổ đĩa
   */
  public saveToFile() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      const data = {
        users: this.users,
        categories: this.categories,
        products: this.products,
        carts: this.carts,
        cartItems: this.cartItems,
        orders: this.orders,
        refreshTokens: this.refreshTokens,
        settings: this.settings,
        savedAt: new Date().toISOString()
      };
      fs.writeFileSync(this.dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Lỗi khi lưu dữ liệu ra file:", err);
    }
  }

  /**
   * Đọc dữ liệu đã lưu từ file JSON
   */
  public loadFromFile() {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const content = fs.readFileSync(this.dataFilePath, "utf-8");
        const data = JSON.parse(content);
        if (data.users && Array.isArray(data.users)) this.users = data.users;
        if (data.categories && Array.isArray(data.categories)) this.categories = data.categories;
        if (data.products && Array.isArray(data.products)) this.products = data.products;
        if (data.carts && Array.isArray(data.carts)) this.carts = data.carts;
        if (data.cartItems && Array.isArray(data.cartItems)) this.cartItems = data.cartItems;
        if (data.orders && Array.isArray(data.orders)) this.orders = data.orders;
        if (data.refreshTokens && Array.isArray(data.refreshTokens)) this.refreshTokens = data.refreshTokens;
        if (data.settings && typeof data.settings === "object") this.settings = data.settings;
        console.log(`📁 Đã nạp thành công dữ liệu lưu trữ từ: ${this.dataFilePath}`);
      }
    } catch (err) {
      console.warn("Chưa thể đọc file lưu trữ, sử dụng mockData ban đầu.");
    }
  }

  /**
   * Thêm người dùng mới (ghi vào PostgreSQL + Lưu file)
   */
  public async addUser(user: User): Promise<User> {
    this.users.push(user);
    this.saveToFile();

    if (this.isPgConnected) {
      try {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            passwordHash: user.passwordHash,
            fullName: user.fullName,
            phone: user.phone || "",
            address: user.address || "",
            avatar: user.avatar || "",
            role: user.role as Role,
            isActive: user.isActive,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt)
          }
        });
        await prisma.cart.create({
          data: {
            id: `cart_${user.id}`,
            userId: user.id
          }
        });
      } catch (err) {
        console.error("Lỗi khi ghi User vào PostgreSQL:", err);
      }
    }
    return user;
  }

  /**
   * Cập nhật thông tin người dùng
   */
  public async updateUser(user: User): Promise<User> {
    const idx = this.users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      this.users[idx] = user;
    }
    this.saveToFile();

    if (this.isPgConnected) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            fullName: user.fullName,
            phone: user.phone || "",
            address: user.address || "",
            avatar: user.avatar || "",
            passwordHash: user.passwordHash,
            role: user.role as Role,
            isActive: user.isActive
          }
        });
      } catch (err) {
        console.error("Lỗi khi cập nhật User trên PostgreSQL:", err);
      }
    }
    return user;
  }

  /**
   * Xóa người dùng
   */
  public async deleteUser(userId: string): Promise<boolean> {
    this.users = this.users.filter(u => u.id !== userId);
    this.saveToFile();

    if (this.isPgConnected) {
      try {
        await prisma.user.delete({ where: { id: userId } });
      } catch (err) {
        console.error("Lỗi khi xóa User trên PostgreSQL:", err);
      }
    }
    return true;
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

  public async addProduct(product: Product): Promise<Product> {
    this.products.push(product);
    this.saveToFile();

    if (this.isPgConnected) {
      try {
        await prisma.product.create({
          data: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice,
            stock: product.stock,
            thumbnail: product.thumbnail,
            images: product.images,
            rating: product.rating,
            reviewCount: product.reviewCount,
            isFeatured: product.isFeatured,
            isNew: product.isNew,
            categoryId: product.categoryId,
            createdAt: new Date(product.createdAt),
            updatedAt: new Date(product.updatedAt)
          }
        });
      } catch (err) {
        console.error("Lỗi khi tạo sản phẩm trên PostgreSQL:", err);
      }
    }
    return product;
  }

  public async updateProduct(product: Product): Promise<Product> {
    const idx = this.products.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      this.products[idx] = product;
    }
    this.saveToFile();

    if (this.isPgConnected) {
      try {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice,
            stock: product.stock,
            thumbnail: product.thumbnail,
            images: product.images,
            rating: product.rating,
            reviewCount: product.reviewCount,
            isFeatured: product.isFeatured,
            isNew: product.isNew,
            categoryId: product.categoryId
          }
        });
      } catch (err) {
        console.error("Lỗi khi cập nhật sản phẩm trên PostgreSQL:", err);
      }
    }
    return product;
  }

  public async deleteProduct(productId: string): Promise<boolean> {
    this.products = this.products.filter(p => p.id !== productId);
    this.saveToFile();

    if (this.isPgConnected) {
      try {
        await prisma.product.delete({ where: { id: productId } });
      } catch (err) {
        console.error("Lỗi khi xóa sản phẩm trên PostgreSQL:", err);
      }
    }
    return true;
  }

  // Categories
  public async addCategory(cat: Category): Promise<Category> {
    this.categories.push(cat);
    this.saveToFile();

    if (this.isPgConnected) {
      try {
        await prisma.category.create({
          data: {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description || "",
            icon: cat.icon || "",
            createdAt: new Date(cat.createdAt),
            updatedAt: new Date(cat.updatedAt)
          }
        });
      } catch (err) {
        console.error("Lỗi khi tạo danh mục trên PostgreSQL:", err);
      }
    }
    return cat;
  }

  public async updateCategory(cat: Category): Promise<Category> {
    const idx = this.categories.findIndex(c => c.id === cat.id);
    if (idx !== -1) {
      this.categories[idx] = cat;
    }
    this.saveToFile();

    if (this.isPgConnected) {
      try {
        await prisma.category.update({
          where: { id: cat.id },
          data: {
            name: cat.name,
            slug: cat.slug,
            description: cat.description || "",
            icon: cat.icon || ""
          }
        });
      } catch (err) {
        console.error("Lỗi khi cập nhật danh mục trên PostgreSQL:", err);
      }
    }
    return cat;
  }

  public async deleteCategory(catId: string): Promise<boolean> {
    this.categories = this.categories.filter(c => c.id !== catId);
    this.saveToFile();

    if (this.isPgConnected) {
      try {
        await prisma.category.delete({ where: { id: catId } });
      } catch (err) {
        console.error("Lỗi khi xóa danh mục trên PostgreSQL:", err);
      }
    }
    return true;
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
      this.saveToFile();
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
    let result: CartItem;
    if (existing) {
      existing.quantity += quantity;
      existing.updatedAt = new Date().toISOString();
      result = existing;
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
      result = newItem;
    }
    this.saveToFile();
    return result;
  }

  public updateCartItemQuantity(userId: string, cartItemId: string, quantity: number) {
    const { cart } = this.getOrCreateUserCart(userId);
    const item = this.cartItems.find(ci => ci.id === cartItemId && ci.cartId === cart.id);
    if (!item) return null;
    if (quantity <= 0) {
      this.cartItems = this.cartItems.filter(ci => ci.id !== cartItemId);
      this.saveToFile();
      return { deleted: true };
    }
    item.quantity = quantity;
    item.updatedAt = new Date().toISOString();
    this.saveToFile();
    return item;
  }

  public removeCartItem(userId: string, cartItemId: string) {
    const { cart } = this.getOrCreateUserCart(userId);
    this.cartItems = this.cartItems.filter(ci => !(ci.id === cartItemId && ci.cartId === cart.id));
    this.saveToFile();
    return true;
  }

  public clearCart(userId: string) {
    const { cart } = this.getOrCreateUserCart(userId);
    this.cartItems = this.cartItems.filter(ci => ci.cartId !== cart.id);
    this.saveToFile();
  }

  // Order operations with Atomic Stock Decrement & PostgreSQL Persistence
  public createOrder(data: {
    userId: string;
    customerName: string;
    phone: string;
    shippingAddress: string;
    note?: string;
    paymentMethod: "COD" | "VNPAY" | "MOMO";
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
      paymentStatus: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: orderItems
    };

    this.orders.unshift(newOrder);

    // Clear cart after checkout
    this.clearCart(data.userId);

    // Lưu ngay lập tức ra file để không bao giờ bị mất
    this.saveToFile();

    // Đồng bộ bất đồng bộ lên PostgreSQL nếu có kết nối
    if (this.isPgConnected) {
      prisma.$transaction(async (tx) => {
        // Trừ kho trên PostgreSQL
        for (const it of orderItems) {
          await tx.product.update({
            where: { id: it.productId },
            data: { stock: { decrement: it.quantity } }
          });
        }
        // Tạo Order và OrderItems
        await tx.order.create({
          data: {
            id: newOrder.id,
            userId: newOrder.userId,
            totalAmount: newOrder.totalAmount,
            shippingFee: newOrder.shippingFee,
            discountAmount: newOrder.discountAmount,
            finalAmount: newOrder.finalAmount,
            status: newOrder.status as OrderStatus,
            paymentMethod: newOrder.paymentMethod as PaymentMethod,
            paymentStatus: newOrder.paymentStatus as PaymentStatus,
            shippingAddress: newOrder.shippingAddress,
            phone: newOrder.phone,
            customerName: newOrder.customerName,
            note: newOrder.note || "",
            createdAt: new Date(newOrder.createdAt),
            updatedAt: new Date(newOrder.updatedAt),
            items: {
              create: orderItems.map(it => ({
                id: it.id,
                productId: it.productId,
                quantity: it.quantity,
                price: it.price,
                createdAt: new Date(it.createdAt)
              }))
            }
          }
        });
      }).catch(err => {
        console.error("Lỗi khi ghi Order vào PostgreSQL:", err);
      });
    }

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

    this.saveToFile();

    if (this.isPgConnected) {
      prisma.$transaction(async (tx) => {
        if (order.items) {
          for (const it of order.items) {
            await tx.product.update({
              where: { id: it.productId },
              data: { stock: { increment: it.quantity } }
            });
          }
        }
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: "CANCELLED",
            updatedAt: new Date()
          }
        });
      }).catch(err => {
        console.error("Lỗi khi hủy Order trên PostgreSQL:", err);
      });
    }

    return order;
  }

  public updateOrder(order: Order) {
    const idx = this.orders.findIndex(o => o.id === order.id);
    if (idx !== -1) {
      this.orders[idx] = order;
    }
    this.saveToFile();

    if (this.isPgConnected) {
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: order.status as OrderStatus,
          paymentStatus: order.paymentStatus as PaymentStatus,
          updatedAt: new Date()
        }
      }).catch(err => {
        console.error("Lỗi khi cập nhật Order trên PostgreSQL:", err);
      });
    }
    return order;
  }

  public updateSettings(newSettings: Partial<SystemSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveToFile();

    if (this.isPgConnected) {
      prisma.systemSettings.upsert({
        where: { id: "default_settings" },
        update: {
          freeShippingThreshold: this.settings.freeShippingThreshold,
          aiProvider: this.settings.aiProvider?.toUpperCase() || "GEMINI",
          geminiApiKey: this.settings.geminiApiKey,
          geminiModel: this.settings.geminiModel,
          openaiApiKey: this.settings.openaiApiKey,
          openaiModel: this.settings.openaiModel,
          aiServiceUrl: this.settings.aiServiceUrl,
          vnpayTmnCode: this.settings.vnpayTmnCode,
          momoPartnerCode: this.settings.momoPartnerCode,
          momoAccessKey: this.settings.momoAccessKey,
          momoSecretKey: this.settings.momoSecretKey
        },
        create: {
          id: "default_settings",
          freeShippingThreshold: this.settings.freeShippingThreshold || 500000,
          aiProvider: this.settings.aiProvider?.toUpperCase() || "GEMINI",
          geminiApiKey: this.settings.geminiApiKey || "",
          geminiModel: this.settings.geminiModel || "gemini-2.5-flash",
          openaiApiKey: this.settings.openaiApiKey || "",
          openaiModel: this.settings.openaiModel || "",
          aiServiceUrl: this.settings.aiServiceUrl || "http://localhost:8000",
          vnpayTmnCode: this.settings.vnpayTmnCode || "SANDBOX_STORE_AI",
          momoPartnerCode: this.settings.momoPartnerCode || "MOMO",
          momoAccessKey: this.settings.momoAccessKey || "",
          momoSecretKey: this.settings.momoSecretKey || ""
        }
      }).catch(err => {
        console.error("Lỗi khi cập nhật SystemSettings trên PostgreSQL:", err);
      });
    }
    return this.settings;
  }
}

export const db = new DatabaseStore();

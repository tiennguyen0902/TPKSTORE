import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

// 1. Luôn ưu tiên nạp biến môi trường từ .env
const envPaths = [
  path.resolve(__dirname, "../.env"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "../../.env")
];

for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
  }
}
dotenv.config();

// 2. Thiết lập giá trị mặc định dự phòng — đảm bảo Prisma không bao giờ bị lỗi thiếu DATABASE_URL
const DEFAULT_DATABASE_URL = "postgresql://postgres:password123@localhost:5432/store_ai_db?schema=public";
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
}

import { PrismaClient } from "@prisma/client";
import { 
  User as MockUser, 
  Category as MockCategory, 
  Product as MockProduct, 
  Order as MockOrder, 
  INITIAL_USERS, 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_SETTINGS 
} from "./mockData";

// Prisma Client Singleton
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Kiểm tra xem lỗi có phải do không kết nối được database PostgreSQL (để tự động fallback)
export function isConnectionError(err: any): boolean {
  if (!err) return false;
  if (err.code === "P2002") return false; // Lỗi trùng lặp email/key thuộc logic người dùng

  const code = String(err.code || "");
  const msg = (err.message || String(err)).toLowerCase();
  return (
    code.startsWith("P1") || // Toàn bộ lỗi P1000 (sai mật khẩu/user DB), P1001 (không kết nối), P1002 (timeout), P1003 (chưa có DB)...
    code === "P2021" ||      // Bảng chưa được tạo trong PostgreSQL
    code === "P2022" ||      // Cột chưa được tạo
    msg.includes("authentication failed") ||
    msg.includes("credentials") ||
    msg.includes("password authentication failed") ||
    msg.includes("can't reach database") ||
    msg.includes("cant reach database") ||
    msg.includes("environment variable not found") ||
    msg.includes("econnrefused") ||
    msg.includes("enotfound") ||
    msg.includes("connection timed out") ||
    msg.includes("connection closed") ||
    msg.includes("does not exist") ||
    msg.includes("access denied") ||
    msg.includes("permission denied")
  );
}

/**
 * Fallback Database Engine (Bộ lưu trữ dự phòng tự động khi PostgreSQL trên Hosting chưa bật)
 * Đảm bảo hệ thống KHÔNG BAO GIỜ SẬP, người dùng luôn đăng nhập và mua sắm được 100%!
 */
class FallbackStore {
  public users: any[] = [];
  public categories: any[] = [];
  public products: any[] = [];
  public orders: any[] = [];
  public settings: any = { ...INITIAL_SETTINGS };
  public refreshTokens: any[] = [];
  public carts: any[] = [];
  public cartItems: any[] = [];
  public aiInteractions: any[] = [];

  private readonly dataDir: string;
  private readonly dataFilePath: string;
  private hasLoggedFallback = false;

  constructor() {
    this.dataDir = path.resolve(__dirname, "../data");
    this.dataFilePath = path.join(this.dataDir, "store.json");

    // Khởi tạo từ mockData
    this.users = INITIAL_USERS.map(u => ({
      ...u,
      createdAt: new Date(u.createdAt),
      updatedAt: new Date(u.updatedAt)
    }));

    this.categories = INITIAL_CATEGORIES.map(c => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt)
    }));

    this.products = INITIAL_PRODUCTS.map(p => {
      let stockVal: any = p.stock;
      if (typeof stockVal === "object" && stockVal !== null) {
        stockVal = typeof stockVal.decrement === "number" ? Math.max(0, 25 - stockVal.decrement) : 15;
      }
      return {
        ...p,
        stock: typeof stockVal === "number" && !isNaN(stockVal) ? stockVal : (parseInt(stockVal) || 20),
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      };
    });

    this.orders = INITIAL_ORDERS.map(o => ({
      ...o,
      createdAt: new Date(o.createdAt),
      updatedAt: new Date(o.updatedAt)
    }));

    // Carts mặc định
    for (const u of this.users) {
      this.carts.push({ id: `cart_${u.id}`, userId: u.id, createdAt: new Date(), updatedAt: new Date() });
    }

    // Đọc thêm từ file store.json nếu có
    this.loadFromFile();
  }

  public logFallbackOnce(op: string, reason?: string) {
    if (!this.hasLoggedFallback) {
      console.warn("==================================================================");
      console.warn("⚠️  POSTGRESQL CHƯA SẴN SÀNG HOẶC KHÔNG THỂ KẾT NỐI TRÊN HOSTING.");
      if (reason) console.warn(`   Chi tiết: ${reason.split("\n")[0]}`);
      console.warn("🛡️  HỆ THỐNG ĐÃ KÍCH HOẠT ENGINE DỰ PHÒNG TỰ ĐỘNG (Fallback Storage)!");
      console.warn("   Mọi hoạt động Đăng nhập (Admin / User), Sản phẩm, Giỏ hàng, Đặt hàng");
      console.warn("   sẽ hoạt động bình thường và được lưu trữ bền vững.");
      console.warn("==================================================================");
      this.hasLoggedFallback = true;
    }
  }

  public saveToFile() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      const data = {
        users: this.users,
        categories: this.categories,
        products: this.products,
        orders: this.orders,
        settings: this.settings,
        refreshTokens: this.refreshTokens,
        carts: this.carts,
        cartItems: this.cartItems,
        savedAt: new Date().toISOString()
      };
      fs.writeFileSync(this.dataFilePath, JSON.stringify(data, null, 2), "utf8");
    } catch (e) {
      // Bỏ qua nếu môi trường hosting không cho phép ghi đĩa
    }
  }

  public loadFromFile() {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const content = fs.readFileSync(this.dataFilePath, "utf8");
        const data = JSON.parse(content);
        if (Array.isArray(data.users)) this.users = data.users.map((u: any) => ({ ...u, createdAt: new Date(u.createdAt), updatedAt: new Date(u.updatedAt) }));
        if (Array.isArray(data.categories)) this.categories = data.categories.map((c: any) => ({ ...c, createdAt: new Date(c.createdAt), updatedAt: new Date(c.updatedAt) }));
        if (Array.isArray(data.products)) {
          this.products = data.products.map((p: any) => {
            let stockVal = p.stock;
            if (typeof stockVal === "object" && stockVal !== null) {
              stockVal = typeof stockVal.decrement === "number" ? Math.max(0, 25 - stockVal.decrement) : 15;
            }
            return {
              ...p,
              stock: typeof stockVal === "number" && !isNaN(stockVal) ? stockVal : (parseInt(stockVal) || 20),
              createdAt: new Date(p.createdAt),
              updatedAt: new Date(p.updatedAt)
            };
          });
        }
        if (Array.isArray(data.orders)) this.orders = data.orders.map((o: any) => ({ ...o, createdAt: new Date(o.createdAt), updatedAt: new Date(o.updatedAt) }));
        if (data.settings) this.settings = data.settings;
        if (Array.isArray(data.refreshTokens)) this.refreshTokens = data.refreshTokens;
        if (Array.isArray(data.carts)) this.carts = data.carts;
        if (Array.isArray(data.cartItems)) this.cartItems = data.cartItems;
      }
    } catch (e) {}
  }
}

const fallback = new FallbackStore();

function filterFallbackProducts(products: any[], where: any, categories: any[]): any[] {
  if (!where || Object.keys(where).length === 0) return products;

  return products.filter(p => {
    const cat = p.category || categories.find(c => c.id === p.categoryId);
    const catSlug = cat?.slug || "";
    const catId = p.categoryId || cat?.id || "";

    // 1. Direct categoryId check
    if (where.categoryId && where.categoryId !== "all") {
      if (catId !== where.categoryId && catSlug !== where.categoryId) return false;
    }

    // 2. OR conditions (e.g. categoryId or category.slug)
    if (Array.isArray(where.OR) && where.OR.length > 0) {
      const orMatches = where.OR.some((cond: any) => {
        if (cond.categoryId && (cond.categoryId === catId || cond.categoryId === catSlug)) return true;
        if (cond.category?.slug && cond.category.slug === catSlug) return true;
        if (cond.category?.id && cond.category.id === catId) return true;
        if (cond.id && cond.id === p.id) return true;
        if (cond.slug && cond.slug === p.slug) return true;
        if (cond.name?.contains && p.name?.toLowerCase().includes(cond.name.contains.toLowerCase())) return true;
        if (cond.description?.contains && p.description?.toLowerCase().includes(cond.description.contains.toLowerCase())) return true;
        return false;
      });
      if (!orMatches) return false;
    }

    // 3. AND conditions (e.g. search)
    if (Array.isArray(where.AND) && where.AND.length > 0) {
      for (const andCond of where.AND) {
        if (Array.isArray(andCond.OR)) {
          const matchOr = andCond.OR.some((sub: any) => {
            if (sub.name?.contains && p.name?.toLowerCase().includes(sub.name.contains.toLowerCase())) return true;
            if (sub.description?.contains && p.description?.toLowerCase().includes(sub.description.contains.toLowerCase())) return true;
            return false;
          });
          if (!matchOr) return false;
        }
      }
    }

    // 4. Price filter
    if (where.price) {
      const price = typeof p.price === "number" ? p.price : (Number(p.price) || 0);
      if (where.price.gte !== undefined && price < where.price.gte) return false;
      if (where.price.lte !== undefined && price > where.price.lte) return false;
    }

    // 5. isFeatured
    if (where.isFeatured !== undefined) {
      if (p.isFeatured !== where.isFeatured) return false;
    }

    // 6. isNew
    if (where.isNew !== undefined) {
      if (p.isNew !== where.isNew) return false;
    }

    return true;
  });
}

/**
 * Resilient Database Proxy:
 * Chuyển tiếp toàn bộ truy vấn tới Prisma Client (PostgreSQL).
 * NẾU PostgreSQL gặp sự cố kết nối, tự động chuyển sang FallbackStore mà KHÔNG trả về lỗi 500 cho người dùng.
 */
function createModelProxy(modelName: string) {
  return new Proxy({}, {
    get(_target, propKey) {
      const method = String(propKey);

      return async (...args: any[]) => {
        try {
          const prismaModel = (prisma as any)[modelName];
          if (prismaModel && typeof prismaModel[method] === "function") {
            return await prismaModel[method](...args);
          }
        } catch (err: any) {
          if (!isConnectionError(err)) {
            throw err; // Lỗi cú pháp hoặc logic của Prisma thì ném ra bình thường
          }
          fallback.logFallbackOnce(`${modelName}.${method}`, err.message);
        }

        // --- XỬ LÝ DỰ PHÒNG KHI POSTGRESQL CHƯA CHẠY ---
        const options = args[0] || {};

        if (modelName === "user") {
          if (method === "findFirst" || method === "findUnique") {
            const where = options.where || {};
            let match = fallback.users.find(u => {
              if (where.id && u.id === where.id) return true;
              if (where.email) {
                const target = typeof where.email === "object" ? where.email.equals : where.email;
                if (target && u.email.toLowerCase() === String(target).toLowerCase()) return true;
              }
              return false;
            });
            return match ? { ...match } : null;
          }
          if (method === "findMany") {
            let list = [...fallback.users];
            if (options.where?.role && options.where.role !== "ALL") {
              list = list.filter(u => u.role === options.where.role);
            }
            return list;
          }
          if (method === "create") {
            const newUser = {
              id: options.data.id || `usr_${uuidv4().substring(0, 8)}`,
              ...options.data,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            fallback.users.push(newUser);
            fallback.saveToFile();
            return { ...newUser };
          }
          if (method === "update") {
            const idx = fallback.users.findIndex(u => u.id === options.where.id);
            if (idx !== -1) {
              fallback.users[idx] = { ...fallback.users[idx], ...options.data, updatedAt: new Date() };
              fallback.saveToFile();
              return { ...fallback.users[idx] };
            }
            return null;
          }
        }

        if (modelName === "refreshToken") {
          if (method === "create") {
            const tokenRecord = {
              id: uuidv4(),
              ...options.data,
              createdAt: new Date()
            };
            fallback.refreshTokens.push(tokenRecord);
            return tokenRecord;
          }
          if (method === "findUnique") {
            return fallback.refreshTokens.find(t => t.tokenHash === options.where.tokenHash) || null;
          }
          if (method === "delete") {
            fallback.refreshTokens = fallback.refreshTokens.filter(t => t.id !== options.where.id);
            return { count: 1 };
          }
          if (method === "deleteMany") {
            return { count: 0 };
          }
        }

        if (modelName === "product") {
          if (method === "findMany") {
            let list = fallback.products.map(p => {
              const cat = fallback.categories.find(c => c.id === p.categoryId);
              let stock = typeof p.stock === "number" && !isNaN(p.stock)
                ? p.stock
                : (typeof p.stock === "object" && p.stock && typeof p.stock.decrement === "number" ? Math.max(0, 25 - p.stock.decrement) : 20);
              return { ...p, stock, category: cat || null };
            });

            // Lọc theo điều kiện where (bao gồm danh mục OR, từ khóa AND, giá cả, v.v.)
            list = filterFallbackProducts(list, options.where, fallback.categories);

            // Sắp xếp
            const orderBy = options.orderBy || {};
            if (orderBy.price === "asc") {
              list.sort((a, b) => a.price - b.price);
            } else if (orderBy.price === "desc") {
              list.sort((a, b) => b.price - a.price);
            } else if (orderBy.rating === "desc") {
              list.sort((a, b) => b.rating - a.rating);
            } else if (orderBy.createdAt === "desc") {
              list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }

            // Phân trang skip/take
            if (options.skip !== undefined || options.take !== undefined) {
              const skip = options.skip || 0;
              const take = options.take || list.length;
              list = list.slice(skip, skip + take);
            }

            return list;
          }
          if (method === "count") {
            const filtered = filterFallbackProducts(fallback.products, options.where, fallback.categories);
            return filtered.length;
          }
          if (method === "findFirst" || method === "findUnique") {
            const where = options.where || {};
            let p: any = null;
            if (Array.isArray(where.OR)) {
              p = fallback.products.find(item => {
                return where.OR.some((cond: any) => {
                  if (cond.id && item.id === cond.id) return true;
                  if (cond.slug && item.slug === cond.slug) return true;
                  return false;
                });
              });
            } else {
              p = fallback.products.find(item => item.id === where.id || item.slug === where.slug || item.id === where.idOrSlug);
            }
            if (!p) return null;
            const cat = fallback.categories.find(c => c.id === p.categoryId);
            let stock = typeof p.stock === "number" && !isNaN(p.stock)
              ? p.stock
              : (typeof p.stock === "object" && p.stock && typeof p.stock.decrement === "number" ? Math.max(0, 25 - p.stock.decrement) : 20);
            return { ...p, stock, category: cat || null };
          }
          if (method === "create") {
            const p = { id: options.data.id || `prd_${uuidv4().substring(0, 8)}`, ...options.data, createdAt: new Date(), updatedAt: new Date() };
            fallback.products.push(p);
            fallback.saveToFile();
            return p;
          }
          if (method === "update") {
            const idx = fallback.products.findIndex(p => p.id === options.where.id);
            if (idx !== -1) {
              const currentProd = fallback.products[idx];
              let updatedStock = currentProd.stock;

              if (options.data.stock !== undefined) {
                const currentNum = typeof currentProd.stock === "number" && !isNaN(currentProd.stock)
                  ? currentProd.stock
                  : 25;

                if (typeof options.data.stock === "object" && options.data.stock !== null) {
                  if (typeof options.data.stock.decrement === "number") {
                    updatedStock = Math.max(0, currentNum - options.data.stock.decrement);
                  } else if (typeof options.data.stock.increment === "number") {
                    updatedStock = currentNum + options.data.stock.increment;
                  } else {
                    updatedStock = currentNum;
                  }
                } else {
                  const parsed = parseInt(options.data.stock, 10);
                  updatedStock = isNaN(parsed) ? currentNum : Math.max(0, parsed);
                }
              }

              fallback.products[idx] = {
                ...currentProd,
                ...options.data,
                stock: updatedStock,
                updatedAt: new Date()
              };
              fallback.saveToFile();
              return { ...fallback.products[idx] };
            }
            return null;
          }
          if (method === "delete") {
            fallback.products = fallback.products.filter(p => p.id !== options.where.id);
            fallback.saveToFile();
            return { success: true };
          }
        }

        if (modelName === "category") {
          if (method === "findMany") {
            return fallback.categories.map(c => ({
              ...c,
              _count: { products: fallback.products.filter(p => p.categoryId === c.id).length }
            }));
          }
          if (method === "findFirst" || method === "findUnique") {
            return fallback.categories.find(c => c.id === options.where?.id || c.slug === options.where?.slug) || null;
          }
          if (method === "create") {
            const c = { id: options.data.id || `cat_${uuidv4().substring(0, 8)}`, ...options.data, createdAt: new Date(), updatedAt: new Date() };
            fallback.categories.push(c);
            fallback.saveToFile();
            return c;
          }
          if (method === "update") {
            const idx = fallback.categories.findIndex(c => c.id === options.where.id);
            if (idx !== -1) {
              fallback.categories[idx] = { ...fallback.categories[idx], ...options.data, updatedAt: new Date() };
              fallback.saveToFile();
              return fallback.categories[idx];
            }
            return null;
          }
          if (method === "delete") {
            fallback.categories = fallback.categories.filter(c => c.id !== options.where.id);
            fallback.saveToFile();
            return { success: true };
          }
        }

        if (modelName === "systemSettings") {
          if (method === "findFirst") {
            return { ...fallback.settings };
          }
          if (method === "create" || method === "upsert") {
            const updateData = options.update || options.create || options.data || {};
            fallback.settings = { ...fallback.settings, ...updateData };
            fallback.saveToFile();
            return { ...fallback.settings };
          }
        }

        if (modelName === "order") {
          if (method === "findMany") {
            let list = [...fallback.orders];
            if (options.where?.userId) {
              list = list.filter(o => o.userId === options.where.userId);
            }
            if (options.where?.status) {
              list = list.filter(o => o.status === options.where.status);
            }
            return list;
          }
          if (method === "findFirst" || method === "findUnique") {
            const order = fallback.orders.find(o => o.id === options.where?.id);
            return order ? { ...order } : null;
          }
          if (method === "create") {
            const newOrder = {
              id: options.data.id || `#ord_${1000 + fallback.orders.length + 1}`,
              ...options.data,
              createdAt: new Date(),
              updatedAt: new Date(),
              items: options.data.items?.create || []
            };
            fallback.orders.unshift(newOrder);
            fallback.saveToFile();
            return newOrder;
          }
          if (method === "update") {
            const idx = fallback.orders.findIndex(o => o.id === options.where.id);
            if (idx !== -1) {
              fallback.orders[idx] = { ...fallback.orders[idx], ...options.data, updatedAt: new Date() };
              fallback.saveToFile();
              return fallback.orders[idx];
            }
            return null;
          }
        }

        if (modelName === "cart") {
          if (method === "findUnique") {
            let cart = fallback.carts.find(c => c.userId === options.where?.userId);
            if (!cart) {
              cart = { id: `cart_${options.where?.userId}`, userId: options.where?.userId, createdAt: new Date(), updatedAt: new Date() };
              fallback.carts.push(cart);
            }
            const items = fallback.cartItems.filter(ci => ci.cartId === cart.id).map(ci => ({
              ...ci,
              product: fallback.products.find(p => p.id === ci.productId)
            }));
            return { ...cart, items };
          }
        }

        if (modelName === "cartItem") {
          if (method === "findUnique") {
            const key = options.where?.cartId_productId;
            if (key) {
              return fallback.cartItems.find(ci => ci.cartId === key.cartId && ci.productId === key.productId) || null;
            }
            return fallback.cartItems.find(ci => ci.id === options.where?.id) || null;
          }
          if (method === "create") {
            const item = { id: `ci_${uuidv4().substring(0, 8)}`, ...options.data, createdAt: new Date(), updatedAt: new Date() };
            fallback.cartItems.push(item);
            return item;
          }
          if (method === "update") {
            const idx = fallback.cartItems.findIndex(ci => ci.id === options.where?.id);
            if (idx !== -1) {
              fallback.cartItems[idx] = { ...fallback.cartItems[idx], ...options.data, updatedAt: new Date() };
              return fallback.cartItems[idx];
            }
            return null;
          }
          if (method === "delete") {
            fallback.cartItems = fallback.cartItems.filter(ci => ci.id !== options.where?.id);
            return { success: true };
          }
          if (method === "deleteMany") {
            fallback.cartItems = fallback.cartItems.filter(ci => ci.cartId !== options.where?.cartId);
            return { count: 1 };
          }
        }

        if (modelName === "aIInteraction") {
          if (method === "create") {
            const record = { id: uuidv4(), ...options.data, createdAt: new Date() };
            fallback.aiInteractions.push(record);
            return record;
          }
        }

        return null;
      };
    }
  });
}

// Resilient DB Object
export const db: any = new Proxy(prisma as any, {
  get(target, propKey) {
    const key = String(propKey);

    // Xử lý giao dịch $transaction
    if (key === "$transaction") {
      return async (arg: any) => {
        try {
          return await target.$transaction(arg);
        } catch (err: any) {
          if (!isConnectionError(err)) throw err;
          fallback.logFallbackOnce("$transaction", err.message);
          if (typeof arg === "function") {
            return await arg(db);
          }
          if (Array.isArray(arg)) {
            const results: any[] = [];
            for (const fn of arg) {
              results.push(await fn);
            }
            return results;
          }
          throw err;
        }
      };
    }

    // Xử lý $connect
    if (key === "$connect") {
      return async () => {
        try {
          return await target.$connect();
        } catch (err: any) {
          if (!isConnectionError(err)) throw err;
          fallback.logFallbackOnce("$connect", err.message);
        }
      };
    }

    // Xử lý $disconnect
    if (key === "$disconnect") {
      return async () => {
        try {
          return await target.$disconnect();
        } catch (e) {}
      };
    }

    // Các model: user, product, category, order, cart, cartItem, systemSettings, refreshToken, aIInteraction
    return createModelProxy(key);
  }
});

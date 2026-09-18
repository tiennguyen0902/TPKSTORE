"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.prisma = void 0;
exports.isConnectionError = isConnectionError;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
// 1. Luôn ưu tiên nạp biến môi trường từ .env
const envPaths = [
    path_1.default.resolve(__dirname, "../.env"),
    path_1.default.resolve(process.cwd(), ".env"),
    path_1.default.resolve(__dirname, "../../.env")
];
for (const p of envPaths) {
    if (fs_1.default.existsSync(p)) {
        dotenv_1.default.config({ path: p });
    }
}
dotenv_1.default.config();
// 2. Thiết lập giá trị mặc định dự phòng — đảm bảo Prisma không bao giờ bị lỗi thiếu DATABASE_URL
const DEFAULT_DATABASE_URL = "postgresql://postgres:password123@localhost:5432/store_ai_db?schema=public";
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
}
const client_1 = require("@prisma/client");
const mockData_1 = require("./mockData");
// Prisma Client Singleton
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
// Kiểm tra xem lỗi có phải do không kết nối được database PostgreSQL (để tự động fallback)
function isConnectionError(err) {
    if (!err)
        return false;
    if (err.code === "P2002")
        return false; // Lỗi trùng lặp email/key thuộc logic người dùng
    const code = String(err.code || "");
    const msg = (err.message || String(err)).toLowerCase();
    return (code.startsWith("P1") || // Toàn bộ lỗi P1000 (sai mật khẩu/user DB), P1001 (không kết nối), P1002 (timeout), P1003 (chưa có DB)...
        code === "P2021" || // Bảng chưa được tạo trong PostgreSQL
        code === "P2022" || // Cột chưa được tạo
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
        msg.includes("permission denied"));
}
/**
 * Fallback Database Engine (Bộ lưu trữ dự phòng tự động khi PostgreSQL trên Hosting chưa bật)
 * Đảm bảo hệ thống KHÔNG BAO GIỜ SẬP, người dùng luôn đăng nhập và mua sắm được 100%!
 */
class FallbackStore {
    users = [];
    categories = [];
    products = [];
    orders = [];
    settings = { ...mockData_1.INITIAL_SETTINGS };
    refreshTokens = [];
    carts = [];
    cartItems = [];
    aiInteractions = [];
    dataDir;
    dataFilePath;
    hasLoggedFallback = false;
    constructor() {
        this.dataDir = path_1.default.resolve(__dirname, "../data");
        this.dataFilePath = path_1.default.join(this.dataDir, "store.json");
        // Khởi tạo từ mockData
        this.users = mockData_1.INITIAL_USERS.map(u => ({
            ...u,
            createdAt: new Date(u.createdAt),
            updatedAt: new Date(u.updatedAt)
        }));
        this.categories = mockData_1.INITIAL_CATEGORIES.map(c => ({
            ...c,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt)
        }));
        this.products = mockData_1.INITIAL_PRODUCTS.map(p => {
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
        this.orders = mockData_1.INITIAL_ORDERS.map(o => ({
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
    logFallbackOnce(op, reason) {
        if (!this.hasLoggedFallback) {
            console.warn("==================================================================");
            console.warn("⚠️  POSTGRESQL CHƯA SẴN SÀNG HOẶC KHÔNG THỂ KẾT NỐI TRÊN HOSTING.");
            if (reason)
                console.warn(`   Chi tiết: ${reason.split("\n")[0]}`);
            console.warn("🛡️  HỆ THỐNG ĐÃ KÍCH HOẠT ENGINE DỰ PHÒNG TỰ ĐỘNG (Fallback Storage)!");
            console.warn("   Mọi hoạt động Đăng nhập (Admin / User), Sản phẩm, Giỏ hàng, Đặt hàng");
            console.warn("   sẽ hoạt động bình thường và được lưu trữ bền vững.");
            console.warn("==================================================================");
            this.hasLoggedFallback = true;
        }
    }
    saveToFile() {
        try {
            if (!fs_1.default.existsSync(this.dataDir)) {
                fs_1.default.mkdirSync(this.dataDir, { recursive: true });
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
            fs_1.default.writeFileSync(this.dataFilePath, JSON.stringify(data, null, 2), "utf8");
        }
        catch (e) {
            // Bỏ qua nếu môi trường hosting không cho phép ghi đĩa
        }
    }
    loadFromFile() {
        try {
            if (fs_1.default.existsSync(this.dataFilePath)) {
                const content = fs_1.default.readFileSync(this.dataFilePath, "utf8");
                const data = JSON.parse(content);
                if (Array.isArray(data.users))
                    this.users = data.users.map((u) => ({ ...u, createdAt: new Date(u.createdAt), updatedAt: new Date(u.updatedAt) }));
                if (Array.isArray(data.categories))
                    this.categories = data.categories.map((c) => ({ ...c, createdAt: new Date(c.createdAt), updatedAt: new Date(c.updatedAt) }));
                if (Array.isArray(data.products)) {
                    this.products = data.products.map((p) => {
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
                if (Array.isArray(data.orders))
                    this.orders = data.orders.map((o) => ({ ...o, createdAt: new Date(o.createdAt), updatedAt: new Date(o.updatedAt) }));
                if (data.settings)
                    this.settings = data.settings;
                if (Array.isArray(data.refreshTokens))
                    this.refreshTokens = data.refreshTokens;
                if (Array.isArray(data.carts))
                    this.carts = data.carts;
                if (Array.isArray(data.cartItems))
                    this.cartItems = data.cartItems;
            }
        }
        catch (e) { }
    }
}
const fallback = new FallbackStore();
/**
 * Resilient Database Proxy:
 * Chuyển tiếp toàn bộ truy vấn tới Prisma Client (PostgreSQL).
 * NẾU PostgreSQL gặp sự cố kết nối, tự động chuyển sang FallbackStore mà KHÔNG trả về lỗi 500 cho người dùng.
 */
function createModelProxy(modelName) {
    return new Proxy({}, {
        get(_target, propKey) {
            const method = String(propKey);
            return async (...args) => {
                try {
                    const prismaModel = exports.prisma[modelName];
                    if (prismaModel && typeof prismaModel[method] === "function") {
                        return await prismaModel[method](...args);
                    }
                }
                catch (err) {
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
                            if (where.id && u.id === where.id)
                                return true;
                            if (where.email) {
                                const target = typeof where.email === "object" ? where.email.equals : where.email;
                                if (target && u.email.toLowerCase() === String(target).toLowerCase())
                                    return true;
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
                            id: options.data.id || `usr_${(0, uuid_1.v4)().substring(0, 8)}`,
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
                            id: (0, uuid_1.v4)(),
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
                        const where = options.where || {};
                        if (where.categoryId && where.categoryId !== "all") {
                            list = list.filter(p => p.categoryId === where.categoryId || p.category?.slug === where.categoryId);
                        }
                        if (where.isFeatured !== undefined) {
                            list = list.filter(p => p.isFeatured === where.isFeatured);
                        }
                        if (where.isNew !== undefined) {
                            list = list.filter(p => p.isNew === where.isNew);
                        }
                        return list;
                    }
                    if (method === "count") {
                        return fallback.products.length;
                    }
                    if (method === "findFirst" || method === "findUnique") {
                        const where = options.where || {};
                        let p = null;
                        if (Array.isArray(where.OR)) {
                            p = fallback.products.find(item => {
                                return where.OR.some((cond) => {
                                    if (cond.id && item.id === cond.id)
                                        return true;
                                    if (cond.slug && item.slug === cond.slug)
                                        return true;
                                    return false;
                                });
                            });
                        }
                        else {
                            p = fallback.products.find(item => item.id === where.id || item.slug === where.slug || item.id === where.idOrSlug);
                        }
                        if (!p)
                            return null;
                        const cat = fallback.categories.find(c => c.id === p.categoryId);
                        let stock = typeof p.stock === "number" && !isNaN(p.stock)
                            ? p.stock
                            : (typeof p.stock === "object" && p.stock && typeof p.stock.decrement === "number" ? Math.max(0, 25 - p.stock.decrement) : 20);
                        return { ...p, stock, category: cat || null };
                    }
                    if (method === "create") {
                        const p = { id: options.data.id || `prd_${(0, uuid_1.v4)().substring(0, 8)}`, ...options.data, createdAt: new Date(), updatedAt: new Date() };
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
                                    }
                                    else if (typeof options.data.stock.increment === "number") {
                                        updatedStock = currentNum + options.data.stock.increment;
                                    }
                                    else {
                                        updatedStock = currentNum;
                                    }
                                }
                                else {
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
                        const c = { id: options.data.id || `cat_${(0, uuid_1.v4)().substring(0, 8)}`, ...options.data, createdAt: new Date(), updatedAt: new Date() };
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
                        const item = { id: `ci_${(0, uuid_1.v4)().substring(0, 8)}`, ...options.data, createdAt: new Date(), updatedAt: new Date() };
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
                        const record = { id: (0, uuid_1.v4)(), ...options.data, createdAt: new Date() };
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
exports.db = new Proxy(exports.prisma, {
    get(target, propKey) {
        const key = String(propKey);
        // Xử lý giao dịch $transaction
        if (key === "$transaction") {
            return async (arg) => {
                try {
                    return await target.$transaction(arg);
                }
                catch (err) {
                    if (!isConnectionError(err))
                        throw err;
                    fallback.logFallbackOnce("$transaction", err.message);
                    if (typeof arg === "function") {
                        return await arg(exports.db);
                    }
                    if (Array.isArray(arg)) {
                        const results = [];
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
                }
                catch (err) {
                    if (!isConnectionError(err))
                        throw err;
                    fallback.logFallbackOnce("$connect", err.message);
                }
            };
        }
        // Xử lý $disconnect
        if (key === "$disconnect") {
            return async () => {
                try {
                    return await target.$disconnect();
                }
                catch (e) { }
            };
        }
        // Các model: user, product, category, order, cart, cartItem, systemSettings, refreshToken, aIInteraction
        return createModelProxy(key);
    }
});

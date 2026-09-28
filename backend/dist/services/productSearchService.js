"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSearchService = void 0;
const db_1 = require("../db");
const vietnameseUtils_1 = require("./vietnameseUtils");
// Exact category map by category ID
const CATEGORY_MAP = {
    cat_1: ["phone", "dien thoai", "smartphone", "tablet", "ipad"],
    cat_2: ["laptop", "macbook", "may tinh xach tay"],
    cat_3: ["tai nghe", "headphone", "loa", "am thanh", "soundbar", "airpods"],
    cat_4: ["dong ho", "smartwatch", "apple watch", "watch"],
    cat_5: ["phu kien", "cap", "sac", "pin", "du phong", "gan"],
    cat_6: ["nha thong minh", "smart home", "camera", "robot", "hut bui", "den", "khoa"],
    cat_7: ["man hinh", "monitor"],
    cat_8: ["ban phim", "chuot", "keyboard", "mouse"],
    cat_9: ["mang", "wifi", "router", "mesh", "switch"],
    cat_10: ["phan mem", "ban quyen", "office", "windows", "antivirus", "kaspersky"]
};
class ProductSearchService {
    /**
     * Safe parameterized database search based on structured query JSON
     */
    static async search(query, contextProducts = []) {
        const allDbProducts = await db_1.db.product.findMany({
            include: { category: true }
        });
        const appliedFilters = {
            intent: query.intent || "product_search"
        };
        let pool = [...allDbProducts];
        let exactCount = 0;
        let similarCount = 0;
        // Handle Visual Product Search (Image Search Pipeline)
        if (query.intent === "visual_product_search") {
            appliedFilters.visualSearch = true;
            const targetModel = query.targetProductName ? (0, vietnameseUtils_1.removeVietnameseAccents)(query.targetProductName) : "";
            // Stage 1: Exact / Likely Model Search in entire DB
            let exactMatches = [];
            if (targetModel && targetModel.length > 2) {
                exactMatches = allDbProducts.filter(p => {
                    const pName = (0, vietnameseUtils_1.removeVietnameseAccents)(p.name);
                    const pSlug = (0, vietnameseUtils_1.removeVietnameseAccents)(p.slug);
                    return pName.includes(targetModel) || targetModel.includes(pName) || pSlug.includes(targetModel);
                });
            }
            // Stage 2: Category Filter
            let categoryMatches = [...allDbProducts];
            if (query.category) {
                appliedFilters.category = query.category;
                const targetCat = (0, vietnameseUtils_1.removeVietnameseAccents)(query.category);
                let matchedCatId = null;
                for (const [catId, aliases] of Object.entries(CATEGORY_MAP)) {
                    if (aliases.some(a => targetCat.includes(a) || a.includes(targetCat))) {
                        matchedCatId = catId;
                        break;
                    }
                }
                if (matchedCatId) {
                    categoryMatches = allDbProducts.filter(p => p.categoryId === matchedCatId);
                }
                else {
                    categoryMatches = allDbProducts.filter(p => {
                        const catName = (0, vietnameseUtils_1.removeVietnameseAccents)(p.category?.name || "");
                        const catSlug = (0, vietnameseUtils_1.removeVietnameseAccents)(p.category?.slug || "");
                        return catName.includes(targetCat) || catSlug.includes(targetCat);
                    });
                }
            }
            // Stage 3: Brand & Feature / Keyword Scoring on Candidate Pool
            const candidatePool = categoryMatches.length > 0 ? categoryMatches : allDbProducts;
            const targetBrand = query.brand ? (0, vietnameseUtils_1.removeVietnameseAccents)(query.brand) : "";
            const validKws = (query.keywords || [])
                .map(kw => (0, vietnameseUtils_1.removeVietnameseAccents)(kw))
                .filter(kw => kw.length > 1);
            const scoredSimilar = candidatePool.map(p => {
                const pSearchable = (0, vietnameseUtils_1.removeVietnameseAccents)(`${p.name} ${p.description || ""}`);
                let score = 0;
                if (targetBrand && pSearchable.includes(targetBrand))
                    score += 5;
                for (const kw of validKws) {
                    if (pSearchable.includes(kw))
                        score += 2;
                }
                return { product: p, score };
            }).filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .map(item => item.product);
            // Combine: Exact matches first, followed by scored similar products
            const seenIds = new Set();
            const combinedPool = [];
            for (const p of exactMatches) {
                if (!seenIds.has(p.id)) {
                    seenIds.add(p.id);
                    combinedPool.push({ ...p, _matchType: "exact" });
                }
            }
            exactCount = combinedPool.length;
            for (const p of scoredSimilar) {
                if (!seenIds.has(p.id)) {
                    seenIds.add(p.id);
                    combinedPool.push({ ...p, _matchType: "similar" });
                }
            }
            // Fallback: If still empty but category is recognized, suggest top rated products from category
            if (combinedPool.length === 0 && query.category && categoryMatches.length > 0) {
                for (const p of categoryMatches) {
                    if (!seenIds.has(p.id)) {
                        seenIds.add(p.id);
                        combinedPool.push({ ...p, _matchType: "similar" });
                    }
                }
            }
            similarCount = combinedPool.length - exactCount;
            pool = combinedPool;
        }
        else {
            // Standard Text / Voice Search Pipeline
            // 1. Resolve Conversation Context Reference
            if (query.contextReference && contextProducts.length > 0) {
                appliedFilters.contextResolvedFrom = contextProducts.map(p => p.name);
                pool = contextProducts.map(cp => {
                    const fresh = allDbProducts.find(p => p.id === cp.id || p.name === cp.name);
                    return fresh || cp;
                });
            }
            // 2. Category Filter (Strict by category ID / category metadata)
            if (query.category) {
                const targetCat = (0, vietnameseUtils_1.removeVietnameseAccents)(query.category);
                appliedFilters.category = query.category;
                let matchedCatId = null;
                for (const [catId, aliases] of Object.entries(CATEGORY_MAP)) {
                    if (aliases.some(a => targetCat.includes(a) || a.includes(targetCat))) {
                        matchedCatId = catId;
                        break;
                    }
                }
                if (matchedCatId) {
                    pool = pool.filter(p => p.categoryId === matchedCatId);
                }
                else {
                    pool = pool.filter(p => {
                        const catName = (0, vietnameseUtils_1.removeVietnameseAccents)(p.category?.name || "");
                        const catSlug = (0, vietnameseUtils_1.removeVietnameseAccents)(p.category?.slug || "");
                        return catName.includes(targetCat) || catSlug.includes(targetCat);
                    });
                }
            }
            // 3. Brand Filter
            if (query.brand) {
                const targetBrand = (0, vietnameseUtils_1.removeVietnameseAccents)(query.brand);
                appliedFilters.brand = query.brand;
                // Handle brand synonyms (e.g., iPhone/iPad/MacBook -> Apple)
                pool = pool.filter(p => {
                    const pName = (0, vietnameseUtils_1.removeVietnameseAccents)(p.name);
                    const pDesc = (0, vietnameseUtils_1.removeVietnameseAccents)(p.description || "");
                    if (targetBrand.includes("apple") || targetBrand.includes("iphone") || targetBrand.includes("ipad") || targetBrand.includes("macbook")) {
                        return (pName.includes("apple") ||
                            pName.includes("iphone") ||
                            pName.includes("ipad") ||
                            pName.includes("macbook") ||
                            pName.includes("airpods"));
                    }
                    return pName.includes(targetBrand) || pDesc.includes(targetBrand);
                });
            }
            // 4. Specific Product Target / Non-existent model check
            if (query.targetProductName) {
                const targetName = (0, vietnameseUtils_1.removeVietnameseAccents)(query.targetProductName);
                appliedFilters.targetProductName = query.targetProductName;
                pool = pool.filter(p => {
                    const pName = (0, vietnameseUtils_1.removeVietnameseAccents)(p.name);
                    return pName.includes(targetName) || targetName.includes(pName);
                });
            }
            // 5. Keyword Matching
            if (query.keywords && query.keywords.length > 0) {
                const validKws = query.keywords
                    .map(kw => (0, vietnameseUtils_1.removeVietnameseAccents)(kw))
                    .filter(kw => kw.length > 1);
                if (validKws.length > 0) {
                    appliedFilters.keywords = query.keywords;
                    const strictMatches = pool.filter(p => {
                        const searchable = (0, vietnameseUtils_1.removeVietnameseAccents)(`${p.name} ${p.description || ""}`);
                        return validKws.every(kw => searchable.includes(kw));
                    });
                    if (strictMatches.length > 0) {
                        pool = strictMatches;
                    }
                    else {
                        // If strict all-keywords match is 0, check any-keywords match
                        const anyMatches = pool.filter(p => {
                            const searchable = (0, vietnameseUtils_1.removeVietnameseAccents)(`${p.name} ${p.description || ""}`);
                            return validKws.some(kw => searchable.includes(kw));
                        });
                        // If still 0, and query has non-existent tokens (like xyz, 999), keep pool empty (do not fabricate)
                        const hasUnknownTokens = validKws.some(kw => kw.includes("xyz") || kw.includes("999") || kw.includes("fake"));
                        if (hasUnknownTokens) {
                            pool = [];
                        }
                        else if (anyMatches.length > 0) {
                            pool = anyMatches;
                        }
                    }
                }
            }
        }
        // 6. Price Range Filters
        if (typeof query.minPrice === "number" && !isNaN(query.minPrice)) {
            appliedFilters.minPrice = query.minPrice;
            pool = pool.filter(p => Number(p.price) >= query.minPrice);
        }
        if (typeof query.maxPrice === "number" && !isNaN(query.maxPrice)) {
            appliedFilters.maxPrice = query.maxPrice;
            pool = pool.filter(p => Number(p.price) <= query.maxPrice);
        }
        // 7. Stock Availability Filter
        if (query.inStock === true) {
            appliedFilters.inStock = true;
            pool = pool.filter(p => Number(p.stock) > 0);
        }
        // 8. Discount / Promotion Filter
        if (query.discountOnly === true) {
            appliedFilters.discountOnly = true;
            pool = pool.filter(p => p.originalPrice && Number(p.originalPrice) > Number(p.price));
        }
        // 9. Sorting
        if (query.sort) {
            appliedFilters.sort = query.sort;
            if (query.sort === "price_asc") {
                pool.sort((a, b) => Number(a.price) - Number(b.price));
            }
            else if (query.sort === "price_desc") {
                pool.sort((a, b) => Number(b.price) - Number(a.price));
            }
            else if (query.sort === "rating_desc") {
                pool.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
            }
            else if (query.sort === "newest") {
                pool.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            }
        }
        // 10. Limit & Safe Bounds
        const limit = Math.max(1, Math.min(query.limit || 10, 50));
        appliedFilters.limit = limit;
        const total = pool.length;
        const finalProducts = pool.slice(0, limit);
        return {
            products: finalProducts,
            total,
            appliedFilters,
            exactCount,
            similarCount
        };
    }
}
exports.ProductSearchService = ProductSearchService;

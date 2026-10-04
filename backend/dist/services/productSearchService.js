"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSearchService = exports.CATEGORY_MAP = void 0;
const db_1 = require("../db");
const vietnameseUtils_1 = require("./vietnameseUtils");
const categoryDictionary_1 = require("./categoryDictionary");
Object.defineProperty(exports, "CATEGORY_MAP", { enumerable: true, get: function () { return categoryDictionary_1.CATEGORY_MAP; } });
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
                const matched = (0, categoryDictionary_1.findCategoryMatch)(query.category);
                if (matched) {
                    categoryMatches = allDbProducts.filter(p => p.categoryId === matched.id);
                }
                else {
                    const targetCat = (0, vietnameseUtils_1.removeVietnameseAccents)(query.category);
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
            let matchedCat = null;
            if (query.category) {
                appliedFilters.category = query.category;
                matchedCat = (0, categoryDictionary_1.findCategoryMatch)(query.category);
                if (matchedCat) {
                    pool = pool.filter(p => p.categoryId === matchedCat.id);
                }
                else {
                    const targetCat = (0, vietnameseUtils_1.removeVietnameseAccents)(query.category);
                    pool = pool.filter(p => {
                        const catName = (0, vietnameseUtils_1.removeVietnameseAccents)(p.category?.name || "");
                        const catSlug = (0, vietnameseUtils_1.removeVietnameseAccents)(p.category?.slug || "");
                        return catName.includes(targetCat) || catSlug.includes(targetCat);
                    });
                }
            }
            // 2.1 Comprehensive Subcategory Disambiguation Engine
            const fullQueryText = (0, vietnameseUtils_1.removeVietnameseAccents)(`${query.rawText || ""} ${(query.keywords || []).join(" ")} ${query.targetProductName || ""}`).toLowerCase();
            const SUBCATEGORY_RULES = [
                // cat_5: Phụ kiện & Cáp sạc
                {
                    id: "subcat_cat5_powerbank",
                    name: "Pin sạc dự phòng",
                    categoryId: "cat_5",
                    triggers: ["sac du phong", "pin du phong", "power bank", "pin sac du phong", "pin sac", "sac di dong", "sac pin du phong"],
                    primaryMatch: (pName, pDesc) => pName.includes("du phong") || pName.includes("power bank") || pName.includes("pin sac"),
                    strictlyExcluded: (pName, pDesc) => pName.includes("but cam ung") || pName.includes("pencil") || pName.includes("stylus") || pName.includes("hub") || pName.includes("dock") || pName.includes("hdmi"),
                    compatibleBackfill: (pName, pDesc) => pName.includes("cu sac") || pName.includes("tram sac") || pName.includes("de sac") || pName.includes("cap sac") || pName.includes("gan")
                },
                {
                    id: "subcat_cat5_charger",
                    name: "Củ sạc & Trạm sạc",
                    categoryId: "cat_5",
                    triggers: ["cu sac", "adapter sac", "tram sac", "sac gan", "sac nhanh", "de sac", "magsafe charger", "sac khong day"],
                    primaryMatch: (pName, pDesc) => (pName.includes("cu sac") || pName.includes("tram sac") || pName.includes("de sac") || pName.includes("gan") || pName.includes("sac nhanh")) && !pName.includes("du phong"),
                    strictlyExcluded: (pName, pDesc) => pName.includes("but cam ung") || pName.includes("pencil") || pName.includes("stylus") || pName.includes("hub") || pName.includes("dock") || pName.includes("hdmi"),
                    compatibleBackfill: (pName, pDesc) => pName.includes("cap sac") || pName.includes("du phong")
                },
                {
                    id: "subcat_cat5_cable",
                    name: "Cáp sạc & Dây sạc",
                    categoryId: "cat_5",
                    triggers: ["cap sac", "day sac", "cap type c", "cap type-c", "cap lightning", "cap thunderbolt", "day cap"],
                    primaryMatch: (pName, pDesc) => pName.includes("cap sac") || pName.includes("day sac") || pName.includes("type-c to type-c"),
                    strictlyExcluded: (pName, pDesc) => pName.includes("but cam ung") || pName.includes("pencil") || pName.includes("stylus") || pName.includes("hub") || pName.includes("dock")
                },
                {
                    id: "subcat_cat5_stylus",
                    name: "Bút cảm ứng",
                    categoryId: "cat_5",
                    triggers: ["but cam ung", "apple pencil", "stylus", "pencil", "but cho ipad", "but ve"],
                    primaryMatch: (pName, pDesc) => pName.includes("but cam ung") || pName.includes("pencil") || pName.includes("stylus") || pName.includes("but "),
                    strictlyExcluded: (pName, pDesc) => pName.includes("du phong") || pName.includes("cu sac") || pName.includes("tram sac") || pName.includes("cap sac") || pName.includes("hub") || pName.includes("dock") || pName.includes("hdmi")
                },
                {
                    id: "subcat_cat5_hub",
                    name: "Hub chuyển đổi & Dock",
                    categoryId: "cat_5",
                    triggers: ["hub", "dock", "cong chuyen doi", "bo chuyen doi", "docking", "hub usb"],
                    primaryMatch: (pName, pDesc) => pName.includes("hub") || pName.includes("dock") || pName.includes("chuyen doi"),
                    strictlyExcluded: (pName, pDesc) => pName.includes("but cam ung") || pName.includes("pencil") || pName.includes("du phong") || pName.includes("cu sac")
                },
                {
                    id: "subcat_cat5_hdmi",
                    name: "Cáp HDMI & Hiển thị",
                    categoryId: "cat_5",
                    triggers: ["hdmi", "cap hdmi", "cap man hinh"],
                    primaryMatch: (pName, pDesc) => pName.includes("hdmi"),
                    strictlyExcluded: (pName, pDesc) => pName.includes("but cam ung") || pName.includes("pencil") || pName.includes("du phong") || pName.includes("cu sac")
                },
                // cat_3: Tai nghe & Âm thanh
                {
                    id: "subcat_cat3_headphone",
                    name: "Tai nghe",
                    categoryId: "cat_3",
                    triggers: ["tai nghe", "headphone", "earphone", "earbuds", "airpods", "buds", "chup tai", "in-ear", "over-ear"],
                    primaryMatch: (pName, pDesc) => pName.includes("tai nghe") || pName.includes("airpods") || pName.includes("buds") || pName.includes("headphone"),
                    strictlyExcluded: (pName, pDesc) => pName.includes("loa") || pName.includes("soundbar") || pName.includes("speaker")
                },
                {
                    id: "subcat_cat3_speaker",
                    name: "Loa & Soundbar",
                    categoryId: "cat_3",
                    triggers: ["loa", "speaker", "soundbar", "loa bluetooth", "loa de ban"],
                    primaryMatch: (pName, pDesc) => pName.includes("loa") || pName.includes("soundbar") || pName.includes("speaker"),
                    strictlyExcluded: (pName, pDesc) => pName.includes("tai nghe") || pName.includes("airpods") || pName.includes("buds") || pName.includes("headphone")
                },
                // cat_8: Bàn phím & Chuột
                {
                    id: "subcat_cat8_mouse",
                    name: "Chuột",
                    categoryId: "cat_8",
                    triggers: ["chuot", "mouse", "chuot gaming", "chuot khong day"],
                    primaryMatch: (pName, pDesc) => pName.includes("chuot") || pName.includes("mouse"),
                    strictlyExcluded: (pName, pDesc) => pName.includes("ban phim") || pName.includes("keyboard")
                },
                {
                    id: "subcat_cat8_keyboard",
                    name: "Bàn phím",
                    categoryId: "cat_8",
                    triggers: ["ban phim", "keyboard", "ban phim co"],
                    primaryMatch: (pName, pDesc) => pName.includes("ban phim") || pName.includes("keyboard"),
                    strictlyExcluded: (pName, pDesc) => pName.includes("chuot") || pName.includes("mouse")
                },
                // cat_6: Smart Home
                {
                    id: "subcat_cat6_vacuum",
                    name: "Robot hút bụi",
                    categoryId: "cat_6",
                    triggers: ["robot hut bui", "robot lau nha", "hut bui", "deebot", "ecovacs", "vacuum"],
                    primaryMatch: (pName, pDesc) => pName.includes("robot") || pName.includes("hut bui") || pName.includes("deebot") || pName.includes("ecovacs"),
                    strictlyExcluded: (pName, pDesc) => pName.includes("camera") || pName.includes("den") || pName.includes("khoa")
                },
                {
                    id: "subcat_cat6_camera",
                    name: "Camera an ninh",
                    categoryId: "cat_6",
                    triggers: ["camera", "cam", "giam sat", "an ninh"],
                    primaryMatch: (pName, pDesc) => pName.includes("camera") || pName.includes("cam "),
                    strictlyExcluded: (pName, pDesc) => pName.includes("robot") || pName.includes("hut bui")
                },
                // cat_1: Điện thoại & Tablet
                {
                    id: "subcat_cat1_phone",
                    name: "Điện thoại",
                    categoryId: "cat_1",
                    triggers: ["dien thoai", "phone", "smartphone", "dtdd"],
                    primaryMatch: (pName, pDesc) => !pName.includes("ipad") && !pName.includes("tab ") && !pName.includes("tablet"),
                    strictlyExcluded: (pName, pDesc) => pName.includes("ipad") || pName.includes("tab ") || pName.includes("tablet")
                },
                {
                    id: "subcat_cat1_tablet",
                    name: "Máy tính bảng",
                    categoryId: "cat_1",
                    triggers: ["tablet", "may tinh bang", "ipad", "tab "],
                    primaryMatch: (pName, pDesc) => pName.includes("ipad") || pName.includes("tab") || pName.includes("tablet"),
                    strictlyExcluded: (pName, pDesc) => !pName.includes("ipad") && !pName.includes("tab") && !pName.includes("tablet")
                }
            ];
            let activeSubcat = null;
            if (matchedCat) {
                const candidateRules = SUBCATEGORY_RULES.filter(r => r.categoryId === matchedCat.id);
                let bestMatchLen = 0;
                for (const rule of candidateRules) {
                    for (const trig of rule.triggers) {
                        if (fullQueryText.includes(trig) && trig.length > bestMatchLen) {
                            if ((rule.id === "subcat_cat5_charger" || rule.id === "subcat_cat5_cable") &&
                                (fullQueryText.includes("du phong") || fullQueryText.includes("power bank") || fullQueryText.includes("pin sac"))) {
                                continue;
                            }
                            bestMatchLen = trig.length;
                            activeSubcat = rule;
                        }
                    }
                }
            }
            if (activeSubcat) {
                appliedFilters.subcategory = activeSubcat.name;
                // 1. Remove strictly excluded products from the pool
                pool = pool.filter(p => {
                    const pName = (0, vietnameseUtils_1.removeVietnameseAccents)(p.name || "").toLowerCase();
                    const pDesc = (0, vietnameseUtils_1.removeVietnameseAccents)(p.description || "").toLowerCase();
                    return !activeSubcat.strictlyExcluded(pName, pDesc);
                });
                // 2. Identify primary matches for the subcategory
                const primaryMatches = pool.filter(p => {
                    const pName = (0, vietnameseUtils_1.removeVietnameseAccents)(p.name || "").toLowerCase();
                    const pDesc = (0, vietnameseUtils_1.removeVietnameseAccents)(p.description || "").toLowerCase();
                    return activeSubcat.primaryMatch(pName, pDesc);
                });
                if (primaryMatches.length > 0) {
                    // Sort primary matches by rating and featured
                    primaryMatches.sort((a, b) => {
                        if (b.isFeatured !== a.isFeatured)
                            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
                        return (Number(b.rating || 0) - Number(a.rating || 0)) || (Number(b.reviewCount || 0) - Number(a.reviewCount || 0));
                    });
                    if (primaryMatches.length >= 4 || !activeSubcat.compatibleBackfill) {
                        pool = primaryMatches;
                    }
                    else {
                        // Backfill with compatible companion products up to 4 items
                        const seenIds = new Set(primaryMatches.map(p => p.id));
                        const backfillCandidates = pool.filter(p => {
                            if (seenIds.has(p.id))
                                return false;
                            const pName = (0, vietnameseUtils_1.removeVietnameseAccents)(p.name || "").toLowerCase();
                            const pDesc = (0, vietnameseUtils_1.removeVietnameseAccents)(p.description || "").toLowerCase();
                            return activeSubcat.compatibleBackfill(pName, pDesc);
                        });
                        backfillCandidates.sort((a, b) => {
                            if (b.isFeatured !== a.isFeatured)
                                return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
                            return (Number(b.rating || 0) - Number(a.rating || 0)) || (Number(b.reviewCount || 0) - Number(a.reviewCount || 0));
                        });
                        pool = [...primaryMatches, ...backfillCandidates.slice(0, 4 - primaryMatches.length)];
                    }
                }
            }
            // 3. Brand Filter
            if (query.brand) {
                const targetBrand = (0, vietnameseUtils_1.removeVietnameseAccents)(query.brand);
                appliedFilters.brand = query.brand;
                // Handle brand synonyms (e.g., Apple, Samsung, Microsoft...)
                pool = pool.filter(p => {
                    const pName = (0, vietnameseUtils_1.removeVietnameseAccents)(p.name);
                    const pDesc = (0, vietnameseUtils_1.removeVietnameseAccents)(p.description || "");
                    if (targetBrand.includes("apple") || targetBrand.includes("iphone") || targetBrand.includes("ipad") || targetBrand.includes("macbook") || targetBrand.includes("mac") || targetBrand.includes("imac")) {
                        return (pName.includes("apple") ||
                            pName.includes("iphone") ||
                            pName.includes("ipad") ||
                            pName.includes("macbook") ||
                            pName.includes("mac") ||
                            pName.includes("airpods"));
                    }
                    if (targetBrand.includes("samsung") || targetBrand.includes("galaxy")) {
                        return pName.includes("samsung") || pName.includes("galaxy") || pDesc.includes("samsung");
                    }
                    if (targetBrand.includes("microsoft") || targetBrand.includes("windows") || targetBrand.includes("office")) {
                        return pName.includes("microsoft") || pName.includes("windows") || pName.includes("office") || pDesc.includes("microsoft");
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
            // 5. Keyword Matching & Category Token Sanitization
            // Only sanitize broad generic category stopwords, preserving equipment subtypes
            const BROAD_CATEGORY_STOPWORDS = {
                cat_1: ["dien thoai", "smartphone", "mobile phone", "phone", "dtdd", "dien thoai di dong"],
                cat_2: ["laptop", "may tinh xach tay", "notebook", "ultrabook", "may tinh laptop"],
                cat_3: ["thiet bi am thanh", "am thanh"],
                cat_4: ["dong ho", "watch"],
                cat_5: ["phu kien", "accessories", "phu kien cong nghe", "phu kien dien thoai", "phu kien laptop"],
                cat_6: ["smart home", "nha thong minh", "thiet bi thong minh", "thiet bi"],
                cat_7: ["man hinh", "monitor", "display"],
                cat_8: ["ban phim va chuot"],
                cat_9: ["thiet bi mang", "networking", "mang"],
                cat_10: ["phan mem", "software", "ban quyen"]
            };
            const categoryTokens = new Set(matchedCat && BROAD_CATEGORY_STOPWORDS[matchedCat.id]
                ? BROAD_CATEGORY_STOPWORDS[matchedCat.id]
                : []);
            const rawKeywords = query.keywords || [];
            const sanitizedKws = rawKeywords.filter(kw => {
                const clean = (0, vietnameseUtils_1.removeVietnameseAccents)(kw.toLowerCase().trim());
                if (clean.length <= 1)
                    return false;
                if (categoryTokens.has(clean))
                    return false;
                return true;
            });
            const allTokens = [];
            for (const kw of sanitizedKws) {
                const clean = (0, vietnameseUtils_1.removeVietnameseAccents)(kw.toLowerCase().trim());
                if (clean.length > 1) {
                    allTokens.push(clean);
                    const parts = clean.split(/\s+/).filter(p => p.length > 1 && !categoryTokens.has(p));
                    if (parts.length > 1) {
                        allTokens.push(...parts);
                    }
                }
            }
            const validKws = Array.from(new Set(allTokens));
            const candidateCategoryPool = [...pool];
            if (validKws.length > 0) {
                appliedFilters.keywords = validKws;
                const strictMatches = pool.filter(p => {
                    const searchable = (0, vietnameseUtils_1.removeVietnameseAccents)(`${p.name} ${p.description || ""}`).toLowerCase();
                    return validKws.every(kw => searchable.includes(kw));
                });
                if (strictMatches.length >= 4) {
                    pool = strictMatches;
                }
                else {
                    // Score products by matching tokens and sort by score descending
                    const scoredMatches = pool.map(p => {
                        const pName = (0, vietnameseUtils_1.removeVietnameseAccents)((p.name || "").toLowerCase());
                        const pDesc = (0, vietnameseUtils_1.removeVietnameseAccents)((p.description || "").toLowerCase());
                        let score = 0;
                        for (const kw of validKws) {
                            if (pName.includes(kw)) {
                                score += kw.length >= 3 ? 15 : 10;
                            }
                            else if (pDesc.includes(kw)) {
                                score += 5;
                            }
                        }
                        return { product: p, score };
                    }).filter(item => item.score > 0);
                    const hasUnknownTokens = validKws.some(kw => kw.includes("xyz") || kw.includes("999") || kw.includes("fake"));
                    if (hasUnknownTokens) {
                        pool = [];
                    }
                    else {
                        scoredMatches.sort((a, b) => b.score - a.score);
                        const combined = [];
                        const seenIds = new Set();
                        // Strict matches first
                        for (const p of strictMatches) {
                            if (!seenIds.has(p.id)) {
                                seenIds.add(p.id);
                                combined.push(p);
                            }
                        }
                        // Scored matches next
                        for (const item of scoredMatches) {
                            if (!seenIds.has(item.product.id)) {
                                seenIds.add(item.product.id);
                                combined.push(item.product);
                            }
                        }
                        // Backfill from candidate pool up to at least 4 products only if category context exists
                        if (matchedCat) {
                            for (const p of candidateCategoryPool) {
                                if (!seenIds.has(p.id)) {
                                    if (activeSubcat) {
                                        const pName = (0, vietnameseUtils_1.removeVietnameseAccents)(p.name || "").toLowerCase();
                                        const pDesc = (0, vietnameseUtils_1.removeVietnameseAccents)(p.description || "").toLowerCase();
                                        if (activeSubcat.strictlyExcluded(pName, pDesc))
                                            continue;
                                    }
                                    seenIds.add(p.id);
                                    combined.push(p);
                                    if (combined.length >= 4)
                                        break;
                                }
                            }
                        }
                        pool = combined;
                    }
                }
            }
            else {
                // No specific keywords: sort by featured and rating
                pool.sort((a, b) => {
                    if (b.isFeatured !== a.isFeatured)
                        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
                    return (Number(b.rating || 0) - Number(a.rating || 0)) || (Number(b.reviewCount || 0) - Number(a.reviewCount || 0));
                });
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

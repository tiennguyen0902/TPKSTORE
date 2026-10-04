"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const searchEngine_1 = require("../utils/searchEngine");
const router = (0, express_1.Router)();
// GET /api/products (Public with filters & Smart Search)
router.get("/", async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, isFeatured, isNew, sortBy, limit, page } = req.query;
        const where = {};
        if (category && category !== "all") {
            // Support both id and slug
            where.OR = [
                { categoryId: category },
                { category: { slug: category } }
            ];
        }
        if (minPrice !== undefined) {
            where.price = { ...(where.price || {}), gte: parseFloat(minPrice) };
        }
        if (maxPrice !== undefined) {
            where.price = { ...(where.price || {}), lte: parseFloat(maxPrice) };
        }
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured === "true";
        }
        if (isNew !== undefined) {
            where.isNew = isNew === "true";
        }
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 50;
        const skip = (pageNum - 1) * limitNum;
        // 🌟 THUẬT TOÁN TÌM KIẾM THÔNG MINH (Smart Search Engine):
        // Xử lý từ đồng nghĩa, tiếng Việt có dấu/không dấu, nhận diện danh mục & ưu tiên độ khớp tên
        if (search && String(search).trim()) {
            const q = String(search).trim();
            const candidateProducts = await db_1.db.product.findMany({
                where,
                include: { category: true }
            });
            let ranked = (0, searchEngine_1.filterAndRankProducts)(candidateProducts, q);
            // Áp dụng sắp xếp người dùng nếu có chỉ định cụ thể
            if (sortBy === "price_asc") {
                ranked.sort((a, b) => a.price - b.price);
            }
            else if (sortBy === "price_desc") {
                ranked.sort((a, b) => b.price - a.price);
            }
            else if (sortBy === "rating_desc") {
                ranked.sort((a, b) => b.rating - a.rating);
            }
            const total = ranked.length;
            const products = ranked.slice(skip, skip + limitNum);
            return res.json({
                total,
                page: pageNum,
                limit: limitNum,
                products
            });
        }
        let orderBy = {};
        if (sortBy === "price_asc") {
            orderBy = { price: "asc" };
        }
        else if (sortBy === "price_desc") {
            orderBy = { price: "desc" };
        }
        else if (sortBy === "rating_desc") {
            orderBy = { rating: "desc" };
        }
        else if (sortBy === "newest") {
            orderBy = { createdAt: "desc" };
        }
        const [products, total] = await Promise.all([
            db_1.db.product.findMany({
                where,
                include: { category: true },
                orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
                skip,
                take: limitNum,
            }),
            db_1.db.product.count({ where })
        ]);
        return res.json({
            total,
            page: pageNum,
            limit: limitNum,
            products
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi truy vấn sản phẩm: " + err.message });
    }
});
// GET /api/products/:idOrSlug
router.get("/:idOrSlug", async (req, res) => {
    try {
        const product = await db_1.db.product.findFirst({
            where: {
                OR: [
                    { id: req.params.idOrSlug },
                    { slug: req.params.idOrSlug }
                ]
            },
            include: { category: true }
        });
        if (!product) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm." });
        }
        return res.json(product);
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi truy vấn: " + err.message });
    }
});
// POST /api/products (Admin & Manager)
router.post("/", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER"]), async (req, res) => {
    try {
        const { name, description, price, originalPrice, stock, categoryId, thumbnail, images, isFeatured, isNew } = req.body;
        if (!name || price === undefined || stock === undefined || !categoryId) {
            return res.status(400).json({ error: "Vui lòng điền đầy đủ Tên, Giá bán, Tồn kho và Danh mục." });
        }
        if (price < 0 || stock < 0) {
            return res.status(400).json({ error: "Giá bán và số lượng tồn kho không được âm." });
        }
        // Generate unique slug
        let baseSlug = name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        let slug = baseSlug;
        let count = 1;
        while (await db_1.db.product.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${count++}`;
        }
        const defaultThumb = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
        const newProduct = await db_1.db.product.create({
            data: {
                name,
                slug,
                description: description || "",
                price: parseFloat(price),
                originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                stock: parseInt(stock),
                thumbnail: thumbnail || defaultThumb,
                images: Array.isArray(images) && images.length > 0 ? images : [thumbnail || defaultThumb],
                rating: 5.0,
                reviewCount: 0,
                isFeatured: isFeatured === true || isFeatured === "true",
                isNew: isNew === true || isNew === "true",
                categoryId,
            },
            include: { category: true }
        });
        return res.status(201).json({
            message: "Thêm mới sản phẩm thành công!",
            product: newProduct
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi thêm sản phẩm: " + err.message });
    }
});
// PUT /api/products/:id (Admin & Manager)
router.put("/:id", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER"]), async (req, res) => {
    try {
        const existing = await db_1.db.product.findUnique({ where: { id: req.params.id } });
        if (!existing) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm." });
        }
        const { name, description, price, originalPrice, stock, categoryId, thumbnail, images, isFeatured, isNew } = req.body;
        if (price !== undefined && price < 0) {
            return res.status(400).json({ error: "Giá bán không được âm." });
        }
        if (stock !== undefined && stock < 0) {
            return res.status(400).json({ error: "Số lượng tồn kho không được âm." });
        }
        const updateData = {};
        if (name)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        if (price !== undefined)
            updateData.price = parseFloat(price);
        if (originalPrice !== undefined)
            updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
        if (stock !== undefined)
            updateData.stock = parseInt(stock);
        if (categoryId)
            updateData.categoryId = categoryId;
        // Always keep thumbnail and primary image in images[0] strictly synchronized
        if (Array.isArray(images)) {
            const sanitizedImages = images.filter((img) => typeof img === "string" && img.trim().length > 0);
            let chosenThumb = (thumbnail && typeof thumbnail === "string" && thumbnail.trim().length > 0)
                ? thumbnail.trim()
                : (sanitizedImages[0] || existing.thumbnail);
            let finalImages = [...sanitizedImages];
            if (chosenThumb) {
                const foundIdx = finalImages.indexOf(chosenThumb);
                if (foundIdx > 0) {
                    finalImages.splice(foundIdx, 1);
                    finalImages.unshift(chosenThumb);
                }
                else if (foundIdx === -1) {
                    finalImages.unshift(chosenThumb);
                }
            }
            else if (finalImages.length > 0) {
                chosenThumb = finalImages[0];
            }
            updateData.images = finalImages;
            updateData.thumbnail = chosenThumb || "";
        }
        else if (thumbnail) {
            updateData.thumbnail = thumbnail;
            const currentImages = Array.isArray(existing.images) ? [...existing.images] : [];
            const foundIdx = currentImages.indexOf(thumbnail);
            if (foundIdx > 0) {
                currentImages.splice(foundIdx, 1);
                currentImages.unshift(thumbnail);
            }
            else if (foundIdx === -1) {
                currentImages.unshift(thumbnail);
            }
            updateData.images = currentImages;
        }
        if (isFeatured !== undefined)
            updateData.isFeatured = Boolean(isFeatured);
        if (isNew !== undefined)
            updateData.isNew = Boolean(isNew);
        const updatedProduct = await db_1.db.product.update({
            where: { id: req.params.id },
            data: updateData,
            include: { category: true }
        });
        return res.json({
            message: "Cập nhật sản phẩm thành công!",
            product: updatedProduct
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi cập nhật sản phẩm: " + err.message });
    }
});
// DELETE /api/products/:id (Admin & Manager)
router.delete("/:id", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN", "MANAGER"]), async (req, res) => {
    try {
        const existing = await db_1.db.product.findUnique({ where: { id: req.params.id } });
        if (!existing) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm." });
        }
        await db_1.db.product.delete({ where: { id: req.params.id } });
        return res.json({ message: "Xóa sản phẩm thành công!" });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi xóa sản phẩm: " + err.message });
    }
});
exports.default = router;

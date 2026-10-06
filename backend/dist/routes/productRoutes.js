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
function generateSlug(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
// POST /api/products (Chỉ ADMIN được quyền tạo mới sản phẩm theo quy chuẩn RBAC)
router.post("/", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN"]), async (req, res) => {
    try {
        const { name, description, price, originalPrice, stock, categoryId, thumbnail, images, isFeatured, isNew } = req.body;
        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ error: "Tên sản phẩm không được để trống." });
        }
        const trimmedName = name.trim();
        if (price === undefined || !categoryId) {
            return res.status(400).json({ error: "Vui lòng điền đầy đủ Tên, Giá bán và Danh mục." });
        }
        const parsedPrice = parseFloat(price);
        const parsedStock = stock !== undefined ? parseInt(stock) : 0;
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({ error: "Giá bán sản phẩm phải lớn hơn 0 VND." });
        }
        if (isNaN(parsedStock) || parsedStock < 0) {
            return res.status(400).json({ error: "Số lượng tồn kho không được âm." });
        }
        // 1. Ràng buộc: Kiểm tra Danh mục có tồn tại hay không
        const categoryExists = await db_1.db.category.findUnique({ where: { id: categoryId } });
        if (!categoryExists) {
            return res.status(400).json({ error: "Danh mục sản phẩm được chọn không tồn tại hoặc đã bị xóa." });
        }
        // 2. Ràng buộc: Kiểm tra trùng Tên sản phẩm (không phân biệt hoa/thường)
        const allProducts = await db_1.db.product.findMany();
        const duplicateName = allProducts.find((p) => p.name.trim().toLowerCase() === trimmedName.toLowerCase());
        if (duplicateName) {
            return res.status(400).json({
                error: `Tên sản phẩm "${trimmedName}" đã tồn tại trong hệ thống (Mã: ${duplicateName.id}). Vui lòng không thêm trùng tên!`
            });
        }
        // 3. Ràng buộc: Kiểm tra trùng Slug sản phẩm
        const slug = generateSlug(trimmedName);
        if (!slug) {
            return res.status(400).json({ error: "Không thể tạo đường dẫn (slug) hợp lệ từ tên sản phẩm." });
        }
        const duplicateSlug = allProducts.find((p) => p.slug.trim().toLowerCase() === slug.toLowerCase());
        if (duplicateSlug) {
            return res.status(400).json({
                error: `Đường dẫn (slug) "${slug}" đã bị trùng với sản phẩm "${duplicateSlug.name}". Vui lòng đổi tên khác!`
            });
        }
        const defaultThumb = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
        const user = req.user;
        const newProduct = await db_1.db.product.create({
            data: {
                name: trimmedName,
                slug,
                description: (description || "").trim(),
                price: parsedPrice,
                originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                stock: parsedStock,
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
        // Nếu có tồn kho ban đầu, ghi nhận StockMovement bất biến
        if (parsedStock > 0) {
            try {
                await db_1.db.stockMovement.create({
                    data: {
                        productId: newProduct.id,
                        quantity: parsedStock,
                        type: "ADJUSTMENT",
                        beforeStock: 0,
                        afterStock: parsedStock,
                        referenceId: newProduct.id,
                        createdById: user?.id || null,
                        note: "Khởi tạo tồn kho ban đầu khi tạo sản phẩm mới"
                    }
                });
            }
            catch (smErr) {
                console.warn("Could not log initial stock movement:", smErr);
            }
        }
        return res.status(201).json({
            message: "Thêm mới sản phẩm thành công!",
            product: newProduct
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi thêm sản phẩm: " + err.message });
    }
});
// PUT /api/products/:id (Chỉ ADMIN được cập nhật sản phẩm; Không cho phép sửa stock trực tiếp)
router.put("/:id", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN"]), async (req, res) => {
    try {
        const existing = await db_1.db.product.findUnique({ where: { id: req.params.id } });
        if (!existing) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm." });
        }
        const { name, description, price, originalPrice, stock, categoryId, thumbnail, images, isFeatured, isNew } = req.body;
        const updateData = {};
        const allProducts = await db_1.db.product.findMany();
        // 1. Ràng buộc: Kiểm tra trùng Tên sản phẩm & cập nhật Slug nếu đổi tên
        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({ error: "Tên sản phẩm không được để trống." });
            }
            const trimmedName = name.trim();
            const duplicateName = allProducts.find((p) => p.id !== req.params.id && p.name.trim().toLowerCase() === trimmedName.toLowerCase());
            if (duplicateName) {
                return res.status(400).json({
                    error: `Tên sản phẩm "${trimmedName}" đã bị trùng với sản phẩm khác (Mã: ${duplicateName.id}). Vui lòng chọn tên khác!`
                });
            }
            updateData.name = trimmedName;
            const newSlug = generateSlug(trimmedName);
            if (newSlug) {
                const duplicateSlug = allProducts.find((p) => p.id !== req.params.id && p.slug.trim().toLowerCase() === newSlug.toLowerCase());
                if (duplicateSlug) {
                    return res.status(400).json({
                        error: `Đường dẫn (slug) "${newSlug}" đã bị trùng với sản phẩm "${duplicateSlug.name}".`
                    });
                }
                updateData.slug = newSlug;
            }
        }
        // 2. Ràng buộc: Kiểm tra Danh mục mới có tồn tại hay không
        if (categoryId !== undefined) {
            if (!categoryId) {
                return res.status(400).json({ error: "Danh mục sản phẩm không được để trống." });
            }
            const categoryExists = await db_1.db.category.findUnique({ where: { id: categoryId } });
            if (!categoryExists) {
                return res.status(400).json({ error: "Danh mục sản phẩm được chọn không tồn tại hoặc đã bị xóa." });
            }
            updateData.categoryId = categoryId;
        }
        if (price !== undefined) {
            const parsedPrice = parseFloat(price);
            if (isNaN(parsedPrice) || parsedPrice <= 0) {
                return res.status(400).json({ error: "Giá bán sản phẩm phải lớn hơn 0 VND." });
            }
            updateData.price = parsedPrice;
        }
        if (originalPrice !== undefined) {
            updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
        }
        // Tồn kho không được chỉnh sửa trực tiếp qua API update sản phẩm (Phải qua StockTicket & Transaction kho)
        if (stock !== undefined) {
            // Ignored for direct updates to preserve stock integrity and StockMovement history
        }
        if (description !== undefined) {
            updateData.description = String(description).trim();
        }
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
// DELETE /api/products/:id (Chỉ ADMIN được xóa sản phẩm theo quy chuẩn RBAC)
router.delete("/:id", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN"]), async (req, res) => {
    try {
        const existing = await db_1.db.product.findUnique({ where: { id: req.params.id } });
        if (!existing) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm." });
        }
        // 1. Ràng buộc toàn vẹn dữ liệu: Không cho phép xóa sản phẩm đã có trong đơn hàng lịch sử
        const orderItemCount = await db_1.db.orderItem.count({ where: { productId: req.params.id } });
        if (orderItemCount > 0) {
            return res.status(400).json({
                error: `Không thể xóa sản phẩm "${existing.name}" vì sản phẩm này đã xuất hiện trong ${orderItemCount} đơn hàng lịch sử. Để bảo toàn hóa đơn và dữ liệu kế toán, bạn chỉ nên cập nhật tồn kho về 0!`
            });
        }
        // 2. Dọn dẹp giỏ hàng chứa sản phẩm này (nếu có) trước khi xóa
        try {
            await db_1.db.cartItem.deleteMany({ where: { productId: req.params.id } });
        }
        catch (e) {
            // Bỏ qua lỗi nếu bảng trống hoặc không có ràng buộc
        }
        await db_1.db.product.delete({ where: { id: req.params.id } });
        return res.json({ message: `Đã xóa sản phẩm "${existing.name}" thành công!` });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi xóa sản phẩm: " + err.message });
    }
});
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/categories
router.get("/", async (req, res) => {
    try {
        const categories = await db_1.db.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        const categoriesWithCount = categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            icon: cat.icon,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
            productCount: cat._count.products
        }));
        return res.json({
            total: categoriesWithCount.length,
            categories: categoriesWithCount
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi truy vấn danh mục: " + err.message });
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
// POST /api/categories (Admin)
router.post("/", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN"]), async (req, res) => {
    try {
        const { name, slug: customSlug, description, icon } = req.body;
        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ error: "Tên danh mục không được để trống." });
        }
        const trimmedName = name.trim();
        const slug = (customSlug && typeof customSlug === "string" && customSlug.trim())
            ? generateSlug(customSlug.trim())
            : generateSlug(trimmedName);
        if (!slug) {
            return res.status(400).json({ error: "Không thể tạo đường dẫn (slug) hợp lệ từ tên danh mục." });
        }
        // 1. Ràng buộc: Kiểm tra trùng Tên danh mục (không phân biệt hoa/thường)
        const allCategories = await db_1.db.category.findMany();
        const duplicateName = allCategories.find((c) => c.name.trim().toLowerCase() === trimmedName.toLowerCase());
        if (duplicateName) {
            return res.status(400).json({
                error: `Tên danh mục "${trimmedName}" đã tồn tại trong hệ thống (Mã: ${duplicateName.id}). Vui lòng chọn tên khác!`
            });
        }
        // 2. Ràng buộc: Kiểm tra trùng Slug danh mục
        const duplicateSlug = allCategories.find((c) => c.slug.trim().toLowerCase() === slug.toLowerCase());
        if (duplicateSlug) {
            return res.status(400).json({
                error: `Đường dẫn (slug) "${slug}" đã được sử dụng bởi danh mục "${duplicateSlug.name}". Vui lòng chọn slug khác!`
            });
        }
        const newCategory = await db_1.db.category.create({
            data: {
                name: trimmedName,
                slug,
                description: (description || "").trim(),
                icon: icon || "Tag",
            }
        });
        return res.status(201).json({
            message: "Tạo danh mục mới thành công!",
            category: newCategory
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi tạo danh mục: " + err.message });
    }
});
// PUT /api/categories/:id (Admin)
router.put("/:id", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN"]), async (req, res) => {
    try {
        const categoryId = req.params.id;
        const existing = await db_1.db.category.findUnique({ where: { id: categoryId } });
        if (!existing) {
            return res.status(404).json({ error: "Không tìm thấy danh mục." });
        }
        const { name, slug: customSlug, description, icon } = req.body;
        const updateData = {};
        const allCategories = await db_1.db.category.findMany();
        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({ error: "Tên danh mục không được để trống." });
            }
            const trimmedName = name.trim();
            // Ràng buộc: Kiểm tra trùng Tên danh mục với danh mục khác
            const duplicateName = allCategories.find((c) => c.id !== categoryId && c.name.trim().toLowerCase() === trimmedName.toLowerCase());
            if (duplicateName) {
                return res.status(400).json({
                    error: `Tên danh mục "${trimmedName}" đã trùng với danh mục khác (Mã: ${duplicateName.id}). Vui lòng chọn tên khác!`
                });
            }
            updateData.name = trimmedName;
            // Tính toán slug mới
            const targetSlug = (customSlug && typeof customSlug === "string" && customSlug.trim())
                ? generateSlug(customSlug.trim())
                : generateSlug(trimmedName);
            if (!targetSlug) {
                return res.status(400).json({ error: "Không thể tạo slug hợp lệ từ tên danh mục." });
            }
            // Ràng buộc: Kiểm tra trùng Slug với danh mục khác
            const duplicateSlug = allCategories.find((c) => c.id !== categoryId && c.slug.trim().toLowerCase() === targetSlug.toLowerCase());
            if (duplicateSlug) {
                return res.status(400).json({
                    error: `Đường dẫn (slug) "${targetSlug}" đã trùng với danh mục "${duplicateSlug.name}". Vui lòng chọn slug khác!`
                });
            }
            updateData.slug = targetSlug;
        }
        else if (customSlug !== undefined) {
            const targetSlug = generateSlug(String(customSlug).trim());
            if (!targetSlug) {
                return res.status(400).json({ error: "Đường dẫn slug không hợp lệ." });
            }
            const duplicateSlug = allCategories.find((c) => c.id !== categoryId && c.slug.trim().toLowerCase() === targetSlug.toLowerCase());
            if (duplicateSlug) {
                return res.status(400).json({
                    error: `Đường dẫn (slug) "${targetSlug}" đã được sử dụng bởi danh mục "${duplicateSlug.name}". Vui lòng chọn slug khác!`
                });
            }
            updateData.slug = targetSlug;
        }
        if (description !== undefined)
            updateData.description = String(description).trim();
        if (icon !== undefined)
            updateData.icon = icon;
        const updatedCategory = await db_1.db.category.update({
            where: { id: categoryId },
            data: updateData
        });
        return res.json({
            message: "Cập nhật danh mục thành công!",
            category: updatedCategory
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi cập nhật danh mục: " + err.message });
    }
});
// DELETE /api/categories/:id (Admin)
router.delete("/:id", auth_1.authenticateToken, (0, auth_1.authorize)(["ADMIN"]), async (req, res) => {
    try {
        const categoryId = req.params.id;
        const existing = await db_1.db.category.findUnique({ where: { id: categoryId } });
        if (!existing) {
            return res.status(404).json({ error: "Không tìm thấy danh mục." });
        }
        // Ràng buộc toàn vẹn dữ liệu: Không cho phép xóa nếu có sản phẩm trực thuộc
        const productCount = await db_1.db.product.count({ where: { categoryId } });
        if (productCount > 0) {
            return res.status(400).json({
                error: `Không thể xóa danh mục "${existing.name}" vì hiện đang có ${productCount} sản phẩm trực thuộc. Vui lòng chuyển hoặc xóa các sản phẩm này trước!`
            });
        }
        await db_1.db.category.delete({ where: { id: categoryId } });
        return res.json({
            message: `Đã xóa danh mục "${existing.name}" thành công!`
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Lỗi xóa danh mục: " + err.message });
    }
});
exports.default = router;

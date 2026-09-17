import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticateToken, authorize } from "../middleware/auth";

const router = Router();

// GET /api/categories
router.get("/", async (req: Request, res: Response) => {
  try {
    const categories = await db.category.findMany({
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
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi truy vấn danh mục: " + err.message });
  }
});

// POST /api/categories (Admin)
router.post("/", authenticateToken, authorize(["ADMIN"]), async (req: Request, res: Response) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Tên danh mục không được để trống." });
    }

    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newCategory = await db.category.create({
      data: {
        name,
        slug,
        description: description || "",
        icon: icon || "Tag",
      }
    });

    return res.status(201).json({
      message: "Tạo danh mục mới thành công!",
      category: newCategory
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi tạo danh mục: " + err.message });
  }
});

// PUT /api/categories/:id (Admin)
router.put("/:id", authenticateToken, authorize(["ADMIN"]), async (req: Request, res: Response) => {
  try {
    const existing = await db.category.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ error: "Không tìm thấy danh mục." });
    }

    const { name, description, icon } = req.body;
    const updateData: any = {};

    if (name) {
      updateData.name = name;
      updateData.slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;

    const updatedCategory = await db.category.update({
      where: { id: req.params.id },
      data: updateData
    });

    return res.json({
      message: "Cập nhật danh mục thành công!",
      category: updatedCategory
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi cập nhật danh mục: " + err.message });
  }
});

// DELETE /api/categories/:id (Admin)
router.delete("/:id", authenticateToken, authorize(["ADMIN"]), async (req: Request, res: Response) => {
  try {
    const existing = await db.category.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ error: "Không tìm thấy danh mục." });
    }

    // Check if any product belongs to this category
    const productCount = await db.product.count({ where: { categoryId: req.params.id } });
    if (productCount > 0) {
      return res.status(400).json({ error: "Không thể xóa danh mục đang có sản phẩm trực thuộc." });
    }

    await db.category.delete({ where: { id: req.params.id } });
    return res.json({ message: "Xóa danh mục thành công!" });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi xóa danh mục: " + err.message });
  }
});

export default router;

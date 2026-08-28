import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticateToken, authorize } from "../middleware/auth";
import { Category } from "../mockData";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// GET /api/categories
router.get("/", (req: Request, res: Response) => {
  const categoriesWithCount = db.categories.map(cat => {
    const productCount = db.products.filter(p => p.categoryId === cat.id).length;
    return {
      ...cat,
      productCount
    };
  });

  return res.json({
    total: categoriesWithCount.length,
    categories: categoriesWithCount
  });
});

// POST /api/categories (Admin)
router.post("/", authenticateToken, authorize(["ADMIN"]), (req: Request, res: Response) => {
  const { name, description, icon } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Tên danh mục không được để trống." });
  }

  let slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const newCategory: Category = {
    id: `cat_${uuidv4().substring(0, 8)}`,
    name,
    slug,
    description: description || "",
    icon: icon || "Tag",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.categories.push(newCategory);
  return res.status(201).json({
    message: "Tạo danh mục mới thành công!",
    category: newCategory
  });
});

// PUT /api/categories/:id (Admin)
router.put("/:id", authenticateToken, authorize(["ADMIN"]), (req: Request, res: Response) => {
  const cat = db.categories.find(c => c.id === req.params.id);
  if (!cat) {
    return res.status(404).json({ error: "Không tìm thấy danh mục." });
  }

  const { name, description, icon } = req.body;
  if (name) {
    cat.name = name;
    cat.slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  if (description !== undefined) cat.description = description;
  if (icon !== undefined) cat.icon = icon;
  cat.updatedAt = new Date().toISOString();

  return res.json({
    message: "Cập nhật danh mục thành công!",
    category: cat
  });
});

// DELETE /api/categories/:id (Admin)
router.delete("/:id", authenticateToken, authorize(["ADMIN"]), (req: Request, res: Response) => {
  const idx = db.categories.findIndex(c => c.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Không tìm thấy danh mục." });
  }

  // Check if any product belongs to this category
  const hasProducts = db.products.some(p => p.categoryId === req.params.id);
  if (hasProducts) {
    return res.status(400).json({ error: "Không thể xóa danh mục đang có sản phẩm trực thuộc." });
  }

  db.categories.splice(idx, 1);
  return res.json({ message: "Xóa danh mục thành công!" });
});

export default router;

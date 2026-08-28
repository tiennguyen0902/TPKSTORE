import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticateToken, authorize } from "../middleware/auth";
import { Product } from "../mockData";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// GET /api/products (Public with filters)
router.get("/", (req: Request, res: Response) => {
  const { category, search, minPrice, maxPrice, isFeatured, isNew, sortBy, limit, page } = req.query;

  const products = db.getAllProducts({
    categoryId: category as string,
    search: search as string,
    minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    isFeatured: isFeatured !== undefined ? isFeatured === "true" : undefined,
    isNew: isNew !== undefined ? isNew === "true" : undefined,
    sortBy: sortBy as string
  });

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 50;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

  return res.json({
    total: products.length,
    page: pageNum,
    limit: limitNum,
    products: paginatedProducts
  });
});

// GET /api/products/:idOrSlug
router.get("/:idOrSlug", (req: Request, res: Response) => {
  const product = db.getProductByIdOrSlug(req.params.idOrSlug);
  if (!product) {
    return res.status(404).json({ error: "Không tìm thấy sản phẩm." });
  }
  return res.json(product);
});

// POST /api/products (Admin & Staff)
router.post("/", authenticateToken, authorize(["ADMIN", "STAFF"]), (req: Request, res: Response) => {
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
    while (db.products.some(p => p.slug === slug)) {
      slug = `${baseSlug}-${count++}`;
    }

    const newProduct: Product = {
      id: `prd_${uuidv4().substring(0, 8)}`,
      name,
      slug,
      description: description || "",
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      stock: parseInt(stock),
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      images: Array.isArray(images) && images.length > 0 ? images : [thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"],
      rating: 5.0,
      reviewCount: 0,
      isFeatured: isFeatured === true || isFeatured === "true",
      isNew: isNew === true || isNew === "true",
      categoryId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.products.unshift(newProduct);

    return res.status(201).json({
      message: "Thêm mới sản phẩm thành công!",
      product: db.getProductWithCategory(newProduct)
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi thêm sản phẩm: " + err.message });
  }
});

// PUT /api/products/:id (Admin & Staff)
router.put("/:id", authenticateToken, authorize(["ADMIN", "STAFF"]), (req: Request, res: Response) => {
  const prod = db.products.find(p => p.id === req.params.id);
  if (!prod) {
    return res.status(404).json({ error: "Không tìm thấy sản phẩm." });
  }

  const { name, description, price, originalPrice, stock, categoryId, thumbnail, images, isFeatured, isNew } = req.body;

  if (price !== undefined && price < 0) {
    return res.status(400).json({ error: "Giá bán không được âm." });
  }
  if (stock !== undefined && stock < 0) {
    return res.status(400).json({ error: "Số lượng tồn kho không được âm." });
  }

  if (name) prod.name = name;
  if (description !== undefined) prod.description = description;
  if (price !== undefined) prod.price = parseFloat(price);
  if (originalPrice !== undefined) prod.originalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
  if (stock !== undefined) prod.stock = parseInt(stock);
  if (categoryId) prod.categoryId = categoryId;
  if (thumbnail) prod.thumbnail = thumbnail;
  if (images) prod.images = images;
  if (isFeatured !== undefined) prod.isFeatured = Boolean(isFeatured);
  if (isNew !== undefined) prod.isNew = Boolean(isNew);
  prod.updatedAt = new Date().toISOString();

  return res.json({
    message: "Cập nhật sản phẩm thành công!",
    product: db.getProductWithCategory(prod)
  });
});

// DELETE /api/products/:id (Admin & Staff)
router.delete("/:id", authenticateToken, authorize(["ADMIN", "STAFF"]), (req: Request, res: Response) => {
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Không tìm thấy sản phẩm." });
  }

  db.products.splice(idx, 1);
  return res.json({ message: "Xóa sản phẩm thành công!" });
});

export default router;

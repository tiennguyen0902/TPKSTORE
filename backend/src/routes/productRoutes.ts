import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticateToken, authorize } from "../middleware/auth";
import { Prisma } from "@prisma/client";

const router = Router();

// GET /api/products (Public with filters)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search, minPrice, maxPrice, isFeatured, isNew, sortBy, limit, page } = req.query;

    const where: Prisma.ProductWhereInput = {};

    if (category && category !== "all") {
      // Support both id and slug
      where.OR = [
        { categoryId: category as string },
        { category: { slug: category as string } }
      ];
    }
    if (search) {
      const q = (search as string).toLowerCase();
      where.AND = [
        {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } }
          ]
        }
      ];
    }
    if (minPrice !== undefined) {
      where.price = { ...((where.price as any) || {}), gte: parseFloat(minPrice as string) };
    }
    if (maxPrice !== undefined) {
      where.price = { ...((where.price as any) || {}), lte: parseFloat(maxPrice as string) };
    }
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured === "true";
    }
    if (isNew !== undefined) {
      where.isNew = isNew === "true";
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy === "price_asc") {
      orderBy = { price: "asc" };
    } else if (sortBy === "price_desc") {
      orderBy = { price: "desc" };
    } else if (sortBy === "rating_desc") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "newest") {
      orderBy = { createdAt: "desc" };
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { category: true },
        orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
        skip,
        take: limitNum,
      }),
      db.product.count({ where })
    ]);

    return res.json({
      total,
      page: pageNum,
      limit: limitNum,
      products
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi truy vấn sản phẩm: " + err.message });
  }
});

// GET /api/products/:idOrSlug
router.get("/:idOrSlug", async (req: Request, res: Response) => {
  try {
    const product = await db.product.findFirst({
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
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi truy vấn: " + err.message });
  }
});

// POST /api/products (Admin & Staff)
router.post("/", authenticateToken, authorize(["ADMIN", "STAFF"]), async (req: Request, res: Response) => {
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
    while (await db.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const defaultThumb = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
    const newProduct = await db.product.create({
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
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi thêm sản phẩm: " + err.message });
  }
});

// PUT /api/products/:id (Admin & Staff)
router.put("/:id", authenticateToken, authorize(["ADMIN", "STAFF"]), async (req: Request, res: Response) => {
  try {
    const existing = await db.product.findUnique({ where: { id: req.params.id } });
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

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (categoryId) updateData.categoryId = categoryId;
    if (thumbnail) updateData.thumbnail = thumbnail;
    if (images) updateData.images = images;
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (isNew !== undefined) updateData.isNew = Boolean(isNew);

    const updatedProduct = await db.product.update({
      where: { id: req.params.id },
      data: updateData,
      include: { category: true }
    });

    return res.json({
      message: "Cập nhật sản phẩm thành công!",
      product: updatedProduct
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi cập nhật sản phẩm: " + err.message });
  }
});

// DELETE /api/products/:id (Admin & Staff)
router.delete("/:id", authenticateToken, authorize(["ADMIN", "STAFF"]), async (req: Request, res: Response) => {
  try {
    const existing = await db.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm." });
    }

    await db.product.delete({ where: { id: req.params.id } });
    return res.json({ message: "Xóa sản phẩm thành công!" });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi xóa sản phẩm: " + err.message });
  }
});

export default router;

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function sync() {
  console.log('🔄 Đang kết nối tới PostgreSQL để trích xuất toàn bộ sản phẩm...');
  const dbProducts = await prisma.product.findMany();
  console.log(`📦 Tìm thấy ${dbProducts.length} sản phẩm trong PostgreSQL.`);

  // Sort by numeric id: prd_1, prd_2, ..., prd_100
  dbProducts.sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  const formattedProducts = dbProducts.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice ?? Math.round(p.price * 1.15),
    stock: p.stock,
    thumbnail: p.thumbnail,
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.thumbnail],
    rating: p.rating,
    reviewCount: p.reviewCount,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    categoryId: p.categoryId,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : String(p.updatedAt)
  }));

  const tsContent = `import { Product } from "./mockData";\n\nexport const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(formattedProducts, null, 2)};\n`;

  const targetPath = path.resolve(__dirname, '../src/mockProducts.ts');
  fs.writeFileSync(targetPath, tsContent, 'utf8');
  console.log(`✅ Đã đồng bộ thành công vào: ${targetPath}`);
  console.log(`📊 Kích thước tệp: ${(fs.statSync(targetPath).size / 1024 / 1024).toFixed(2)} MB`);
}

sync()
  .catch(err => {
    console.error('❌ Lỗi khi đồng bộ dữ liệu từ DB:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

-- CreateEnum
CREATE TYPE "StockTicketType" AS ENUM ('IMPORT', 'EXPORT');

-- CreateEnum
CREATE TYPE "StockTicketStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('IMPORT', 'EXPORT', 'SALE', 'SALE_CANCEL', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_tickets" (
    "id" TEXT NOT NULL,
    "type" "StockTicketType" NOT NULL,
    "status" "StockTicketStatus" NOT NULL DEFAULT 'PENDING',
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "note" TEXT,
    "requestedByUserId" TEXT NOT NULL,
    "approvedByUserId" TEXT,
    "rejectReason" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "beforeStock" INTEGER NOT NULL,
    "afterStock" INTEGER NOT NULL,
    "referenceId" TEXT,
    "createdById" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "orders" ADD COLUMN "customerId" TEXT;
ALTER TABLE "orders" ADD COLUMN "createdByStaffId" TEXT;

-- AlterTable
ALTER TABLE "ai_interactions" ADD COLUMN "provider" TEXT NOT NULL DEFAULT 'api';
ALTER TABLE "ai_interactions" ADD COLUMN "model" TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE "ai_interactions" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'CUSTOMER';
ALTER TABLE "ai_interactions" ADD COLUMN "latency" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ai_interactions" ADD COLUMN "success" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "ai_interactions" ADD COLUMN "actionType" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "customers_userId_key" ON "customers"("userId");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_createdByStaffId_fkey" FOREIGN KEY ("createdByStaffId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_tickets" ADD CONSTRAINT "stock_tickets_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_tickets" ADD CONSTRAINT "stock_tickets_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_tickets" ADD CONSTRAINT "stock_tickets_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

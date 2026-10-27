-- AlterEnum
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'MANAGER';

-- AlterTable users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "canChatAi" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable system_settings
ALTER TABLE "system_settings" ADD COLUMN IF NOT EXISTS "localAiModel" TEXT NOT NULL DEFAULT 'llava';
ALTER TABLE "system_settings" ADD COLUMN IF NOT EXISTS "localAiUrl" TEXT NOT NULL DEFAULT 'http://localhost:11434';

-- DropForeignKey
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'orders_userId_fkey' AND table_name = 'orders'
  ) THEN
    ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";
  END IF;
END $$;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

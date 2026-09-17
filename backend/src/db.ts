import { PrismaClient } from "@prisma/client";

// Prisma Client Singleton — tránh tạo nhiều connection pool khi hot-reload
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Alias for backward compatibility — các route files import { db } from "../db"
export const db = prisma;

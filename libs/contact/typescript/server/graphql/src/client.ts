/* eslint-disable no-var */
import { ConfigManager } from "@open-system/core-shared-utilities";
import { PrismaClient } from "@prisma/client/contact";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.prisma ||
  new PrismaClient({
    log: ["error", "info", "query", "warn"],
  });

if (ConfigManager.instance.isDevelopment) global.prisma = prisma;

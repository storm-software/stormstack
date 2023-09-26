/* eslint-disable no-var */
import { PrismaClient } from "@prisma/client/contact";
import { ConfigManager } from "@stormstack/core-shared-utilities";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.prisma ||
  new PrismaClient({
    log: ["error", "info", "query", "warn"]
  });

if (ConfigManager.instance.isDevelopment) global.prisma = prisma;

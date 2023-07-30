import { Logger } from "@open-system/core-shared-utilities";
import pino from "pino";

export const pinoLogger: Logger = pino({
  level: process.env.PINO_LOG_LEVEL || "info",
  formatters: {
    level: label => {
      return { level: label.toUpperCase() };
    },
  },
});

import { existsSync } from "node:fs";

export const exists = (filePath: string): boolean => {
  return existsSync(filePath);
};

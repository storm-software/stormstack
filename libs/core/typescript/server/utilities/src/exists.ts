import { existsSync } from "fs";

export const exists = (filePath: string): boolean => {
  return existsSync(filePath);
};

import { createHash } from "node:crypto";

export const createSHA256Hash = (value: string): string => {
  return createHash("sha256").update(value, "utf8").digest("hex");
};

export const createMD5Hash = (value: string): string => {
  return createHash("md5").update(value, "utf8").digest("hex");
};

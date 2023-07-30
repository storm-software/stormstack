import { createHash } from "node:crypto";

export const hashSessionId = (sessionId: string): string => {
  return createHash("sha256").update(sessionId).digest("hex");
};

import "server-only";

import { cookies } from "next/headers";
import { UserLikeHistoryConstants } from "./constants";

export function useIsLiked(pageId: string): boolean {
  return !!JSON.parse(
    cookies()?.get?.(UserLikeHistoryConstants.COOKIE_NAME)?.value ?? ""
  )?.[pageId];
}

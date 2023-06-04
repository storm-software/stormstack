import { getUniqueId, parseBoolean } from "@open-system/core-utilities";
import { cookies } from "next/headers";
import "server-only";

export type UseUserCookieReturn = {
  userId?: string;
  hasAgreedToPrivacyPolicy: boolean;
};

export const useUserCookie = () => {
  const cookieStore = cookies();

  let userId = cookieStore.get("user-id")?.value;
  const hasAgreedToPrivacyPolicy = parseBoolean(
    cookieStore.get("agreed-to-privacy-policy")?.value
  );

  return {
    userId,
    hasAgreedToPrivacyPolicy,
  };
};

import { parseBoolean } from "@open-system/core-shared-utilities";
import { cookies } from "next/headers";
import "server-only";

export type UseUserCookieReturn = {
  userId?: string;
  hasAgreedToPrivacyPolicy: boolean;
};

export const getUserCookie = () => {
  const cookieStore = cookies();

  const userId = cookieStore.get("user-id")?.value;
  const hasAgreedToPrivacyPolicy = parseBoolean(
    cookieStore.get("agreed-to-privacy-policy")?.value
  );

  return {
    userId,
    hasAgreedToPrivacyPolicy,
  };
};

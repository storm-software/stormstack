import { BaseComponentProps } from "@open-system/design-system-components";
import {
  UserData,
  UserDataConstants,
} from "@open-system/shared-ui-data-access";
import { cookies } from "next/headers";
import CookiePolicyBannerClient from "./cookie-policy-banner.client";

export default function CookiePolicyBanner(props: BaseComponentProps) {
  const cookie = cookies()?.get?.(UserDataConstants.COOKIE_NAME)?.value;

  let userData: UserData | null = null;
  if (cookie) {
    userData = JSON.parse(cookie);
  }

  return (
    <>{!userData?.hasAgreedToCookiePolicy && <CookiePolicyBannerClient />}</>
  );
}

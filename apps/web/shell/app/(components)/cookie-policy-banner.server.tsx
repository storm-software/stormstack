import { BaseComponentProps } from "@open-system/design-system-components";
import {
  UserDataConstants,
  UserState,
} from "@open-system/shared-ui-data-access";
import { cookies } from "next/headers";

export default function CookiePolicyBanner(props: BaseComponentProps) {
  const cookie = cookies()?.get?.(UserDataConstants.COOKIE_NAME)?.value;

  let userData: UserState | null = null;
  if (cookie) {
    userData = JSON.parse(cookie);
  }

  return (
    <>
      {/*!userData?.hasAgreedToPrivacyPolicy && <CookiePolicyBannerClient />*/}
    </>
  );
}

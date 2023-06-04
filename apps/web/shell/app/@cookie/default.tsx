import { CookiePolicyBanner } from "@open-system/user-management-components";
import { useUserCookie } from "@open-system/user-management-data-access/server";
import { agreeToPrivacyPolicy } from "./actions";

// export const revalidate = 60;

export default async function Default() {
  const { userId, hasAgreedToPrivacyPolicy } = useUserCookie();

  if (!userId) {
    console.log("No user id in cookie");
  }

  if (hasAgreedToPrivacyPolicy) {
    return null;
  }

  return (
    <CookiePolicyBanner onAgreeToPrivacyPolicy={agreeToPrivacyPolicy} />
  );
}

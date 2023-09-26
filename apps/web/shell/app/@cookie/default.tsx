import { CookiePolicyBanner } from "@stormstack/user-management-client-components";
import { getUserCookie } from "@stormstack/user-management-server-data-access";
import { agreeToPrivacyPolicy } from "./actions";

// export const revalidate = 60;

export default async function Default() {
  const { userId, hasAgreedToPrivacyPolicy } = getUserCookie();

  if (!userId) {
    console.log("No user id in cookie");
  }

  if (hasAgreedToPrivacyPolicy) {
    return null;
  }

  return <CookiePolicyBanner onAgreeToPrivacyPolicy={agreeToPrivacyPolicy} />;
}

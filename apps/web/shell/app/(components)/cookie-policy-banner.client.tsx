"use client";

import { CookiePolicyBanner as CookiePolicyBannerInner } from "@open-system/shared-ui-feature-layout/cookie-policy-banner";
import PersistGate from "./persist-gate";

export default function CookiePolicyBanner() {
  return (
    <PersistGate>
      <CookiePolicyBannerInner />
    </PersistGate>
  );
}

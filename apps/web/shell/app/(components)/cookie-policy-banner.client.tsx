"use client";

import { CookiePolicyBanner as CookiePolicyBannerInner } from "@open-system/shared-ui-feature-layout/cookie-policy-banner";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "../../store/store";

export default function CookiePolicyBannerClient() {
  return (
    <PersistGate
      loading={<h1 className="text-primary">Loading...</h1>}
      persistor={persistor}>
      <CookiePolicyBannerInner />
    </PersistGate>
  );
}

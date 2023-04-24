"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import { Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { getCurrentEnvironment } from "../relay/environment";

export default function RootProvider({
  children,
  ...props
}: BaseComponentProps) {
  const environment = getCurrentEnvironment();
  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">{children}</Suspense>
    </RelayEnvironmentProvider>
  );
}

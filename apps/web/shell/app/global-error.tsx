"use client";

import { ErrorBoundaryProps, GlobalErrorBoundary } from "@open-system/core-feature-notifications";

export default function GlobalError(props: ErrorBoundaryProps) {
  return <GlobalErrorBoundary {...props} />;
}

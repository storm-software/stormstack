"use client";

import { ErrorBoundaryProps } from "@open-system/shared-ui-components";
import { GlobalErrorBoundary } from "@open-system/shared-ui-feature-layout/global-error-boundary";

export default function GlobalError(props: ErrorBoundaryProps) {
  return <GlobalErrorBoundary {...props} />;
}

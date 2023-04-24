"use client";

import { ErrorBoundaryProps } from "@open-system/shared-ui-components";
import { ErrorBoundary } from "@open-system/shared-ui-feature-layout/error-boundary";

export default function Error(props: ErrorBoundaryProps) {
  return <ErrorBoundary {...props} />;
}

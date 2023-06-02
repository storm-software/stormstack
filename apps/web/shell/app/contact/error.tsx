"use client";

import { ErrorBoundaryProps, ErrorBoundary } from "@open-system/core-feature-notifications";

export default function Error(props: ErrorBoundaryProps) {
  return <ErrorBoundary {...props} />;
}

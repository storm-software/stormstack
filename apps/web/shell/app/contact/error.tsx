"use client";

import {
  ErrorReport,
  ErrorReportProps,
} from "@open-system/core-feature-notifications";

export default function Error(props: ErrorReportProps) {
  return <ErrorReport {...props} />;
}

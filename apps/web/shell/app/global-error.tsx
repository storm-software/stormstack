"use client";

import {
  ErrorReportProps,
  GlobalErrorReport,
} from "@open-system/core-feature-notifications";

export default function GlobalError(props: ErrorReportProps) {
  return <GlobalErrorReport {...props} />;
}

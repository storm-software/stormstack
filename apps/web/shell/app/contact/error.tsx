"use client";

import {
  ErrorReport,
  ErrorReportProps,
} from "@open-system/core-client-notifications";

export default function Error(props: ErrorReportProps) {
  return <ErrorReport {...props} />;
}

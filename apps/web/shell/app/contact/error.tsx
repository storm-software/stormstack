"use client";

import {
  ErrorReport,
  ErrorReportProps
} from "@stormstack/core-client-notifications";

export default function Error(props: ErrorReportProps) {
  return <ErrorReport {...props} />;
}

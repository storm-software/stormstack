"use client";

import {
  ErrorReportProps,
  GlobalErrorReport
} from "@stormstack/core-client-notifications";

export default function GlobalError(props: ErrorReportProps) {
  return (
    <div className="bg-bg-primary px-20">
      <GlobalErrorReport {...props} />
    </div>
  );
}

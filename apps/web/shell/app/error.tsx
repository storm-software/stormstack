"use client";

import {
  ErrorReport,
  ErrorReportProps
} from "@stormstack/core-client-notifications";

export default function Error(props: ErrorReportProps) {
  return (
    <div className="bg-bg-primary px-20 py-32">
      <ErrorReport {...props} />
    </div>
  );
}

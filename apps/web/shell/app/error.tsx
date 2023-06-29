"use client";

import {
  ErrorReport,
  ErrorReportProps,
} from "@open-system/core-feature-notifications";

export default function Error(props: ErrorReportProps) {
  return (
    <div className="px-20 py-32">
      <ErrorReport {...props} />
    </div>
  );
}

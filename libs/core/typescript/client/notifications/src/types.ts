import { ErrorInfo } from "react";

export interface ErrorReportProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  reset: () => void;
}

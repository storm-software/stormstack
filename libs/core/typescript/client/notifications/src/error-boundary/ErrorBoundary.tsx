"use client";

import { ConsoleLogger } from "@open-system/core-shared-utilities";
import { BaseComponentProps } from "@open-system/design-system-components";
import { Component, ErrorInfo } from "react";
import { ErrorReport } from "../error-report/ErrorReport";

export interface ErrorBoundaryProps extends BaseComponentProps {
  onReset?: () => void;
  onError?: (error: Error, errorInfo?: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false, error: undefined, errorInfo: undefined };
  }

  public static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;

    onError && onError(error, errorInfo);

    ConsoleLogger.error({ error, errorInfo });
    if (errorInfo) {
      this.setState({ errorInfo });
    }
  }

  public render() {
    const { hasError, error, errorInfo } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <ErrorReport error={error} errorInfo={errorInfo} reset={this.reset} />
      );
    }

    return children;
  }

  private reset = () => {
    const { onReset } = this.props;

    onReset && onReset();
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };
}

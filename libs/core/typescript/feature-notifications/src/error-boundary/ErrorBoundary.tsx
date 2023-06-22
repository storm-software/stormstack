"use client";

import { ConsoleLogger } from "@open-system/core-utilities";
import { Component } from "react";

export interface ErrorBoundaryProps extends BaseComponentProps {
  onRetry?: () => void;
  onError?: (error: Error) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState>  {
  public constructor(props: ErrorBoundaryProps) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false, error: null }
  }

  public static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true, error }
  }

  public  componentDidCatch(error: Error, errorInfo: Error) {
      const { onError } = this.props;

      onError && onError(error);

    ConsoleLogger.error({ error, errorInfo })
  }

  public render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <ErrorReport error={error} retry={this.retry} />
      )
    }

    return children
  }

  private retry = () => {
    const { onRetry } = this.props;

    onRetry && onRetry();
    this.setState({ hasError: false, error: null })
  }
}

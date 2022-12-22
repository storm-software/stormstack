"use client";

import { ConsoleLogger } from "@open-system/core-typescript-utilities";
import {
  Button,
  ButtonVariants,
  MessageBar,
  MessageBarVariants,
} from "@open-system/design-system-components";
import { ErrorBoundaryProps } from "@open-system/shared-ui-components";
import { useEffect } from "react";

export default function Error({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    error?.message && ConsoleLogger.error(error.message);
  }, [error]);

  return (
    <div className="flex w-full flex-col gap-10 p-12">
      <MessageBar variant={MessageBarVariants.ERROR} message={error?.message} />
      <div className="flex flex-row-reverse">
        <Button
          variant={ButtonVariants.PRIMARY}
          onClick={reset}
          hoverText="Reset">
          Try Again
        </Button>
      </div>
    </div>
  );
}

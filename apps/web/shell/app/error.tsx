"use client";

import { ConsoleLogger } from "@open-system/core-typescript-utilities";
import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonVariants,
  MessageBar,
  MessageBarVariants,
  Modal,
  ModalVariants,
} from "@open-system/design-system-components";
import { ErrorBoundaryProps } from "@open-system/shared-ui-components";
import { useEffect } from "react";
import AlertIcon from "../../../../assets/alert-triangle.svg";

export default function Error({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    error?.message && ConsoleLogger.error(error.message);
  }, [error]);

  return (
    <div className="relative h-full min-h-screen w-full">
      <AlertIcon
        className="absolute top-0 left-20"
        height={750}
        width={750}
        fill="#334155"
      />
      <div className="flex min-h-screen w-full flex-row items-center justify-center gap-10">
        <Modal title="Something went wrong!" variant={ModalVariants.ERROR}>
          <div className="flex flex-col items-center gap-6">
            <MessageBar
              className="w-full min-w-fit flex-1"
              variant={MessageBarVariants.ERROR}
              message={error?.message}
            />
            <div className="flex flex-1">
              <p className="text-lg font-body-1 text-primary">
                User experience is always my top priority, but unfortunately
                errors can happen from time to time. I would greatly appreciate
                it if you could submit an error report detailing your previous
                actions below. With your help, I&apos;ll ensure this
                doesn&apos;t happen in the future.
              </p>
            </div>
            <div className="flex w-full flex-row-reverse gap-6">
              <Button
                className="w-44"
                variant={ButtonVariants.PRIMARY}
                rounding={ButtonCornerRoundingTypes.NONE}
                transitionDirection={ButtonTransitionDirections.NONE}
                onClick={reset}>
                Try Again
              </Button>
              <Button
                className="w-44"
                variant={ButtonVariants.PRIMARY}
                rounding={ButtonCornerRoundingTypes.NONE}
                inverse={true}
                transitionDirection={ButtonTransitionDirections.NONE}
                onClick={reset}>
                Report
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

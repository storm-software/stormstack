import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonVariants,
  MessageBar,
  MessageBarVariants,
  Modal,
  ModalVariants
} from "@open-system/design-system-components";
import AlertIcon from "../../assets/alert-triangle.svg";
import { StackTrace } from "../stack-trace";
import { ErrorReportProps } from "../types";

export function ErrorReport({ error, errorInfo, reset }: ErrorReportProps) {
  const message = error?.message ?? "An error occured during processing.";

  return (
    <div className="relative h-full min-h-screen w-full">
      <AlertIcon
        className="absolute left-20 top-0"
        height={750}
        width={750}
        fill="#334155"
      />
      <div className="flex h-full w-full flex-row items-center justify-center gap-10">
        <Modal title="Something went wrong!" variant={ModalVariants.ERROR}>
          <div className="flex flex-col items-center gap-6">
            <MessageBar
              className="w-full min-w-fit flex-1"
              variant={MessageBarVariants.ERROR}
              message={message}
              details={
                <StackTrace
                  stack={errorInfo?.componentStack}
                  message={message}
                />
              }
            />
            <div className="flex flex-1">
              <p className="text-primary font-body-1 text-lg">
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
                Retry
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

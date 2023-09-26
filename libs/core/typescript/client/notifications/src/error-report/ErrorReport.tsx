import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonVariants,
  MessageBar,
  MessageBarVariants,
  Modal,
  ModalVariants
} from "@stormstack/design-system-components";
import AlertIcon from "../../assets/alert-triangle.svg";
import { StackTrace } from "../stack-trace";
import { ErrorReportProps } from "../types";

export function ErrorReport({ error, errorInfo, reset }: ErrorReportProps) {
  const message = error?.message ?? "An error occured during processing.";

  return (
    <div className="h-full min-h-screen w-full relative">
      <AlertIcon
        className="left-20 top-0 absolute"
        height={750}
        width={750}
        fill="#334155"
      />
      <div className="h-full w-full gap-10 flex flex-row items-center justify-center">
        <Modal title="Something went wrong!" variant={ModalVariants.ERROR}>
          <div className="gap-6 flex flex-col items-center">
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
            <div className="flex-1 flex">
              <p className="text-primary text-lg font-body-1">
                User experience is always my top priority, but unfortunately
                errors can happen from time to time. I would greatly appreciate
                it if you could submit an error report detailing your previous
                actions below. With your help, I&apos;ll ensure this
                doesn&apos;t happen in the future.
              </p>
            </div>
            <div className="w-full gap-6 flex flex-row-reverse">
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

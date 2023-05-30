"use client";

import {
  Button,
  ButtonProps,
  ButtonTransitionDirections,
  ButtonTypes,
} from "@open-system/design-system-components";
import clsx from "clsx";
import { useCallback, useState } from "react";
import { useFormState } from "react-hook-form";
import { useIsValid } from "../hooks/useIsValid";
import { SubmitButtonIcon } from "./SubmitButtonIcon";

export type SubmitButtonProps = Omit<ButtonProps, "type">;

export function SubmitButton({
  children,
  className,
  disabled = false,
  inverse,
  ...props
}: SubmitButtonProps) {
  const { isSubmitting, isValidating, isSubmitSuccessful, isValid as isRequiredMissing } = useFormState();
  const isValid = useIsValid(true);

  const [isStopped, setIsStopped] = useState(true);
  const handleHoverStart = useCallback(() => {
    if (isStopped) {
      setIsStopped(false);
    }
  }, [isStopped]);
  const handleHoverEnd = useCallback(() => {
    if (!isStopped) {
      setIsStopped(true);
    }
  }, [isStopped]);

  return (
    <Button
      type={ButtonTypes.SUBMIT}
      transitionDirection={ButtonTransitionDirections.NONE}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      className={clsx({ "cursor-wait": isSubmitting }, className)}
      hoverText="Submit"
      inverse={inverse}
      disabled={
        disabled ||
        isSubmitting ||
        isSubmitSuccessful ||
        isRequiredMissing ||
        !isValid ||
        isValidating
      }
      {...props}>
      <div className="flex flex-row items-center gap-1">
        <div className="flex flex-1">{children}</div>
        <SubmitButtonIcon
          inverse={!!inverse}
          isStopped={isStopped}
          isSubmitting={isSubmitting}
          isValidating={isValidating}
          isSubmitSuccessful={isSubmitSuccessful}
          isValid={!isValid && !isRequiredMissing}
        />
      </div>
    </Button>
  );
}

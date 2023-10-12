"use client";

import {
  Button,
  ButtonProps,
  ButtonTransitionDirections,
  ButtonTypes
} from "@stormstack/design-system-components";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useFormState } from "react-hook-form";
import { useIsValid } from "../hooks";
import { SubmitButtonIcon } from "./SubmitButtonIcon";

export type SubmitButtonProps = Omit<ButtonProps, "type">;

export function SubmitButton({
  children,
  className,
  disabled = false,
  inverse,
  variant,
  ...props
}: SubmitButtonProps) {
  const { isSubmitting, isValidating, isSubmitSuccessful, isValid } =
    useFormState();
  const isError = !useIsValid(true);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  useEffect(() => {
    const nextIsDisabled =
      disabled ||
      isSubmitting ||
      isSubmitSuccessful ||
      !isValid ||
      isValidating;
    if (nextIsDisabled && !isDisabled) {
      setIsDisabled(true);
    } else if (!nextIsDisabled && isDisabled) {
      setIsDisabled(false);
    }
  }, [
    disabled,
    isDisabled,
    isSubmitSuccessful,
    isSubmitting,
    isValid,
    isValidating
  ]);

  return (
    <Button
      type={ButtonTypes.SUBMIT}
      className={clsx({ "cursor-wait": isSubmitting }, className)}
      inverse={inverse}
      variant={variant}
      disabled={isDisabled}
      {...props}
      transitionDirection={ButtonTransitionDirections.NONE}>
      <div className="gap-1 flex flex-row items-center">
        <div className="flex-1 flex">{children}</div>
        <SubmitButtonIcon
          inverse={!!inverse}
          isDisabled={isDisabled}
          isSubmitting={isSubmitting}
          isValidating={isValidating}
          isSubmitSuccessful={isSubmitSuccessful}
          isError={isError}
          variant={variant}
        />
      </div>
    </Button>
  );
}

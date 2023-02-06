"use client";

import {
  Button,
  ButtonProps,
  ButtonTypes,
} from "@open-system/design-system-components";
import { useFormState } from "react-hook-form";

export type SubmitButtonProps = Omit<ButtonProps, "type">;

export function SubmitButton({
  children,
  disabled = false,
  ...props
}: SubmitButtonProps) {
  const { isSubmitting, isValid } = useFormState();

  return (
    <Button
      type={ButtonTypes.SUBMIT}
      hoverText="Submit"
      disabled={disabled || isSubmitting || !isValid}
      {...props}>
      {children}
    </Button>
  );
}

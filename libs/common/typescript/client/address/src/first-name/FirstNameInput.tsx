"use client";

import { InputAutoCompleteTypes } from "@stormstack/design-system-components";
import { Input, InputProps } from "@stormstack/core-client-form";

export type FirstNameInputProps = Partial<Omit<InputProps, "min" | "max">>;

export function FirstNameInput(props: FirstNameInputProps) {
  return (
    <Input
      name="firstName"
      label="First name"
      autoComplete={InputAutoCompleteTypes.FIRST_NAME}
      maxLength={50}
      required={false}
      {...props}
    />
  );
}

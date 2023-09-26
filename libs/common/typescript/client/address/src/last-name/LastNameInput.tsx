"use client";

import { Input, InputProps } from "@stormstack/core-client-form";
import { InputAutoCompleteTypes } from "@stormstack/design-system-components";

export type LastNameInputProps = Partial<Omit<InputProps, "min" | "max">>;

export function LastNameInput(props: LastNameInputProps) {
  return (
    <Input
      name="lastName"
      label="Last name"
      autoComplete={InputAutoCompleteTypes.LAST_NAME}
      maxLength={50}
      required={false}
      {...props}
    />
  );
}

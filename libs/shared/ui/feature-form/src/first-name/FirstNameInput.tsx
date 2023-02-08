"use client";

import { InputAutoCompleteTypes } from "@open-system/design-system-components";
import { Input, InputProps } from "../input";

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

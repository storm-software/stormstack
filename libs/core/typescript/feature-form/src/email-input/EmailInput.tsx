"use client";

import {
  InputAutoCompleteTypes,
  InputTypes,
} from "@open-system/design-system-components";
import { Input, InputProps } from "../input";

export type EmailInputProps = Partial<Omit<InputProps, "min" | "max">>;

export function EmailInput(props: EmailInputProps) {
  return (
    <Input
      name="email"
      label="Email address"
      type={InputTypes.EMAIL}
      autoComplete={InputAutoCompleteTypes.EMAIL}
      pattern={{
        value: new RegExp(
          /^(?:(?:[\w.\-_]+@[\w\d]+(?:\.[\w]{2,6})+)[,;]?\s?)+$/
        ),
        message: "Invalid email address format provided.",
      }}
      maxLength={80}
      {...props}
    />
  );
}

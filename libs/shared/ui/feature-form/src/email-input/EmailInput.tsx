"use client";

import { InputTypes } from "@open-system/design-system-components";
import { Input, InputProps } from "../input";

export type EmailInputProps = Omit<InputProps, "min" | "max">;

export function EmailInput(props: EmailInputProps) {
  return (
    <Input
      {...props}
      type={InputTypes.EMAIL}
      pattern={{
        value: new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        message: "Invalid email address format provided.",
      }}
    />
  );
}

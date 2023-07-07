"use client";

import {
  InputAutoCompleteTypes,
  InputTypes,
} from "@open-system/design-system-components";
import { Input, InputProps } from "../input";

export type PhoneNumberInputProps = Partial<Omit<InputProps, "min" | "max">>;

export function PhoneNumberInput(props: PhoneNumberInputProps) {
  return (
    <Input
      name="phoneNumber"
      label="Phone number"
      type={InputTypes.TEL}
      autoComplete={InputAutoCompleteTypes.TEL}
      pattern={{
        value: new RegExp(
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
        ),
        message: "Invalid phone number format provided.",
      }}
      maxLength={15}
      {...props}
    />
  );
}

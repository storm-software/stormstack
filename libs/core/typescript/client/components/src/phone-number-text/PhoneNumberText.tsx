"use client";

import { formatPhoneNumber } from "@stormstack/core-shared-data-access";
import {
  FieldText,
  FieldTextProps
} from "@stormstack/design-system-components";

export type PhoneNumberTextProps = FieldTextProps & {
  phoneNumber?: string;
};

export const PhoneNumberText = ({
  phoneNumber,
  ...props
}: PhoneNumberTextProps) => (
  <FieldText {...props}>{formatPhoneNumber(phoneNumber)}</FieldText>
);

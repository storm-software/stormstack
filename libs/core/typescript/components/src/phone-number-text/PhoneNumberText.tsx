"use client";

import {
  FieldText,
  FieldTextProps,
} from "@open-system/design-system-components";
import { formatPhoneNumber } from "@open-system/core-data-access";

export type PhoneNumberTextProps = FieldTextProps & {
  phoneNumber?: string;
};

export const PhoneNumberText = ({
  phoneNumber,
  ...props
}: PhoneNumberTextProps) => (
  <FieldText {...props}>{formatPhoneNumber(phoneNumber)}</FieldText>
);

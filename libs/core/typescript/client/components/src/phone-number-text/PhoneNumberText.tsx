"use client";

import { formatPhoneNumber } from "@open-system/core-shared-data-access";
import {
  FieldText,
  FieldTextProps,
} from "@open-system/design-system-components";

export type PhoneNumberTextProps = FieldTextProps & {
  phoneNumber?: string;
};

export const PhoneNumberText = ({
  phoneNumber,
  ...props
}: PhoneNumberTextProps) => (
  <FieldText {...props}>{formatPhoneNumber(phoneNumber)}</FieldText>
);

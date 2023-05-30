"use client";

import {
  FieldText,
  FieldTextProps,
} from "@open-system/design-system-components";
import { formatPhoneNumber } from "@open-system/shared-ui-data-access";

export type PhoneNumberTextProps = FieldTextProps & {
  phoneNumber?: string;
};

export const PhoneNumberText = ({
  phoneNumber,
  ...props
}: PhoneNumberTextProps) => (
  <FieldText {...props}>{formatPhoneNumber(phoneNumber)}</FieldText>
);

"use client";

import {
  FieldText,
  FieldTextProps,
} from "@open-system/design-system-components";
import {
  Address,
  formatAddressLines,
} from "@open-system/shared-ui-data-access";
import clsx from "clsx";

export type AddressTextProps = FieldTextProps & {
  address?: Partial<Address>;
};

export function AddressText({
  className,
  address,
  ...props
}: AddressTextProps) {
  return (
    <FieldText
      {...props}
      className={clsx("flex flex-col gap-0.5 whitespace-pre-line", className)}>
      {formatAddressLines(address).reduce(
        (ret: string, addressLine: string, i: number, array: string[]) => {
          ret += i < array.length - 1 ? addressLine + "\r\n" : addressLine;
          return ret;
        },
        ""
      )}
    </FieldText>
  );
}

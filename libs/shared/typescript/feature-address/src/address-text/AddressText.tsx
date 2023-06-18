"use client";

import {
  FieldText,
  FieldTextProps,
} from "@open-system/design-system-components";
import { Address, AddressMolecule } from "@open-system/shared-data-access";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { useMolecule } from "jotai-molecules";

export type AddressTextProps = FieldTextProps & {
  address?: Partial<Address>;
};

export function AddressText({
  className,
  hideWhenEmpty,
  ...props
}: AddressTextProps) {
  const address = useMolecule(AddressMolecule);
  const formattedAddressLines = useAtomValue<string[] | undefined>(
    address.formattedAddressLinesAtom
  );

  return (
    <>
      {hideWhenEmpty &&
        (!formattedAddressLines || !formattedAddressLines.length) && (
          <FieldText
            {...props}
            className={clsx(
              "flex flex-col gap-0.5 whitespace-pre-line",
              className
            )}>
            {formattedAddressLines &&
              formattedAddressLines.reduce(
                (
                  ret: string,
                  addressLine: string,
                  i: number,
                  array: string[]
                ) => {
                  ret +=
                    i < array.length - 1 ? addressLine + "\r\n" : addressLine;
                  return ret;
                },
                ""
              )}
          </FieldText>
        )}
    </>
  );
}

"use client";

import { AddressMolecule } from "@stormstack/common-client-data-access";
import { Address } from "@stormstack/common-shared-data-access";
import {
  FieldText,
  FieldTextProps
} from "@stormstack/design-system-components";
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
              "gap-0.5 flex flex-col whitespace-pre-line",
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

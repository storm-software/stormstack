import {
  Address,
  AddressConstants
} from "@stormstack/common-shared-data-access";
import { MoleculeObjectKeys } from "@stormstack/core-client-data-access";
import { atom } from "jotai";
import { createScope, molecule } from "jotai-molecules";

export type AddressMolecule = MoleculeObjectKeys<Address>;

export const AddressScope = createScope(undefined);

export const AddressMolecule = molecule((_, getScope) => {
  const id = getScope(AddressScope);

  const addressLine1Atom = atom<string | undefined>(undefined);
  const addressLine2Atom = atom<string | undefined>(undefined);
  const cityAtom = atom<string | undefined>(undefined);
  const stateAtom = atom<string | undefined>(undefined);
  const countryCodeAtom = atom<string | undefined>(
    AddressConstants.DOMESTIC_COUNTRY_CODE
  );
  const postalCodeAtom = atom<string | undefined>(undefined);

  const formattedAddressLinesAtom = atom<string[] | undefined>(get => {
    const addressLines = [];

    const addressLine1 = get(addressLine1Atom);
    const addressLine2 = get(addressLine2Atom);
    const city = get(cityAtom);
    const state = get(stateAtom);
    const countryCode = get(countryCodeAtom);
    const postalCode = get(postalCodeAtom);

    addressLine1 && addressLines.push(addressLine1);
    addressLine2 && addressLines.push(addressLine2);

    if (city || state || postalCode) {
      let addressLine = city ?? "";

      if (state) {
        addressLine = addressLine ? `${addressLine}, ${state}` : state;
      }

      if (postalCode) {
        addressLine = addressLine
          ? state
            ? `${addressLine} ${postalCode}`
            : `${addressLine}, ${postalCode}`
          : postalCode;
      }

      if (countryCode) {
        addressLine = addressLine
          ? state || postalCode
            ? `${addressLine} ${countryCode}`
            : `${addressLine}, ${countryCode}`
          : countryCode;
      }

      addressLine && addressLines.push(addressLine);
    }

    return addressLines;
  });

  return {
    id,
    addressLine1Atom,
    addressLine2Atom,
    cityAtom,
    stateAtom,
    countryCodeAtom,
    postalCodeAtom,
    formattedAddressLinesAtom
  };
});

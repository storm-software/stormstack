import { ScopedObjectState } from "@open-system/core-shared-data-access";

export const AddressConstants = {
  DOMESTIC_COUNTRY_CODE: "US",
};

export interface Address extends ScopedObjectState {
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  countryCode: string;
  postalCode?: string;
}

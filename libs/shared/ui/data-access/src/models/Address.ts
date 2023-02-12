export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  countryCode: string;
  postalCode?: string;
}

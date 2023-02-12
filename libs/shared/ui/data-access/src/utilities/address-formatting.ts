import { Address } from "../models/Address";

export const formatAddressLines = (address?: Partial<Address>): string[] => {
  const addressLines = [];

  address?.addressLine1 && addressLines.push(address.addressLine1);
  address?.addressLine2 && addressLines.push(address.addressLine2);

  if (
    address?.city ||
    address?.state ||
    address?.postalCode ||
    address?.countryCode
  ) {
    let addressLine = address.city ?? "";

    if (address.state) {
      addressLine = addressLine
        ? `${addressLine}, ${address.state}`
        : address.state;
    }

    if (address.postalCode) {
      addressLine = addressLine
        ? address.state
          ? `${addressLine} ${address.postalCode}`
          : `${addressLine}, ${address.postalCode}`
        : address.postalCode;
    }

    if (address.countryCode) {
      addressLine = addressLine
        ? address.state || address.postalCode
          ? `${addressLine} ${address.countryCode}`
          : `${addressLine}, ${address.countryCode}`
        : address.countryCode;
    }

    addressLine && addressLines.push(addressLine);
  }

  return addressLines;
};

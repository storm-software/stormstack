import { ContactFormValues, ContactState } from "./types";

export const initialFormValues: ContactFormValues = {
  reason: "business",
  isSubscribed: true,
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  companyName: "",
  title: "",
  details: "",
  url: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  countryCode: "",
  postalCode: "",
};

// Define the initial state using that type
export const initialState: ContactState = {
  formValues: {
    ...initialFormValues,
  },
  createdDateTime: null,
};

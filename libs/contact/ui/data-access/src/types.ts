import { ContactDetail, ContactHeader } from "./apis";

export type ContactFormValues = ContactHeader & ContactDetail;

export interface ContactState {
  formValues: ContactFormValues;
  createdDateTime: string | null;
}

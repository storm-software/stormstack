import { ContactDetailRecord, ContactHeaderRecord } from "./models";

export type ContactFormValues = ContactHeaderRecord & ContactDetailRecord;

export interface ContactState {
  formValues: ContactFormValues;
  createdDateTime: string | null;
}

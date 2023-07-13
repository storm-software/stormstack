import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Attachment = {
  id: string;
  createdAt: Generated<string>;
  updatedAt: string | null;
  name: string;
  path: string;
  status: string;
  contactId: string;
};
export type Contact = {
  id: string;
  createdAt: Generated<string>;
  updatedAt: string | null;
  reason: string;
  details: string | null;
  emailId: string;
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  postalCode: string | null;
  city: string | null;
  state: string | null;
  countryCode: string | null;
  title: string | null;
  companyName: string | null;
  url: string | null;
};
export type EmailAddress = {
  id: string;
  createdAt: Generated<string>;
  updatedAt: string | null;
  email: string;
  subscribed: Generated<number>;
};
export type DB = {
  Attachment: Attachment;
  Contact: Contact;
  EmailAddress: EmailAddress;
};

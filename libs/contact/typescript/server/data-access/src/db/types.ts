import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Contact = {
  id: Generated<number>;
  createdAt: Generated<string>;
  updatedAt: string | null;
  createdBy: number;
  updatedBy: number | null;
  reason: string;
  details: string | null;
  emailId: number;
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
export type ContactAttachment = {
  id: Generated<number>;
  createdAt: Generated<string>;
  updatedAt: string | null;
  createdBy: number;
  updatedBy: number | null;
  name: string;
  path: string;
  status: string;
  contactId: number;
};
export type ContactEmail = {
  id: Generated<number>;
  createdAt: Generated<string>;
  updatedAt: string | null;
  createdBy: number;
  updatedBy: number | null;
  email: string;
};
export type DB = {
  Contact: Contact;
  ContactAttachment: ContactAttachment;
  ContactEmail: ContactEmail;
};

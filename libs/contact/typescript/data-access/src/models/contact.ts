import { atomWithWebStorage } from "@open-system/core-data-access";
import { DateTime } from "@open-system/core-utilities";
import { Address } from "@open-system/shared-data-access";

export type ContactReasonTypes =
  | "business"
  | "question"
  | "other"
  | "project"
  | "interest"
  | "subscription";
export const ContactReasonTypes = {
  BUSINESS: "business" as ContactReasonTypes,
  QUESTION: "question" as ContactReasonTypes,
  OTHER: "other" as ContactReasonTypes,
  PROJECT: "project" as ContactReasonTypes,
  INTEREST: "interest" as ContactReasonTypes,
  SUBSCRIPTION: "subscription" as ContactReasonTypes,
};

export interface Contact extends Partial<Address> {
  draftSavedDateTime?: DateTime;
  reason: ContactReasonTypes;
  title?: string;
  companyName?: string;
  details?: string;
  attachments?: File | File[];
  url?: string;
  emailAddress?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isSubscribed: boolean;
}

export const INITIAL_CONTACT: Partial<Contact> = {
  isSubscribed: true,
} ;

export const contactAtom = atomWithWebStorage<Partial<Contact>>(
  "contact-draft",
  INITIAL_CONTACT
);

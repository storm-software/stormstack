import { Address } from "@open-system/common-shared-data-access";
import { DateTime } from "@open-system/core-shared-utilities";

export const MAX_ATTACHMENT_SIZE = 90000000;

export const MAX_ATTACHMENTS_COUNT = 10;

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

import { Contact } from "@open-system/contact-shared-data-access";
import { atomWithWebStorage } from "@open-system/core-client-data-access";

export const INITIAL_CONTACT: Partial<Contact> = {
  isSubscribed: true,
};

export const contactAtom = atomWithWebStorage<Partial<Contact>>(
  "contact-draft",
  INITIAL_CONTACT
);

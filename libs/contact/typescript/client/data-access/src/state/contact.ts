import { Contact } from "@stormstack/contact-shared-data-access";
import { atomWithWebStorage } from "@stormstack/core-client-data-access";

export const INITIAL_CONTACT: Partial<Contact> = {
  isSubscribed: true
};

export const contactAtom = atomWithWebStorage<Partial<Contact>>(
  "contact-draft",
  INITIAL_CONTACT
);

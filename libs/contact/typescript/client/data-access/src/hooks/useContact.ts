import { Contact } from "@stormstack/contact-shared-data-access";
import { DateTime } from "@stormstack/core-shared-utilities";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { INITIAL_CONTACT, contactAtom } from "../state/contact";

export const useContactValue = (): Partial<Contact> => {
  const contact = useAtomValue(contactAtom);
  return contact as Contact;
};

export const useSetContact = (): ((contact: Partial<Contact>) => void) => {
  const setContact = useSetAtom(contactAtom);

  return useCallback(
    (contact: Partial<Contact>) => {
      setContact({
        ...contact,
        draftSavedDateTime: DateTime.current
      } as unknown as Contact);
    },
    [setContact]
  );
};

export const useResetContact = (): (() => void) => {
  const setContact = useSetAtom(contactAtom);

  return useCallback(() => {
    setContact(INITIAL_CONTACT);
  }, [setContact]);
};

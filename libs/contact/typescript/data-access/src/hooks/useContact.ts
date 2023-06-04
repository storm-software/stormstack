import { DateTime } from "@open-system/core-utilities";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { Contact, INITIAL_CONTACT, contactAtom } from "../models/contact";

export const useContactValue = (): Contact | undefined => {
  const contact = useAtomValue(contactAtom);
  return contact as Contact;
};

export const useSetContact = (): ((contact: Partial<Contact>) => void) => {
  const setContact = useSetAtom(contactAtom);

  return useCallback(
    (contact: Partial<Contact>) => {
      setContact({
        ...contact,
        draftSavedDateTime: DateTime.current,
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

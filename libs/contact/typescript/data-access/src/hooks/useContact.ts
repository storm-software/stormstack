import { DateTime, formatDateTime } from "@open-system/core-utilities";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { Contact, contactAtom, initialContact } from "../models/contact";

export const useContactValue = (): Contact | undefined => {
  const contact = useAtomValue(contactAtom);

  if (contact?.draftSavedDateTime) {
    contact.draftSavedDateTime = DateTime.create(contact.draftSavedDateTime);
  }

  return contact;
};

export const useSetContact = (): ((contact: Partial<Contact>) => void) => {
  const setContact = useSetAtom(contactAtom);

  return useCallback(
    (contact: Partial<Contact>) => {
      setContact({ ...contact, draftSavedDateTime: formatDateTime(DateTime.current) } as unknown as Contact);

    },
    [setContact]
  );
};

export const useResetContact = (): (() => void) => {
  const setContact = useSetAtom(contactAtom);

  return useCallback(
    () => {
      setContact(initialContact);
    },
    [setContact]
  );
};

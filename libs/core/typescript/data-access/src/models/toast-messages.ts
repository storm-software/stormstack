/* eslint-disable @typescript-eslint/no-unused-vars */
import { Getter, Setter, atom } from "jotai";
import { MessageTypes, ScopedObjectState } from "../types";
import { ListAction, atomWithList } from "../utilities";
import { atomWithWebStorage } from "../utilities/atomWithWebStorage";

export interface ToastMessage extends ScopedObjectState {
  type: MessageTypes;
  summary: string;
  details?: string;
  isExtendable: boolean;
}

const toastMessagesStorageAtom = atomWithWebStorage<ToastMessage[]>(
  "toast-messages",
  []
);
const toastMessageListAtom = atomWithList<ToastMessage>([], {
  allowDuplicates: false,
});

export const toastMessagesAtom = atom<
  ToastMessage[],
  [ListAction<ToastMessage>],
  void
>(
  (get: Getter) => get(toastMessagesStorageAtom),
  (get: Getter, set: Setter, action: ListAction<ToastMessage>) => {
    const prev = get(toastMessageListAtom);
    if (
      action.type !== "add" ||
      !prev.some(
        (item: ToastMessage) =>
          action.item.type === item.type && action.item.summary === item.summary
      )
    ) {
      set(toastMessageListAtom, action);

      const next = get(toastMessageListAtom);
      set(toastMessagesStorageAtom, next);
    }
  }
);

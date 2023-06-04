/* eslint-disable @typescript-eslint/no-unused-vars */
import { Getter, Setter, atom } from "jotai";
import { MessageTypes, ScopedObjectState } from "../types";
import { ListAction, atomWithList } from "../utilities";
import { atomWithWebStorage } from "../utilities/atomWithWebStorage";

export interface Alert extends ScopedObjectState {
  type: MessageTypes;
  summary: string;
  details?: string;
  isExtendable: boolean;
}

const alertStorageAtom = atomWithWebStorage<Alert[]>("alerts", []);
const alertListAtom = atomWithList<Alert>([], { allowDuplicates: false });

export const alertsAtom = atom<Alert[], [ListAction<Alert>], void>(
  (get: Getter) => get(alertStorageAtom),
  (get: Getter, set: Setter, action: ListAction<Alert>) => {
    const prev = get(alertListAtom);
    if (
      action.type !== "add" ||
      !prev.some(
        (item: Alert) =>
          action.item.type === item.type && action.item.summary === item.summary
      )
    ) {
      set(alertListAtom, action);

      const next = get(alertListAtom);
      set(alertStorageAtom, next);
    }
  }
);

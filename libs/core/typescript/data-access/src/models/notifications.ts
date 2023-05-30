import { isDevelopment } from "@open-system/core-utilities";
import { atom } from "jotai";
import { createScope, molecule } from "jotai-molecules";
import { atomWithWebStorage } from "../state/atomWithWebStorage";
import { LinkDetails, MessageTypes } from "../types";

export const NotificationScope = createScope(undefined);

export const NotificationMolecule = molecule((_, getScope) => {
  const id = getScope(NotificationScope);
  const typeAtom = atom<MessageTypes>(MessageTypes.INFO);
  const messageAtom = atom<string | undefined>(undefined);
  const linkAtom = atom<LinkDetails | undefined>(undefined);

  return {
    id,
    typeAtom,
    messageAtom,
    linkAtom,
  };
});

export const notificationsAtom = atom([]);
if (isDevelopment()) {
  notificationsAtom.debugPrivate = true;
}

import { getUniqueId, isDevelopment } from "@open-system/core-utilities";
import { atom } from "jotai";
import { createScope, molecule } from "jotai-molecules";
import { Molecule } from "jotai-molecules/dist/molecule";
import { MessageTypes, MoleculeObjectKeys, ScopedObjectState } from "../types";

export interface LinkDetails {
  href: string;
  text: string;
}

export interface Notification extends ScopedObjectState {
  type: MessageTypes;
  message: string;
  link?: LinkDetails;
}

export type NotificationMolecule = MoleculeObjectKeys<Notification>;

export const NotificationScope = createScope(getUniqueId());

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

export const notificationsAtom = atom<
  Record<string, Molecule<NotificationMolecule>>
>({});
if (isDevelopment()) {
  notificationsAtom.debugPrivate = true;
}

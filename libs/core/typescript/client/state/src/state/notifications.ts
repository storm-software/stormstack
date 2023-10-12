import { isDevelopment } from "@stormstack/core-shared-utilities";
import { MessageTypes, ScopedObjectState } from "../types";
import { atomWithList } from "../utilities/atomWithList";

export interface LinkDetails {
  href: string;
  text: string;
}

export type NotificationMessage = ScopedObjectState & {
  type: MessageTypes;
  message: string;
  link?: LinkDetails;
};

export const notificationsAtom = atomWithList<NotificationMessage>([], {
  allowDuplicates: false
});
if (isDevelopment()) {
  notificationsAtom.debugPrivate = true;
}

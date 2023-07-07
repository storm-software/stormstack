import { ScopedObjectState } from "@open-system/core-shared-data-access";
import { isDevelopment } from "@open-system/core-shared-utilities";
import { MessageTypes } from "../types";
import { atomWithList } from "../utilities/atomWithList";

export interface LinkDetails {
  href: string;
  text: string;
}

export interface NotificationMessage extends ScopedObjectState {
  type: MessageTypes;
  message: string;
  link?: LinkDetails;
}

export const notificationsAtom = atomWithList<NotificationMessage>([], {
  allowDuplicates: false,
});
if (isDevelopment()) {
  notificationsAtom.debugPrivate = true;
}

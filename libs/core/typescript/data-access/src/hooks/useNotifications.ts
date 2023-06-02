import { useMolecule } from "jotai-molecules";
import { Molecule } from "jotai-molecules/dist/molecule";
import { useAtomValue } from "jotai/react";
import {
  NotificationMolecule,
  notificationsAtom,
} from "../models/notifications";

export const useNotifications = (): Record<
  string,
  Molecule<NotificationMolecule>
> => {
  const notifications = useAtomValue(notificationsAtom);
  return notifications;
};

export const useNotificationList = (): Molecule<NotificationMolecule>[] => {
  const notifications = useNotifications();

  return Object.values(notifications).reduce(
    (
      ret: Molecule<NotificationMolecule>[],
      notification: Molecule<NotificationMolecule>
    ) => {
      ret.push(notification);
      return ret;
    },
    []
  );
};

export const useNotification = (
  id: string
): NotificationMolecule | undefined => {
  const notifications = useNotifications();
  return useMolecule(notifications[id]);
};

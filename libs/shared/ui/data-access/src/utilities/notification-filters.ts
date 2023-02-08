import { Notification } from "../models/NotificationsState";

export const duplicateNotificationFilter = (
  notifications: Notification[] = []
): Notification[] => {
  return [
    ...notifications.filter(
      (notification1: Notification, i: number, array: Notification[]) =>
        i ===
        array.findIndex(
          (notification2: Notification) =>
            notification1.type === notification2.type &&
            notification1.message?.toUpperCase() ===
              notification2.message?.toUpperCase() &&
            notification1.details?.toUpperCase() ===
              notification2.details?.toUpperCase()
        )
    ),
  ];
};

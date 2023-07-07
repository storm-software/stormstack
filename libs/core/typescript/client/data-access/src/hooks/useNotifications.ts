import { useAtomValue } from "jotai/react";
import { NotificationMessage, notificationsAtom } from "../state/notifications";
import { UseAtomListReturn, useAtomList } from "./useAtomList";

export const useSetNotifications =
  (): UseAtomListReturn<NotificationMessage> => {
    return useAtomList(notificationsAtom);
  };

export const useNotificationsValue = (): NotificationMessage[] => {
  const notifications = useAtomValue(notificationsAtom);
  return notifications;
};

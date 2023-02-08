import { NotificationTypes } from "./NotificationTypes";

export interface Notification {
  id: string;
  type: NotificationTypes;
  message: string;
  details?: string;
}

export interface NotificationsState {
  list: Notification[];
}

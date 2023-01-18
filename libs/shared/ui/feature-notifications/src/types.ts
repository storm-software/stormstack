export type NotificationTypes = "warning" | "error" | "info" | "success";
export const NotificationTypes = {
  WARNING: "warning" as NotificationTypes,
  ERROR: "error" as NotificationTypes,
  INFO: "info" as NotificationTypes,
  SUCCESS: "success" as NotificationTypes,
};

export interface Notification {
  id?: string;
  type: NotificationTypes;
  message: string;
  details?: string;
}

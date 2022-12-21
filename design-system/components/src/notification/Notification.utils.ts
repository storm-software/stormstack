import { NotificationVariants } from "./Notification.types";

export function getBorderStyle(variant: NotificationVariants) {
  return variant === NotificationVariants.ERROR
    ? "border-error"
    : variant === NotificationVariants.WARNING
    ? "border-warning"
    : variant === NotificationVariants.SUCCESS
    ? "border-success"
    : "border-info";
}

export function getBackgroundStyle(variant: NotificationVariants) {
  return variant === NotificationVariants.ERROR
    ? "bg-error/60"
    : variant === NotificationVariants.WARNING
    ? "bg-warning/60"
    : variant === NotificationVariants.SUCCESS
    ? "bg-success/60"
    : "bg-info/60";
}

export function getTextStyle(variant: NotificationVariants) {
  return variant === NotificationVariants.ERROR
    ? "text-error font-bold"
    : variant === NotificationVariants.WARNING
    ? "text-warning font-bold"
    : variant === NotificationVariants.SUCCESS
    ? "text-success font-bold"
    : "text-info font-bold";
}

export function getDefaultTitle(variant: NotificationVariants) {
  return variant === NotificationVariants.ERROR
    ? "Error"
    : variant === NotificationVariants.WARNING
    ? "Warning"
    : variant === NotificationVariants.SUCCESS
    ? "Success"
    : "Attention";
}

export function getCloseButtonStyle(variant: NotificationVariants) {
  return variant === NotificationVariants.ERROR
    ? "border-error text-error hover:border-primary hover:text-primary font-extrabold"
    : variant === NotificationVariants.WARNING
    ? "border-warning text-warning hover:border-primary hover:text-primary font-extrabold"
    : variant === NotificationVariants.SUCCESS
    ? "border-success text-success hover:border-primary hover:text-primary font-extrabold"
    : "border-info text-info hover:border-primary hover:text-primary font-extrabold";
}

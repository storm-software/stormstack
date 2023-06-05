import { NotificationVariants } from "./Notification.types";

export function getBorderStyle(variant: NotificationVariants) {
  return variant === NotificationVariants.ERROR
    ? "border-l-error"
    : variant === NotificationVariants.WARNING
    ? "border-l-warning"
    : variant === NotificationVariants.SUCCESS
    ? "border-l-success"
    : variant === NotificationVariants.INFO
    ? "border-l-info"
    : "border-l-primary";
}

export function getBackgroundStyle(variant: NotificationVariants) {
  return variant === NotificationVariants.ERROR ||
    variant === NotificationVariants.WARNING ||
    variant === NotificationVariants.INFO ||
    variant === NotificationVariants.SUCCESS
    ? "background-caution"
    : variant === NotificationVariants.GRADIENT
    ? "bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to"
    : "bg-bg-1";
}


export function getTextStyle(variant: NotificationVariants) {
  return variant === NotificationVariants.ERROR
    ? "text-error"
    : variant === NotificationVariants.WARNING
    ? "text-warning"
    : variant === NotificationVariants.SUCCESS
    ? "text-success"
    : "text-info";
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

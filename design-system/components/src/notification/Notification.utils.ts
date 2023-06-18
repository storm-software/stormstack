import { NotificationVariants } from "./Notification.types";

export function getBorderStyle(variant: NotificationVariants) {
  return variant === NotificationVariants.ERROR
    ? "border-l-bg-error"
    : variant === NotificationVariants.WARNING
    ? "border-l-bg-warning"
    : variant === NotificationVariants.SUCCESS
    ? "border-l-bg-success"
    : variant === NotificationVariants.INFO
    ? "border-l-bg-info"
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
    ? "text-bg-error"
    : variant === NotificationVariants.WARNING
    ? "text-bg-warning"
    : variant === NotificationVariants.SUCCESS
    ? "text-bg-success"
    : "text-bg-info";
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
    ? "border-bg-error text-bg-error hover:border-primary hover:text-primary font-extrabold"
    : variant === NotificationVariants.WARNING
    ? "border-bg-warning text-bg-warning hover:border-primary hover:text-primary font-extrabold"
    : variant === NotificationVariants.SUCCESS
    ? "border-bg-success text-bg-success hover:border-primary hover:text-primary font-extrabold"
    : "border-bg-info text-bg-info hover:border-primary hover:text-primary font-extrabold";
}

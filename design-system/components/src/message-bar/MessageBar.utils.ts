import { MessageBarVariants } from "./MessageBar.types";

export function getBorderStyle(variant: MessageBarVariants) {
  return variant === MessageBarVariants.ERROR
    ? "border-bg-error"
    : variant === MessageBarVariants.WARNING
    ? "border-bg-warning"
    : variant === MessageBarVariants.SUCCESS
    ? "border-bg-success"
    : "border-bg-info";
}

export function getBackgroundStyle(variant: MessageBarVariants) {
  return variant === MessageBarVariants.ERROR
    ? "bg-bg-error/60"
    : variant === MessageBarVariants.WARNING
    ? "bg-bg-warning/60"
    : variant === MessageBarVariants.SUCCESS
    ? "bg-bg-success/60"
    : "bg-bg-info/60";
}

export function getTextStyle(variant: MessageBarVariants) {
  return variant === MessageBarVariants.ERROR
    ? "text-bg-error font-bold"
    : variant === MessageBarVariants.WARNING
    ? "text-bg-warning font-bold"
    : variant === MessageBarVariants.SUCCESS
    ? "text-bg-success font-bold"
    : "text-bg-info font-bold";
}

export function getDefaultTitle(variant: MessageBarVariants) {
  return variant === MessageBarVariants.ERROR
    ? "Error"
    : variant === MessageBarVariants.WARNING
    ? "Warning"
    : variant === MessageBarVariants.SUCCESS
    ? "Success"
    : "Attention";
}

export function getCloseButtonStyle(variant: MessageBarVariants) {
  return variant === MessageBarVariants.ERROR
    ? "border-bg-error text-bg-error hover:border-primary hover:text-primary font-extrabold"
    : variant === MessageBarVariants.WARNING
    ? "border-bg-warning text-bg-warning hover:border-primary hover:text-primary font-extrabold"
    : variant === MessageBarVariants.SUCCESS
    ? "border-bg-success text-bg-success hover:border-primary hover:text-primary font-extrabold"
    : "border-bg-info text-bg-info hover:border-primary hover:text-primary font-extrabold";
}

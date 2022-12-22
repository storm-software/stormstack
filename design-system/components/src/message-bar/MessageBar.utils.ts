import { MessageBarVariants } from "./MessageBar.types";

export function getBorderStyle(variant: MessageBarVariants) {
  return variant === MessageBarVariants.ERROR
    ? "border-error"
    : variant === MessageBarVariants.WARNING
    ? "border-warning"
    : variant === MessageBarVariants.SUCCESS
    ? "border-success"
    : "border-info";
}

export function getBackgroundStyle(variant: MessageBarVariants) {
  return variant === MessageBarVariants.ERROR
    ? "bg-error/60"
    : variant === MessageBarVariants.WARNING
    ? "bg-warning/60"
    : variant === MessageBarVariants.SUCCESS
    ? "bg-success/60"
    : "bg-info/60";
}

export function getTextStyle(variant: MessageBarVariants) {
  return variant === MessageBarVariants.ERROR
    ? "text-error font-bold"
    : variant === MessageBarVariants.WARNING
    ? "text-warning font-bold"
    : variant === MessageBarVariants.SUCCESS
    ? "text-success font-bold"
    : "text-info font-bold";
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
    ? "border-error text-error hover:border-primary hover:text-primary font-extrabold"
    : variant === MessageBarVariants.WARNING
    ? "border-warning text-warning hover:border-primary hover:text-primary font-extrabold"
    : variant === MessageBarVariants.SUCCESS
    ? "border-success text-success hover:border-primary hover:text-primary font-extrabold"
    : "border-info text-info hover:border-primary hover:text-primary font-extrabold";
}

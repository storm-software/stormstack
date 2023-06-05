import { ToastVariants } from "./Toast.types";

export function getBorderStyle(variant: ToastVariants) {
  return variant === ToastVariants.ERROR
    ? "border-error"
    : variant === ToastVariants.WARNING
    ? "border-warning"
    : variant === ToastVariants.SUCCESS
    ? "border-success"
    : "border-info";
}

export function getBackgroundStyle(variant: ToastVariants) {
  return variant === ToastVariants.ERROR ||
    variant === ToastVariants.WARNING ||
    variant === ToastVariants.INFO ||
    variant === ToastVariants.SUCCESS
    ? "background-caution"
    : variant === ToastVariants.GRADIENT
    ? "bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to"
    : "bg-bg-1";
}

export function getTextStyle(variant: ToastVariants) {
  return variant === ToastVariants.ERROR
    ? "text-error"
    : variant === ToastVariants.WARNING
    ? "text-warning"
    : variant === ToastVariants.SUCCESS
    ? "text-success"
    : "text-info";
}

export function getDefaultTitle(variant: ToastVariants) {
  return variant === ToastVariants.ERROR
    ? "Error"
    : variant === ToastVariants.WARNING
    ? "Warning"
    : variant === ToastVariants.SUCCESS
    ? "Success"
    : "Attention";
}

export function getCloseButtonStyle(variant: ToastVariants) {
  return variant === ToastVariants.ERROR
    ? "border-error text-error hover:border-primary hover:text-primary font-extrabold"
    : variant === ToastVariants.WARNING
    ? "border-warning text-warning hover:border-primary hover:text-primary font-extrabold"
    : variant === ToastVariants.SUCCESS
    ? "border-success text-success hover:border-primary hover:text-primary font-extrabold"
    : "border-info text-info hover:border-primary hover:text-primary font-extrabold";
}

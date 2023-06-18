import { ToastVariants } from "./Toast.types";

export function getBorderStyle(variant: ToastVariants) {
  return variant === ToastVariants.ERROR
    ? "border-bg-error"
    : variant === ToastVariants.WARNING
    ? "border-bg-warning"
    : variant === ToastVariants.SUCCESS
    ? "border-bg-success"
    : "border-bg-info";
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
    ? "text-bg-error"
    : variant === ToastVariants.WARNING
    ? "text-bg-warning"
    : variant === ToastVariants.SUCCESS
    ? "text-bg-success"
    : "text-bg-info";
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
    ? "border-bg-error text-bg-error hover:border-primary hover:text-primary font-extrabold"
    : variant === ToastVariants.WARNING
    ? "border-bg-warning text-bg-warning hover:border-primary hover:text-primary font-extrabold"
    : variant === ToastVariants.SUCCESS
    ? "border-bg-success text-bg-success hover:border-primary hover:text-primary font-extrabold"
    : "border-bg-info text-bg-info hover:border-primary hover:text-primary font-extrabold";
}

import { ModalVariants } from "./Modal.types";

export function getBorderStyle(variant: ModalVariants) {
  return variant === ModalVariants.ERROR
    ? "border-error"
    : variant === ModalVariants.WARNING
    ? "border-warning"
    : variant === ModalVariants.INFO
    ? "border-info"
    : variant === ModalVariants.SUCCESS
    ? "border-success"
    : "border-primary";
}

export function getBackgroundStyle(variant: ModalVariants) {
  return variant === ModalVariants.ERROR
    ? "bg-error/60"
    : variant === ModalVariants.WARNING
    ? "bg-warning/60"
    : variant === ModalVariants.INFO
    ? "bg-info/60"
    : variant === ModalVariants.SUCCESS
    ? "bg-success/60"
    : "bg-slate-800/60";
}

export function getTextStyle(variant: ModalVariants) {
  return variant === ModalVariants.ERROR
    ? "text-error font-bold"
    : variant === ModalVariants.WARNING
    ? "text-warning font-bold"
    : variant === ModalVariants.INFO
    ? "text-info font-bold"
    : variant === ModalVariants.SUCCESS
    ? "text-success font-bold"
    : "text-primary";
}

export function getDefaultTitle(variant: ModalVariants) {
  return variant === ModalVariants.ERROR
    ? "Error"
    : variant === ModalVariants.WARNING
    ? "Warning"
    : variant === ModalVariants.SUCCESS
    ? "Success"
    : "Attention";
}

export function getCloseButtonStyle(variant: ModalVariants) {
  return variant === ModalVariants.ERROR
    ? "border-error text-error hover:border-primary hover:text-primary font-extrabold"
    : variant === ModalVariants.WARNING
    ? "border-warning text-warning hover:border-primary hover:text-primary font-extrabold"
    : variant === ModalVariants.INFO
    ? "border-info text-info hover:border-primary hover:text-primary font-extrabold"
    : variant === ModalVariants.SUCCESS
    ? "border-success text-success hover:border-primary hover:text-primary font-extrabold"
    : "border-primary bg-slate-800/60 text-primary hover:border-slate-400 hover:text-slate-400";
}

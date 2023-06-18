import { ModalVariants } from "./Modal.types";

export function getBorderStyle(variant: ModalVariants) {
  return variant === ModalVariants.ERROR
    ? "border-bg-error"
    : variant === ModalVariants.WARNING
    ? "border-bg-warning"
    : variant === ModalVariants.INFO
    ? "border-bg-info"
    : variant === ModalVariants.SUCCESS
    ? "border-bg-success"
    : "border-primary";
}

export function getBackgroundStyle(variant: ModalVariants) {
  return variant === ModalVariants.ERROR ||
  variant === ModalVariants.WARNING ||
  variant === ModalVariants.INFO ||
  variant === ModalVariants.SUCCESS
    ? "background-caution"
    : "bg-slate-800";
}

export function getTextStyle(variant: ModalVariants) {
  return variant === ModalVariants.ERROR
    ? "text-bg-error font-bold"
    : variant === ModalVariants.WARNING
    ? "text-bg-warning font-bold"
    : variant === ModalVariants.INFO
    ? "text-bg-info font-bold"
    : variant === ModalVariants.SUCCESS
    ? "text-bg-success font-bold"
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
    ? "border-bg-error text-bg-error hover:border-primary hover:text-primary font-extrabold"
    : variant === ModalVariants.WARNING
    ? "border-bg-warning text-bg-warning hover:border-primary hover:text-primary font-extrabold"
    : variant === ModalVariants.INFO
    ? "border-bg-info text-bg-info hover:border-primary hover:text-primary font-extrabold"
    : variant === ModalVariants.SUCCESS
    ? "border-bg-success text-bg-success hover:border-primary hover:text-primary font-extrabold"
    : "border-primary bg-slate-800/70 text-primary hover:border-slate-400 hover:text-slate-400";
}

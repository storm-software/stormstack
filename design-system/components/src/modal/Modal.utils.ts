import { ModalVariants } from "./Modal.types";

export function getBorderStyle(variant: ModalVariants) {
  return variant === ModalVariants.ERROR
    ? "border-bg-error border-4"
    : variant === ModalVariants.WARNING
    ? "border-bg-warning border-4"
    : variant === ModalVariants.INFO
    ? "border-bg-info border-4"
    : variant === ModalVariants.SUCCESS
    ? "border-bg-success border-4"
    : "border-primary border-2";
}

export function getBackgroundStyle(variant: ModalVariants) {
  return variant === ModalVariants.ERROR ||
    variant === ModalVariants.WARNING ||
    variant === ModalVariants.INFO ||
    variant === ModalVariants.SUCCESS
    ? "background-caution"
    : "bg-bg-primary";
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
    : "border-primary bg-bg-primary text-primary hover:border-slate-400 hover:text-slate-400";
}

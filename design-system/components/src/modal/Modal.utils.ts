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
    ? "from-error/80 to-error/70 backdrop-brightness-50"
    : variant === ModalVariants.WARNING
    ? "from-warning/70 to-warning/60 backdrop-blur-lg backdrop-brightness-0"
    : variant === ModalVariants.INFO
    ? "from-info/70 to-info/60 backdrop-blur-sm backdrop-brightness-0"
    : variant === ModalVariants.SUCCESS
    ? "from-success/70 to-success/60 backdrop-blur-lg backdrop-brightness-0"
    : "from-slate-800/70 to-slate-800/60 backdrop-blur-lg backdrop-brightness-0";
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
    : "border-primary bg-slate-800/70 text-primary hover:border-slate-400 hover:text-slate-400";
}

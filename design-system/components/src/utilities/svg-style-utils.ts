import { ButtonVariants } from "../button";

export function getSvgFillStyle(
  error?: string | boolean | null,
  warning?: string | boolean | null,
  info?: string | boolean | null,
  success?: string | boolean | null
) {
  return error
    ? "fill-error"
    : warning
    ? "fill-warning"
    : info
    ? "fill-info"
    : success
    ? "fill-success"
    : "fill-primary";
}

export function getButtonSvgFillStyle(
  disabled: boolean,
  variant?: ButtonVariants | string
) {
  return disabled
    ? "fill-disabled"
    : variant === ButtonVariants.GRADIENT
    ? "fill-primary"
    : variant === ButtonVariants.SECONDARY
    ? "fill-secondary"
    : variant === ButtonVariants.TERTIARY
    ? "fill-tertiary"
    : variant === ButtonVariants.QUARTERNARY
    ? "fill-quaternary"
    : "fill-primary";
}

export function getButtonSvgStrokeStyle(
  disabled: boolean,
  variant?: ButtonVariants | string
) {
  return disabled
    ? "stroke-disabled"
    : variant === ButtonVariants.GRADIENT
    ? "stroke-primary"
    : variant === ButtonVariants.SECONDARY
    ? "stroke-secondary"
    : variant === ButtonVariants.TERTIARY
    ? "stroke-tertiary"
    : variant === ButtonVariants.QUARTERNARY
    ? "stroke-quaternary"
    : "stroke-primary";
}

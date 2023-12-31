import {
  ButtonCornerRoundingTypes,
  ButtonTypes,
  ButtonVariants,
} from "./Button.types";

export function getBackgroundColor(
  disabled: boolean,
  variant: ButtonVariants | string
) {
  return disabled
    ? "bg-disabled"
    : variant === ButtonVariants.GRADIENT
    ? "bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to"
    : variant === ButtonVariants.SECONDARY
    ? "bg-secondary"
    : variant === ButtonVariants.TERTIARY
    ? "bg-tertiary"
    : variant === ButtonVariants.QUARTERNARY
    ? "bg-quaternary"
    : "bg-primary";
}

export function getTextColor(
  disabled: boolean,
  variant: ButtonVariants | string
) {
  return disabled
    ? "text-disabled"
    : variant === ButtonVariants.GRADIENT
    ? "text-primary"
    : variant === ButtonVariants.SECONDARY
    ? "text-secondary"
    : variant === ButtonVariants.TERTIARY
    ? "text-tertiary"
    : variant === ButtonVariants.QUARTERNARY
    ? "text-quaternary"
    : "text-primary";
}

export function getCursor(disabled: boolean) {
  return disabled ? "cursor-not-allowed" : "cursor-pointer";
}

export function getHoverTextColor(variant: ButtonVariants | string) {
  return variant === ButtonVariants.GRADIENT ? "text-primary" : "text-inverse";
}

export function getDefaultText(type: ButtonTypes) {
  return type === ButtonTypes.RESET
    ? "Reset"
    : type === ButtonTypes.SUBMIT
    ? "Submit"
    : "View";
}

export function getBorderRadius(
  rounding: ButtonCornerRoundingTypes,
  isInner = false
) {
  return rounding === ButtonCornerRoundingTypes.NONE
    ? "rounded-none"
    : rounding === ButtonCornerRoundingTypes.FULL
    ? "rounded-full"
    : isInner
    ? "rounded"
    : "rounded-lg";
}

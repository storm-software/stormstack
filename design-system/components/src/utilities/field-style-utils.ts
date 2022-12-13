/* eslint-disable @typescript-eslint/no-explicit-any */

export function getTextStyle(
  error: string | null,
  warning: string | null,
  info: string | null,
  focused: boolean
) {
  return error
    ? "text-error"
    : warning
    ? "text-warning"
    : info
    ? "text-info"
    : focused
    ? "text-active"
    : "text-input-label";
}

export function getInputFillColor(disabled: boolean) {
  return disabled ? "bg-disabled-fill" : "bg-input-fill";
}

export function getInputTextStyle(
  error: string | null,
  warning: string | null,
  info: string | null,
  focused: boolean,
  disabled: boolean,
  value: any
) {
  return disabled
    ? "text-input-fill"
    : value !== undefined && value !== null
    ? "text-active"
    : getTextStyle(error, warning, info, focused);
}

export function getStrokeStyle(
  error: string | null,
  warning: string | null,
  info: string | null,
  focused: boolean,
  disabled: boolean
) {
  return error
    ? "border-error focus:border-error"
    : warning
    ? "border-warning focus:border-warning"
    : info
    ? "border-info focus:border-info"
    : focused
    ? "border-active focus:border-active"
    : disabled
    ? "border-disabled focus:border-disabled"
    : "border-input-label focus:border-input-label";
}

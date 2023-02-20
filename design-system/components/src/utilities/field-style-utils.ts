/* eslint-disable @typescript-eslint/no-explicit-any */

import { getTextStyle } from "./text-style-utils";

export function getFieldTextStyle(
  errors?: boolean,
  warning?: boolean,
  info?: boolean,
  focused?: boolean
) {
  return errors || warning || info
    ? getTextStyle(errors, warning, info, false)
    : focused
    ? "text-active"
    : "text-input-label";
}

export function getInputFillColor(disabled: boolean) {
  return "bg-input-fill" /*disabled ? "bg-disabled-fill" : "bg-input-fill"*/;
}

export function getInputTextStyle(
  errors?: boolean,
  warning?: boolean,
  info?: boolean,
  focused?: boolean,
  disabled?: boolean,
  value?: any
) {
  return disabled
    ? "text-input-fill"
    : value !== undefined && value !== null
    ? "text-active"
    : getFieldTextStyle(errors, warning, info, focused);
}

export function getStrokeStyle(
  errors?: boolean,
  warning?: boolean,
  info?: boolean,
  focused?: boolean,
  disabled?: boolean
) {
  return errors
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

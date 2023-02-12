/* eslint-disable @typescript-eslint/no-explicit-any */

export function getTextStyle(
  errors?: boolean,
  warning?: boolean,
  info?: boolean,
  success?: boolean
) {
  return errors
    ? "text-error"
    : warning
    ? "text-warning"
    : info
    ? "text-info"
    : success
    ? "text-success"
    : "text-primary";
}

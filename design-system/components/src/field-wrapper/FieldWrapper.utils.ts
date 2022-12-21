export function getBorderStyle(
  error: string | null,
  warning: string | null,
  info: string | null,
  focused: boolean
) {
  return error
    ? "border-l-error"
    : warning
    ? "border-l-warning"
    : info
    ? "border-l-info"
    : focused
    ? "border-l-active"
    : "border-l-input-label";
}

export function getIsBorderDisplayed(
  error: string | null,
  warning: string | null,
  info: string | null,
  focused: boolean,
  noBorder: boolean
) {
  return !noBorder && (error || warning || info || focused);
}

export function getInputMessage(
  error: string | null,
  warning: string | null,
  info: string | null
) {
  return error ? error : warning ? warning : info ? info : null;
}

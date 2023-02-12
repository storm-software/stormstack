export function getBorderStyle(
  error: boolean,
  warning: boolean,
  info: boolean,
  focused: boolean
) {
  return error
    ? "stroke-error"
    : warning
    ? "stroke-warning"
    : info
    ? "stroke-info"
    : focused
    ? "stroke-active"
    : "stroke-input-label";
}

export function getIsBorderDisplayed(
  error: boolean,
  warning: boolean,
  info: boolean,
  focused: boolean,
  noBorder: boolean
) {
  return !noBorder && (error || warning || info || focused);
}

export function getInputMessage(
  error?: string | null,
  warning?: string | null,
  info?: string | null
) {
  return error ? error : warning ? warning : info ? info : null;
}

export function getPulseBackgroundStyle(
  error?: string | boolean | null,
  warning?: string | boolean | null,
  info?: string | boolean | null,
  success?: string | boolean | null
) {
  return error
    ? "bg-error"
    : warning
    ? "bg-warning"
    : info
    ? "bg-info"
    : success
    ? "bg-success"
    : "bg-transparent";
}

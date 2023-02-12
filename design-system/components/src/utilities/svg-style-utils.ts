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

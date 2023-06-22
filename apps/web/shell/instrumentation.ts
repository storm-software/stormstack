import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel("@open-system/web-shell");
}

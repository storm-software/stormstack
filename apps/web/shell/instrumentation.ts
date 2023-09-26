import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel("@stormstack/web-shell");
}

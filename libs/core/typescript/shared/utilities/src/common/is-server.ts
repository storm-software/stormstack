/**
 * The function checks if the code is running on
 * the server or in the browser.
 */
export const isRuntimeServer = (): boolean =>
  typeof window === "undefined" || "Deno" in window;

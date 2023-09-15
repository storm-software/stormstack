// Stacktracey requires buffer, which Vite does not polyfill by default
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  window.Buffer = window.Buffer || require("node:buffer").Buffer;
}

// eslint-disable-next-line import/first
import StackTracey from "stacktracey";

export const toVSCodeURL = (entry: StackTracey.Entry) => {
  // To account for folks using vscode-insiders etc
  // This is defined by webpack and vite from .env
  const scheme = process?.env?.DEV_EDITOR_ID || "vscode";
  return `${scheme}://file/${entry.fileShort}:${entry.line}:${entry.column}`;
};

export const shouldHideEntry = (entry: StackTracey.Entry, i: number) => {
  return (
    (entry.thirdParty ||
      entry["native"] ||
      entry.hide ||
      entry.fileShort.includes("node_modules")) &&
    i !== 0
  );
};

export const hideStackLine = (fileReference: string): boolean => {
  return (
    fileReference.length === 1 ||
    fileReference.includes("node_modules/react-dom")
  );
};

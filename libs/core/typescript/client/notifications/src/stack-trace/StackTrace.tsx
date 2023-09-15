/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/first */

// Stacktracey requires buffer, which Vite does not polyfill by default
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  window.Buffer = window.Buffer || require("buffer").Buffer;
}

import { isString } from "@open-system/core-shared-utilities/common/type-checks";
import StackTracey from "stacktracey";
import { StackTraceLine } from "./StackTraceLine";

/**
 * A component that renders a stack trace with links to vscode
 * @param param0
 * @returns
 */
export const StackTrace = ({
  stack,
  message
}: {
  stack: string | undefined;
  message: string | undefined;
}) => {
  if (!stack || !isString(stack)) {
    return null;
  }

  return new StackTracey(stack)
    .withSources()
    .items.map((stackLine, i) => (
      <StackTraceLine
        key={i}
        stackLine={stackLine}
        i={i}
        message={message ?? "An error occured"}
      />
    ));
};

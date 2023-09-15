/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/first */

// Stacktracey requires buffer, which Vite does not polyfill by default
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  window.Buffer = window.Buffer || require("buffer").Buffer;
}

import { envManager } from "@open-system/core-shared-env/env-manager";
import {
  hideStackLine,
  shouldHideEntry,
  toVSCodeURL
} from "@open-system/core-shared-utilities/errors";
import StackTracey from "stacktracey";

function renderHighlightedLine(text: string, column: number) {
  const [before, after] = [text.slice(0, column - 1), text.slice(column - 1)];
  return (
    <>
      {before}
      <strong>{after}</strong>
    </>
  );
}

let srcRoot = "";
if (isSet(envManager.get("DEV_REPO_ROOT"))) {
  srcRoot = envManager.get("DEV_REPO_ROOT");
}

let appRoot: string;
if (/^[A-Z]:\\/.test(srcRoot)) {
  // On Windows srcRoot will be something like C:\Users\bob\dev\ps-dev
  appRoot = srcRoot.substring(3).replace(/\\/g, "/");
} else {
  // On Linux/MacOS srcRoot will be something like /Users/bob/dev/ps-dev
  appRoot = srcRoot.substring(1);
}

/**
 * A component that renders a stack trace with links to vscode
 * @param param0
 * @returns
 */
export const StackTraceLine = ({
  stackLine,
  i
}: {
  stackLine: StackTracey.Entry;
  i: number;
  message: string;
}) => {
  const { sourceFile = { lines: [] }, line, column, fileShort } = stackLine;

  const lineIndex = (line || 0) - 1;
  const maxLines = sourceFile.lines.length;
  const window = 4;

  let start = lineIndex - window,
    end = lineIndex + window + 2;

  if (start < 0) {
    end = Math.min(end - start, maxLines);
    start = 0;
  }
  if (end > maxLines) {
    start = Math.max(0, start - (end - maxLines));
    end = maxLines;
  }

  const lines = sourceFile.lines.slice(start, end);
  const lineNumberWidth = String(start + lines.length).length;
  const highlightIndex = (line || 0) - start - 1;
  const onLastLine = highlightIndex === lines.length - 1;

  const shortestPath = (path: string) => path.replace(appRoot || "", "");
  const expanded = !shouldHideEntry(stackLine, i);

  const clickable = lines.length;
  const LinkToVSCode = (props: { children: any }) =>
    clickable ? (
      <a href={toVSCodeURL(stackLine)}>{props.children}</a>
    ) : (
      props.children
    );
  const fileReference = !lines.length ? "[System]" : shortestPath(fileShort);

  return hideStackLine(fileReference) ? (
    <div></div>
  ) : (
    <LinkToVSCode>
      <div
        className={[
          "stack-entry",
          !fileReference.includes("node_modules"),
          i === 0 && " first",
          lines.length && "clickable"
        ]
          .filter(Boolean)
          .join(" ")}>
        <div className="file">{fileReference + " in " + stackLine.callee}</div>
        {expanded && !!lines.length && (
          <div className={"flex flex-col " + (onLastLine ? ".no-fade" : "")}>
            {lines.map((text, i) => {
              return (
                <div
                  key={i}
                  className={
                    "flex flex-row" +
                    (i === highlightIndex
                      ? " bg-i-message-bar-color-primary-highlight"
                      : "")
                  }>
                  <span className="pr-6 opacity-50">
                    {String(start + i + 1).padStart(lineNumberWidth, " ")}
                  </span>
                  <span className="line-text">
                    {i === highlightIndex
                      ? renderHighlightedLine(text, column || 0)
                      : text}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </LinkToVSCode>
  );
};

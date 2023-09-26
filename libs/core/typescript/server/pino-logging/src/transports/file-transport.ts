import { EnvManager } from "@stormstack/core-shared-env/env-manager";
import {
  DateTime,
  formatDate,
  isString
} from "@stormstack/core-shared-utilities/common";
import { tmpdir } from "node:os";
import Path from "node:path";
import pino from "pino";

export const createFileTransport = (env: EnvManager) => {
  let logPath = env.get("LOG_PATH")
    ? env.get("LOG_PATH")
    : env.get("PINO_LOG_PATH");

  if (!logPath || !isString(logPath)) {
    logPath = Path.join(tmpdir(), "storm");
  }

  let logFilePrefix = env.get("LOG_FILE_PREFIX");
  if (!logFilePrefix || !isString(logFilePrefix)) {
    logFilePrefix = "storm";
  }

  return pino.transport({
    target: "pino/file",
    options: {
      destination: pino.destination({
        dest: Path.join(
          logPath,
          formatDate().replaceAll("/", "-"),
          `${logFilePrefix}-${DateTime.current.toString({
            smallestUnit: "millisecond"
          })}.log`
        ),
        minLength: 4096,
        sync: false
      })
    }
  });
};

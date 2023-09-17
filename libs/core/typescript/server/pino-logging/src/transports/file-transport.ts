import { EnvManager } from "@open-system/core-shared-env/env-manager";
import {
  DateTime,
  formatDate,
  isString
} from "@open-system/core-shared-utilities/common";
import { tmpdir } from "node:os";
import Path from "node:path";
import pino from "pino";

export const createFileTransport = (env: EnvManager) => {
  let logPath = env.get("LOG_PATH")
    ? env.get("LOG_PATH")
    : env.get("PINO_LOG_PATH");

  if (!logPath || !isString(logPath)) {
    logPath = Path.join(tmpdir(), "open-system");
  }

  let logFilePrefix = env.get("LOG_FILE_PREFIX");
  if (!logFilePrefix || !isString(logFilePrefix)) {
    logFilePrefix = "open-system";
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

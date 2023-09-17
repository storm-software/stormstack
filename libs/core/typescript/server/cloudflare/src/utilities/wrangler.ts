/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutorContext } from "@nx/devkit";
import { executeAsync } from "@open-system/core-server-utilities/execute";
import {
  ConfigurationError,
  EMPTY_STRING
} from "@open-system/core-shared-utilities";
import { isSet } from "@open-system/core-shared-utilities/common/type-checks";
import { ConsoleLogger } from "@open-system/core-shared-logging";
import { WranglerCommand } from "../types";

export async function runWranglerCommand(
  context: ExecutorContext,
  command: WranglerCommand,
  options: Record<string, string | boolean | number> = {},
  script?: string
) {
  const { projectName } = context;

  if (!projectName) {
    ConsoleLogger.error("No project name was provided in context object.");
    throw new ConfigurationError("projectName");
  }

  const nextCommand = `cross-env NO_D1_WARNING=true wrangler ${command}${
    script ? ` ${script}` : EMPTY_STRING
  } ${Object.entries(options).reduce(
    (ret: string, [key, value]: [string, string | number | boolean]) => {
      if (isSet(key) && isSet(value)) {
        ret += ` --${key}=${value} `;
      }

      return ret;
    },
    ""
  )} `;

  try {
    ConsoleLogger.debug(nextCommand);
    await executeAsync(nextCommand);
  } catch (e) {
    ConsoleLogger.error(
      `An error occured executing the command '${nextCommand}'. Halting execution early.`
    );
    console.error(e);
  }
}

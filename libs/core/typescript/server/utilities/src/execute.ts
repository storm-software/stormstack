/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConsoleLogger } from "@stormstack/core-shared-logging";
import { isEmptyObject } from "@stormstack/core-shared-utilities/common";
import {
  ExecOptions,
  StdioOptions,
  execSync as extExecSync
} from "child_process";
import { Readable } from "node:stream";
import { promisify } from "util";

export const execute = (
  command: string,
  options: ExecOptions = {},
  env: Record<string, string> = {},
  stdio: StdioOptions = "inherit"
): string | Buffer | Readable | undefined => {
  try {
    ConsoleLogger.info(
      `Executing command: "${command}"${
        !isEmptyObject(options) ? `, options: ${JSON.stringify(options)}` : ""
      }${!isEmptyObject(env) ? `, env: ${JSON.stringify(env)}` : ""}${
        !stdio ? `, stdio: ${stdio}` : ""
      }`
    );

    const mergedEnv = { ...process.env, ...env };
    return extExecSync(command, {
      encoding: "utf-8",
      env: mergedEnv,
      stdio,
      ...options
    });
  } catch (e) {
    ConsoleLogger.error(`An error occurred executing command: "${command}"`);
    ConsoleLogger.error(e);

    return (
      (e as any)?.message ?? "Exception occurred while processing request "
    );
  }
};

export const executeAsync = async (
  command: string,
  options?: ExecOptions,
  env?: Record<string, string>,
  stdio?: StdioOptions
): Promise<string | Buffer | undefined> => {
  return (await promisify(execute)(command, options, env, stdio)) as any;
};

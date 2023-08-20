/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConsoleLogger } from "@open-system/core-shared-utilities/logging";
import { ExecOptions, exec } from "child_process";
import { Readable } from "node:stream";
import { promisify } from "util";

export const execute = (
  command: string,
  options?: ExecOptions
): string | Buffer | Readable | undefined => {
  try {
    ConsoleLogger.info(`Executing command: "${command}"`);

    const result = exec(command, options);
    if (result?.stderr) {
      ConsoleLogger.error(`An error occurred executing command: "${command}"`);
      ConsoleLogger.error(result.stderr);

      return result.stderr;
    }

    return undefined;
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
  options?: ExecOptions
): Promise<string | Buffer | undefined> => {
  return (await promisify(execute)(command, options)) as any;
};

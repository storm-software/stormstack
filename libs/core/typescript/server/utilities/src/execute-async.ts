/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConsoleLogger } from "@open-system/core-shared-utilities";
import { ExecOptions, exec } from "child_process";
import { promisify } from "util";

export const executeAsync = async (
  command: string,
  options?: ExecOptions
): Promise<string | Buffer | undefined> => {
  try {
    ConsoleLogger.info(`Executing command: "${command}"`);

    const result = await promisify(exec)(command, options);
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecOptions, exec } from "child_process";
import { promisify } from "util";
import { ConsoleLogger } from "../logging/console-logger";

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

    return;
  } catch (e: any) {
    ConsoleLogger.error(`An error occurred executing command: "${command}"`);
    ConsoleLogger.error(e);

    return e?.message ?? "Exception occurred while processing request ";
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConsoleLogger } from "@stormstack/core-shared-logging";
import fs, { CopyOptionsSync, copyFileSync, copySync } from "fs-extra";

export const copyFiles = (
  from: string,
  to: string,
  options?: CopyOptionsSync
): string | Buffer | undefined => {
  try {
    ConsoleLogger.info(`Copying files from "${from}" to "${to}"`);

    copySync(from, to, options);

    return undefined;
  } catch (e) {
    ConsoleLogger.error(`An error occurred copying files`);
    ConsoleLogger.error(e);

    return (
      (e as any)?.message ?? "Exception occurred while processing request "
    );
  }
};

export const copyFile = (
  file: string,
  dest: string
): string | Buffer | undefined => {
  try {
    ConsoleLogger.info(`Copying file "${file}" to "${dest}"`);

    copyFileSync(file, dest, fs.constants.COPYFILE_FICLONE);

    return undefined;
  } catch (e) {
    ConsoleLogger.error(`An error occurred copying files`);
    ConsoleLogger.error(e);

    return (
      (e as any)?.message ?? "Exception occurred while processing request "
    );
  }
};

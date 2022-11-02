import chalk from "chalk";
import { exec } from "child_process";
import { promisify } from "util";

export const execute = async (command: string): Promise<string | undefined> => {
  try {
    printInfo(`Executing command: "${command}"`);

    const result = await promisify(exec)(command);
    if (result?.stderr) {
      printError(`An error occurred executing command: "${command}"`);
      printError(result.stderr);

      return result.stderr;
    }

    return undefined;
  } catch (e) {
    printError(`An error occurred executing command: "${command}"`);
    printError(e);

    return e?.message ?? "Exception occurred while processing request ";
  }
};

export const printInfo = (
  message: string,
  newLine = true,
  newLineAfter = true
) => {
  console.log(
    `${newLine ? "\n" : ""}${chalk.blue("i")} ${message}${
      newLineAfter ? "\n" : ""
    }`
  );
};

export const printSuccess = (
  message: string,
  newLine = true,
  newLineAfter = true
) => {
  console.log(
    `${newLine ? "\n" : ""}${chalk.green("✓")} ${message}${
      newLineAfter ? "\n" : ""
    }`
  );
};

export const printWarning = (
  message: string,
  newLine = true,
  newLineAfter = true
) => {
  console.warn(
    `${newLine ? "\n" : ""}${chalk.yellow("!")} ${message}${
      newLineAfter ? "\n" : ""
    }`
  );
};

export const printError = (
  message: string,
  newLine = true,
  newLineAfter = true
) => {
  console.error(
    `${newLine ? "\n" : ""}${chalk.red("!")} ${message}${
      newLineAfter ? "\n" : ""
    }`
  );
};

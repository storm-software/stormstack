import { ConfigurationError } from "@stormstack/core-shared-utilities";
import fs from "fs";
import z, { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { GUARD_FIELD_NAME, TRANSACTION_FIELD_NAME } from "../sdk";

const schema = z
  .object({
    guardFieldName: z.string().default(GUARD_FIELD_NAME),
    transactionFieldName: z.string().default(TRANSACTION_FIELD_NAME)
  })
  .strict();

export type ConfigType = z.infer<typeof schema>;

export let config: ConfigType = schema.parse({});

/**
 * Loads and validates CLI configuration file.
 * @returns
 */
export function loadConfig(filename: string) {
  try {
    const fileData = fs.readFileSync(filename, `utf-8`);
    const content = JSON.parse(fileData);
    config = schema.parse(content);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err?.code === `ENOENT`) {
      throw new ConfigurationError(
        filename,
        `Config file could not be found: ${filename}`
      );
    }
    if (err instanceof SyntaxError) {
      throw new ConfigurationError(
        filename,
        `Config is not a valid JSON file: ${filename}`
      );
    }
    if (err instanceof ZodError) {
      throw new ConfigurationError(
        fromZodError(err).message,
        `Config file ${filename} is not valid: ${fromZodError(err)}`
      );
    }
    throw new ConfigurationError(filename, `Error loading config: ${filename}`);
  }
}

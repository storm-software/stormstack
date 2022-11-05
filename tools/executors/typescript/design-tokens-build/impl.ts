import { ExecutorContext } from "@nrwl/devkit";
import fs from 'fs';
import { execute, printError, printInfo, printSuccess, ToTailwindParser } from "../utilities";
import { DesignTokensBuildExecutorSchema } from "./schema";

export default async function (
  options: DesignTokensBuildExecutorSchema,
  context: ExecutorContext
) {
  try {
    printInfo("Executing design-tokens-build executor...");
    printInfo(`Options: ${JSON.stringify(options, null, 2)}`);
    printInfo(`Current Directory: ${__dirname}`);

    const { tokensJson, clean } = options;

    printInfo(`Design Tokens JSON: ${tokensJson}`);

    printInfo("Starting design tokens build...");

    let result;
    if (clean) {
      printInfo("Cleaning previous design tokens build...");

      result = await execute(`rimraf ./dist/design-system/tokens -v !("package.json")`);
      if (result) {
        printError(result);
        return { success: false };
      }
    }

    printInfo("Loading design tokens file...");

    const dataArray = JSON.parse(fs.readFileSync(tokensJson, 'utf-8'));
    printInfo(dataArray);

    printInfo("Building latest design tokens...");

    result = await ToTailwindParser(dataArray , {
      formatName: 'camelCase',
      formatConfig: {
        objectName: 'extend',
        module: 'commonjs',
      },
    }, { _: null })
    // result = await execute(`style-dictionary build --config ${configFile}`);
    if (result) {
      printError(result);
      return { success: false };
    }

    printSuccess("Design tokens sync succeeded.");

    return { success: !result };
  } catch (e) {
    printError(
      `An error occurred syncing client API for ${context.projectName}`
    );
    printError(e);

    return { success: false };
  }
}

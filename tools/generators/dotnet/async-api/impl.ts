import Generator from "@asyncapi/generator";
//import { parse } from "@asyncapi/parser";
import { Tree } from "@nx/devkit";
//import { readFileSync } from "fs";
// import { ConsoleLogger } from "@open-system/core-utilities";
import { AsyncApiGeneratorSchema } from "./schema";

export default async function (
  host: Tree,
  {
    asyncapiFileDir,
    templateName,
    targetDir,
    ...options
  }: AsyncApiGeneratorSchema
) {
  console.log(`Generating async API code to ${targetDir}`);

  try {
    const generator = new Generator(templateName, targetDir, {
      templateParams: { ...options },
      forceWrite: true,
    });

    console.log(
      `Generator has been created, preparing to generate from file: ${asyncapiFileDir}`
    );

    try {
      /*console.log("Reading Async API File...");
      const asyncapiString = readFileSync(asyncapiFileDir, {
        encoding: "utf8",
      });
      console.log(asyncapiString);

      console.log("*** Parsing AsyncApi ***");
      const asyncapi = await parse(asyncapiString, {
        path: asyncapiFileDir,
      });
      console.log("*** Parsing AsyncApi Result ***");
      console.log(JSON.stringify(asyncapi));
      console.log("*** Parsing AsyncApi JSON ***");
      console.log(JSON.stringify(asyncapi.json()));
      console.log("*** Parsing AsyncApi Channels ***");
      console.log(JSON.stringify(asyncapi.channels()));
      console.log("*** Parsing AsyncApi allMessages ***");
      console.log(JSON.stringify(asyncapi.allMessages()));
      console.log("*** Parsing AsyncApi allSchemas ***");
      console.log(JSON.stringify(asyncapi.allSchemas()));*/

      await generator.generateFromFile(asyncapiFileDir);
    } catch (e) {
      console.error(`An error occurred building`);
      throw e;
    }

    console.log("Async API code generation process succeeded");

    return { success: true };
  } catch (e) {
    console.error(e);

    return { success: false };
  }
}

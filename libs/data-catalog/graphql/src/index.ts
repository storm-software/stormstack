import fs from "fs";

const artifactsFolder = "./__generated__";



fs.readdir(artifactsFolder, (err: any, files: any) => {
  let fileContent = "";
  files.forEach((file: any) => {
    const moduleName = file.replace(/.graphql.ts/, "");
    fileContent += `export * as ${moduleName} from "./__generated__/${moduleName}.graphql"\n`;
  });
  fs.writeFile(
    "./libs/graphql-artifacts/src/index.ts",
    fileContent,
    (err: any) => console.error(err)
  );
});

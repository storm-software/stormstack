import type { ConfigFile } from "@rtk-query/codegen-openapi";

const config: ConfigFile = {
  schemaFile: "../../../../config/src/contact.api-spec.json",
  apiFile: "./emptyApi.ts",
  apiImport: "emptySplitApi",
  outputFile: "./contactApi.ts",
  exportName: "contactApi",
  hooks: { queries: true, lazyQueries: true, mutations: true },
  tag: true,
};

export default config;

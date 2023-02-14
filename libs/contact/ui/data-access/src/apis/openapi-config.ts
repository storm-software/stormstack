import type { ConfigFile } from "@rtk-query/codegen-openapi";

const config: ConfigFile = {
  schemaFile: "../../../../config/src/contact.api-spec.json",
  apiFile: "../state/contactApi.ts",
  apiImport: "contactApi",
  outputFile: "./injectedContactApi.ts",
  exportName: "injectedContactApi",
  hooks: { queries: true, lazyQueries: true, mutations: true },
  tag: true,
};

export default config;

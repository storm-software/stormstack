import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./libs/**/typescript/server/graphql/src/modules/*/*.graphql",
  emitLegacyCommonJSImports: false,
  generates: {
    "./libs/user-management/typescript/server/graphql/src/modules/": {
      preset: "graphql-modules",
      plugins: [
        {
          add: {
            content: `/* eslint-disable */

import "graphql-import-node";
import { GraphQLServerContext } from "@open-system/core-server-graphql";
       `,
          },
        },
        "typescript",
        "typescript-resolvers",
        "typescript-validation-schema",
      ],
      hooks: { afterAllFileWrite: ["eslint --fix", "prettier --write"] },
      presetConfig: {
        baseTypesPath: "../__generated__/types.ts",
        filename: "__generated__/types.ts",
      },
      config: {
        immutableTypes: true,
        contextType: "GraphQLServerContext",
        scalars: {
          ID: "string",
          Time: "Date",
          Date: "Date",
          DateTime: "Date",
          TimeZone: "string",
          CountryCode: "string",
          EmailAddress: "string",
          PhoneNumber: "string",
          PostalCode: "string",
          URL: "string",
          Currency: "string",
          Duration: "string",
          IP: "string",
          Latitude: "string",
          Longitude: "string",
          Locale: "string",
          SemVer: "string",
          JWT: "string",
        },
        strictScalars: true,
        schema: "zod",
        scalarSchemas: {
          ID: "z.string()",
          Time: "z.date()",
          Date: "z.date()",
          DateTime: "z.date()",
          TimeZone: "z.string()",
          CountryCode: "z.string().length(2)",
          EmailAddress: "z.string().email()",
          PhoneNumber: "z.string().max(15)",
          PostalCode: "z.string().min(5).max(12)",
          URL: "z.string().url()",
          Currency: "z.string()",
          Duration: "z.string()",
          IP: "z.string().ip()",
          Latitude:
            "z.string().regex(/^[-+]?([1-8]?d(.d+)?|90(.0+)?),s*[-+]?(180(.0+)?|((1[0-7]d)|([1-9]?d))(.d+)?)$/)",
          Longitude:
            "z.string().regex(/^[-+]?([1-8]?d(.d+)?|90(.0+)?),s*[-+]?(180(.0+)?|((1[0-7]d)|([1-9]?d))(.d+)?)$/)",
          Locale: "z.string()",
          SemVer:
            "z.string().regex(/^([0-9]+).([0-9]+).([0-9]+)(?:-([0-9A-Za-z-]+(?:.[0-9A-Za-z-]+)*))?(?:+[0-9A-Za-z-]+)?$/",
          JWT: "z.string()",
        },
      },
    },
  },
};

export default config;

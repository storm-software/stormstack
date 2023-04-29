import { ExecutorContext } from "@nrwl/devkit";
// import { ConsoleLogger } from "@open-system/core-typescript-utilities";
//import { generateGraphQL } from "@confluentinc/ksqldb-graphql";
import { codegen } from "@graphql-codegen/core";
import * as schemaAstPlugin from "@graphql-codegen/schema-ast";
import * as timePlugin from "@graphql-codegen/time";
import { addResolversToSchema } from "@graphql-tools/schema";
import { buildKsqlDBGraphQL } from "@open-system/core-typescript-kafka";
import fs from "node:fs";
import path from "node:path";
import { ClientGraphQLSyncExecutorSchema } from "./schema";

export default async function (
  options: ClientGraphQLSyncExecutorSchema,
  context: ExecutorContext
) {
  try {
    console.info("Executing client-gql-sync (GraphQL) executor...");
    console.info(`Options: ${JSON.stringify(options, null, 2)}`);
    console.info(`Current Directory: ${__dirname}`);

    const { outputFileTypes, outputFileSchemaAst, outputFileClient } = options;

    const rootPath = context.root;
    /* const projectName = context.projectName
      ? context.projectName
      : `${domainName}-ui-data-access`;

    const sourceRoot =
      context.projectName && context.workspace.projects
        ? context.workspace.projects[context.projectName].sourceRoot
        : `libs/${domainName}/ui/data-access`;*/
    /*sourceRoot =
      sourceRoot.lastIndexOf("/src") > 0
        ? sourceRoot.substring(0, sourceRoot.lastIndexOf("/src"))
        : sourceRoot;
    if (!sourceRoot || sourceRoot.length <= 1) {
      console.error(`No sourceRoot could be found: "${sourceRoot}" `);
      return { success: false };
    }*/

    const {
      schemas,
      queryResolvers,
      subscriptionResolvers,
      mutationResolvers,
    } = await buildKsqlDBGraphQL({
      options: {
        hostname: process.env.ROOT_HOST,
        port: 8088,
      },
    });

    /*let config: Types.GenerateOptions = {
      documents: [],
      config: {},
      // used by a plugin internally, although the 'typescript' plugin currently
      // returns the string output, rather than writing to a file
      filename: outputFileClient,
      schema: schemas,
      plugins: [
        // Each plugin should be an object
        {
          time: {
            message:
              "// OpenSystem GraphQL Client \r\n// **Do not modify this file manually** \r\n// The schema generated on: ",
            format: "MM/DD/YYYY at HH:mm:ss",
          },
        },
        {
          typescriptReactApollo: {
            withMutationFn: true,
            withRefetchFn: true,
            documentMode: "external",
            importDocumentNodeExternallyFrom: "./schema.graphql",
            namingConvention: "change-case-all#PascalCase",
            reactApolloVersion: 3,
            withHooks: true,
            contextType: "ApolloClientContext",
            contextTypeRequired: true,
          },
        },
      ],
      pluginMap: {
        time: timePlugin,
        typescriptReactApollo: typescriptReactApolloPlugin,
      },
    };

    console.info("Generating GraphQL client code...");

    let output = await codegen(config);

    console.info(`Writing GraphQL client code to file ${outputFileClient}.`);

    fs.writeFileSync(
      path.join("C:\\Development\\open-system", outputFileClient),
      output,
      "utf8"
    );

    console.info("Client GraphQL sync succeeded.");*/

    const config = {
      documents: [],
      config: {
        namingConvention: "change-case-all#PascalCase",
      },
      // used by a plugin internally, although the 'typescript' plugin currently
      // returns the string output, rather than writing to a file
      filename: outputFileSchemaAst,
      schema: addResolversToSchema({
        schema: schemas,
        resolvers: {
          ...subscriptionResolvers,
          ...queryResolvers,
          ...mutationResolvers,
          KsqlProcessingLog: null,
        },
      }) as any,
      plugins: [
        // Each plugin should be an object
        {
          schemaAst: {
            includeDirectives: true,
            includeIntrospectionTypes: true,
            commentDescriptions: true,
            namingConvention: "change-case-all#PascalCase",
          },
        },
        {
          time: {
            message:
              "# OpenSystem GraphQL Types \r\n# **Do not modify this file manually** \r\n# The schema generated on: ",
            format: "MM/DD/YYYY at HH:mm:ss",
          },
        },
      ],
      pluginMap: {
        time: timePlugin,
        schemaAst: schemaAstPlugin,
      },
    };

    console.info("Generating GraphQL Schema AST code...");

    const output = await codegen(config);

    console.info(
      `Writing GraphQL Schema AST code to file ${outputFileSchemaAst}.`
    );

    fs.writeFileSync(
      path.join("C:\\Development\\open-system", outputFileSchemaAst),
      output,
      "utf8"
    );

    console.info("GraphQL Schema AST sync succeeded.");

    /*config = {
      documents: [],
      config: {},
      // used by a plugin internally, although the 'typescript' plugin currently
      // returns the string output, rather than writing to a file
      filename: outputFileTypes,
      schema: schemas,
      plugins: [
        // Each plugin should be an object
        {
          time: {
            message:
              "// OpenSystem GraphQL Types \r\n// **Do not modify this file manually** \r\n// The schema generated on: ",
            format: "MM/DD/YYYY at HH:mm:ss",
          },
        },
        {
          typescript: {
            namingConvention: "change-case-all#PascalCase",
            immutableTypes: true,
            addUnderscoreToArgsType: true,
            declarationKind: "interface",
            typesPrefix: "I",
            enumPrefix: false,
          },
        },
        {
          typescriptOperations: {
            namingConvention: "change-case-all#PascalCase",
          },
        },
      ],
      pluginMap: {
        time: timePlugin,
        typescript: typescriptPlugin,
        typescriptOperations: typescriptOperationsPlugin,
      },
    };

    console.info("Generating GraphQL Types code...");

    output = await codegen(config);

    console.info(`Writing GraphQL Types code to file ${outputFileTypes}.`);

    fs.writeFileSync(
      path.join("C:\\Development\\open-system", outputFileTypes),
      output,
      "utf8"
    );

    console.info("Client GraphQL sync succeeded.");*/

    return { success: true };
  } catch (e) {
    console.error(
      `An error occurred syncing client API for ${context.projectName}`
    );
    console.error(e);

    return { success: false };
  }
}

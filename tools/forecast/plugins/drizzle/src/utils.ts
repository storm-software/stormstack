import { ConsoleLogger } from "@stormstack/core-shared-logging";
import { ConfigurationError } from "@stormstack/core-shared-utilities";
import {
  ConnectorType,
  Context,
  TemplateDetails,
  TypescriptGenerator,
  getDataSourceProvider
} from "@stormstack/tools-forecast-codegen";
import { AstNode } from "langium";
import { DrizzlePluginOptions, VALID_CONNECTOR_TYPES } from "./types";

export const filterDrizzleTemplates = (
  options: DrizzlePluginOptions,
  context: Context,
  generator: TypescriptGenerator<DrizzlePluginOptions>,
  node: AstNode | null,
  templates: Array<TemplateDetails>
): Array<TemplateDetails> => {
  const dataSourceProvider = getDataSourceProvider(context.model);
  if (
    !(VALID_CONNECTOR_TYPES as string[]).includes(
      dataSourceProvider.toLowerCase()
    )
  ) {
    throw new ConfigurationError(
      `Invalid connector type: ${dataSourceProvider}. Valid connector types are: ${VALID_CONNECTOR_TYPES.join(
        ", "
      )}`
    );
  }

  if (options.skipDBConnectorFilter) {
    return templates;
  }

  ConsoleLogger.info(
    `Filtering template for ${dataSourceProvider} connector type`
  );

  switch (dataSourceProvider) {
    case ConnectorType.SQLITE:
      return templates.filter(
        template =>
          !template.name
            .toUpperCase()
            .includes(ConnectorType.POSTGRES.toUpperCase()) &&
          !template.name
            .toUpperCase()
            .includes(ConnectorType.POSTGRESQL.toUpperCase()) &&
          !template.name
            .toUpperCase()
            .includes(ConnectorType.MYSQL.toUpperCase())
      );

    case ConnectorType.MYSQL:
      return templates.filter(
        template => template =>
          !template.name
            .toUpperCase()
            .includes(ConnectorType.POSTGRES.toUpperCase()) &&
          !template.name
            .toUpperCase()
            .includes(ConnectorType.POSTGRESQL.toUpperCase()) &&
          !template.name
            .toUpperCase()
            .includes(ConnectorType.SQLITE.toUpperCase())
      );

    case ConnectorType.POSTGRES:
    case ConnectorType.POSTGRESQL:
      return templates.filter(
        template =>
          !template.name
            .toUpperCase()
            .includes(ConnectorType.SQLITE.toUpperCase()) &&
          !template.name
            .toUpperCase()
            .includes(ConnectorType.MYSQL.toUpperCase())
      );

    default:
      return templates;
  }
};

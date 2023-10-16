import {
  ConnectorType,
  TypescriptPluginOptions
} from "@stormstack/tools-forecast-codegen";

export const VALID_CONNECTOR_TYPES = [
  ConnectorType.SQLITE,
  ConnectorType.POSTGRES,
  ConnectorType.POSTGRESQL,
  ConnectorType.MYSQL
];

export type DrizzlePluginOptions = TypescriptPluginOptions & {
  /**
   * Should the UniqueIdGenerator from [@stormstack/core-shared-utilities](https://github.com/stormstack/stormstack/tree/main/libs/core/typescript/shared/utilities) be used to generate the default ID values for fields
   *
   * @default true
   */
  useUniqueIdGenerator?: boolean;

  /**
   * Should the DateTime class from [@stormstack/core-shared-utilities](https://github.com/stormstack/stormstack/tree/main/libs/core/typescript/shared/utilities) be used to type DateTime fields. Set to false if you want to use the Date class instead.
   *
   * @default true
   */
  useDateTime?: boolean;

  /**
   * Should the plugin skip filtering templates by the select database connector type (e.g. if sqlite is selected, any template with mysql, postgres, or postgresql in the name will be skipped)
   *
   * @default false
   */
  skipDBConnectorFilter?: boolean;
};

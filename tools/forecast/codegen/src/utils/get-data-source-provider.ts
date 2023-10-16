import { ConnectorType } from "@prisma/generator-helper";
import {
  DataSource,
  Model,
  isDataSource
} from "@stormstack/tools-forecast-language/ast";
import { getLiteral } from "@stormstack/tools-forecast-language/utils";

export const getDataSourceProvider = (model: Model): ConnectorType => {
  const dataSource = model.declarations.find(
    (declaration): declaration is DataSource => isDataSource(declaration)
  );

  return getLiteral<string>(
    dataSource?.fields.find(field => field.name === "provider")?.value
  ) as ConnectorType;
};

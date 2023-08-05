import { writeFileSync } from "fs";
import { GraphQLSchema, lexicographicSortSchema, printSchema } from "graphql";

export const schemaPrinter = (
  outputPath = "./schema.graphql",
  schema: GraphQLSchema
): string => {
  const schemaAsString = printSchema(lexicographicSortSchema(schema));

  writeFileSync(outputPath, schemaAsString);
  return schemaAsString;
};

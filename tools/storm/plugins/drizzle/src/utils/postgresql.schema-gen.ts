import {
  constantCase,
  lowerCaseFirst
} from "@stormstack/core-shared-utilities/common/string-fns";
import { DataModelField, isEnum } from "@stormstack/tools-storm-language/ast";
import { SchemaGenerator } from "./schema-gen";

export class PostgresqlSchemaGenerator extends SchemaGenerator {
  public override readonly tableMethod = "pgTable";
  public override readonly importStatement = `import { blob, integer, real, text, pgTable, relations } from "drizzle-orm/pg-core";`;

  public override getTableSchema(modelName: string) {
    return `export const ${lowerCaseFirst(modelName)} = ${
      this.tableMethod
    }("${lowerCaseFirst(modelName)}", `;
  }

  protected getColumnTypeSchema(field: DataModelField) {
    let schema: string;

    if (field.type.reference?.ref && isEnum(field.type.reference?.ref)) {
      schema = `text("${field.name}", { enum: [${field.type.reference.ref.fields
        .map(f => `${field.type.reference.ref.name}.${constantCase(f.name)}`)
        .join(", ")}] })`;
    } else {
      switch (field.type.type) {
        case "Int":
          schema = `integer("${field.name}", { mode: "number" })`;
          break;
        case "Float":
        case "Decimal":
          schema = `real("${field.name}")`;
          break;
        case "BigInt":
          schema = `blob("${field.name}", { mode: "bigint" })`;
          break;
        case "String":
          schema = `text("${field.name}")`;
          break;
        case "Boolean":
          schema = `integer("${field.name}", { mode: "boolean" })`;
          break;
        case "DateTime":
          schema = `integer("${field.name}", { mode: "timestamp" })`;
          break;
        case "Bytes":
          schema = `blob("${field.name}", { mode: "buffer" })`;
          break;
        default:
          schema = `text("${field.name}")`;
          break;
      }
    }

    if (field.type.array) {
      schema = `blob("${field.name}", { mode: "json" }).$type<${
        field.type.type === "Int"
          ? "number"
          : field.type.type === "BigInt"
          ? "bigint"
          : field.type.type === "Float"
          ? "number"
          : field.type.type === "Decimal"
          ? "number"
          : field.type.type === "String"
          ? "string"
          : field.type.type === "Boolean"
          ? "boolean"
          : field.type.type === "DateTime"
          ? "Date"
          : field.type.type === "Bytes"
          ? "Uint8Array"
          : "any"
      }[]>()`;
    }

    return schema;
  }
}

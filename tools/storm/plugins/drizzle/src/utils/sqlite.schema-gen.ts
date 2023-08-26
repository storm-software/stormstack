import {
  constantCase,
  lowerCaseFirst
} from "@open-system/core-shared-utilities/common/string-fns";
import {
  DataModel,
  DataModelField,
  isEnum
} from "@open-system/tools-storm-language/ast";
import { SchemaGenerator } from "./schema-gen";

export class SqliteSchemaGenerator extends SchemaGenerator {
  public override readonly tableMethod = "sqliteTable";
  public override readonly importStatement = `import { blob, integer, real, text, sqliteTable } from "drizzle-orm/sqlite-core";`;

  public override getTableSchema(modelName: string) {
    return `export const ${lowerCaseFirst(modelName)} = ${
      this.tableMethod
    }("${lowerCaseFirst(modelName)}", `;
  }

  public override getRelationsSchema(_model: DataModel): string {
    return "";
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

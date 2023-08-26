import {
  DataModelField,
  InvocationExpr,
  LiteralExpr,
  isEnum
} from "@open-system/tools-storm-language/ast";

export function makeFieldSchema(field: DataModelField) {
  let schema = makeDrizzleSchema(field);

  for (const attr of field.attributes) {
    switch (attr.decl.ref?.name) {
      case "@default":
        {
          if (attr.args.length > 0) {
            const functionName = (attr.args[0].value as InvocationExpr)
              ?.function?.ref?.name;
            const value = (attr.args[0].value as LiteralExpr)?.value;
            schema +=
              functionName && functionName.startsWith("now")
                ? ".$defaultFn(() => new Date(DateTime.current.epochMilliseconds))"
                : functionName && functionName.startsWith("cuid")
                ? ".$defaultFn(() => UniqueIdGenerator.generate())"
                : value
                ? `.default(${value})`
                : "";
          }
        }
        break;
      case "@unique":
        schema += ".unique()";
        break;
      case "@id":
        schema += ".primaryKey()";
        break;
      default:
        break;
    }
  }

  if (!field.type.optional) {
    schema += ".notNull()";
  }

  return schema;
}

function makeDrizzleSchema(field: DataModelField) {
  let schema: string;

  if (field.type.reference?.ref && isEnum(field.type.reference?.ref)) {
    schema = `text("${field.name}", { enum: [${field.type.reference.ref.fields
      .map(f => `${field.type.reference.ref.name}.${f.name}`)
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

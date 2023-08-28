import { getFileHeader } from "@open-system/tools-storm-schema/sdk/code-gen";
import { AUXILIARY_FIELDS } from "@open-system/tools-storm-schema/sdk/constants";
import type { DMMF as PrismaDMMF } from "@prisma/generator-helper";
import { join } from "path";
import { Project } from "ts-morph";

export const generateObjectSchema = (project: Project) => {
  const objectSchemaFields = generateObjectSchemaFields();
  const objectSchema = prepareObjectSchema(objectSchemaFields);
  const objectSchemaName = resolveObjectSchemaName();

  const filePath = join(
    Transformer.outputPath,
    `objects/${objectSchemaName}.schema.ts`
  );
  const content =
    `/* eslint-disable */\n${getFileHeader("Drizzle ORM")}\n` + objectSchema;
  project.createSourceFile(filePath, content, { overwrite: true });
  return `${objectSchemaName}.schema`;
};

const generateObjectSchemaFields = (fields: PrismaDMMF.SchemaArg[]) => {
  const objectSchemaFields = fields
    .filter(field => !AUXILIARY_FIELDS.includes(field.name))
    .map(field => generateObjectSchemaField(field))
    .flatMap(item => item)
    .map(item => {
      const [stringWithMainType, field, skipValidators] = item;

      const value = skipValidators
        ? stringWithMainType
        : generateFieldValidators(stringWithMainType, field);

      return value.trim();
    });
  return objectSchemaFields;
};

const generateFieldValidators = (
  stringWithMainType: string,
  field: PrismaDMMF.SchemaArg
) => {
  const { isRequired, isNullable } = field;

  if (!isRequired) {
    stringWithMainType += "?";
  }

  if (isNullable) {
    stringWithMainType += " | null;";
  }

  return stringWithMainType;
};

const prepareObjectSchema = (objectSchemaFields: string[]) => {
  const objectSchema = `${generateExportObjectSchemaStatement(
    addFinalWrappers({ zodStringFields: objectSchemaFields })
  )}\n`;

  const prismaImportStatement = generateImportPrismaStatement();

  const json = generateJsonSchemaImplementation();

  return `${generateObjectSchemaImportStatements()}${prismaImportStatement}${json}${objectSchema}`;
};

const generateObjectSchemaField = (
  field: PrismaDMMF.SchemaArg
): [string, PrismaDMMF.SchemaArg, boolean][] => {
  const lines = field.inputTypes;

  if (lines.length === 0) {
    return [];
  }

  let alternatives = lines.reduce<string[]>((result, inputType) => {
    if (inputType.type === "String") {
      result.push("string");
    } else if (inputType.type === "Int" || inputType.type === "Float") {
      result.push("number");
    } else if (inputType.type === "Decimal") {
      result.push("Decimal");
    } else if (inputType.type === "BigInt") {
      result.push("bigint");
    } else if (inputType.type === "Boolean") {
      result.push("boolean");
    } else if (inputType.type === "DateTime") {
      result.push("DateTime");
    } else if (inputType.type === "Bytes") {
      result.push("Uint8Array");
    } else if (inputType.type === "Json") {
      result.push("Record<string, any>");
    } else if (inputType.type === "True") {
      result.push("true");
    } else if (inputType.type === "Null") {
      result.push("null");
    } else {
      const isEnum = inputType.location === "enumTypes";
      const isFieldRef = inputType.location === "fieldRefTypes";

      if (
        // fieldRefTypes refer to other fields in the model and don't need to be generated as part of schema
        !isFieldRef &&
        ("prisma" || isEnum)
      ) {
        if (inputType.type !== name && typeof inputType.type === "string") {
          addSchemaImport(inputType.type);
        }

        result.push(generatePrismaStringLine(field, inputType, lines.length));
      }
    }

    return result;
  }, []);

  if (alternatives.length === 0) {
    return [];
  }

  if (alternatives.length > 1) {
    alternatives = alternatives.map(alter => alter.replace(".optional()", ""));
  }

  const fieldName = alternatives.some(alt => alt.includes(":"))
    ? ""
    : `  ${field.name}:`;

  const opt = !field.isRequired ? ".optional()" : "";

  let resString =
    alternatives.length === 1
      ? alternatives.join(",\r\n")
      : `z.union([${alternatives.join(",\r\n")}])${opt}`;

  if (field.isNullable) {
    resString += ".nullable()";
  }

  return [[`  ${fieldName} ${resString} `, field, true]];
};

const generateExportObjectSchemaStatement = (schema: string) => {
  let name = this.name;

  if (isAggregateInputType(name)) {
    name = `${name}Type`;
  }
  const outType = `z.ZodType<Purge<Prisma.${name}>>`;
  return `type SchemaType = ${outType};
export const ${this.name}ObjectSchema: SchemaType = ${schema} as SchemaType;`;
};

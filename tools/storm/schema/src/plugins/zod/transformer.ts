/* eslint-disable @typescript-eslint/ban-ts-comment */
import { upperCaseFirst } from "@open-system/core-shared-utilities/common/string-fns";
import { Model } from "@open-system/tools-storm-language/ast";
import { getPrismaVersion } from "@open-system/tools-storm-runtime";
import type { DMMF as PrismaDMMF } from "@prisma/generator-helper";
import path from "path";
import * as semver from "semver";
import { Project } from "ts-morph";
import { AUXILIARY_FIELDS, getPrismaClientImportSpec } from "../../sdk";
import {
    checkModelHasModelRelation,
    findModelByName,
    isAggregateInputType,
} from "../../sdk/dmmf-helpers";
import indentString from "../../sdk/utils";
import { AggregateOperationSupport, TransformerParams } from "./types";

export default class Transformer {
  name: string;
  fields: PrismaDMMF.SchemaArg[];
  schemaImports = new Set<string>();
  models: PrismaDMMF.Model[];
  modelOperations: PrismaDMMF.ModelMapping[];
  aggregateOperationSupport: AggregateOperationSupport;
  enumTypes: PrismaDMMF.SchemaEnum[];

  static enumNames: string[] = [];
  static rawOpsMap: { [name: string]: string } = {};
  static provider: string;
  private static outputPath = "./generated";
  private hasJson = false;
  private hasDecimal = false;
  private project: Project;
  private storm: Model;

  constructor(params: TransformerParams) {
    this.name = params.name ?? "";
    this.fields = params.fields ?? [];
    this.models = params.models ?? [];
    this.modelOperations = params.modelOperations ?? [];
    this.aggregateOperationSupport = params.aggregateOperationSupport ?? {};
    this.enumTypes = params.enumTypes ?? [];
    this.project = params.project;
    this.storm = params.storm;
  }

  static setOutputPath(outPath: string) {
    this.outputPath = outPath;
  }

  static getOutputPath() {
    return this.outputPath;
  }

  async generateEnumSchemas() {
    for (const enumType of this.enumTypes) {
      const { name, values } = enumType;
      const filteredValues = values.filter(v => !AUXILIARY_FIELDS.includes(v));

      const filePath = path.join(
        Transformer.outputPath,
        `enums/${name}.schema.ts`
      );
      const content = `/* eslint-disable */\n${this.generateImportZodStatement()}\n${this.generateExportSchemaStatement(
        `${name}`,
        `z.enum(${JSON.stringify(filteredValues)})`
      )}`;
      this.project.createSourceFile(filePath, content, { overwrite: true });
    }
    this.project.createSourceFile(
      path.join(Transformer.outputPath, `enums/index.ts`),
      this.enumTypes
        .map(enumType => `export * from './${enumType.name}.schema';`)
        .join("\n"),
      { overwrite: true }
    );
  }

  generateImportZodStatement() {
    return "import { z } from 'zod';\n";
  }

  generateExportSchemaStatement(name: string, schema: string) {
    return `export const ${name}Schema = ${schema}`;
  }

  generateObjectSchema() {
    const zodObjectSchemaFields = this.generateObjectSchemaFields();
    const objectSchema = this.prepareObjectSchema(zodObjectSchemaFields);
    const objectSchemaName = this.resolveObjectSchemaName();

    const filePath = path.join(
      Transformer.outputPath,
      `objects/${objectSchemaName}.schema.ts`
    );
    const content = "/* eslint-disable */\n" + objectSchema;
    this.project.createSourceFile(filePath, content, { overwrite: true });
    return `${objectSchemaName}.schema`;
  }

  generateObjectSchemaFields() {
    const zodObjectSchemaFields = this.fields
      .filter(field => !AUXILIARY_FIELDS.includes(field.name))
      .map(field => this.generateObjectSchemaField(field))
      .flatMap(item => item)
      .map(item => {
        const [zodStringWithMainType, field, skipValidators] = item;

        const value = skipValidators
          ? zodStringWithMainType
          : this.generateFieldValidators(zodStringWithMainType, field);

        return value.trim();
      });
    return zodObjectSchemaFields;
  }

  generateObjectSchemaField(
    field: PrismaDMMF.SchemaArg
  ): [string, PrismaDMMF.SchemaArg, boolean][] {
    const lines = field.inputTypes;

    if (lines.length === 0) {
      return [];
    }

    let alternatives = lines.reduce<string[]>((result, inputType) => {
      if (inputType.type === "String") {
        result.push(this.wrapWithZodValidators("z.string()", field, inputType));
      } else if (inputType.type === "Int" || inputType.type === "Float") {
        result.push(this.wrapWithZodValidators("z.number()", field, inputType));
      } else if (inputType.type === "Decimal") {
        this.hasDecimal = true;
        result.push(
          this.wrapWithZodValidators("DecimalSchema", field, inputType)
        );
      } else if (inputType.type === "BigInt") {
        result.push(this.wrapWithZodValidators("z.bigint()", field, inputType));
      } else if (inputType.type === "Boolean") {
        result.push(
          this.wrapWithZodValidators("z.boolean()", field, inputType)
        );
      } else if (inputType.type === "DateTime") {
        result.push(
          this.wrapWithZodValidators(
            ["z.date()", "z.string().datetime()"],
            field,
            inputType
          )
        );
      } else if (inputType.type === "Bytes") {
        result.push(
          this.wrapWithZodValidators(
            `z.instanceof(Uint8Array)`,
            field,
            inputType
          )
        );
      } else if (inputType.type === "Json") {
        this.hasJson = true;
        result.push(this.wrapWithZodValidators("jsonSchema", field, inputType));
      } else if (inputType.type === "True") {
        result.push(
          this.wrapWithZodValidators("z.literal(true)", field, inputType)
        );
      } else if (inputType.type === "Null") {
        result.push(this.wrapWithZodValidators("z.null()", field, inputType));
      } else {
        const isEnum = inputType.location === "enumTypes";
        const isFieldRef = inputType.location === "fieldRefTypes";

        if (
          // fieldRefTypes refer to other fields in the model and don't need to be generated as part of schema
          !isFieldRef &&
          ("prisma" || isEnum)
        ) {
          if (
            inputType.type !== this.name &&
            typeof inputType.type === "string"
          ) {
            this.addSchemaImport(inputType.type);
          }

          result.push(
            this.generatePrismaStringLine(field, inputType, lines.length)
          );
        }
      }

      return result;
    }, []);

    if (alternatives.length === 0) {
      return [];
    }

    if (alternatives.length > 1) {
      alternatives = alternatives.map(alter =>
        alter.replace(".optional()", "")
      );
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
  }

  wrapWithZodValidators(
    mainValidators: string | string[],
    field: PrismaDMMF.SchemaArg,
    inputType: PrismaDMMF.SchemaArgInputType
  ) {
    let line = "";

    const base = Array.isArray(mainValidators)
      ? mainValidators
      : [mainValidators];

    line += base
      .map(validator => {
        let r = validator;
        if (inputType.isList) {
          r += ".array()";
        }
        if (!field.isRequired) {
          r += ".optional()";
        }
        return r;
      })
      .join(", ");

    if (base.length > 1) {
      line = `z.union([${line}])`;
    }

    return line;
  }

  addSchemaImport(name: string) {
    this.schemaImports.add(name);
  }

  generatePrismaStringLine(
    field: PrismaDMMF.SchemaArg,
    inputType: PrismaDMMF.SchemaArgInputType,
    inputsLength: number
  ) {
    const isEnum = inputType.location === "enumTypes";

    const { isModelQueryType, modelName, queryName } =
      this.checkIsModelQueryType(inputType.type as string);

    const objectSchemaLine = isModelQueryType
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.resolveModelQuerySchemaName(modelName!, queryName!)
      : `${inputType.type}ObjectSchema`;
    const enumSchemaLine = `${inputType.type}Schema`;

    const schema =
      inputType.type === this.name
        ? objectSchemaLine
        : isEnum
        ? enumSchemaLine
        : objectSchemaLine;

    const arr = inputType.isList ? ".array()" : "";

    const opt = !field.isRequired ? ".optional()" : "";

    return inputsLength === 1
      ? `  ${field.name}: z.lazy(() => ${schema})${arr}${opt}`
      : `z.lazy(() => ${schema})${arr}${opt}`;
  }

  generateFieldValidators(
    zodStringWithMainType: string,
    field: PrismaDMMF.SchemaArg
  ) {
    const { isRequired, isNullable } = field;

    if (!isRequired) {
      zodStringWithMainType += ".optional()";
    }

    if (isNullable) {
      zodStringWithMainType += ".nullable()";
    }

    return zodStringWithMainType;
  }

  prepareObjectSchema(zodObjectSchemaFields: string[]) {
    const objectSchema = `${this.generateExportObjectSchemaStatement(
      this.addFinalWrappers({ zodStringFields: zodObjectSchemaFields })
    )}\n`;

    const prismaImportStatement = this.generateImportPrismaStatement();

    const json = this.generateJsonSchemaImplementation();

    return `${this.generateObjectSchemaImportStatements()}${prismaImportStatement}${json}${objectSchema}`;
  }

  generateExportObjectSchemaStatement(schema: string) {
    let name = this.name;

    if (isAggregateInputType(name)) {
      name = `${name}Type`;
    }
    const outType = `z.ZodType<Purge<Prisma.${name}>>`;
    return `type SchemaType = ${outType};
export const ${this.name}ObjectSchema: SchemaType = ${schema} as SchemaType;`;
  }

  addFinalWrappers({ zodStringFields }: { zodStringFields: string[] }) {
    const fields = [...zodStringFields];

    return this.wrapWithZodObject(fields) + ".strict()";
  }

  generateImportPrismaStatement() {
    const prismaClientImportPath = getPrismaClientImportSpec(
      this.storm,
      path.resolve(Transformer.outputPath, "./objects")
    );
    return `import type { Prisma } from '${prismaClientImportPath}';\n\n`;
  }

  generateJsonSchemaImplementation() {
    let jsonSchemaImplementation = "";

    if (this.hasJson) {
      jsonSchemaImplementation += `\n`;
      jsonSchemaImplementation += `const literalSchema = z.union([z.string(), z.number(), z.boolean()]);\n`;
      jsonSchemaImplementation += `const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>\n`;
      jsonSchemaImplementation += `  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])\n`;
      jsonSchemaImplementation += `);\n\n`;
    }

    return jsonSchemaImplementation;
  }

  generateObjectSchemaImportStatements() {
    let generatedImports = this.generateImportZodStatement();
    generatedImports += this.generateSchemaImports();
    generatedImports += this.generateCommonImport();
    generatedImports += "\n\n";
    return generatedImports;
  }

  generateSchemaImports() {
    return [...this.schemaImports]
      .map(name => {
        const { isModelQueryType, modelName } =
          this.checkIsModelQueryType(name);
        if (isModelQueryType) {
          return `import { ${modelName}InputSchema } from '../input/${modelName}Input.schema';`;
        } else if (Transformer.enumNames.includes(name)) {
          return `import { ${name}Schema } from '../enums/${name}.schema';`;
        } else {
          return `import { ${name}ObjectSchema } from './${name}.schema';`;
        }
      })
      .join("\n");
  }

  private generateCommonImport() {
    let r = `import type { Purge } from '../common';\n`;
    if (this.hasDecimal) {
      r += `import { DecimalSchema } from '../common';\n`;
    }
    r += "\n";
    return r;
  }

  checkIsModelQueryType(type: string) {
    const modelQueryTypeSuffixToQueryName: Record<string, string> = {
      FindManyArgs: "findMany",
    };
    for (const modelQueryType of ["FindManyArgs"]) {
      if (type.includes(modelQueryType)) {
        const modelQueryTypeSuffixIndex = type.indexOf(modelQueryType);
        return {
          isModelQueryType: true,
          modelName: type.substring(0, modelQueryTypeSuffixIndex),
          queryName: modelQueryTypeSuffixToQueryName[modelQueryType],
        };
      }
    }
    return { isModelQueryType: false };
  }

  resolveModelQuerySchemaName(modelName: string, queryName: string) {
    const modelNameCapitalized = upperCaseFirst(modelName);
    return `${modelNameCapitalized}InputSchema.${queryName}`;
  }

  wrapWithZodUnion(zodStringFields: string[]) {
    let wrapped = "";

    wrapped += "z.union([";
    wrapped += "\n";
    wrapped += "  " + zodStringFields.join(",");
    wrapped += "\n";
    wrapped += "])";
    return wrapped;
  }

  wrapWithZodObject(zodStringFields: string | string[]) {
    let wrapped = "";

    wrapped += "z.object({";
    wrapped += "\n";
    wrapped += "  " + zodStringFields;
    wrapped += "\n";
    wrapped += "})";
    return wrapped;
  }

  resolveObjectSchemaName() {
    return this.name;
  }

  async generateInputSchemas() {
    const globalExports: string[] = [];

    for (const modelOperation of this.modelOperations) {
      const {
        model: modelName,
        findUnique,
        findFirst,
        findMany,
        // @ts-expect-error
        createOne,
        createMany,
        // @ts-expect-error
        deleteOne,
        // @ts-expect-error
        updateOne,
        deleteMany,
        updateMany,
        // @ts-expect-error
        upsertOne,
        aggregate,
        groupBy,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } = modelOperation;

      globalExports.push(`export * from './${modelName}Input.schema'`);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const model = findModelByName(this.models, modelName)!;

      const {
        selectImport,
        includeImport,
        selectZodSchemaLineLazy,
        includeZodSchemaLineLazy,
      } = this.resolveSelectIncludeImportAndZodSchemaLine(model);

      let imports = [
        `import { z } from 'zod'`,
        this.generateImportPrismaStatement(),
        selectImport,
        includeImport,
      ];
      let codeBody = "";
      const operations: [string, string][] = [];

      if (findUnique) {
        imports.push(
          `import { ${modelName}WhereUniqueInputObjectSchema } from '../objects/${modelName}WhereUniqueInput.schema'`
        );
        codeBody += `findUnique: z.object({ ${selectZodSchemaLineLazy} ${includeZodSchemaLineLazy} where: ${modelName}WhereUniqueInputObjectSchema }),`;
        operations.push(["findUnique", modelName]);
      }

      if (findFirst) {
        imports.push(
          `import { ${modelName}WhereInputObjectSchema } from '../objects/${modelName}WhereInput.schema'`,
          `import { ${modelName}OrderByWithRelationInputObjectSchema } from '../objects/${modelName}OrderByWithRelationInput.schema'`,
          `import { ${modelName}WhereUniqueInputObjectSchema } from '../objects/${modelName}WhereUniqueInput.schema'`,
          `import { ${upperCaseFirst(
            modelName
          )}ScalarFieldEnumSchema } from '../enums/${upperCaseFirst(
            modelName
          )}ScalarFieldEnum.schema'`
        );
        codeBody += `findFirst: z.object({ ${selectZodSchemaLineLazy} ${includeZodSchemaLineLazy} where: ${modelName}WhereInputObjectSchema.optional(), orderBy: z.union([${modelName}OrderByWithRelationInputObjectSchema, ${modelName}OrderByWithRelationInputObjectSchema.array()]).optional(), cursor: ${modelName}WhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.array(${upperCaseFirst(
          modelName
        )}ScalarFieldEnumSchema).optional() }),`;
        operations.push(["findFirst", modelName]);
      }

      if (findMany) {
        imports.push(
          `import { ${modelName}WhereInputObjectSchema } from '../objects/${modelName}WhereInput.schema'`,
          `import { ${modelName}OrderByWithRelationInputObjectSchema } from '../objects/${modelName}OrderByWithRelationInput.schema'`,
          `import { ${modelName}WhereUniqueInputObjectSchema } from '../objects/${modelName}WhereUniqueInput.schema'`,
          `import { ${upperCaseFirst(
            modelName
          )}ScalarFieldEnumSchema } from '../enums/${upperCaseFirst(
            modelName
          )}ScalarFieldEnum.schema'`
        );
        codeBody += `findMany: z.object({ ${selectZodSchemaLineLazy} ${includeZodSchemaLineLazy} where: ${modelName}WhereInputObjectSchema.optional(), orderBy: z.union([${modelName}OrderByWithRelationInputObjectSchema, ${modelName}OrderByWithRelationInputObjectSchema.array()]).optional(), cursor: ${modelName}WhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.array(${upperCaseFirst(
          modelName
        )}ScalarFieldEnumSchema).optional()  }),`;
        operations.push(["findMany", modelName]);
      }

      if (createOne) {
        imports.push(
          `import { ${modelName}CreateInputObjectSchema } from '../objects/${modelName}CreateInput.schema'`,
          `import { ${modelName}UncheckedCreateInputObjectSchema } from '../objects/${modelName}UncheckedCreateInput.schema'`
        );
        codeBody += `create: z.object({ ${selectZodSchemaLineLazy} ${includeZodSchemaLineLazy} data: z.union([${modelName}CreateInputObjectSchema, ${modelName}UncheckedCreateInputObjectSchema]) }),`;
        operations.push(["create", modelName]);
      }

      if (createMany) {
        imports.push(
          `import { ${modelName}CreateManyInputObjectSchema } from '../objects/${modelName}CreateManyInput.schema'`
        );
        codeBody += `createMany: z.object({ data: z.union([${modelName}CreateManyInputObjectSchema, z.array(${modelName}CreateManyInputObjectSchema)]) }),`;
        operations.push(["createMany", modelName]);
      }

      if (deleteOne) {
        imports.push(
          `import { ${modelName}WhereUniqueInputObjectSchema } from '../objects/${modelName}WhereUniqueInput.schema'`
        );
        codeBody += `'delete': z.object({ ${selectZodSchemaLineLazy} ${includeZodSchemaLineLazy} where: ${modelName}WhereUniqueInputObjectSchema  }),`;
        operations.push(["delete", modelName]);
      }

      if (deleteMany) {
        imports.push(
          `import { ${modelName}WhereInputObjectSchema } from '../objects/${modelName}WhereInput.schema'`
        );
        codeBody += `deleteMany: z.object({ where: ${modelName}WhereInputObjectSchema.optional()  }),`;
        operations.push(["deleteMany", modelName]);
      }

      if (updateOne) {
        imports.push(
          `import { ${modelName}UpdateInputObjectSchema } from '../objects/${modelName}UpdateInput.schema'`,
          `import { ${modelName}UncheckedUpdateInputObjectSchema } from '../objects/${modelName}UncheckedUpdateInput.schema'`,
          `import { ${modelName}WhereUniqueInputObjectSchema } from '../objects/${modelName}WhereUniqueInput.schema'`
        );
        codeBody += `update: z.object({ ${selectZodSchemaLineLazy} ${includeZodSchemaLineLazy} data: z.union([${modelName}UpdateInputObjectSchema, ${modelName}UncheckedUpdateInputObjectSchema]), where: ${modelName}WhereUniqueInputObjectSchema  }),`;
        operations.push(["update", modelName]);
      }

      if (updateMany) {
        imports.push(
          `import { ${modelName}UpdateManyMutationInputObjectSchema } from '../objects/${modelName}UpdateManyMutationInput.schema'`,
          `import { ${modelName}UncheckedUpdateManyInputObjectSchema } from '../objects/${modelName}UncheckedUpdateManyInput.schema'`,
          `import { ${modelName}WhereInputObjectSchema } from '../objects/${modelName}WhereInput.schema'`
        );
        codeBody += `updateMany: z.object({ data: z.union([${modelName}UpdateManyMutationInputObjectSchema, ${modelName}UncheckedUpdateManyInputObjectSchema]), where: ${modelName}WhereInputObjectSchema.optional()  }),`;
        operations.push(["updateMany", modelName]);
      }

      if (upsertOne) {
        imports.push(
          `import { ${modelName}WhereUniqueInputObjectSchema } from '../objects/${modelName}WhereUniqueInput.schema'`,
          `import { ${modelName}CreateInputObjectSchema } from '../objects/${modelName}CreateInput.schema'`,
          `import { ${modelName}UncheckedCreateInputObjectSchema } from '../objects/${modelName}UncheckedCreateInput.schema'`,
          `import { ${modelName}UpdateInputObjectSchema } from '../objects/${modelName}UpdateInput.schema'`,
          `import { ${modelName}UncheckedUpdateInputObjectSchema } from '../objects/${modelName}UncheckedUpdateInput.schema'`
        );
        codeBody += `upsert: z.object({ ${selectZodSchemaLineLazy} ${includeZodSchemaLineLazy} where: ${modelName}WhereUniqueInputObjectSchema, create: z.union([${modelName}CreateInputObjectSchema, ${modelName}UncheckedCreateInputObjectSchema]), update: z.union([${modelName}UpdateInputObjectSchema, ${modelName}UncheckedUpdateInputObjectSchema]) }),`;
        operations.push(["upsert", modelName]);
      }

      const aggregateOperations = [];

      // DMMF messed up the model name casing used in the aggregate operations,
      // AND the casing behavior varies from version to version -_-||
      const modelNameCap = upperCaseFirst(modelName);
      const prismaVersion = getPrismaVersion();

      if (this.aggregateOperationSupport[modelNameCap]?.count) {
        imports.push(
          `import { ${modelNameCap}CountAggregateInputObjectSchema } from '../objects/${modelNameCap}CountAggregateInput.schema'`
        );
        aggregateOperations.push(
          `_count: z.union([ z.literal(true), ${modelNameCap}CountAggregateInputObjectSchema ]).optional()`
        );
      }
      if (this.aggregateOperationSupport[modelNameCap]?.min) {
        imports.push(
          `import { ${modelNameCap}MinAggregateInputObjectSchema } from '../objects/${modelNameCap}MinAggregateInput.schema'`
        );
        aggregateOperations.push(
          `_min: ${modelNameCap}MinAggregateInputObjectSchema.optional()`
        );
      }
      if (this.aggregateOperationSupport[modelNameCap]?.max) {
        imports.push(
          `import { ${modelNameCap}MaxAggregateInputObjectSchema } from '../objects/${modelNameCap}MaxAggregateInput.schema'`
        );
        aggregateOperations.push(
          `_max: ${modelNameCap}MaxAggregateInputObjectSchema.optional()`
        );
      }
      if (this.aggregateOperationSupport[modelNameCap]?.avg) {
        imports.push(
          `import { ${modelNameCap}AvgAggregateInputObjectSchema } from '../objects/${modelNameCap}AvgAggregateInput.schema'`
        );
        aggregateOperations.push(
          `_avg: ${modelNameCap}AvgAggregateInputObjectSchema.optional()`
        );
      }
      if (this.aggregateOperationSupport[modelNameCap]?.sum) {
        imports.push(
          `import { ${modelNameCap}SumAggregateInputObjectSchema } from '../objects/${modelNameCap}SumAggregateInput.schema'`
        );
        aggregateOperations.push(
          `_sum: ${modelNameCap}SumAggregateInputObjectSchema.optional()`
        );
      }

      if (aggregate) {
        imports.push(
          `import { ${modelName}WhereInputObjectSchema } from '../objects/${modelName}WhereInput.schema'`,
          `import { ${modelName}OrderByWithRelationInputObjectSchema } from '../objects/${modelName}OrderByWithRelationInput.schema'`,
          `import { ${modelName}WhereUniqueInputObjectSchema } from '../objects/${modelName}WhereUniqueInput.schema'`
        );

        codeBody += `aggregate: z.object({ where: ${modelName}WhereInputObjectSchema.optional(), orderBy: z.union([${modelName}OrderByWithRelationInputObjectSchema, ${modelName}OrderByWithRelationInputObjectSchema.array()]).optional(), cursor: ${modelName}WhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), ${aggregateOperations.join(
          ", "
        )} }),`;
        operations.push(["aggregate", modelNameCap]);
      }

      if (groupBy) {
        imports.push(
          `import { ${modelName}WhereInputObjectSchema } from '../objects/${modelName}WhereInput.schema'`,
          `import { ${modelName}OrderByWithAggregationInputObjectSchema } from '../objects/${modelName}OrderByWithAggregationInput.schema'`,
          `import { ${modelName}ScalarWhereWithAggregatesInputObjectSchema } from '../objects/${modelName}ScalarWhereWithAggregatesInput.schema'`,
          `import { ${modelNameCap}ScalarFieldEnumSchema } from '../enums/${modelNameCap}ScalarFieldEnum.schema'`
        );
        codeBody += `groupBy: z.object({ where: ${modelName}WhereInputObjectSchema.optional(), orderBy: z.union([${modelName}OrderByWithAggregationInputObjectSchema, ${modelName}OrderByWithAggregationInputObjectSchema.array()]).optional(), having: ${modelName}ScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(${upperCaseFirst(
          modelName
        )}ScalarFieldEnumSchema), ${aggregateOperations.join(", ")} }),`;

        if (prismaVersion && semver.gte(prismaVersion, "5.0.0")) {
          // Prisma V5 has a different casing for this guy ...
          operations.push(["groupBy", modelName]);
        } else {
          operations.push(["groupBy", modelNameCap]);
        }
      }

      imports = [...new Set(imports)];

      const filePath = path.join(
        Transformer.outputPath,
        `input/${modelName}Input.schema.ts`
      );
      const content = `
            /* eslint-disable */
            ${imports.join(";\n")}

            type ${modelName}InputSchemaType = {
${operations
  .map(op =>
    indentString(
      `${op[0]}: z.ZodType<Prisma.${op[1]}${upperCaseFirst(op[0])}Args>`,
      4
    )
  )
  .join(",\n")}
            }

            export const ${modelName}InputSchema = {
            ${indentString(codeBody, 4)}
            } as ${modelName}InputSchemaType;
                        `;

      this.project.createSourceFile(filePath, content, { overwrite: true });
    }

    const indexFilePath = path.join(Transformer.outputPath, "input/index.ts");
    const indexContent = `
/* eslint-disable */
${globalExports.join(";\n")}
`;
    this.project.createSourceFile(indexFilePath, indexContent, {
      overwrite: true,
    });
  }

  generateImportStatements(imports: (string | undefined)[]) {
    let generatedImports = this.generateImportZodStatement();
    generatedImports +=
      imports?.filter(importItem => !!importItem).join(";\r\n") ?? "";
    generatedImports += "\n\n";
    return generatedImports;
  }

  resolveSelectIncludeImportAndZodSchemaLine(model: PrismaDMMF.Model) {
    const { name: modelName } = model;

    const hasRelationToAnotherModel = checkModelHasModelRelation(model);

    const selectImport = `import { ${modelName}SelectObjectSchema } from '../objects/${modelName}Select.schema'`;

    const includeImport = hasRelationToAnotherModel
      ? `import { ${modelName}IncludeObjectSchema } from '../objects/${modelName}Include.schema'`
      : "";

    let selectZodSchemaLine = "";
    let includeZodSchemaLine = "";
    let selectZodSchemaLineLazy = "";
    let includeZodSchemaLineLazy = "";

    const zodSelectObjectSchema = `${modelName}SelectObjectSchema.optional()`;
    selectZodSchemaLine = `select: ${zodSelectObjectSchema},`;
    selectZodSchemaLineLazy = `select: z.lazy(() => ${zodSelectObjectSchema}),`;

    if (hasRelationToAnotherModel) {
      const zodIncludeObjectSchema = `${modelName}IncludeObjectSchema.optional()`;
      includeZodSchemaLine = `include: ${zodIncludeObjectSchema},`;
      includeZodSchemaLineLazy = `include: z.lazy(() => ${zodIncludeObjectSchema}),`;
    }

    return {
      selectImport,
      includeImport,
      selectZodSchemaLine,
      includeZodSchemaLine,
      selectZodSchemaLineLazy,
      includeZodSchemaLineLazy,
    };
  }
}

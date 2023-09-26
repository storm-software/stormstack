/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { DMMF as PrismaDMMF } from "@prisma/generator-helper";
import {
  constantCase,
  kebabCase
} from "@stormstack/core-shared-utilities/common/string-fns";
import { Model } from "@stormstack/tools-storm-language/ast";
import {
  AUXILIARY_FIELDS,
  getFileHeader
} from "@stormstack/tools-storm-schema/sdk";
import { join } from "path";
import { Project } from "ts-morph";
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
  private static outputPath = "./__generated__/drizzle";
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

      const filePath = join(
        Transformer.outputPath,
        `enums/${kebabCase(name)}.ts`
      );
      const content = `/* eslint-disable */\n${getFileHeader(
        "Drizzle ORM"
      )}\n${this.generateExportStatement(
        `${name}`,
        ` {
${filteredValues.map(v => `${constantCase(v)}: "${v}"`).join(", \n")}
}`
      )}`;
      this.project.createSourceFile(filePath, content, { overwrite: true });
    }
    this.project.createSourceFile(
      join(Transformer.outputPath, `enums/index.ts`),
      this.enumTypes
        .map(enumType => `export * from './${kebabCase(enumType.name)}';`)
        .join("\n"),
      { overwrite: true }
    );
  }

  generateExportStatement(name: string, schema: string) {
    return `export const ${name} = ${schema}`;
  }

  /*async generateRepositories() {
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
        groupBy
      } = modelOperation;

      globalExports.push(`export * from './${modelName}.repository'`);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const model = findModelByName(this.models, modelName)!;

      const {
        selectImport,
        includeImport,
        selectZodSchemaLineLazy,
        includeZodSchemaLineLazy
      } = this.resolveSelectIncludeImportAndZodSchemaLine(model);

      let imports = [
        `import { z } from 'zod'`,
        this.generateImportPrismaStatement(),
        selectImport,
        includeImport
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

      const filePath = join(
        Transformer.outputPath,
        `input/${modelName}Input.schema.ts`
      );
      const content = `
            ${getFileHeader("Drizzle ORM")}
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

    const indexFilePath = join(Transformer.outputPath, "input/index.ts");
    const indexContent = `
${getFileHeader("Drizzle ORM")}
${globalExports.join(";\n")}
`;
    this.project.createSourceFile(indexFilePath, indexContent, {
      overwrite: true
    });
  }*/
}

import {
  execute,
  executeAsync
} from "@open-system/core-server-utilities/execute";
import { exists } from "@open-system/core-server-utilities/exists";
import { findFilePath } from "@open-system/core-server-utilities/file-path-fns";
import { ConsoleLogger } from "@open-system/core-shared-utilities/logging";
import {
  ArrayExpr,
  AstNode,
  AttributeArg,
  DataModel,
  DataModelAttribute,
  DataModelField,
  DataModelFieldAttribute,
  DataModelFieldType,
  DataSource,
  Enum,
  EnumField,
  Expression,
  GeneratorDecl,
  InvocationExpr,
  LiteralExpr,
  Model,
  isArrayExpr,
  isInvocationExpr,
  isLiteralExpr,
  isReferenceExpr
} from "@open-system/tools-storm-language/ast";
import {
  PRISMA_MINIMUM_VERSION,
  getPrismaVersion
} from "@open-system/tools-storm-runtime";
import { mkdirSync, readFileSync } from "fs";
import { writeFile } from "fs/promises";
import { lt } from "semver";
import { name } from ".";
import { getStringLiteral } from "../../language-server/validator/utils";
import {
  GUARD_FIELD_NAME,
  PluginError,
  PluginOptions,
  TRANSACTION_FIELD_NAME,
  analyzePolicies,
  getDMMF,
  getDataModels,
  getFileHeader,
  getLiteral,
  getLiteralArray,
  resolvePath,
  resolved
} from "../../sdk";
import {
  ModelFieldType,
  AttributeArg as PrismaAttributeArg,
  AttributeArgValue as PrismaAttributeArgValue,
  ContainerDeclaration as PrismaContainerDeclaration,
  Model as PrismaDataModel,
  DataSourceUrl as PrismaDataSourceUrl,
  Enum as PrismaEnum,
  FieldAttribute as PrismaFieldAttribute,
  FieldReference as PrismaFieldReference,
  FieldReferenceArg as PrismaFieldReferenceArg,
  FunctionCall as PrismaFunctionCall,
  FunctionCallArg as PrismaFunctionCallArg,
  PrismaModel,
  ContainerAttribute as PrismaModelAttribute,
  PassThroughAttribute as PrismaPassThroughAttribute,
  SimpleField
} from "./prisma-builder";
import StormCodeGenerator from "./storm-code-generator";

const MODEL_PASSTHROUGH_ATTR = "@@prisma.passthrough";
const FIELD_PASSTHROUGH_ATTR = "@prisma.passthrough";

/**
 * Generates Prisma schema file
 */
export default class PrismaSchemaGenerator {
  private stormGenerator: StormCodeGenerator = new StormCodeGenerator();

  private readonly FILE_HEADER = getFileHeader("Prisma Schema");

  async generate(
    model: Model,
    options: PluginOptions,
    config?: Record<string, string>
  ) {
    const warnings: string[] = [];

    const prismaVersion = getPrismaVersion();
    if (prismaVersion && lt(prismaVersion, PRISMA_MINIMUM_VERSION)) {
      warnings.push(
        `Storm requires Prisma version "${PRISMA_MINIMUM_VERSION}" or higher. Detected version is "${prismaVersion}".`
      );
    }

    const prisma = new PrismaModel();

    for (const decl of model.declarations) {
      switch (decl.$type) {
        case DataSource:
          this.generateDataSource(prisma, decl as DataSource);
          break;

        case Enum:
          this.generateEnum(prisma, decl as Enum);
          break;

        case DataModel:
          this.generateModel(prisma, decl as DataModel, config);
          break;

        case GeneratorDecl:
          this.generateGenerator(prisma, decl as GeneratorDecl);
          break;
      }
    }

    let outFile = (options.output as string) ?? "./prisma/schema.prisma";
    outFile = resolvePath(outFile, options);

    if (!exists(findFilePath(outFile))) {
      mkdirSync(findFilePath(outFile), { recursive: true });
    }
    await writeFile(outFile, this.FILE_HEADER + prisma.toString());

    if (options.format === true) {
      try {
        // run 'prisma format'
        await executeAsync(`npx prisma format --schema ${outFile}`);
      } catch {
        warnings.push(`Failed to format Prisma schema file`);
      }
    }

    const generateClient = options.generateClient !== false;

    if (generateClient) {
      try {
        // run 'prisma generate'
        execute(`npx prisma generate --schema ${outFile}`, {}, {}, "ignore");
      } catch {
        await this.trackPrismaSchemaError(outFile);
        try {
          // run 'prisma generate' again with output to the console
          execute(`npx prisma generate --schema ${outFile}  --ignore`);
        } catch {
          // noop
          ConsoleLogger.info("Prisma Generate - Catching error");
        }
        throw new PluginError(name, `Failed to run "prisma generate"`);
      }
    }

    ConsoleLogger.success("Prisma Generate run successfully!");

    return warnings;
  }

  private async trackPrismaSchemaError(schema: string) {
    try {
      await getDMMF({ datamodel: readFileSync(schema, "utf-8") });
    } catch (err) {
      if (err instanceof Error) {
        ConsoleLogger.info(err.message);
      }
    }
  }

  public generateDataSource(prisma: PrismaModel, dataSource: DataSource) {
    let provider: string | undefined = undefined;
    let url: PrismaDataSourceUrl | undefined = undefined;
    let directUrl: PrismaDataSourceUrl | undefined = undefined;
    let shadowDatabaseUrl: PrismaDataSourceUrl | undefined = undefined;
    const restFields: SimpleField[] = [];

    for (const f of dataSource.fields) {
      switch (f.name) {
        case "provider": {
          if (this.isStringLiteral(f.value)) {
            provider = f.value.value as string;
          } else {
            throw new PluginError(
              name,
              "Datasource provider must be set to a string"
            );
          }
          break;
        }

        case "url": {
          const r = this.extractDataSourceUrl(f.value);
          if (!r) {
            throw new PluginError(name, "Invalid value for datasource url");
          }
          url = r;
          break;
        }

        case "directUrl": {
          const r = this.extractDataSourceUrl(f.value);
          if (!r) {
            throw new PluginError(name, "Invalid value for directUrl");
          }
          directUrl = r;
          break;
        }

        case "shadowDatabaseUrl": {
          const r = this.extractDataSourceUrl(f.value);
          if (!r) {
            throw new PluginError(name, "Invalid value for shadowDatabaseUrl");
          }
          shadowDatabaseUrl = r;
          break;
        }

        default: {
          // rest fields
          const value = isArrayExpr(f.value)
            ? getLiteralArray(f.value)
            : getLiteral(f.value);
          if (value === undefined) {
            throw new PluginError(
              name,
              `Invalid value for datasource field ${f.name}: value must be a string or an array of strings`
            );
          } else {
            restFields.push({ name: f.name, value });
          }
          break;
        }
      }
    }

    if (!provider) {
      throw new PluginError(name, 'Datasource is missing "provider" field');
    }
    if (!url) {
      throw new PluginError(name, 'Datasource is missing "url" field');
    }

    prisma.addDataSource(
      dataSource.name,
      provider,
      url,
      directUrl,
      shadowDatabaseUrl,
      restFields
    );
  }

  public extractDataSourceUrl(
    fieldValue: LiteralExpr | InvocationExpr | ArrayExpr
  ) {
    if (this.isStringLiteral(fieldValue)) {
      return new PrismaDataSourceUrl(fieldValue.value as string, false);
    } else if (
      isInvocationExpr(fieldValue) &&
      fieldValue.function.ref?.name === "env" &&
      fieldValue.args.length === 1 &&
      this.isStringLiteral(fieldValue.args[0].value)
    ) {
      return new PrismaDataSourceUrl(
        fieldValue.args[0].value.value as string,
        true
      );
    } else {
      return null;
    }
  }

  public generateGenerator(prisma: PrismaModel, decl: GeneratorDecl) {
    const generator = prisma.addGenerator(
      decl.name,
      decl.fields.map(f => {
        const value = isArrayExpr(f.value)
          ? getLiteralArray(f.value)
          : getLiteral(f.value);
        return { name: f.name, value };
      })
    );

    // deal with configuring PrismaClient preview features
    const provider = generator.fields.find(f => f.name === "provider");
    if (provider?.value === "prisma-client-js") {
      const prismaVersion = getPrismaVersion();
      if (prismaVersion) {
        const previewFeatures =
          generator.fields.find(f => f.name === "previewFeatures")?.value ?? [];

        if (!Array.isArray(previewFeatures)) {
          throw new PluginError(
            name,
            'option "previewFeatures" must be an array'
          );
        }

        if (lt(prismaVersion, "5.0.0")) {
          // extendedWhereUnique feature is opt-in pre V5
          if (!previewFeatures.includes("extendedWhereUnique")) {
            previewFeatures.push("extendedWhereUnique");
          }
        }

        if (previewFeatures.length > 0) {
          const curr = generator.fields.find(f => f.name === "previewFeatures");
          if (!curr) {
            generator.fields.push({
              name: "previewFeatures",
              value: previewFeatures
            });
          }
        }
      }
    }
  }

  public generateModel(
    prisma: PrismaModel,
    decl: DataModel,
    config?: Record<string, string>
  ) {
    const model = decl.isView
      ? prisma.addView(decl.name)
      : prisma.addModel(decl.name);
    for (const field of decl.fields) {
      this.generateModelField(model, field);
    }

    if (this.shouldGenerateAuxFields(decl)) {
      // generate auxiliary fields for policy check

      // add an "storm_guard" field for dealing with boolean conditions
      const guardField = model.addField(GUARD_FIELD_NAME, "Boolean", [
        new PrismaFieldAttribute("@default", [
          new PrismaAttributeArg(
            undefined,
            new PrismaAttributeArgValue("Boolean", true)
          )
        ])
      ]);

      if (
        config?.guardFieldName &&
        config?.guardFieldName !== GUARD_FIELD_NAME
      ) {
        // generate a @map to rename field in the database
        guardField.addAttribute("@map", [
          new PrismaAttributeArg(
            undefined,
            new PrismaAttributeArgValue("String", config.guardFieldName)
          )
        ]);
      }

      // add an "storm_transaction" field for tracking records created/updated with nested writes
      const transactionField = model.addField(
        TRANSACTION_FIELD_NAME,
        "String?"
      );

      // create an index for "storm_transaction" field
      model.addAttribute("@@index", [
        new PrismaAttributeArg(
          undefined,
          new PrismaAttributeArgValue("Array", [
            new PrismaAttributeArgValue(
              "FieldReference",
              TRANSACTION_FIELD_NAME
            )
          ])
        )
      ]);

      if (
        config?.transactionFieldName &&
        config?.transactionFieldName !== TRANSACTION_FIELD_NAME
      ) {
        // generate a @map to rename field in the database
        transactionField.addAttribute("@map", [
          new PrismaAttributeArg(
            undefined,
            new PrismaAttributeArgValue("String", config.transactionFieldName)
          )
        ]);
      }
    }

    for (const attr of decl.attributes.filter(attr =>
      this.isPrismaAttribute(attr)
    )) {
      this.generateContainerAttribute(model, attr);
    }

    decl.attributes
      .filter(attr => attr.decl.ref && !this.isPrismaAttribute(attr))
      .forEach(attr =>
        model.addComment("/// " + this.stormGenerator.generateAttribute(attr))
      );

    // user defined comments pass-through
    decl.comments.forEach(c => model.addComment(c));
  }

  private shouldGenerateAuxFields(decl: DataModel) {
    if (decl.isView) {
      return false;
    }

    const { allowAll, denyAll, hasFieldValidation } = analyzePolicies(decl);

    if (!allowAll && !denyAll) {
      // has policy conditions
      return true;
    }

    if (hasFieldValidation) {
      return true;
    }

    // check if the model is related by other models, if so
    // aux fields are needed for nested queries
    const root = decl.$container;
    for (const model of getDataModels(root)) {
      if (model === decl) {
        continue;
      }
      for (const field of model.fields) {
        if (field.type.reference?.ref === decl) {
          // found a relation with policies
          const otherPolicies = analyzePolicies(model);
          if (
            (!otherPolicies.allowAll && !otherPolicies.denyAll) ||
            otherPolicies.hasFieldValidation
          ) {
            // the relating side has policies
            return true;
          }
        }
      }
    }

    return false;
  }

  public isPrismaAttribute(attr: DataModelAttribute | DataModelFieldAttribute) {
    if (!attr.decl.ref) {
      return false;
    }
    const attrDecl = resolved(attr.decl);
    return (
      !!attrDecl.attributes.find(a => a.decl.ref?.name === "@@@prisma") ||
      // the special pass-through attribute
      attrDecl.name === MODEL_PASSTHROUGH_ATTR ||
      attrDecl.name === FIELD_PASSTHROUGH_ATTR
    );
  }

  private getUnsupportedFieldType(fieldType: DataModelFieldType) {
    if (fieldType.unsupported) {
      const value = getStringLiteral(fieldType.unsupported.value);
      if (value) {
        return `Unsupported("${value}")`;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  public generateModelField(model: PrismaDataModel, field: DataModelField) {
    const fieldType =
      field.type.type ||
      field.type.reference?.ref?.name ||
      this.getUnsupportedFieldType(field.type);
    if (!fieldType) {
      throw new PluginError(
        name,
        `Field type is not resolved: ${field.$container.name}.${field.name}`
      );
    }

    const type = new ModelFieldType(
      fieldType,
      field.type.array,
      field.type.optional
    );

    const attributes = field.attributes
      .filter(attr => this.isPrismaAttribute(attr))
      .map(attr => this.makeFieldAttribute(attr));

    const nonPrismaAttributes = field.attributes.filter(
      attr => attr.decl.ref && !this.isPrismaAttribute(attr)
    );

    const documentations = nonPrismaAttributes.map(
      attr => "/// " + this.stormGenerator.generateAttribute(attr)
    );

    const result = model.addField(field.name, type, attributes, documentations);

    // user defined comments pass-through
    field.comments.forEach(c => result.addComment(c));
  }

  private makeFieldAttribute(attr: DataModelFieldAttribute) {
    const attrName = resolved(attr.decl).name;
    if (attrName === FIELD_PASSTHROUGH_ATTR) {
      const text = getLiteral<string>(attr.args[0].value);
      if (text) {
        return new PrismaPassThroughAttribute(text);
      } else {
        throw new PluginError(
          name,
          `Invalid arguments for ${FIELD_PASSTHROUGH_ATTR} attribute`
        );
      }
    } else {
      return new PrismaFieldAttribute(
        attrName,
        attr.args.map(arg => this.makeAttributeArg(arg))
      );
    }
  }

  private makeAttributeArg(arg: AttributeArg): PrismaAttributeArg {
    return new PrismaAttributeArg(
      arg.name,
      this.makeAttributeArgValue(arg.value)
    );
  }

  private makeAttributeArgValue(node: Expression): PrismaAttributeArgValue {
    if (isLiteralExpr(node)) {
      switch (typeof node.value) {
        case "string":
          return new PrismaAttributeArgValue("String", node.value);
        case "number":
          return new PrismaAttributeArgValue("Number", node.value);
        case "boolean":
          return new PrismaAttributeArgValue("Boolean", node.value);
        default:
          throw new PluginError(
            name,
            `Unexpected literal type: ${typeof node.value}`
          );
      }
    } else if (isArrayExpr(node)) {
      return new PrismaAttributeArgValue(
        "Array",
        new Array(...node.items.map(item => this.makeAttributeArgValue(item)))
      );
    } else if (isReferenceExpr(node)) {
      return new PrismaAttributeArgValue(
        "FieldReference",
        new PrismaFieldReference(
          resolved(node.target).name,
          node.args.map(arg => new PrismaFieldReferenceArg(arg.name, arg.value))
        )
      );
    } else if (isInvocationExpr(node)) {
      // invocation
      return new PrismaAttributeArgValue(
        "FunctionCall",
        this.makeFunctionCall(node)
      );
    } else {
      throw new PluginError(
        name,
        `Unsupported attribute argument expression type: ${node.$type}`
      );
    }
  }

  makeFunctionCall(node: InvocationExpr): PrismaFunctionCall {
    return new PrismaFunctionCall(
      resolved(node.function).name,
      node.args.map(arg => {
        if (!isLiteralExpr(arg.value)) {
          throw new PluginError(name, "Function call argument must be literal");
        }
        return new PrismaFunctionCallArg(arg.name, arg.value.value);
      })
    );
  }

  public generateContainerAttribute(
    container: PrismaContainerDeclaration,
    attr: DataModelAttribute
  ) {
    const attrName = resolved(attr.decl).name;
    if (attrName === MODEL_PASSTHROUGH_ATTR) {
      const text = getLiteral<string>(attr.args[0].value);
      if (text) {
        container.attributes.push(new PrismaPassThroughAttribute(text));
      }
    } else {
      container.attributes.push(
        new PrismaModelAttribute(
          attrName,
          attr.args.map(arg => this.makeAttributeArg(arg))
        )
      );
    }
  }

  public generateEnum(prisma: PrismaModel, decl: Enum) {
    const _enum = prisma.addEnum(decl.name);

    for (const field of decl.fields) {
      this.generateEnumField(_enum, field);
    }

    for (const attr of decl.attributes.filter(attr =>
      this.isPrismaAttribute(attr)
    )) {
      this.generateContainerAttribute(_enum, attr);
    }

    decl.attributes
      .filter(attr => attr.decl.ref && !this.isPrismaAttribute(attr))
      .forEach(attr =>
        _enum.addComment("/// " + this.stormGenerator.generateAttribute(attr))
      );

    // user defined comments pass-through
    decl.comments.forEach(c => _enum.addComment(c));
  }

  public generateEnumField(_enum: PrismaEnum, field: EnumField) {
    const attributes = field.attributes
      .filter(attr => this.isPrismaAttribute(attr))
      .map(attr => this.makeFieldAttribute(attr));

    const nonPrismaAttributes = field.attributes.filter(
      attr => attr.decl.ref && !this.isPrismaAttribute(attr)
    );

    const documentations = nonPrismaAttributes.map(
      attr => "/// " + this.stormGenerator.generateAttribute(attr)
    );
    _enum.addField(field.name, attributes, documentations);
  }

  private isStringLiteral(node: AstNode): node is LiteralExpr {
    return isLiteralExpr(node) && typeof node.value === "string";
  }
}

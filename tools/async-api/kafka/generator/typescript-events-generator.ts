import {
  ConstrainedEnumModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedUnionModel,
  FormatHelpers,
  InputMetaModel,
  Logger,
  MetaModel,
  RenderOutput,
  SplitOptions,
  TypeMapping,
  TypeScriptExportType,
  constrainMetaModel,
  defaultGeneratorOptions,
  split
} from "@asyncapi/modelina";
import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from "../constrainer/EnumConstrainer";
import { defaultModelNameConstraints } from "../constrainer/ModelNameConstrainer";
import { defaultPropertyKeyConstraints } from "../constrainer/PropertyKeyConstrainer";
import {
  TS_DEFAULT_PRESET,
  TypeScriptPreset
} from "../presets/typescript-preset";
import { ClassRenderer } from "../renderers/ClassRenderer";
import { EnumRenderer } from "../renderers/EnumRenderer";
import { InterfaceRenderer } from "../renderers/InterfaceRenderer";
import { TypeRenderer } from "../renderers/TypeRenderer";
import { mergePartialAndDefault } from "../utils/common";
import { DeepPartial, TypeScriptEventsOptions } from "../utils/types";
import { AbstractGenerator } from "./abstract-generator";
import { TypeScriptDependencyManager } from "./typescript-dependency-manager";

export type TypeScriptTypeMapping = TypeMapping<
  TypeScriptEventsOptions,
  TypeScriptDependencyManager
>;

export interface TypeScriptEventsRenderCompleteModelOptions {
  exportType: TypeScriptExportType;
}

export const TypeScriptDefaultTypeMapping: TypeScriptTypeMapping = {
  Object({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Reference({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Any(): string {
    return "any";
  },
  Float(): string {
    return "number";
  },
  Integer(): string {
    return "number";
  },
  String(): string {
    return "string";
  },
  Boolean(): string {
    return "boolean";
  },
  Tuple({ constrainedModel }): string {
    const tupleTypes = constrainedModel.tuple.map(constrainedType => {
      return constrainedType.value.type;
    });
    return `[${tupleTypes.join(", ")}]`;
  },
  Array({ constrainedModel }): string {
    let arrayType = constrainedModel.valueModel.type;
    if (constrainedModel.valueModel instanceof ConstrainedUnionModel) {
      arrayType = `(${arrayType})`;
    }
    return `${arrayType}[]`;
  },
  Enum({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Union({ constrainedModel }): string {
    const unionTypes = constrainedModel.union.map(unionModel => {
      return unionModel.type;
    });
    return unionTypes.join(" | ");
  },
  Dictionary({ constrainedModel, options }): string {
    let keyType;
    //There is some restrictions on what can be used as keys for dictionaries.
    if (constrainedModel.key instanceof ConstrainedUnionModel) {
      Logger.error(
        "Key for dictionary is not allowed to be union type, falling back to any model."
      );
      keyType = "any";
    } else {
      keyType = constrainedModel.key.type;
    }
    switch (options.mapType) {
      case "indexedObject":
        return `{ [name: ${keyType}]: ${constrainedModel.value.type} }`;
      case "record":
        return `Record<${keyType}, ${constrainedModel.value.type}>`;
      default:
      case "map":
        return `Map<${keyType}, ${constrainedModel.value.type}>`;
    }
  }
};

export const TypeScriptDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints()
};

/**
 * Generator for TypeScript
 */
export class TypeScriptEventsGenerator extends AbstractGenerator<
  TypeScriptEventsOptions,
  TypeScriptEventsRenderCompleteModelOptions
> {
  public static defaultOptions: TypeScriptEventsOptions<TypeScriptPreset> = {
    ...defaultGeneratorOptions,
    renderTypes: true,
    modelType: "class",
    enumType: "enum",
    mapType: "record",
    version: 1,
    defaultPreset: TS_DEFAULT_PRESET as any,
    typeMapping: TypeScriptDefaultTypeMapping,
    constraints: TypeScriptDefaultConstraints,
    moduleSystem: "ESM",
    // Temporarily set
    dependencyManager: () => {
      return new TypeScriptDependencyManager({
        ...TypeScriptEventsGenerator.defaultOptions,
        dependencyManager: null
      });
    }
  };

  public static defaultCompleteModelOptions: TypeScriptEventsRenderCompleteModelOptions =
    {
      exportType: "default"
    };

  /**
   * Returns the TypeScript options by merging custom options with default ones.
   */
  public static getOptions(
    options?: DeepPartial<TypeScriptEventsOptions>
  ): TypeScriptEventsOptions {
    const optionsToUse = mergePartialAndDefault(
      TypeScriptEventsGenerator.defaultOptions,
      options
    ) as TypeScriptEventsOptions;

    if (!options.dependencyManager) {
      optionsToUse.dependencyManager = () => {
        return new TypeScriptDependencyManager(optionsToUse);
      };
    }

    return optionsToUse;
  }

  constructor(options?: DeepPartial<TypeScriptEventsOptions>) {
    const realizedOptions = TypeScriptEventsGenerator.getOptions(options);
    super("TypeScript", realizedOptions);
  }

  /**
   * Wrapper to get an instance of the dependency manager
   */
  public getDependencyManager(
    options: TypeScriptEventsOptions
  ): TypeScriptDependencyManager {
    return (
      this.getDependencyManagerInstance(options) ??
      new TypeScriptDependencyManager(options)
    );
  }

  splitMetaModel(model: MetaModel): MetaModel[] {
    //These are the models that we have separate renderers for
    const metaModelsToSplit: SplitOptions = {
      splitEnum: true,
      splitObject: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(
    model: MetaModel,
    options: DeepPartial<TypeScriptEventsOptions>
  ): ConstrainedMetaModel {
    const optionsToUse = TypeScriptEventsGenerator.getOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    return constrainMetaModel<
      TypeScriptEventsOptions,
      TypeScriptDependencyManager
    >(this.options.typeMapping, this.options.constraints, {
      metaModel: model,
      dependencyManager: dependencyManagerToUse,
      options: { ...this.options },
      constrainedName: "" //This is just a placeholder, it will be constrained within the function
    });
  }

  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   *
   * @param model
   * @param inputModel
   * @param options
   */
  async renderCompleteModel(
    model: ConstrainedMetaModel,
    inputModel: InputMetaModel,
    completeModelOptions: Partial<TypeScriptEventsRenderCompleteModelOptions>,
    options: DeepPartial<TypeScriptEventsOptions>
  ): Promise<RenderOutput> {
    const completeModelOptionsToUse = mergePartialAndDefault(
      TypeScriptEventsGenerator.defaultCompleteModelOptions,
      completeModelOptions
    ) as TypeScriptEventsRenderCompleteModelOptions;

    const optionsToUse = TypeScriptEventsGenerator.getOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = new TypeScriptDependencyManager(
      optionsToUse
    );
    const outputModel = await this.render(model, inputModel, {
      ...optionsToUse,
      dependencyManager: dependencyManagerToUse
    });
    const modelDependencies = model.getNearestDependencies();

    //Create the correct model dependency imports
    const modelDependencyImports = modelDependencies.map(model => {
      return new TypeScriptDependencyManager(
        optionsToUse
      ).renderCompleteModelDependencies(
        model,
        completeModelOptionsToUse.exportType
      );
    });

    const modelExport = dependencyManagerToUse.renderExportByName(
      model.name,
      completeModelOptionsToUse.exportType
    );

    const modelCode = `${outputModel.result}\n${modelExport}`;

    const outputContent = `${[
      ...modelDependencyImports,
      ...outputModel.dependencies
    ].join("\n")}
${modelCode}`;

    return RenderOutput.toRenderOutput({
      result: outputContent,
      renderedName: outputModel.renderedName,
      dependencies: outputModel.dependencies
    });
  }

  /**
   * Render any ConstrainedMetaModel to code based on the type
   */
  render(
    model: ConstrainedMetaModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<TypeScriptEventsOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = TypeScriptEventsGenerator.getOptions({
      ...this.options,
      ...options
    });
    if (model instanceof ConstrainedObjectModel) {
      if (this.options.modelType === "interface") {
        return this.renderInterface(model, inputModel, optionsToUse);
      }
      return this.renderClass(model, inputModel, optionsToUse);
    } else if (model instanceof ConstrainedEnumModel) {
      return this.renderEnum(model, inputModel, optionsToUse);
    }
    return this.renderType(model, inputModel, optionsToUse);
  }

  async renderClass(
    model: ConstrainedObjectModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<TypeScriptEventsOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = TypeScriptEventsGenerator.getOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = new TypeScriptDependencyManager(
      optionsToUse
    );
    dependencyManagerToUse.addTypeScriptDependency(
      "{ IIntegrationEvent, IntegrationEvent }",
      "@stormstack/core-server-services"
    );

    const schemaName = `${
      model.name.charAt(0).toLowerCase() +
      model.name.substring(1, model.name.length)
    }Schema`;

    dependencyManagerToUse.addTypeScriptDependency(
      `{ ${schemaName} }`,
      `./${FormatHelpers.toParamCase(model.name)}.schema`
    );

    const presets = this.getPresets("class");
    const renderer = new ClassRenderer(
      optionsToUse,
      this,
      presets,
      model,
      inputModel,
      dependencyManagerToUse
    );
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({
      result,
      renderedName: model.name,
      dependencies: dependencyManagerToUse.dependencies
    });
  }

  async renderInterface(
    model: ConstrainedObjectModel,
    inputModel: InputMetaModel,
    options?: Partial<TypeScriptEventsOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = TypeScriptEventsGenerator.getOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets("interface");
    const renderer = new InterfaceRenderer(
      optionsToUse,
      this,
      presets,
      model,
      inputModel,
      dependencyManagerToUse
    );
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({
      result,
      renderedName: model.name,
      dependencies: dependencyManagerToUse.dependencies
    });
  }

  async renderEnum(
    model: ConstrainedEnumModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<TypeScriptEventsOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = TypeScriptEventsGenerator.getOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets("enum");
    const renderer = new EnumRenderer(
      optionsToUse,
      this,
      presets,
      model,
      inputModel,
      dependencyManagerToUse
    );
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({
      result,
      renderedName: model.name,
      dependencies: dependencyManagerToUse.dependencies
    });
  }

  async renderType(
    model: ConstrainedMetaModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<TypeScriptEventsOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = TypeScriptEventsGenerator.getOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets("type");
    const renderer = new TypeRenderer(
      optionsToUse,
      this,
      presets,
      model,
      inputModel,
      dependencyManagerToUse
    );
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({
      result,
      renderedName: model.name,
      dependencies: dependencyManagerToUse.dependencies
    });
  }
}

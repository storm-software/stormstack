import {
  ConstrainedMetaModel,
  IndentationTypes,
  InputMetaModel,
  InputProcessor,
  MetaModel,
  OutputModel,
  Preset,
  RenderOutput,
} from "@asyncapi/modelina";
import { isFunction as isFunctionExternal } from "radash";
import {
  CommonGeneratorOptions,
  DeepPartial,
  TypeScriptEventsOptions,
  isPresetWithOptions,
} from "../utils";
import { AbstractDependencyManager } from "./abstract-dependency-manager";
import { TypeScriptDependencyManager } from "./typescript-dependency-manager";

export const defaultGeneratorOptions: CommonGeneratorOptions = {
  indentation: {
    type: IndentationTypes.SPACES,
    size: 2,
  },
};

/**
 * Abstract generator which must be implemented by each language
 */
export abstract class AbstractGenerator<
  TOptions extends TypeScriptEventsOptions = TypeScriptEventsOptions,
  RenderCompleteModelOptions = any
> {
  constructor(
    public readonly languageName: string,
    public readonly options: TOptions
  ) {}

  public abstract render(
    model: MetaModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<TOptions>
  ): Promise<RenderOutput>;
  public abstract renderCompleteModel(
    model: MetaModel,
    inputModel: InputMetaModel,
    completeOptions: Partial<RenderCompleteModelOptions>,
    options?: DeepPartial<TOptions>
  ): Promise<RenderOutput>;
  public abstract constrainToMetaModel(
    model: MetaModel,
    options: DeepPartial<TOptions>
  ): ConstrainedMetaModel;
  public abstract getDependencyManager(
    options: TOptions
  ): AbstractDependencyManager;
  public abstract splitMetaModel(model: MetaModel): MetaModel[];

  public process(input: Record<string, unknown>): Promise<InputMetaModel> {
    return InputProcessor.processor.process(
      input,
      this.options.processorOptions
    );
  }

  /**
   * This function returns an instance of the dependency manager which is either a factory or an instance.
   */
  protected getDependencyManagerInstance(
    options: TOptions
  ): TypeScriptDependencyManager {
    if (!options.dependencyManager) {
      throw new Error(
        "Internal error, could not find dependency manager instance"
      );
    }

    let dependencyManager;
    if (isFunction(options.dependencyManager)) {
      dependencyManager = options.dependencyManager();
    } else {
      dependencyManager = options.dependencyManager;
    }

    if (!dependencyManager) {
      dependencyManager = new TypeScriptDependencyManager(options);
    }

    options.dependencyManager = dependencyManager;
    return dependencyManager;
  }

  /**
   * Generates the full output of a model, instead of a scattered model.
   *
   * OutputModels result is no longer the model itself, but including package, package dependencies and model dependencies.
   *
   */
  public async generateCompleteModels(
    input: any | InputMetaModel,
    completeOptions: Partial<RenderCompleteModelOptions>
  ): Promise<OutputModel[]> {
    const inputModel = await this.processInput(input);
    const renders = Object.values(inputModel.models).map(async model => {
      const dependencyManager = this.getDependencyManager(this.options);
      const constrainedModel = this.constrainToMetaModel(model, {
        dependencyManager,
      } as DeepPartial<TOptions>);
      const renderedOutput = await this.renderCompleteModel(
        constrainedModel,
        inputModel,
        completeOptions,
        { dependencyManager } as DeepPartial<TOptions>
      );
      return OutputModel.toOutputModel({
        result: renderedOutput.result,
        modelName: renderedOutput.renderedName,
        dependencies: renderedOutput.dependencies,
        model: constrainedModel,
        inputModel,
      });
    });
    return Promise.all(renders);
  }

  /**
   * Generates a scattered model where dependencies and rendered results are separated.
   */
  public async generate(input: any | InputMetaModel): Promise<OutputModel[]> {
    const inputModel = await this.processInput(input);
    const renders = Object.values(inputModel.models).map(async model => {
      const dependencyManager = this.getDependencyManager(this.options);
      const constrainedModel = this.constrainToMetaModel(model, {
        dependencyManager,
      } as DeepPartial<TOptions>);
      const renderedOutput = await this.render(constrainedModel, inputModel, {
        dependencyManager,
      } as DeepPartial<TOptions>);
      return OutputModel.toOutputModel({
        result: renderedOutput.result,
        modelName: renderedOutput.renderedName,
        dependencies: renderedOutput.dependencies,
        model: constrainedModel,
        inputModel,
      });
    });
    return Promise.all(renders);
  }

  /**
   * Process any of the input formats to the appropriate InputMetaModel type and split out the meta models
   * based on the requirements of the generators
   *
   * @param input
   */
  protected async processInput(
    input: any | InputMetaModel
  ): Promise<InputMetaModel> {
    const rawInputModel =
      input instanceof InputMetaModel ? input : await this.process(input);

    //Split out the models based on the language specific requirements of which models is rendered separately
    const splitOutModels: { [key: string]: MetaModel } = {};
    for (const model of Object.values(rawInputModel.models)) {
      const splitModels = this.splitMetaModel(model);
      for (const splitModel of splitModels) {
        splitOutModels[splitModel.name] = splitModel;
      }
    }
    rawInputModel.models = splitOutModels;
    return rawInputModel;
  }

  /**
   * Get all presets (default and custom ones from options) for a given preset type (class, enum, etc).
   */
  protected getPresets(presetType: string): Array<[Preset, unknown]> {
    const filteredPresets: Array<[Preset, unknown]> = [];

    const defaultPreset = this.options.defaultPreset;
    if (defaultPreset !== undefined) {
      filteredPresets.push([defaultPreset[String(presetType)], this.options]);
    }

    const presets = this.options.presets || [];
    for (const p of presets) {
      if (isPresetWithOptions(p)) {
        const preset = p.preset[String(presetType)];
        if (preset) {
          filteredPresets.push([preset, p.options]);
        }
      } else {
        const preset = p[String(presetType)];
        if (preset) {
          filteredPresets.push([preset, undefined]);
        }
      }
    }

    return filteredPresets;
  }
}

export const isFunction = (
  obj: unknown
): obj is (params?: unknown) => unknown => {
  try {
    return (
      obj instanceof Function ||
      typeof obj === "function" ||
      isFunctionExternal(obj)
    );
  } catch (e) {
    return false;
  }
};

/* eslint-disable @typescript-eslint/ban-types */
import {
  IndentationTypes,
  Preset,
  Presets,
  ProcessorOptions,
  TypeScriptOptions,
} from "@asyncapi/modelina";
import { AbstractDependencyManager } from "../generator/abstract-dependency-manager";
import { TypeScriptDependencyManager } from "../generator/typescript-dependency-manager";

export type TypeScriptEventsOptions<P extends Preset = Preset> =
  TypeScriptOptions &
    CommonGeneratorOptions<P, TypeScriptDependencyManager> & {
      version?: number;
    };

export interface CommonGeneratorOptions<
  P extends Preset = Preset,
  DependencyManager extends AbstractDependencyManager = AbstractDependencyManager
> {
  indentation?: {
    type: IndentationTypes;
    size: number;
  };
  defaultPreset?: P;
  presets?: Presets<P>;
  processorOptions?: ProcessorOptions;
  /**
   * This dependency manager type serves two functions.
   * 1. It can be used to provide a factory for generate functions
   * 2. It can be used to provide a single instance of a dependency manager, to add all dependencies together
   *
   * This depends on context and where it's used.
   */
  dependencyManager?: (() => DependencyManager) | DependencyManager;
}

/**
 * Deep partial type that does NOT partial function arguments.
 */
export type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  InputMetaModel,
  Preset,
} from "@asyncapi/modelina";
import { TypeScriptEventsGenerator } from "../generator/typescript-events-generator";
import {
  ClassRenderer,
  TS_DEFAULT_CLASS_PRESET,
} from "../renderers/ClassRenderer";
import {
  EnumRenderer,
  TS_DEFAULT_ENUM_PRESET,
} from "../renderers/EnumRenderer";
import {
  InterfaceRenderer,
  TS_DEFAULT_INTERFACE_PRESET,
} from "../renderers/InterfaceRenderer";
import {
  TS_DEFAULT_TYPE_PRESET,
  TypeRenderer,
} from "../renderers/TypeRenderer";
import { AbstractRenderer } from "../renderers/abstract-renderer";
import { TypeScriptEventsOptions } from "../utils";

export interface PresetArgs<
  R extends AbstractRenderer,
  O,
  M extends ConstrainedMetaModel
> {
  model: M;
  inputModel: InputMetaModel;
  renderer: R;
  options: O;
  content: string;
}
export interface CommonPreset<
  R extends AbstractRenderer,
  O,
  M extends ConstrainedMetaModel
> {
  self?: (args: PresetArgs<R, O, M>) => Promise<string> | string;
  additionalContent?: (args: PresetArgs<R, O, M>) => Promise<string> | string;
}

export declare enum PropertyType {
  property = 0,
  additionalProperty = 1,
  patternProperties = 2,
}
export interface PropertyArgs {
  property: ConstrainedObjectPropertyModel;
}
export interface ClassPreset<
  R extends AbstractRenderer<
    TypeScriptEventsOptions,
    TypeScriptEventsGenerator,
    ConstrainedObjectModel
  >,
  O extends Partial<TypeScriptEventsOptions> = Partial<TypeScriptEventsOptions>
> extends CommonPreset<R, O, ConstrainedObjectModel> {
  ctor?: (
    args: PresetArgs<R, O, ConstrainedObjectModel>
  ) => Promise<string> | string;
  property?: (
    args: PresetArgs<R, O, ConstrainedObjectModel> & PropertyArgs
  ) => Promise<string> | string;
  getter?: (
    args: PresetArgs<R, O, ConstrainedObjectModel> & PropertyArgs
  ) => Promise<string> | string;
  setter?: (
    args: PresetArgs<R, O, ConstrainedObjectModel> & PropertyArgs
  ) => Promise<string> | string;
}

export interface InterfacePreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedObjectModel> {
  property?: (
    args: PresetArgs<R, O, ConstrainedObjectModel> & PropertyArgs
  ) => Promise<string> | string;
}

export interface EnumArgs {
  item: ConstrainedEnumValueModel;
}
export interface EnumPreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedEnumModel> {
  item?: (args: PresetArgs<R, O, ConstrainedEnumModel> & EnumArgs) => string;
}

export type ClassPresetType = ClassPreset<
  ClassRenderer,
  Partial<TypeScriptEventsOptions>
>;
export type InterfacePresetType = InterfacePreset<
  InterfaceRenderer,
  Partial<TypeScriptEventsOptions>
>;
export type EnumPresetType = EnumPreset<
  EnumRenderer,
  Partial<TypeScriptEventsOptions>
>;
export type TypePresetType = CommonPreset<
  TypeRenderer,
  Partial<TypeScriptEventsOptions>,
  ConstrainedMetaModel
>;

export type TypeScriptPreset = Preset<{
  class: ClassPresetType;
  interface: InterfacePresetType;
  enum: EnumPresetType;
  type: TypePresetType;
}>;

export const TS_DEFAULT_PRESET: TypeScriptPreset = {
  class: TS_DEFAULT_CLASS_PRESET,
  interface: TS_DEFAULT_INTERFACE_PRESET,
  enum: TS_DEFAULT_ENUM_PRESET,
  type: TS_DEFAULT_TYPE_PRESET,
};

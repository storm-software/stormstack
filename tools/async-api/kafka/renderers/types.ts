import {
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  InputMetaModel,
  PropertyArgs,
} from "@asyncapi/modelina";
import { TypeScriptRenderer } from "./typescript-renderer";

export interface PresetArgs<
  R extends TypeScriptRenderer,
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
  R extends TypeScriptRenderer,
  O,
  M extends ConstrainedMetaModel
> {
  self?: (args: PresetArgs<R, O, M>) => Promise<string> | string;
  additionalContent?: (args: PresetArgs<R, O, M>) => Promise<string> | string;
}

export interface ClassPreset<R extends TypeScriptRenderer, O>
  extends CommonPreset<R, O, ConstrainedObjectModel> {
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

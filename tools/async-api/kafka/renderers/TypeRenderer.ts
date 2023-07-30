import { TypePresetType } from "../presets/typescript-preset";
import { TypeScriptRenderer } from "./typescript-renderer";

export class TypeRenderer extends TypeScriptRenderer {
  defaultSelf(): string {
    return `type ${this.model.name} = ${this.model.type};`;
  }
}

export const TS_DEFAULT_TYPE_PRESET: TypePresetType = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
};

import * as _ from "lodash";
import Template from "../../../libs/template";
import { Token } from "../../../types";
import { OptionsType } from "../to-tailwind.parser";
import { TailwindType } from "../to-tailwind.type";
import { getNameFormatterFunction } from "../utils/getNameFormatterFunction";

export * from "./border";
export * from "./color";
export * from "./depth";
export * from "./duration";
export * from "./gradient";
export * from "./measurement";
export * from "./opacity";
export * from "./shadow";
export * from "./size";
export * from "./textStyle";

export abstract class Utils {
  static parseFloatIfString(value: string | number) {
    return typeof value === "string" ? parseFloat(value) : value;
  }

  static sortObjectByValue<T>(obj: T) {
    return Object.entries(obj)
      .sort(
        ([, a], [, b]) =>
          this.parseFloatIfString(a) - this.parseFloatIfString(b)
      )
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  }

  static getTemplatedTokenName(
    token: Partial<Token>,
    template: string | undefined
  ) {
    if (template) {
      const templateInstance = new Template(template);
      return templateInstance.render(token);
    }
    return token.name!;
  }

  static go<T>(
    token: T,
    options: OptionsType,
    tailwindKey: TailwindType,
    value: unknown
  ) {
    const keyName = this.getTemplatedTokenName(
      token,
      options?.renameKeys?.[tailwindKey]
    );
    const keys = [
      ...(options?.splitBy
        ? keyName.split(new RegExp(options.splitBy))
        : [keyName]),
    ];
    return _.setWith(
      {},
      keys.map(k => getNameFormatterFunction(options?.formatName)(k)).join("."),
      value,
      Object
    );
  }
}

import { IncorrectTypeError } from "@stormstack/core-shared-utilities";
import { JsonParser } from "../parser";
import { IJsonParser } from "../types";

export const parser = new Proxy<IJsonParser>({} as IJsonParser, {
  get: async (target: IJsonParser, prop: string) => {
    switch (prop) {
      case "parse":
        return JsonParser.parse;
      case "stringify":
        return JsonParser.stringify;
      case "register":
        return JsonParser.register;
      default:
        throw new IncorrectTypeError("Invalid prop used on JsonParser");
    }
  },
  set: (
    target: IJsonParser,
    prop: string | symbol,
    newValue: any,
    _: any
  ): boolean => {
    return true;
  }
});

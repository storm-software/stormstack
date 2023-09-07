/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from "@open-system/core-shared-injection";
import { BaseUtilityClass } from "@open-system/core-shared-utilities";
import { parse, registerCustom, stringify } from "superjson";
import { JSON_PARSER_SYMBOL, JsonValue } from "./types";

@Service(JSON_PARSER_SYMBOL)
export class JsonParser extends BaseUtilityClass {
  constructor() {
    super(JSON_PARSER_SYMBOL);
  }

  public static parse<TData = any>(json: string): TData {
    return parse<TData>(json);
  }

  public static stringify<TData = any>(data: TData): string {
    return stringify(data);
  }

  public static register<TData = any, TJsonValue extends JsonValue = JsonValue>(
    name: string,
    serialize: (data: TData) => TJsonValue,
    deserialize: (json: TJsonValue) => TData,
    isApplicable: (data: any) => data is TData
  ) {
    return registerCustom<TData, TJsonValue>(
      { isApplicable, serialize, deserialize },
      name
    );
  }
}

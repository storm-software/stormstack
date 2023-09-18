/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseError,
  BaseUtilityClass,
  DateTime
} from "@open-system/core-shared-utilities";
import { Decimal } from "decimal.js";
import { parse, registerCustom, stringify } from "superjson";
import { JSON_PARSER_SYMBOL, JsonValue } from "../types";

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

JsonParser.register(
  "Decimal",
  (value: Decimal) => value.toJSON(),
  (strValue: string) => new Decimal(strValue),
  (value: any): value is Decimal => Decimal.isDecimal(value)
);

JsonParser.register(
  "DateTime",
  DateTime.stringify,
  DateTime.parse,
  DateTime.isDateTime
);

JsonParser.register(
  "BaseError",
  BaseError.stringify,
  BaseError.parse,
  BaseError.isBaseError
);

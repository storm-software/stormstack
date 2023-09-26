/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseError,
  BaseUtilityClass,
  DateTime
} from "@stormstack/core-shared-utilities";
import { Decimal } from "decimal.js";
import { deserialize, registerCustom, serialize } from "superjson";
import { JSON_PARSER_SYMBOL, JsonValue } from "../types";

export class JsonParser extends BaseUtilityClass {
  constructor() {
    super(JSON_PARSER_SYMBOL);
  }

  /**
   * Serialize the given value with superjson
   */
  public static stringify<TData = unknown>(
    value: TData
  ): { data: unknown; meta: unknown } {
    const { json, meta } = serialize(value);
    return { data: json, meta };
  }

  /**
   * Deserialize the given value with superjson using the given metadata
   */
  public static parse<TData = unknown>(value: unknown, meta: any): TData {
    return deserialize({ json: value as any, meta });
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

JsonParser.register<Buffer, string>(
  "Bytes",
  v => v.toString("base64"),
  v => Buffer.from(v, "base64"),
  (v): v is Buffer => Buffer.isBuffer(v)
);

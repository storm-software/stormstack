/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseError,
  BaseUtilityClass,
  DateTime,
  StormError
} from "@stormstack/core-shared-utilities";
import { Decimal } from "decimal.js";
import {
  deserialize,
  parse,
  registerCustom,
  serialize,
  stringify
} from "superjson";
import { JSON_PARSER_SYMBOL, JsonParserResult, JsonValue } from "../types";

export class JsonParser extends BaseUtilityClass {
  /**
   * Stringify the given value with superjson
   */
  public static stringify(json: any): string {
    return stringify(json);
  }

  /**
   * Parse the given value with superjson using the given metadata
   */
  public static parse<TData = unknown>(strData: string): TData {
    return parse<TData>(strData);
  }

  /**
   * Serialize the given value with superjson
   */
  public static serialize(object: JsonValue): JsonParserResult {
    return serialize(object);
  }

  /**
   * Deserialize the given value with superjson using the given metadata
   */
  public static deserialize<TData = unknown>(payload: JsonParserResult): TData {
    return deserialize(payload);
  }

  public static register<
    TData = any,
    TJsonObject extends JsonValue = JsonValue
  >(
    name: string,
    serialize: (data: TData) => TJsonObject,
    deserialize: (json: TJsonObject) => TData,
    isApplicable: (data: any) => data is TData
  ) {
    return registerCustom<TData, TJsonObject>(
      { isApplicable, serialize, deserialize },
      name
    );
  }

  /**
   * A string representing the base class
   *
   * @remarks This is used when determining how to deserialize the object
   */
  public get __base(): string {
    return "JsonParser";
  }

  constructor() {
    super(JSON_PARSER_SYMBOL);
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

JsonParser.register(
  "StormError",
  StormError.stringify,
  StormError.parse,
  StormError.isStormError
);

JsonParser.register<Buffer, string>(
  "Bytes",
  v => v.toString("base64"),
  v => Buffer.from(v, "base64"),
  (v): v is Buffer => Buffer.isBuffer(v)
);

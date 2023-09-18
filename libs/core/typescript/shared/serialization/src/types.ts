/* eslint-disable @typescript-eslint/no-explicit-any */
export type PrimitiveJsonValue = string | number | boolean | undefined | null;

export type JsonValue =
  | PrimitiveJsonValue
  | Array<JsonValue>
  | {
      [key: string]: JsonValue;
    };

export const JSON_PARSER_SYMBOL = Symbol.for("OS_JSON_PARSER_SYMBOL");

export interface IJsonParser {
  parse: <TData = any>(json: string) => TData;
  stringify: <TData = any>(data: TData) => string;
  register: <TData = any, TJsonValue extends JsonValue = JsonValue>(
    name: string,
    serialize: (data: TData) => TJsonValue,
    deserialize: (json: TJsonValue) => TData,
    isApplicable: (data: any) => data is TData
  ) => void;
}

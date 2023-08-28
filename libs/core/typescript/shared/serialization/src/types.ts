export type PrimitiveJsonValue = string | number | boolean | undefined | null;

export type JsonValue =
  | PrimitiveJsonValue
  | Array<JsonValue>
  | {
      [key: string]: JsonValue;
    };

export const JSON_PARSER_SYMBOL = Symbol.for("OS_JSON_PARSER_SYMBOL");

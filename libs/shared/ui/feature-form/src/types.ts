import {
  BrowserNativeObject,
  NestedValue
} from "@open-system/core-typescript-utilities";

export type DeepPartial<T> = T extends BrowserNativeObject | NestedValue
  ? T
  : {
      [K in keyof T]?: DeepPartial<T[K]>;
    };

export type ValidationPropType<TValue> = {
  value: TValue;
  message: string;
}

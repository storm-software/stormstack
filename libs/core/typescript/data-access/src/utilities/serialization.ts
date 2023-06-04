/* eslint-disable @typescript-eslint/no-explicit-any */
import { DateTime, isObject } from "@open-system/core-utilities";

export const serialize = <TValue = any>(obj: TValue): TValue => {
  if (!isObject(obj)) {
    return obj;
  } else if (DateTime.isDateTime(obj)) {
    return {
      value: obj.toString(),
      _type: "DateTime",
    } as TValue;
  } else {
    return Object.values(obj).map((value: any) =>
      DateTime.isDateTime(value)
        ? { value: value.toString(), _type: "DateTime" }
        : value
    ) as TValue;
  }
};

export const deserialize = <TValue = any>(obj: TValue): TValue => {
  if (!isObject(obj)) {
    return obj;
  } else if ((obj as any)._type === "DateTime" && (obj as any).value) {
    return DateTime.create((obj as any).value) as TValue;
  } else {
    return Object.values(obj).map((value: any) =>
      isObject(value) && value?._type === "DateTime" && value?.value
        ? DateTime.create(value?.value)
        : value
    ) as TValue;
  }
};

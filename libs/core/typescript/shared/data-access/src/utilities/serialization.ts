/* eslint-disable @typescript-eslint/no-explicit-any */
import { DateTime, isObject } from "@open-system/core-shared-utilities";

export type SerializedObject = { value: string; _type: string };

export const serialize = <TValue = any>(obj: TValue): TValue => {
  if (!isObject(obj)) {
    return obj;
  } else if (DateTime.isDateTime(obj)) {
    return {
      value: (obj as any)?.toString(),
      _type: "DateTime",
    } as TValue;
  } else {
    return Object.entries(obj).reduce(
      (ret: { [key: string]: any }, [key, value]: [string, any]) => {
        ret[key] = DateTime.isDateTime(value)
          ? { value: value.toString(), _type: "DateTime" }
          : value;

        return ret;
      },
      {}
    ) as TValue;
  }
};

export const deserialize = <TValue = any>(obj: TValue): TValue => {
  if (!isObject(obj)) {
    return obj;
  } else if (
    (obj as unknown as SerializedObject)?._type === "DateTime" &&
    (obj as unknown as SerializedObject)?.value
  ) {
    return DateTime.create(
      (obj as unknown as SerializedObject).value
    ) as TValue;
  } else {
    return Object.entries(obj).reduce(
      (ret: { [key: string]: any }, [key, value]: [string, any]) => {
        ret[key] =
          isObject(value) &&
          (value as SerializedObject)?._type === "DateTime" &&
          (value as SerializedObject)?.value
            ? DateTime.create((value as SerializedObject)?.value)
            : value;

        return ret;
      },
      {}
    ) as TValue;
  }
};

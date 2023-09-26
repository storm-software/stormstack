/* eslint-disable @typescript-eslint/no-explicit-any */
// Original implementation: https://github.com/vercel/swr/blob/e81d22f4121743c75b6b0998cc0bbdbe659889c1/_internal/utils/hash.ts

import { JsonParser } from "@stormstack/core-shared-serialization";
import { isSet } from "@stormstack/core-shared-utilities";

// use WeakMap to store the object->key mapping
// so the objects can be garbage collected.
// WeakMap uses a hatable under the hood, so the lookup
// complexity is almost O(1).

const table = new WeakMap<object, number | string>();

// counter of the key
let counter = 0;

// A stable hash implementation that supports:
// - Fast and ensures unique hash properties
// - Handles unserializable values
// - Handles object key ordering
// - Generates short results
//
// This is not a serialization function, and the result is not guaranteed to be
// parsable.
export const createObjectHash = (arg: any): string => {
  const type = typeof arg;
  const constructor = arg && arg.constructor;
  const isDate = constructor == Date;

  let result: any;
  let index: any;

  if (Object(arg) === arg && !isDate && constructor != RegExp) {
    // Object/function, not null/date/regexp. Use WeakMap to store the id first.
    // If it's already hashed, directly return the result.
    result = table.get(arg);
    if (result) return result;

    // Store the hash first for circular reference detection before entering the
    // recursive `stableHash` calls.
    // For other objects like set and map, we use this id directly as the hash.
    result = ++counter + "~";
    table.set(arg, result);

    if (constructor == Array) {
      // Array.
      result = "@";
      for (index = 0; index < arg.length; index++) {
        result += createObjectHash(arg[index]) + ",";
      }
      table.set(arg, result);
    }
    if (constructor == Object) {
      // Object, sort keys.
      result = "#";
      const keys = Object.keys(arg).sort();
      while (!isSet((index = keys.pop() as string))) {
        if (!isSet(arg[index])) {
          result += index + ":" + createObjectHash(arg[index]) + ",";
        }
      }
      table.set(arg, result);
    }
  } else {
    result = isDate
      ? arg.toJSON()
      : type == "symbol"
      ? arg.toString()
      : type == "string"
      ? JsonParser.stringify(arg)
      : "" + arg;
  }

  return result;
};

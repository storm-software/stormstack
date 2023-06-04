import { getUniqueId, isDevelopment } from "@open-system/core-utilities";
import { WritableAtom } from "jotai";
import { atomWithReducer } from "jotai/utils";
import { ScopedObjectState } from "../types";

export type ListAction<TValue extends ScopedObjectState = ScopedObjectState> =
  | { type: "add"; item: Omit<TValue, "id"> & Partial<Pick<TValue, "id">> }
  | { type: "remove"; id: string }
  | { type: "reset"; initialValue?: TValue[] }
  | { type: "process"; funct: (prev: TValue[]) => TValue[] }
  | { type: "map"; funct: (prev: TValue) => TValue };

export interface Options {
  allowDuplicates?: boolean;
}

export function atomWithList<
  TValue extends ScopedObjectState = ScopedObjectState
>(
  initialValue: TValue[] = [],
  options: Options = { allowDuplicates: true }
): WritableAtom<TValue[], [ListAction<TValue>], void> {
  const returnedAtom = atomWithReducer<TValue[], ListAction<TValue>>(
    initialValue,
    (prev: TValue[], action: ListAction<TValue>) => {
      switch (action.type) {
        case "add":
          // eslint-disable-next-line no-case-declarations
          const newItem = action.item;
          if (!newItem.id) {
            newItem.id = getUniqueId();
          }

          if (
            !options.allowDuplicates &&
            prev.some((item: TValue) => item.id === newItem.id)
          ) {
            // Do not allow duplicate items to be added to the list
            return prev;
          }

          return [...prev, newItem as TValue];

        case "remove":
          return prev.filter((item: TValue) => action.id !== item.id);

        case "reset":
          return action.initialValue ?? initialValue;

        case "process":
          return action.funct(prev);

        case "map":
          return prev.map(action.funct);

        default:
          return prev;
      }
    }
  );
  if (isDevelopment()) {
    returnedAtom.debugPrivate = true;
  }

  return returnedAtom;
}

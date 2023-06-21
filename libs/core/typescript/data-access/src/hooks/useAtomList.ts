import { WritableAtom, useSetAtom } from "jotai";
import { useCallback } from "react";
import { ScopedObjectState } from "../types";
import { ListAction } from "../utilities/atomWithList";

export type UseAtomListReturn<
  TValue extends ScopedObjectState = ScopedObjectState
> = {
  add: (item: Omit<TValue, "id"> & Partial<Pick<TValue, "id">>) => void;
  remove: (id: string) => void;
  reset: (
    initialValue?: Array<Omit<TValue, "id"> & Partial<Pick<TValue, "id">>>
  ) => void;
  process: (funct: (prev: TValue[]) => TValue[]) => void;
  map: (funct: (prev: TValue, index: number) => TValue) => void;
};

export const useAtomList = <
  TValue extends ScopedObjectState = ScopedObjectState
>(
  atomList: WritableAtom<TValue[], [ListAction<TValue>], void>
): UseAtomListReturn<TValue> => {
  const setAtomList = useSetAtom(atomList);

  const add = useCallback(
    (item: Omit<TValue, "id"> & Partial<Pick<TValue, "id">>) => {
      setAtomList({ type: "add", item });
    },
    [setAtomList]
  );

  const remove = useCallback(
    (id: string) => {
      setAtomList({ type: "remove", id });
    },
    [setAtomList]
  );

  const reset = useCallback(
    (initialValue?: TValue[]) => {
      setAtomList({ type: "reset", initialValue });
    },
    [setAtomList]
  );

  const process = useCallback(
    (funct: (prev: TValue[]) => TValue[]) => {
      setAtomList({ type: "process", funct });
    },
    [setAtomList]
  );

  const map = useCallback(
    (funct: (prev: TValue) => TValue) => {
      setAtomList({ type: "map", funct });
    },
    [setAtomList]
  );

  return { add, remove, reset, process, map };
};

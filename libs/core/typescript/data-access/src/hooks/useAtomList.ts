import { WritableAtom, useSetAtom } from "jotai";
import { useCallback } from "react";
import { ScopedObjectState } from "../types";
import { ListAction } from "../utilities/atomWithList";

export type UseAtomListReturn<
  TValue extends ScopedObjectState = ScopedObjectState
> = {
  add: (item: Omit<TValue, "id"> & Partial<Pick<TValue, "id">>) => void;
  remove: (id: string) => void;
  reset: (initialValue?: TValue[]) => void;
  process: (funct: (prev: TValue[]) => TValue[]) => void;
  map: (funct: (prev: TValue) => TValue) => void;
};

export const useAtomList = <
  TValue extends ScopedObjectState = ScopedObjectState
>(
  atomList: WritableAtom<TValue[], [ListAction<TValue>], void>
): UseAtomListReturn<TValue> => {
  const setAtomList = useSetAtom(atomList);

  const add = useCallback((item: Omit<TValue, "id"> & Partial<Pick<TValue, "id">>) => {
    setAtomList({ type: "add", item });
  }, []);

  const remove = useCallback((id: string) => {
    setAtomList({ type: "remove", id });
  }, []);

  const reset = useCallback((initialValue?: TValue[]) => {
    setAtomList({ type: "reset", initialValue });
  }, []);

  const process = useCallback((funct: (prev: TValue[]) => TValue[]) => {
    setAtomList({ type: "process", funct });
  }, []);

  const map = useCallback((funct: (prev: TValue) => TValue) => {
    setAtomList({ type: "map", funct });
  }, []);

  return { add, remove, reset, process, map };
};

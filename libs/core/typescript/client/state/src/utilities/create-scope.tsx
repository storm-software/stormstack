import type { Atom } from "jotai";
import {
  useAtom as useAtomOrig,
  useAtomValue as useAtomValueOrig,
  useSetAtom as useSetAtomOrig
} from "jotai/react";
import { createStore } from "jotai/vanilla";
import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";

type Store = ReturnType<typeof createStore>;
type AnyAtom = Atom<unknown>;

export const createScope = () => {
  const ScopeContext = createContext<Map<AnyAtom, Store>>(new Map());

  const ScopeProvider = ({
    atoms,
    children
  }: {
    atoms: Iterable<AnyAtom>;
    children: ReactNode;
  }) => {
    const storeRef = useRef<Store>();
    if (!storeRef.current) {
      storeRef.current = createStore();
    }
    const store = storeRef.current;
    const parentMap = useContext(ScopeContext);
    const map = new Map(parentMap);
    Array.from(atoms).forEach(anAtom => {
      map.set(anAtom, store);
    });
    return (
      <ScopeContext.Provider value={map}>{children}</ScopeContext.Provider>
    );
  };

  const useScopedAtom = ((anAtom: any, options?: any) => {
    const map = useContext(ScopeContext);
    const store = map.get(anAtom);
    return useAtomOrig(anAtom, { store, ...options });
  }) as typeof useAtomOrig;

  const useScopedAtomValue = ((anAtom: any, options?: any) => {
    const map = useContext(ScopeContext);
    const store = map.get(anAtom);
    return useAtomValueOrig(anAtom, { store, ...options });
  }) as typeof useAtomValueOrig;

  const useScopedSetAtom = ((anAtom: any, options?: any) => {
    const map = useContext(ScopeContext);
    const store = map.get(anAtom);
    return useSetAtomOrig(anAtom, { store, ...options });
  }) as typeof useSetAtomOrig;

  return {
    ScopeProvider,
    useScopedAtom,
    useScopedAtomValue,
    useScopedSetAtom
  };
};

export const {
  ScopeProvider,
  useScopedAtom,
  useScopedAtomValue,
  useScopedSetAtom
} = createScope();

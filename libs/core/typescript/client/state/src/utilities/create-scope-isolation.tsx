import { StormError } from "@stormstack/core-shared-utilities";
import {
  useAtom as useAtomOrig,
  useAtomValue as useAtomValueOrig,
  useSetAtom as useSetAtomOrig
} from "jotai/react";
import { useHydrateAtoms } from "jotai/react/utils";
import { createStore } from "jotai/vanilla";
import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";

type Store = ReturnType<typeof createStore>;
type InitialValues = Parameters<typeof useHydrateAtoms>[0];

export const createIsolation = () => {
  const StoreContext = createContext<Store | null>(null);

  const Provider = ({
    store,
    initialValues = [] as unknown as InitialValues,
    children
  }: {
    store?: Store;
    initialValues?: InitialValues;
    children: ReactNode;
  }) => {
    const storeRef = useRef(store);
    if (!storeRef.current) {
      storeRef.current = createStore();
    }
    useHydrateAtoms(initialValues, { store: storeRef.current });
    return (
      <StoreContext.Provider value={storeRef.current}>
        {children}
      </StoreContext.Provider>
    );
  };

  const useAtom = ((anAtom: any, options?: any) => {
    const store = useContext(StoreContext);
    if (!store) {
      throw new StormError("Missing Provider from createIsolation");
    }
    return useAtomOrig(anAtom, { store, ...options });
  }) as typeof useAtomOrig;

  const useAtomValue = ((anAtom: any, options?: any) => {
    const store = useContext(StoreContext);
    if (!store) {
      throw new StormError("Missing Provider from createIsolation");
    }
    return useAtomValueOrig(anAtom, { store, ...options });
  }) as typeof useAtomValueOrig;

  const useSetAtom = ((anAtom: any, options?: any) => {
    const store = useContext(StoreContext);
    if (!store) {
      throw new StormError("Missing Provider from createIsolation");
    }
    return useSetAtomOrig(anAtom, { store, ...options });
  }) as typeof useSetAtomOrig;

  return { Provider, useAtom, useAtomValue, useSetAtom };
};

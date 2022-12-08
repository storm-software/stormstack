"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import { createContext } from "react";

const StoreContext = createContext({ store: "dark" });

export default function StoreProvider({ children }: BaseComponentProps) {
  return (
    <StoreContext.Provider value={{ store: "dark" }}>
      {children}
    </StoreContext.Provider>
  );
}

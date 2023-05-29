import { createContext } from "react";

export interface AppHeaderState {
  isDisplayed: boolean;
}

export const INITIAL_STATE: AppHeaderState = { isDisplayed: true };

export const Context = createContext<AppHeaderState>(
  Object.assign({}, INITIAL_STATE)
);

export const ContextProvider = Context.Provider;
export const ContextConsumer = Context.Consumer;

export default Context;

/* eslint-disable @typescript-eslint/no-empty-function */
import React, { Context } from "react";
import { RadioContextState } from "./Radio.types";

// Initial context values
export const initialRadioContext: RadioContextState = {
  value: null,
  onFocus: () => {},
  onBlur: (event: { target: any; type?: any }) => new Promise(() => {}),
  name: "",
  disabled: false,
  isVertical: false,
  focused: false,
  glow: true,
};

// Create the context
export const RadioContext: Context<RadioContextState> =
  React.createContext(initialRadioContext);

// Export the Provider and Consumer
export const RadioContextProvider = RadioContext.Provider;

export const RadioContextConsumer = RadioContext.Consumer;

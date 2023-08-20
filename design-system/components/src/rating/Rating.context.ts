/* eslint-disable @typescript-eslint/no-empty-function */
import React, { Context } from "react";
import { RatingContextState } from "./Rating.types";

// Initial context values
export const initialRatingContext: RatingContextState = {
  value: null,
  onFocus: () => {},
  onBlur: (event: { target: any; type?: any }) => new Promise(() => {}),
  name: "",
  disabled: false,
  isVertical: false,
  focused: false,
  glow: true,
  placeholder: 1,
  current: -1,
  setCurrent: (next: number) => {},
};

// Create the context
export const RatingContext: Context<RatingContextState> =
  React.createContext(initialRatingContext);

// Export the Provider and Consumer
export const RatingContextProvider = RatingContext.Provider;

export const RatingContextConsumer = RatingContext.Consumer;

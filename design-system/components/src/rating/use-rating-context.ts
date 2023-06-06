import {
  ConsoleLogger,
  MissingContextError,
} from "@open-system/core-utilities";
import { useContext } from "react";
import { RatingContext } from "./Rating.context";
import { RatingContextState } from "./Rating.types";

export const useRatingContext = (): RatingContextState => {
  const context = useContext<RatingContextState>(RatingContext);
  if (!context) {
    ConsoleLogger.error("RatingContext is required.");

    throw new MissingContextError("RatingContext");
  }

  return context;
};

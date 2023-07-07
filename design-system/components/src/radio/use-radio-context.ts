import {
  ConsoleLogger,
  MissingContextError,
} from "@open-system/core-shared-utilities";
import { useContext } from "react";
import { RadioContext } from "./Radio.context";
import { RadioContextState } from "./Radio.types";

export const useRadioContext = (): RadioContextState => {
  const context = useContext<RadioContextState>(RadioContext);
  if (!context) {
    ConsoleLogger.error("RadioContext is required.");

    throw new MissingContextError("RadioContext");
  }

  return context;
};

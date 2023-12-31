import { ConsoleLogger } from "@stormstack/core-shared-logging";
import { MissingContextError } from "@stormstack/core-shared-utilities";
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

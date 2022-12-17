"use client";

import { useCallback, useState } from "react";

export type StartMenuStateTypes = "opened" | "closed";
export const StartMenuStateTypes = {
  OPENED: "opened" as StartMenuStateTypes,
  CLOSED: "closed" as StartMenuStateTypes,
};

export interface UseStartMenuStateResult {
  setOpened: () => void;
  setClosed: () => void;
  state: StartMenuStateTypes;
}

export default function useStartMenuState(): UseStartMenuStateResult {
  const [startMenuState, setStartMenuState] = useState<StartMenuStateTypes>(
    StartMenuStateTypes.CLOSED
  );

  const handleOpened = useCallback(
    () => setStartMenuState(StartMenuStateTypes.OPENED),
    []
  );
  const handleClosed = useCallback(
    () => setStartMenuState(StartMenuStateTypes.CLOSED),
    []
  );

  return {
    setOpened: handleOpened,
    setClosed: handleClosed,
    state: startMenuState,
  };
}

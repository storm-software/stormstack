"use client";

import { useCallback, useState } from "react";

export type WindowStateTypes = "opened" | "minimized" | "closed";
export const WindowStateTypes = {
  OPENED: "opened" as WindowStateTypes,
  MINIMIZED: "minimized" as WindowStateTypes,
  CLOSED: "closed" as WindowStateTypes,
};

export interface UseWindowStateResult {
  setOpened: () => void;
  setMinimized: () => void;
  setClosed: () => void;
  state: WindowStateTypes;
}

export default function useWindowState(): UseWindowStateResult {
  const [windowState, setWindowState] = useState<WindowStateTypes>(
    WindowStateTypes.CLOSED
  );

  const handleOpened = useCallback(
    () => setWindowState(WindowStateTypes.OPENED),
    []
  );
  const handleClosed = useCallback(
    () => setWindowState(WindowStateTypes.CLOSED),
    []
  );
  const handleMinimized = useCallback(
    () =>
      windowState !== WindowStateTypes.CLOSED &&
      setWindowState(WindowStateTypes.MINIMIZED),
    [windowState]
  );

  return {
    setOpened: handleOpened,
    setMinimized: handleMinimized,
    setClosed: handleClosed,
    state: windowState,
  };
}

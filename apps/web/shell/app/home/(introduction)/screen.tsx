"use client";

import Desktop from "./desktop";
import Taskbar from "./taskbar";
import useStartMenuState from "./use-start-menu-state";
import useWindowState from "./use-window-state";

export default function Screen() {
  const {
    setOpened: setWindowOpened,
    setMinimized: setWindowMinimized,
    setClosed: setWindowClosed,
    state: windowState,
  } = useWindowState();
  const {
    setOpened: setStartMenuOpened,
    setClosed: setStartMenuClosed,
    state: startMenuState,
  } = useStartMenuState();

  return (
    <div className="flex h-full w-full flex-col">
      <Desktop
        windowState={windowState}
        setOpened={setWindowOpened}
        setMinimized={setWindowMinimized}
        setClosed={setWindowClosed}
      />
      <Taskbar
        windowState={windowState}
        setWindowOpened={setWindowOpened}
        setWindowMinimized={setWindowMinimized}
        setStartMenuOpened={setStartMenuOpened}
        setStartMenuClosed={setStartMenuClosed}
        startMenuState={startMenuState}
      />
    </div>
  );
}

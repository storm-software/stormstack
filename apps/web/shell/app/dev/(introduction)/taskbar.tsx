"use client";

import { SpeakerWaveIcon, WifiIcon } from "@heroicons/react/24/outline";
import { DateTime } from "@stormstack/core-shared-utilities";
import { useCallback, useEffect, useState } from "react";
import StartMenu from "./start-menu";
import TaskbarItem from "./taskbar-item";
import { StartMenuStateTypes } from "./use-start-menu-state";
import { WindowStateTypes } from "./use-window-state";
import WindowsStartIcon from "./windows-start-icon";

interface TaskbarProps {
  setWindowOpened: () => void;
  setWindowMinimized: () => void;
  windowState: WindowStateTypes;
  setStartMenuOpened: () => void;
  setStartMenuClosed: () => void;
  startMenuState: StartMenuStateTypes;
}

export default function Taskbar({
  setWindowOpened,
  setWindowMinimized,
  windowState,
  setStartMenuOpened,
  setStartMenuClosed,
  startMenuState
}: TaskbarProps) {
  const toggleStartMenuOpened = useCallback(
    () =>
      startMenuState === StartMenuStateTypes.CLOSED
        ? setStartMenuOpened()
        : setStartMenuClosed(),
    [setStartMenuClosed, setStartMenuOpened, startMenuState]
  );

  const [current, setCurrent] = useState<DateTime | null>(null);
  useEffect(() => {
    setCurrent(DateTime.current);
  }, []);

  return (
    <div className="h-12 min-h-fit w-full bg-black/50 flex flex-row items-center justify-between">
      {startMenuState !== StartMenuStateTypes.CLOSED && (
        <StartMenu
          setClosed={setStartMenuClosed}
          setWindowOpened={setWindowOpened}
        />
      )}
      <div className="h-full gap-1 flex flex-row">
        <div
          className="h-full w-fit cursor-pointer px-5 hover:bg-gray-700 flex items-center"
          onClick={toggleStartMenuOpened}>
          <WindowsStartIcon />
        </div>
        {windowState !== WindowStateTypes.CLOSED && (
          <TaskbarItem
            windowState={windowState}
            setOpened={setWindowOpened}
            setMinimized={setWindowMinimized}
          />
        )}
      </div>
      <div className="h-full w-fit gap-2 px-5 text-white flex flex-row items-center">
        <WifiIcon className="h-1/2 w-fit md:block hidden" />
        <SpeakerWaveIcon className="h-1/2 w-fit md:block hidden" />
        <div className="h-full w-fit grid-cols-1 py-2 text-xs leading-normal grid content-center whitespace-nowrap text-center">
          <time>
            {current
              ?.getPlainTime()
              .toLocaleString(undefined, { timeStyle: "short" }) ?? "12:40 AM"}
          </time>
          <p>{current?.getPlainDate().toLocaleString() ?? "1/20/2023"}</p>
        </div>
      </div>
    </div>
  );
}

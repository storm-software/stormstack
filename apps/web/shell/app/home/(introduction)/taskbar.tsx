"use client";

import { SpeakerWaveIcon, WifiIcon } from "@heroicons/react/24/outline";
import { DateTime } from "@open-system/core-typescript-utilities";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import startButton from "../../../../../../assets/start-button.png";
import StartMenu from "./start-menu";
import TaskbarItem from "./taskbar-item";
import { StartMenuStateTypes } from "./use-start-menu-state";
import { WindowStateTypes } from "./use-window-state";

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
  startMenuState,
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
    <div className="flex h-12 min-h-fit w-full flex-row items-center justify-between bg-black/30">
      {startMenuState !== StartMenuStateTypes.CLOSED && (
        <StartMenu
          setClosed={setStartMenuClosed}
          setWindowOpened={setWindowOpened}
        />
      )}
      <div className="flex h-full flex-row gap-1">
        <div
          className="flex h-full w-fit cursor-pointer items-center px-5 hover:bg-gray-700"
          onClick={toggleStartMenuOpened}>
          <Image src={startButton} alt="Start Icon" width={35} height={20} />
        </div>
        {windowState !== WindowStateTypes.CLOSED && (
          <TaskbarItem
            windowState={windowState}
            setOpened={setWindowOpened}
            setMinimized={setWindowMinimized}
          />
        )}
      </div>
      <div className="flex h-full w-fit flex-row items-center gap-2 px-5 text-white">
        <WifiIcon className="h-1/2 w-fit" />
        <SpeakerWaveIcon className="h-1/2 w-fit" />
        <div className="grid h-full w-fit grid-cols-1 content-center whitespace-nowrap py-2 text-center text-xs leading-normal">
          <label>
            {current
              ?.getPlainTime()
              .toLocaleString(undefined, { timeStyle: "short" }) ?? "12:40 AM"}
          </label>
          <label>
            {current?.getPlainDate().toLocaleString() ?? "1/20/2023"}
          </label>
        </div>
      </div>
    </div>
  );
}

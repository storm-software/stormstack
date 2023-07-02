"use client";

import clsx from "clsx";
import { useCallback } from "react";
import NotepadIcon from "../../../public/static/images/notepad-icon.svg";
import { WindowStateTypes } from "./use-window-state";

interface TaskbarItemProps {
  setOpened: () => void;
  setMinimized: () => void;
  windowState: WindowStateTypes;
}

export default function TaskbarItem({
  setOpened,
  setMinimized,
  windowState,
}: TaskbarItemProps) {
  const handleClick = useCallback(
    () =>
      windowState === WindowStateTypes.OPENED ? setMinimized() : setOpened(),
    [setMinimized, setOpened, windowState]
  );

  return (
    <div
      className={clsx(
        "flex w-fit cursor-pointer flex-row items-center gap-2 px-2 hover:bg-gray-700",
        {
          "border-b-2 border-b-slate-200 text-white":
            windowState === WindowStateTypes.OPENED,
        },
        {
          "text-gray-400": windowState === WindowStateTypes.MINIMIZED,
        }
      )}
      onClick={handleClick}>
      <NotepadIcon alt="Notepad Icon" width={24} height={20} />
      <p className="cursor-pointer">Read Me.txt - Notepad</p>
    </div>
  );
}

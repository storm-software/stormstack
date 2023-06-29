"use client";

import clsx from "clsx";
import Image from "next/image";
import { useCallback } from "react";
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
      <Image
        src="/static/images/notepad-icon.png"
        alt="Notepad Icon"
        width={24}
        height={20}
      />
      <label className="cursor-pointer">Read Me.txt - Notepad</label>
    </div>
  );
}

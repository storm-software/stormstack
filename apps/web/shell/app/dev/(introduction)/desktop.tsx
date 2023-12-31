"use client";

import clsx from "clsx";
import NotepadIcon from "./notepad-icon";
import { WindowStateTypes } from "./use-window-state";
import Window from "./window";

interface DesktopProps {
  setOpened: () => void;
  setMinimized: () => void;
  setClosed: () => void;
  windowState: WindowStateTypes;
}

export default function Desktop({
  setOpened,
  setMinimized,
  setClosed,
  windowState,
}: DesktopProps) {
  return (
    <div className="relative h-full w-full">
      <div
        className={clsx(
          "absolute left-1/3 top-1/4 grid h-fit w-fit cursor-pointer grid-cols-1 justify-items-center gap-1 px-2 pb-1 pt-2 text-center text-slate-900",
          {
            "hover:border hover:border-dashed hover:border-slate-100 hover:text-slate-600":
              windowState !== WindowStateTypes.OPENED,
          }
        )}
        onClick={setOpened}>
        <NotepadIcon width={50} height={60} />
        <p className="cursor-pointer text-center">Read Me.txt</p>
      </div>
      {windowState === WindowStateTypes.OPENED && (
        <Window setMinimized={setMinimized} setClosed={setClosed} />
      )}
    </div>
  );
}

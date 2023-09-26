"use client";

import {
  AdjustmentsVerticalIcon,
  Cog6ToothIcon,
  PowerIcon,
  Squares2X2Icon
} from "@heroicons/react/24/outline";
import { BoxLogo } from "@stormstack/common-client-components";
import { useClickOutside } from "@stormstack/core-client-components";
import { DateTime } from "@stormstack/core-shared-utilities";
import { useCallback, useEffect, useState } from "react";
import NotepadIcon from "./notepad-icon";

interface StartMenuProps {
  setClosed: () => void;
  setWindowOpened: () => void;
}

export default function StartMenu({
  setClosed,
  setWindowOpened
}: StartMenuProps) {
  const ref = useClickOutside(setClosed);

  const handleClick = useCallback(() => {
    setClosed();
    setWindowOpened();
  }, [setClosed, setWindowOpened]);

  const [current, setCurrent] = useState<DateTime | null>(null);
  useEffect(() => {
    setCurrent(DateTime.current);
  }, []);

  return (
    <div
      ref={ref}
      className="bottom-12 left-0 z-20 h-3/4 w-4/5 min-w-fit bg-black/80 md:w-1/2 absolute flex flex-col">
      <div
        className="cursor-pointer gap-3 p-6 group flex flex-row items-center"
        onClick={handleClick}>
        <BoxLogo className="h-14 w-16" />
        <p className="cursor-pointer text-lg font-semibold text-gray-400 group-hover:text-white">
          Patrick Sullivan
        </p>
      </div>
      <div className="flex-1 gap-3 px-1 pb-3 flex flex-row">
        <div className="text-white flex flex-col-reverse">
          <Squares2X2Icon className="h-8 w-8 py-2 hover:bg-gray-700" />
          <PowerIcon className="h-8 w-8 py-2 hover:bg-gray-700" />
          <Cog6ToothIcon className="h-8 w-8 py-2 hover:bg-gray-700" />
          <AdjustmentsVerticalIcon className="h-8 w-8 py-2 hover:bg-gray-700" />
        </div>
        <div className="flex-1 gap-2 flex flex-col">
          <div className="text-md text-white">Recently Opened</div>
          <div
            className="w-full cursor-pointer gap-2 px-2 py-5 text-gray-400 hover:bg-gray-700 hover:text-white flex flex-row items-center"
            onClick={handleClick}>
            <NotepadIcon width={28} height={24} />
            <p className="cursor-pointer font-semibold">
              Read Me.txt - Notepad
            </p>
            <p className="cursor-pointer text-sm">
              - Last saved on{" "}
              {current?.getPlainDate().toLocaleString() ?? "12/14/2022"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  AdjustmentsVerticalIcon,
  Cog6ToothIcon,
  PowerIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { DateTime } from "@open-system/core-typescript-utilities";
import { useClickOutside } from "@open-system/shared-ui-components/hooks";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Logo from "../../../../../../assets/box-logo-gradient.svg";
import notepadIcon from "../../../../../../assets/notepad-icon.png";

interface StartMenuProps {
  setClosed: () => void;
  setWindowOpened: () => void;
}

export default function StartMenu({
  setClosed,
  setWindowOpened,
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
      className="absolute bottom-12 left-0 z-20 flex h-3/4 w-1/2 flex-col bg-black/80">
      <div
        className="group flex cursor-pointer flex-row items-center gap-3 p-6"
        onClick={handleClick}>
        <Logo alt="box-logo" className="h-14 w-16" />
        <label className="cursor-pointer text-gray-400 group-hover:text-white">
          Patrick Sullivan Development
        </label>
      </div>
      <div className="flex flex-1 flex-row gap-3 px-1 pb-3">
        <div className="flex flex-col-reverse text-white">
          <Squares2X2Icon className="h-8 w-8 py-2 hover:bg-gray-700" />
          <PowerIcon className="h-8 w-8 py-2 hover:bg-gray-700" />
          <Cog6ToothIcon className="h-8 w-8 py-2 hover:bg-gray-700" />
          <AdjustmentsVerticalIcon className="h-8 w-8 py-2 hover:bg-gray-700" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="text-md text-white">Recently Opened</div>
          <div
            className="flex w-full cursor-pointer flex-row items-center gap-2 px-2 py-5 text-gray-400 hover:bg-gray-700 hover:text-white"
            onClick={handleClick}>
            <Image
              src={notepadIcon}
              alt="Notepad Icon"
              width={28}
              height={24}
            />
            <label className="cursor-pointer font-semibold">
              Introduction.txt - Notepad
            </label>
            <label className="cursor-pointer text-sm">
              - Last saved on{" "}
              {current?.getPlainDate().toLocaleString() ?? "12/14/2022"}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  MinusIcon,
  Square2StackIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import NotepadIcon from "./notepad-icon";

interface WindowProps {
  setMinimized: () => void;
  setClosed: () => void;
}

export default function Window({ setMinimized, setClosed }: WindowProps) {
  return (
    <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col bg-white">
      <div className="flex h-fit w-full flex-row items-center justify-between border-2 border-b-slate-300">
        <div className="flex flex-row items-center gap-2 px-2 py-1 text-sm">
          <NotepadIcon width={20} height={18} />
          <p className="text-black">Read Me.txt - Notepad</p>
        </div>
        <div className="flex flex-row items-center">
          <div
            className="cursor-pointer px-2 text-gray-400 hover:text-gray-700 md:px-5"
            onClick={setMinimized}>
            <MinusIcon className="h-4 w-5" />
          </div>
          <div className="hidden cursor-pointer px-5 text-gray-400 hover:text-gray-700 md:block">
            <Square2StackIcon className="h-4 w-5" />
          </div>
          <div
            className="cursor-pointer px-2 text-gray-400 hover:text-gray-700 md:px-5"
            onClick={setClosed}>
            <XMarkIcon className="h-4 w-5" />
          </div>
        </div>
      </div>
      <div className="cursor-text p-2">
        <p className="after:border-r-1 after:animate-blink text-black after:h-full after:border-r-black after:bg-black after:pl-[1px] after:content-['']">
          I am a financial technology developer based in the New York
          metropolitan area with a passion for learning new things, solving
          complicated problems, and giving back to the open source community.
        </p>
      </div>
    </div>
  );
}

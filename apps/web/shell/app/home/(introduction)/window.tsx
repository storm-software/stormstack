"use client";

import {
  MinusIcon,
  Square2StackIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import notepadIcon from "../../../../../../assets/notepad-icon.png";

interface WindowProps {
  setMinimized: () => void;
  setClosed: () => void;
}

export default function Window({ setMinimized, setClosed }: WindowProps) {
  return (
    <div className="absolute top-0 left-0 z-10 flex h-full w-full flex-col bg-white">
      <div className="flex h-8 w-full flex-row items-center justify-between border-2 border-b-slate-300">
        <div className="flex flex-row items-center gap-2 px-2 text-sm">
          <Image src={notepadIcon} alt="Notepad Icon" width={20} height={18} />
          <label>Introduction.txt - Notepad</label>
        </div>
        <div className="flex flex-row items-center">
          <div
            className="cursor-pointer px-5 text-gray-400 hover:text-gray-700"
            onClick={setMinimized}>
            <MinusIcon className="h-4 w-5" />
          </div>
          <div className="px-5 text-gray-400 hover:text-gray-700">
            <Square2StackIcon className="h-4 w-5" />
          </div>
          <div
            className="cursor-pointer px-5 text-gray-400 hover:text-gray-700"
            onClick={setClosed}>
            <XMarkIcon className="h-4 w-5" />
          </div>
        </div>
      </div>
      <div className="cursor-text p-2">
        <p className="after:border-r-1 font-body-1 text-black after:h-full after:animate-blink after:border-r-black after:bg-black after:pl-0.5 after:content-['']">
          I am a financial technology developer based in the New York
          metropolitan area with a passion for learning new things, solving
          complicated problems, and giving back to the open source community.
        </p>
      </div>
    </div>
  );
}

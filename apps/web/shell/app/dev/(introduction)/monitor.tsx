"use client";

import { MinusIcon, PlusIcon, PowerIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@stormstack/design-system-components";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import DellLogo from "../../../public/static/images/dell-logo.svg";

const Screen = dynamic(() => import("./screen"), {
  loading: () => (
    <div
      aria-label="Loading..."
      role="status"
      className="h-full w-full bg-black flex items-center justify-center">
      <Spinner className="mb-20 h-20 w-20" />
    </div>
  )
});

export default function Monitor() {
  const [isPowered, setIsPowered] = useState(true);
  const handleToggleIsPowered = useCallback(() => {
    setIsPowered(!isPowered);
  }, [isPowered]);

  return (
    <div className="grid-col-1 grid justify-items-center">
      <div className="z-20 w-full rounded-lg border border-white bg-slate-500 p-5 pb-8 md:h-[30rem] relative h-[35rem] shadow-[7px_7px_7px_0px_rgba(0,0,0,0.3)]">
        {isPowered ? (
          <div className="h-full w-full rounded-sm border-r-4 border-t-4 border-slate-700 bg-cover bg-center relative bg-bg-windows bg-no-repeat">
            <Screen />
          </div>
        ) : (
          <div className="h-full w-full border-r-4 border-t-4 border-slate-700 bg-black" />
        )}
        <div className="left-2 z-50 h-28 w-28 gap-0.5 bg-yellow-200 before:z-40 before:w-0 before:translate-x-1/2 before:translate-y-1/2 before:border-r-transparent before:border-t-yellow-100 before:bg-transparent after:right-1/2 after:z-30 after:w-full after:translate-x-1/2 after:translate-y-1/2 after:border-r-bg-primary after:border-t-yellow-200 after:bg-bg-primary sm:w-32 md:left-10 absolute -bottom-[6rem] flex -rotate-[4deg] flex-col justify-center text-center before:absolute before:bottom-[9px] before:right-[11px] before:border-r-[20px] before:border-t-[20px] before:shadow-[-2px_-2px_2px_0px_rgba(0,0,0,0.3)] before:content-[''] after:absolute after:bottom-[9px] after:border-r-[20px] after:border-t-[20px] after:content-['']">
          <p className="text-xl text-slate-900 font-label-2">
            Who is Pat Sullivan?
          </p>
        </div>
        <div className="h-7 w-28 rounded-xl border-b border-b-white bg-slate-500 pb-2 md:left-[45%] absolute -bottom-[0.5rem] left-[35%] flex justify-center shadow-[0px_7px_4px_0px_rgba(0,0,0,0.3)]">
          <DellLogo alt="Dell" height={22} />
        </div>
        <div className="bottom-1.5 right-5 gap-2 md:right-10 absolute flex flex-row items-center justify-center">
          <PlusIcon
            height={20}
            className="stroke-slate-800 hover:stroke-slate-300"
          />
          <MinusIcon
            height={20}
            className="stroke-slate-800 hover:stroke-slate-300"
          />

          <PowerIcon
            onClick={handleToggleIsPowered}
            height={20}
            className={clsx(
              { "stroke-lime-400 hover:stroke-slate-300": isPowered },
              { "hover:stroke-lime-500": !isPowered },
              "hover:cursor-pointer"
            )}
          />
        </div>
      </div>
      <div className="h-16 w-64 border-l-4 border-r border-l-gray-800 border-r-gray-300 bg-gradient-to-t from-gray-400 to-gray-800 bg-bottom justify-self-center bg-no-repeat"></div>
      <div className="h-2.5 w-96 rounded border-b border-r border-b-white border-r-white bg-slate-600 justify-self-center"></div>
    </div>
  );
}

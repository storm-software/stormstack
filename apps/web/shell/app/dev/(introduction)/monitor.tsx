"use client";

import { MinusIcon, PlusIcon, PowerIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Spinner } from "design-system/components/src/spinner/Spinner";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import DellLogo from "../../../public/static/images/dell-logo.svg";

const Screen = dynamic(() => import("./screen"), {
  loading: () => (
    <div
      aria-label="Loading..."
      role="status"
      className="flex h-full w-full items-center justify-center bg-black">
      <Spinner className="mb-20 h-20 w-20" />
    </div>
  ),
});

export default function Monitor() {
  const [isPowered, setIsPowered] = useState(true);
  const handleToggleIsPowered = useCallback(() => {
    setIsPowered(!isPowered);
  }, [isPowered]);

  return (
    <div className="grid-col-1 grid justify-items-center">
      <div className="relative z-20 h-[35rem] w-full rounded-lg border border-white bg-slate-500 p-5 pb-8 shadow-[7px_7px_7px_0px_rgba(0,0,0,0.3)] md:h-[30rem]">
        {isPowered ? (
          <div className="relative h-full w-full rounded-sm border-r-4 border-t-4 border-slate-700 bg-bg-windows bg-cover bg-center bg-no-repeat">
            <Screen />
          </div>
        ) : (
          <div className="h-full w-full border-r-4 border-t-4 border-slate-700 bg-black" />
        )}
        <div className="absolute -bottom-[6rem] left-2 z-50 flex h-28 w-28 -rotate-[4deg] flex-col justify-center gap-0.5 bg-yellow-200 text-center before:absolute before:bottom-[9px] before:right-[11px] before:z-40 before:w-0 before:translate-x-1/2 before:translate-y-1/2 before:border-r-[20px] before:border-t-[20px] before:border-r-transparent before:border-t-yellow-100 before:bg-transparent before:shadow-[-2px_-2px_2px_0px_rgba(0,0,0,0.3)] before:content-[''] after:absolute after:bottom-[9px] after:right-1/2 after:z-30 after:w-full after:translate-x-1/2 after:translate-y-1/2 after:border-r-[20px] after:border-t-[20px] after:border-r-bg-primary after:border-t-yellow-200 after:bg-bg-primary after:content-[''] sm:w-32 md:left-10">
          <p className="text-xl font-label-2 text-slate-900">
            Who is Pat Sullivan?
          </p>
        </div>
        <div className="absolute -bottom-[0.5rem] left-[35%] flex h-7 w-28 justify-center rounded-xl border-b border-b-white bg-slate-500 pb-2 shadow-[0px_7px_4px_0px_rgba(0,0,0,0.3)] md:left-[45%]">
          <DellLogo alt="Dell" height={22} />
        </div>
        <div className="absolute bottom-1.5 right-5 flex flex-row items-center justify-center gap-2 md:right-10">
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
      <div className="h-16 w-64 justify-self-center border-l-4 border-r border-l-gray-800 border-r-gray-300 bg-gradient-to-t from-gray-400 to-gray-800 bg-bottom bg-no-repeat"></div>
      <div className="h-2.5 w-96 justify-self-center rounded border-b border-r border-b-white border-r-white bg-slate-600"></div>
    </div>
  );
}

"use client";

import { MinusIcon, PlusIcon, PowerIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Suspense, useCallback, useEffect, useState } from "react";
import DellLogo from "../../../../../../assets/dell-logo.svg";
import Screen from "./screen";

export default function Monitor() {
  const [isPowered, setIsPowered] = useState(true);
  const handleToggleIsPowered = useCallback(() => {
    setIsPowered(!isPowered);
  }, [isPowered]);

  const [isFlashing, setIsFlashing] = useState(false);
  useEffect(() => {
    const flashInterval = setInterval(() => {
      !isPowered && setIsFlashing(!isFlashing);
    }, 1000);

    return () => clearInterval(flashInterval);
  }, [isFlashing, isPowered]);

  return (
    <div className="grid-col-1 grid justify-items-center">
      <div className="relative z-20 h-[30rem] w-full rounded-lg border border-white bg-slate-500 p-5 pb-8 shadow-[7px_7px_7px_0px_rgba(0,0,0,0.3)]">
        {isPowered ? (
          <Suspense
            fallback={
              <div
                aria-label="Loading..."
                role="status"
                className="flex h-full w-full items-center justify-center">
                <svg className="h-12 w-12 animate-spin" viewBox="3 3 18 18">
                  <path
                    className="fill-gray-200"
                    d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"></path>
                  <path
                    className="fill-gray-800"
                    d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"></path>
                </svg>
              </div>
            }>
            <div className="relative h-full w-full rounded-sm border-t-4 border-r-4 border-slate-700 bg-bg-windows bg-cover bg-center bg-no-repeat">
              <Screen />
            </div>
          </Suspense>
        ) : (
          <div className="h-full w-full border-t-4 border-r-4 border-slate-700 bg-black" />
        )}
        <div className="absolute -bottom-[5rem] left-10 z-50 flex h-24 w-32 -rotate-[4deg] flex-col justify-center gap-0.5 bg-yellow-200 text-center before:absolute before:-bottom-[9px] before:right-[11px] before:z-40 before:w-0 before:translate-y-1/2 before:translate-x-1/2 before:border-t-[20px] before:border-r-[20px] before:border-r-transparent before:border-t-yellow-100 before:bg-transparent before:shadow-[-2px_-2px_2px_0px_rgba(0,0,0,0.3)] before:content-[''] after:absolute after:-bottom-[9px] after:right-1/2 after:z-30 after:w-full after:translate-y-1/2 after:translate-x-1/2 after:border-t-[20px] after:border-r-[20px] after:border-r-transparent after:border-t-yellow-200 after:bg-transparent after:content-['']">
          <label className="text-lg font-label-2 text-slate-900">
            Who is Patrick Sullivan?
          </label>
        </div>
        <div className="absolute -bottom-[0.5rem] left-[45%] flex h-7 w-28 justify-center rounded-xl border-b border-b-white bg-slate-500 pb-2 shadow-[0px_7px_4px_0px_rgba(0,0,0,0.3)]">
          <DellLogo alt="Dell" height={22} />
        </div>
        <div className="absolute bottom-1.5 right-10 flex flex-row items-center justify-center gap-2">
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
              { "stroke-slate-800 hover:stroke-lime-500": !isPowered },
              { "stroke-lime-400": isFlashing },
              "hover:cursor-pointer"
            )}
          />
        </div>
      </div>
      <div className="z-10 h-16 w-64 justify-self-center border-l-4 border-r border-l-gray-800 border-r-gray-300 bg-gradient-to-t from-gray-400 to-gray-800 bg-bottom bg-no-repeat"></div>
      <div className="z-20 h-2.5 w-96 justify-self-center rounded border-r border-b border-r-white border-b-white bg-slate-600"></div>
    </div>
  );
}

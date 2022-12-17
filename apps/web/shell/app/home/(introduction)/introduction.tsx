import Image from "next/image";
import { Suspense } from "react";
import keyboard from "../../../../../../assets/keyboard.png";
import Mouse from "../../../../../../assets/mouse.svg";
import Screen from "./screen";

export default function Introduction() {
  return (
    <section className="flex w-full snap-center snap-always justify-center overflow-hidden">
      <div className="flex w-3/4 flex-col gap-20 px-10">
        <div className="flex w-full max-w-[65rem] flex-col gap-20">
          <div className="flex flex-col gap-5">
            <div className="grid-col-1 grid justify-items-center">
              <div className="h-[30rem] w-full rounded-lg bg-slate-500 p-5">
                <Suspense
                  fallback={
                    <div
                      aria-label="Loading..."
                      role="status"
                      className="flex h-full w-full items-center justify-center">
                      <svg
                        className="h-12 w-12 animate-spin"
                        viewBox="3 3 18 18">
                        <path
                          className="fill-gray-200"
                          d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"></path>
                        <path
                          className="fill-gray-800"
                          d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"></path>
                      </svg>
                    </div>
                  }>
                  <div className="relative h-full w-full rounded-sm bg-bg-windows bg-cover bg-bottom bg-no-repeat">
                    <Screen />
                  </div>
                </Suspense>
              </div>
              <div className="h-16 w-64 justify-self-center bg-gray-400"></div>
              <div className="h-2.5 w-2/5 justify-self-center bg-slate-600"></div>
            </div>
            <div className="flex flex-row items-center justify-center gap-10">
              <Image src={keyboard} alt="keyboard" width={600} height={300} />
              <Mouse className="h-52 text-slate-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
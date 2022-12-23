import Image from "next/image";
import { Suspense } from "react";
import coffee from "../../../../../../assets/coffee.png";
import keyboard from "../../../../../../assets/keyboard.png";
import Screen from "./screen";

export default function Introduction() {
  return (
    <section className="flex w-full snap-center snap-always justify-center overflow-hidden">
      <div className="z-10 mx-10 flex w-full flex-col px-10 md:mx-0 lg:w-3/4">
        <div className="flex w-full max-w-[65rem] flex-col">
          <div className="grid-col-1 grid justify-items-center">
            <div className="relative h-[30rem] w-full rounded-lg bg-gradient-to-bl from-slate-400 to-slate-600 bg-bottom bg-no-repeat p-5">
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
                <div className="relative h-full w-full rounded-sm bg-bg-windows bg-cover bg-bottom bg-no-repeat">
                  <Screen />
                </div>
              </Suspense>
              <div className="rotate- absolute -bottom-24 left-10 z-50 flex h-28 w-32 -rotate-[4deg] flex-col justify-center gap-0.5 bg-yellow-200 text-center">
                <label className="text-lg font-label-2 text-slate-900">
                  Password:
                </label>
                <label className="text-md font-label-2 text-slate-900">
                  password123
                </label>
              </div>
            </div>
            <div className="h-16 w-64 justify-self-center bg-gradient-to-t from-gray-400 to-gray-800 bg-bottom bg-no-repeat"></div>
            <div className="h-2.5 w-96 justify-self-center rounded bg-slate-600"></div>
          </div>
        </div>
        <div className="flex flex-row items-start justify-center gap-10">
          <Image
            src={keyboard}
            alt="Keyboard"
            width={800}
            height={400}
            className="-rotate-6"
          />
          <Image src={coffee} alt="Coffee" width={200} height={300} />
        </div>
      </div>
    </section>
  );
}

"use client";

import StackLayer from "./StackLayer";

export default function Stack() {
  return (
    <section className="flex w-full snap-center snap-always justify-center overflow-hidden">
      <div className="flex h-[88rem] w-fit flex-col gap-20 px-10">
        <div className="flex w-fit max-w-[65rem] flex-col gap-20">
          <div className="flex flex-col gap-2">
            <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_40%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]">
              <h2 className="text-shadow-lg font-app-title-1 text-6xl leading-[4rem] text-primary shadow-white">
                Full Stack Development
              </h2>
            </span>

            <p className="font-body-1 text-body-1">
              While I feel nowadays the term <i>full stack developer</i> is
              overwhelming used incorrectly, I am very comfortable working in
              all areas of modern software development (and some areas of
              hardware development). My experience ranges as far as developing a
              UI/UX design system for a React banking client, all the way to
              reading PCB schematics for commercial aeronautical applications.
            </p>
          </div>
        </div>
        <div className="relative flex w-5/6 flex-col py-24">
          <div className="from-bg-yellow-400 via-bg-yellow-400/95 h-16 w-full border-2 border-bg-1 bg-yellow-400 bg-gradient-to-r to-transparent"></div>
          <div className="from-bg-blue-600 via-bg-blue-600/95 h-16 w-full border-2 border-bg-1 bg-blue-600 bg-gradient-to-r to-transparent"></div>
          <div className="from-bg-emerald-600 via-bg-emerald-600/95 h-20 w-full border-2 border-bg-1 bg-emerald-600 bg-gradient-to-r to-transparent"></div>
          <div className="from-bg-red-600 via-bg-red-600/95 h-16 w-full border-2 border-bg-1 bg-red-600 bg-gradient-to-r to-transparent"></div>
          <div className="from-bg-purple-700 via-bg-purple-700/95 h-20 w-full border-2 border-bg-1 bg-purple-700 bg-gradient-to-r to-transparent"></div>

          <div className="absolute top-[700px] left-[25%] h-[700px] w-full">
            <StackLayer label="Hardware" />
          </div>
          <div className="absolute top-[625px] left-[25%] h-[700px] w-full">
            <StackLayer label="Database" />
          </div>
          <div className="absolute top-[550px] left-[25%] h-[700px] w-full">
            <StackLayer label="Server-Side" />
          </div>
          <div className="absolute top-[475px] left-[25%] h-[700px] w-full">
            <StackLayer label="Client-Side" />
          </div>
          <div className="absolute top-[400px] left-[25%] h-[700px] w-full">
            <StackLayer label="Design System" />
          </div>
        </div>
      </div>
    </section>
  );
}

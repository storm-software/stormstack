"use client";

import { OsHeader } from "@open-system/design-system-components-react";
import StackLayer from "./StackLayer";

export default function Stack() {
  return (
    <section className="flex w-full snap-center snap-always justify-center overflow-hidden">
      <div className="flex h-[75rem] w-fit flex-col gap-20 px-10">
        <div className="flex w-fit max-w-[65rem] flex-col gap-20">
          <div className="flex flex-col gap-5">
            <OsHeader level={2}>Full Stack Development</OsHeader>

            <p className="font-body-1 text-body-1">
              I feel nowadays the phrase <i>full stack developer</i> is
              overwhelming used incorrectly; however, I am very comfortable
              working in all areas of modern software development (and some
              areas of hardware development). My experience ranges as far as
              developing a UI/UX design system for a React banking client, all
              the way to reading PCB schematics for commercial aeronautical
              applications.
            </p>
          </div>
        </div>
        <div className="relative flex w-full flex-col pt-12">
          <StackLayer
            className="absolute top-[600px] left-[25%] z-10"
            header="Hardware"
          />
          <StackLayer
            className="absolute top-[525px] left-[25%] z-20"
            header="Database"
          />
          <StackLayer
            className="absolute top-[450px] left-[25%] z-30"
            header="Server-Side"
          />
          <StackLayer
            className="absolute top-[375px] left-[25%] z-40"
            header="Client-Side"
          />
          <StackLayer
            className="absolute top-[300px] left-[25%] z-50"
            header="Design System"
          />
        </div>
      </div>
    </section>
  );
}

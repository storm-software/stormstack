"use client";

import { OsHeader } from "@open-system/shared-ui-components";
import StackLayer from "./StackLayer";

export default function Stack() {
  return (
    <section className="flex w-full snap-center snap-always justify-center overflow-hidden">
      <div className="flex h-[88rem] w-fit flex-col gap-20 px-10">
        <div className="flex w-fit max-w-[65rem] flex-col gap-20">
          <div className="flex flex-col gap-5">
            <OsHeader level={2}>Full Stack Development</OsHeader>

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
        <div className="relative flex w-full flex-col pt-12">
          <StackLayer
            className="z-10 absolute top-[600px] left-[25%]"
            header="Hardware"
          />
          <StackLayer
            className="z-20 absolute top-[525px] left-[25%]"
            header="Database"
          />
          <StackLayer
            className="z-30 absolute top-[450px] left-[25%]"
            header="Server-Side"
          />
          <StackLayer
            className="z-40 absolute top-[375px] left-[25%]"
            header="Client-Side"
          />
          <StackLayer
            className="z-50 absolute top-[300px] left-[25%]"
            header="Design System"
          />
        </div>
      </div>
    </section>
  );
}

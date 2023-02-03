"use client";

import * as React from "react";

export default function Client() {
  React.useRef(null);
  return (
    <section className="flex w-full snap-center snap-always justify-center overflow-hidden">
      <div className="flex h-[88rem] w-fit flex-col gap-20 px-10">
        <div className="flex w-fit max-w-[65rem] flex-col gap-20">
          <div className="flex flex-col gap-5">
            {/*<OsHeader level={2}>About me</OsHeader>*/}

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
      </div>
    </section>
  );
}

"use client";

import {
  ScrollArrowIndicator,
  ScrollProgressBar,
} from "@open-system/shared-ui-feature-layout";
import { useCallback, useEffect, useRef, useState } from "react";
import "reflect-metadata";
import HorizontalSeparator from "../(components)/horizontal-separator.server";
import Logo from "../../../../../assets/box-logo-gradient.svg";
import Aside from "../aside";
import Header from "./(header)/header";
import Introduction from "./(introduction)/introduction";
import Stack from "./(stack)/stack";
import Technologies from "./(technologies)/technologies";

export default function Client() {
  const ref = useRef<HTMLDivElement>(null);

  const [viewportHeight, setViewportHeight] = useState(0);
  const onResize = useCallback((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      setViewportHeight(entry.contentRect.width);
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => onResize(entries)
    );
    ref.current && resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onResize]);

  return (
    <div ref={ref}>
      <ScrollProgressBar />

      <div className="z-scroll">
        <ScrollArrowIndicator viewportHeight={viewportHeight} />
      </div>

      <div className="flex flex-col">
        <header className="mb-60">
          <Header />
        </header>

        <Aside />

        <main className="flex snap-both snap-mandatory flex-col gap-16 scroll-smooth">
          <Introduction />

          <HorizontalSeparator />

          <Stack />

          <Technologies />

          <HorizontalSeparator />

          <section className="flex snap-center snap-always justify-center">
            <div className="relative h-[38rem] max-w-[65rem] md:w-3/4 lg:w-2/3">
              <div className="absolute bottom-0 left-0">
                <div className="flex flex-col gap-3">
                  <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                    <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                      Patrick
                    </h1>
                  </span>

                  <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                    <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                      Sullivan
                    </h1>
                  </span>

                  <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                    <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                      Development
                    </h1>
                  </span>
                </div>
              </div>

              <div className="absolute top-0 right-0">
                <Logo alt="box-logo" />
              </div>
            </div>
          </section>

          <section className="flex snap-center snap-always justify-center">
            <div className="relative h-[38rem] max-w-[65rem] md:w-3/4 lg:w-2/3">
              <div className="absolute bottom-0 left-0">
                <div className="flex flex-col gap-3">
                  <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                    <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                      Patrick
                    </h1>
                  </span>

                  <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                    <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                      Sullivan
                    </h1>
                  </span>

                  <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                    <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                      Development
                    </h1>
                  </span>
                </div>
              </div>

              <div className="absolute top-0 right-0">
                <Logo alt="box-logo" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

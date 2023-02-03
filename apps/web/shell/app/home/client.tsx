"use client";

import { PdfResumeDownload } from "@open-system/portfolio-ui-feature-resume/pdf-resume-download";
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

/*const Stack = dynamic(() => import("./(stack)/stack"), {
  loading: () => (
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
  ),
});

const ResumeDisplay = dynamic(
  () =>
    import(
      "@open-system/portfolio-ui-feature-resume/resume-display/ResumeDisplay"
    ),
  { ssr: false }
);*/

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

        <main className="flex snap-y snap-proximity flex-col gap-16">
          <div className="snap-center snap-always scroll-px-9">
            <Introduction />
          </div>

          <HorizontalSeparator />

          <div className="snap-center snap-always scroll-px-9">
            <Stack />
          </div>

          <div className="snap-center snap-always scroll-px-9">
            <Technologies />
          </div>

          <HorizontalSeparator />

          {/*<PdfDownloadLink
            document={<PdfResume />}
            fileName="Patrick Sullivan - Resume">
            Download Resume
  </PdfDownloadLink>
  <Link href="/api/get-resume" inNewTab={true}>
            Download Resume
          </Link>
  */}
          <PdfResumeDownload />

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

"use client";

import {
  BaseComponentProps,
  Card,
  Heading,
  IconTypes,
} from "@open-system/design-system-components";
import { BoxLogo } from "@open-system/shared-ui-components/box-logo";
import clsx from "clsx";
import { useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import Wave from "../../../public/images/header-wave.svg";
import Barcode from "./barcode";

/*const PdfResumeDownload = dynamic(
  () => import("../../(components)/pdf-resume-download.client"),
  { ssr: false }
);*/

export interface HeaderProps extends BaseComponentProps {
  isCovered?: boolean;
}

export default function Header({ className, ...props }: HeaderProps) {
  const [isCovered, setIsCovered] = useState(false);

  const { scrollYProgress } = useScroll();
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((scrollY: number) => {
      if (isCovered && !scrollY) {
        setIsCovered(false);
      } else if (!isCovered && scrollY) {
        setIsCovered(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isCovered, scrollYProgress]);

  /*const modalRef = useRef<ModalReference>(null);
  const handleOpen = useCallback(
    () => modalRef && modalRef?.current && modalRef?.current?.open?.(),
    []
  );*/

  return (
    <div className="relative flex h-fit min-h-[205vh] flex-col overflow-hidden pb-10 lg:min-h-[155vh]">
      <div className="relative h-[150vh] min-h-screen w-full">
        <div className="absolute top-0 z-10 h-full w-full overflow-hidden bg-fixed pb-10">
          <div className="relative h-full w-full">
            <div className="absolute left-0 top-0 z-20 h-full w-full overflow-hidden after:absolute after:bottom-0 after:left-0 after:right-0 after:top-0 after:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.75)_100%)] after:content-['']">
              <div className="tv-static absolute -bottom-60 -left-60 -right-60 -top-60 animate-tv-static opacity-[35%]"></div>
            </div>
            <div className="absolute left-0 top-[75vh] z-30 hidden lg:block">
              <Barcode className="origin-top-left -rotate-[90deg]" />
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          { "top-0 pt-[3rem] md:pt-[6rem]": !isCovered },
          { "top-48": isCovered },
          "absolute left-0 right-0 z-content-mid-high flex h-fit w-full flex-col gap-3 transition-all"
        )}>
        <div className="flex h-fit w-full flex-col items-center justify-center gap-2 md:flex-row">
          <div
            className={clsx(
              { "title-text": !isCovered },
              "hidden grid-cols-1 md:grid"
            )}>
            <h1
              id="title-text-1"
              className={clsx(
                { "text-[4.5rem] lg:text-[7rem]": !isCovered },
                { "text-[4rem] lg:text-[6rem]": isCovered },
                "col-start-1 row-start-1 whitespace-pre font-header-1 leading-none text-primary transition-all"
              )}>
              Pat Sullivan
              <br />
              <span className="bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-clip-text text-transparent">
                Development
              </span>
            </h1>
            {!isCovered && (
              <>
                <h1
                  id="title-text-2"
                  className="col-start-1 row-start-1 whitespace-pre text-[4.5rem] font-header-1 leading-none text-primary transition-all lg:text-[7rem]">
                  Pat Sullivan
                  <br />
                  <span className="bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-clip-text text-transparent">
                    Development
                  </span>
                </h1>
                <h1
                  id="title-text-3"
                  className="col-start-1 row-start-1 whitespace-pre text-[4.5rem] font-header-1 leading-none text-primary transition-all lg:text-[7rem]">
                  Pat Sullivan
                  <br />
                  <span className="bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-clip-text text-transparent">
                    Development
                  </span>
                </h1>
              </>
            )}
          </div>

          <div className="w-fit">
            <BoxLogo
              className={clsx(
                { "h-[25rem] w-full": !isCovered },
                { "h-[20rem] w-full": isCovered },
                "animate-flicker transition-all delay-300"
              )}
            />
          </div>
        </div>

        <div
          className={clsx(
            { "flex flex-row opacity-100": !isCovered },
            { "hidden opacity-0": isCovered },
            "mt-2 justify-center transition-opacity"
          )}>
          <div className="align-center flex animate-flicker2 flex-col gap-4">
            <Heading
              level={4}
              className="title-sub-text text-center text-5xl leading-none text-white">
              Software designed for{" "}
              <span className="bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-clip-text text-transparent">
                tomorrow&apos;s
              </span>{" "}
              brands
            </Heading>
            <div className="flex flex-row justify-center">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="w-3/5 fill-zinc-200"
                preserveAspectRatio="none">
                <path
                  d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"
                  strokeLinecap="round"
                  strokeWidth={4}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-0 right-0 z-content-bg w-full">
        <div
          className={clsx(
            { "-translate-y-0": isCovered },
            { "translate-y-full": !isCovered },
            "relative min-h-fit w-full transition-transform duration-[2800ms] ease-in-out"
          )}>
          <Wave
            id="cards"
            className="absolute -top-[20rem] z-content-high h-[22rem] min-w-full"
          />
          <div className="relative flex h-full min-h-fit w-full flex-row items-end justify-center bg-bg-1 px-20 py-[35rem] before:absolute before:inset-0 before:bg-[radial-gradient(35%_35%_at_50%_35%,rgba(112,30,239,.376)_0,rgba(37,38,44,0)_100%)] before:content-['']">
            <div className="grid grid-cols-1 justify-between gap-4 lg:grid-cols-3 lg:gap-8">
              <Card
                className="h-full min-h-[8rem] hover:cursor-pointer"
                title="Subscribe"
                details="Receive email notifications on future updates"
                iconType={IconTypes.BELL}
              />
              <Card
                className="h-full min-h-[8rem] hover:cursor-pointer"
                title="Resume"
                details="Download a copy of my resume"
                iconType={IconTypes.DOWNLOAD}
              />
              <Card
                className="h-full min-h-[8rem] hover:cursor-pointer"
                title="Articles"
                details="Read some recent articles I've written"
                iconType={IconTypes.PENCIL}
              />
              <Card
                className="h-full min-h-[8rem] hover:cursor-pointer"
                title="Contact"
                details="Reach out to me for anything and everything"
                iconType={IconTypes.POST_BOX}
              />
              <Card
                className="h-full min-h-[8rem] hover:cursor-pointer"
                title="Projects"
                details="Check out some projects I'm currently working on"
                iconType={IconTypes.LIST}
              />
              <Card
                className="h-full min-h-[8rem] hover:cursor-pointer"
                title="Design"
                details="Let me explain my favorite software design philosophies"
                iconType={IconTypes.WRENCH}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

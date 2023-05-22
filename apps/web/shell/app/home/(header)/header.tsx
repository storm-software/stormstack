import {
  Card,
  Heading,
  IconTypes,
} from "@open-system/design-system-components";
import { ModalReference } from "@open-system/shared-ui-components";
import { BoxLogo } from "@open-system/shared-ui-components/box-logo";
import clsx from "clsx";
import { AnimatePresence, Variants, motion, useScroll } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import fog from "../../../public/images/fog.png";
import Comet from "./comet";
import Desk from "./desk.svg";
import Moon from "./moon.svg";
import Rocket from "./rocket";
import Star from "./star";
import Ufo from "./ufo";
import Wave from "./wave.svg";

const PdfResumeDownload = dynamic(
  () => import("../../(components)/pdf-resume-download.client"),
  { ssr: false }
);

const cover: Variants = {
  covered: {
    height: "150%",
    transition: {
      duration: 1.5,
      stiffness: 1000,
      velocity: -100,
    },
  },
  uncovered: {
    height: "0",
    transition: {
      duration: 1,
      stiffness: 1000,
    },
  },
};

export default function Header() {
  const ref = useRef<HTMLDivElement | null>(null);

  const [isCovered, setIsCovered] = useState(false);
  const { scrollYProgress } = useScroll();

  const [{ bgX, bgY, titleX, titleY }, setMousePosition] = useState({
    bgX: 0,
    bgY: 0,
    titleX: 0,
    titleY: 0,
  });

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isCovered) {
        const x =
          ref.current?.clientWidth && e.clientX
            ? ref.current.clientWidth / 2 - e.clientX
            : 0;
        const y =
          ref.current?.clientHeight && e.clientY
            ? ref.current.clientHeight / 2 - e.clientY
            : 0;

        setMousePosition({
          bgX: x / 15,
          bgY: y / 15,
          titleX: (x / 80) * -1,
          titleY: (y / 80) * -1,
        });
      }
    },
    [isCovered]
  );

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((scrollY: number) => {
      if (isCovered && !scrollY) {
        setIsCovered(false);
        ref.current?.addEventListener("mousemove", onMouseMove);
      } else if (!isCovered && scrollY) {
        setIsCovered(true);
        ref.current?.removeEventListener("mousemove", onMouseMove);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [isCovered, scrollYProgress, onMouseMove]);

  const modalRef = useRef<ModalReference>(null);
  const handleOpen = useCallback(
    () => modalRef && modalRef?.current && modalRef?.current?.open?.(),
    []
  );

  return (
    <div
      ref={ref}
      className="relative flex h-[120vh] flex-col overflow-hidden pb-10">
      <div className="absolute z-10 h-[116vh] w-full overflow-hidden bg-gradient-to-t from-blue-900 to-blue-900/5 bg-[length:100%_100%] bg-fixed pb-10">
        <div className="relative flex h-full w-full flex-col">
          <motion.div style={{ translateX: bgX, translateY: bgY }}>
            <Moon className="absolute left-16 top-10 h-48 w-48 animate-float-moon rounded-full shadow-[0_0_35px_35px_rgba(0,0,0,0.025)] shadow-yellow-100/20 transition-shadow" />
            <div
              className={clsx(
                { "z-[9999]": !isCovered },
                "absolute left-[25%] top-20 h-fit w-fit"
              )}>
              <Ufo>
                <Desk className="h-20 w-28" />
              </Ufo>
            </div>
            <div className="absolute left-[45%] top-16 z-40 rotate-45">
              <Rocket />
            </div>
            <Star className="left-0 top-[10rem] animate-shine1" rotate={true} />
            <Star
              className="left-[5rem] top-[30rem] animate-shine3"
              rotate={true}
            />
            <Star className="left-[15rem] top-[25rem] animate-shine2" />
            <Star className="left-[24rem] top-[5rem] animate-shine1" />
            <Star className="left-[31rem] top-[10rem] animate-shine3" />
            <Star
              className="left-[38rem] top-[6rem] animate-shine2"
              rotate={true}
            />
            <Star className="left-[40rem] top-[20rem] animate-shine1" />
            <Star className="right-[8rem] top-[6rem] animate-shine1" />
            <Star
              className="right-[36rem] top-[3rem] animate-shine3"
              rotate={true}
            />
            <Star
              className="right-[6rem] top-[20rem] animate-shine2"
              rotate={true}
            />
          </motion.div>

          <Comet className="absolute -left-20 -top-20 z-0 rotate-2 animate-comet1" />
          <Comet className="flip-vertical absolute -left-20 -top-20 z-0 animate-comet2" />

          <div className="absolute bottom-20 left-0 right-0 z-0 h-[12rem] w-full">
            <div className="absolute origin-center rotate-[8deg]">
              <Image
                src={fog}
                alt="Fog"
                className="h-full w-full animate-fog5"
              />
            </div>
            <div className="flip-vertical absolute origin-center -rotate-[8deg]">
              <Image
                src={fog}
                alt="Fog"
                className="h-full w-full animate-fog4"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          { "top-0 pt-[8rem]": !isCovered },
          { "top-32": isCovered },
          "absolute left-0 right-0 z-content w-full transition-all"
        )}>
        <motion.div
          style={{
            translateX: titleX,
            translateY: titleY,
          }}
          className="flex w-full flex-row items-center justify-center gap-2">
          <div className="relative h-fit">
            <h1
              className={clsx(
                { "text-[7rem]": !isCovered },
                { "text-[6rem]": isCovered },
                "whitespace-pre font-header-1 leading-none text-primary transition-all"
              )}>
              Pat Sullivan
              <br />
              <span className="bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-clip-text text-transparent">
                Development
              </span>
            </h1>
          </div>
          <div className="w-fit">
            <BoxLogo
              className={clsx(
                { "w-[550px]": !isCovered },
                { "w-[400px]": isCovered },
                "transition-all"
              )}
            />
          </div>
        </motion.div>
        <AnimatePresence>
          {!isCovered ? (
            <motion.div
              className="mt-5 flex flex-row justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}>
              <div className="align-center flex flex-col gap-6">
                <Heading level={4} className="text-5xl leading-10">
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
                    className="w-3/5 fill-primary"
                    preserveAspectRatio="none">
                    <motion.path
                      d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"
                      strokeLinecap="round"
                      strokeWidth={4}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 2.5,
                        delay: 2,
                        ease: "easeInOut",
                      }}
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-row justify-center px-20">
              <div className="grid grid-cols-3 flex-row justify-between gap-8">
                <motion.div
                  onClick={handleOpen}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0,
                  }}>
                  <Card
                    className="h-full hover:cursor-pointer"
                    title="Subscribe"
                    details="Receive email notifications on future updates"
                    iconType={IconTypes.POST_BOX}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5,
                  }}>
                  <Card
                    className="h-full hover:cursor-pointer"
                    title="Resume"
                    details="Download a copy of my resume"
                    iconType={IconTypes.DOWNLOAD}
                  />
                </motion.div>
                <motion.div
                  onClick={handleOpen}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 1,
                  }}>
                  <Card
                    className="h-full hover:cursor-pointer"
                    title="Articles"
                    details="Check out some recent articles I've written"
                    iconType={IconTypes.PENCIL}
                  />
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        variants={cover}
        initial={false}
        animate={isCovered ? "covered" : "uncovered"}
        className="absolute -bottom-[21rem] left-0 right-0 z-20 w-full bg-bg-1 before:absolute before:inset-0 before:bg-[radial-gradient(35%_25%_at_50%_40%,rgba(112,30,239,.376)_0,rgba(37,38,44,0)_100%)] before:content-['']">
        <div className="relative w-full">
          <Wave className="absolute -top-[21rem] w-[110vw]" />
        </div>
      </motion.div>
    </div>
  );
}

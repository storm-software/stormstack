import { Card, Heading } from "@open-system/design-system-components";
import { ModalReference } from "@open-system/shared-ui-components";
import { BoxLogo } from "@open-system/shared-ui-components/box-logo";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import fog from "../../../public/images/fog.png";
import Comet from "./comet";
import Moon from "./moon.svg";
import Rocket from "./rocket";
import Star from "./star";

const PdfResumeDownload = dynamic(
  () => import("../../(components)/pdf-resume-download.client"),
  { ssr: false }
);

export default function Header() {
  const ref = useRef<HTMLElement | null>(null);

  const [{ bgX, bgY, curveX, curveY, titleX, titleY }, setMousePosition] =
    useState({
      bgX: 0,
      bgY: 0,
      curveX: 0,
      curveY: 0,
      titleX: 0,
      titleY: 0,
    });

  useEffect(() => {
    ref.current?.addEventListener("mousemove", e => {
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
        curveX: x / 30,
        curveY: y / 30,
        titleX: (x / 80) * -1,
        titleY: (y / 80) * -1,
      });
    });
  }, []);

  const modalRef = useRef<ModalReference>(null);
  const handleOpen = useCallback(
    () => modalRef && modalRef?.current && modalRef?.current?.open?.(),
    []
  );

  return (
    <header
      ref={ref}
      className="relative flex flex-col overflow-hidden bg-gradient-to-t from-blue-900 to-blue-900/5 bg-[length:100%_100%] bg-fixed pb-10">
      <motion.div className="z-10" style={{ translateX: bgX, translateY: bgY }}>
        <Moon className="absolute left-16 top-10 h-48 w-48 animate-float-moon rounded-full shadow-[0_0_35px_35px_rgba(0,0,0,0.025)] shadow-yellow-100/20 transition-shadow" />
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
          <Image src={fog} alt="Fog" className="h-full w-full animate-fog5" />
        </div>
        <div className="flip-vertical absolute origin-center -rotate-[8deg]">
          <Image src={fog} alt="Fog" className="h-full w-full animate-fog4" />
        </div>
      </div>

      <motion.div
        style={{ translateX: curveX, translateY: curveY }}
        className="absolute -bottom-5 -left-20 -right-20 z-20 w-[110vw]">
        <svg className="w-full" viewBox="0 0 1440 320">
          <path
            fill="#18181B"
            fillOpacity="1"
            d="M0,224L120,186.7C240,149,480,75,720,74.7C960,75,1200,149,1320,186.7L1440,224L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
        </svg>
      </motion.div>
      <div className="z-30 flex w-full flex-row items-center justify-center gap-2 pt-[6rem]">
        <div className="relative h-fit">
          <div className="z-30">
            <motion.h1
              style={{
                translateX: titleX,
                translateY: titleY,
              }}
              className="whitespace-pre text-[7rem] font-header-1 leading-none text-primary">
              Pat Sullivan
              <br />
              <span className="bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-clip-text text-transparent">
                Development
              </span>
            </motion.h1>
          </div>
        </div>
        <motion.div
          className="w-fit"
          style={{
            translateX: titleX,
            translateY: titleY,
          }}>
          <BoxLogo className="w-[550px]" />
        </motion.div>
      </div>
      <div className="z-30 mb-8 flex flex-row justify-center">
        <Heading level={4} className="text-5xl leading-10">
          Software designed for{" "}

            <span className="bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-clip-text text-transparent">
              tomorrow&apos;s
            </span>{" "}
          brands
        </Heading>
      </div>
      <div className="flex flex-row justify-center">
        <div className="z-scroll flex w-[52rem] flex-row justify-between gap-8">
          <motion.div
            onClick={handleOpen}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0,
            }}>
            <Card
              className="hover:cursor-pointer"
              title="Subscribe"
              details="Receive email notifications on future updates"
            />
          </motion.div>
          {/*<SubscriptionModalForm ref={modalRef} />*/}
          <PdfResumeDownload>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 1,
              }}>
              <Card
                className="hover:cursor-pointer"
                title="Resume Download"
                details="Download a copy of my resume"
              />
            </motion.div>
          </PdfResumeDownload>
        </div>
      </div>
    </header>
  );
}

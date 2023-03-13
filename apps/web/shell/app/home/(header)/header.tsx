import { Card, Heading } from "@open-system/design-system-components";
import { ModalReference } from "@open-system/shared-ui-components";
import { BoxLogo } from "@open-system/shared-ui-components/box-logo";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import PdfResumeDownload from "../../(components)/pdf-resume-download.client";
import SubscriptionModalForm from "../../(components)/subscription-modal-form.client";
import Moon from "./moon.svg";
import Rocket from "./rocket";
import Star from "./star";

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
      className="relative flex min-h-[50rem] flex-col overflow-hidden bg-gradient-to-t from-blue-900 to-blue-900/5 bg-[length:100%_80%] bg-fixed pb-10">
      <motion.div style={{ translateX: bgX, translateY: bgY }}>
        <Moon className="absolute top-10 left-16 h-48 w-48 animate-float-moon rounded-full shadow-[0_0_35px_35px_rgba(0,0,0,0.025)] shadow-yellow-100/20 transition-shadow" />
        <div className="absolute top-16 left-[45%] z-40 rotate-45">
          <Rocket />
        </div>
        <Star className="top-[5rem] left-[24rem] animate-shine1" />
        <Star className="top-[10rem] left-[31rem] animate-shine3" />
        <Star className="top-[6rem] left-[38rem] animate-shine2" />
        <Star className="top-[6rem] right-[8rem] animate-shine1" />
        <Star className="top-[3rem] right-[36rem] animate-shine3" />
        <Star className="top-[10rem] left-0 animate-shine1" />
        <Star className="top-[20rem] right-[6rem] animate-shine2" />
      </motion.div>

      <motion.div
        style={{ translateX: curveX, translateY: curveY }}
        className="absolute -bottom-20 -left-20 -right-20 z-0 h-[70rem] w-full">
        <svg className="h-full" viewBox="0 0 1440 320">
          <path
            fill="#18181B"
            fillOpacity="1"
            d="M0,192L48,176C96,160,192,128,288,144C384,160,480,224,576,213.3C672,203,768,117,864,112C960,107,1056,181,1152,186.7C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
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
          <span className="underline decoration-primary decoration-dotted decoration-8 underline-offset-8">
            <span className="bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-clip-text text-transparent">
              tomorrow&apos;s
            </span>
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
          <SubscriptionModalForm ref={modalRef} />
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

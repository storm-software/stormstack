import { Card, Heading } from "@open-system/design-system-components";
import { ModalReference } from "@open-system/shared-ui-components";
import { BoxLogo } from "@open-system/shared-ui-components/box-logo";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import PdfResumeDownload from "../../(components)/pdf-resume-download.client";
import SubscriptionModalForm from "../../(components)/subscription-modal-form.client";
import HeaderBackground from "./header-background";

export default function Header() {
  const ref = useRef<HTMLElement | null>(null);

  const [{ bgX, bgY, titleX, titleY }, setMousePosition] = useState({
    bgX: 0,
    bgY: 0,
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
        bgX: x / 40,
        bgY: y / 40,
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
      className="relative flex min-h-[50rem] flex-col gap-8 overflow-hidden pb-10">
      <motion.div
        style={{ translateX: bgX, translateY: bgY }}
        className="absolute top-0 -left-24 z-10 h-full w-full">
        <HeaderBackground className="h-full w-[115%] origin-center rotate-180" />
      </motion.div>
      <div className="z-30 flex w-full flex-row items-center justify-center gap-2 pt-[6rem]">
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
        <motion.div
          style={{
            translateX: titleX,
            translateY: titleY,
          }}>
          <BoxLogo className="h-[400px]" />
        </motion.div>
      </div>

      <div className="z-30 flex flex-row justify-center gap-4">
        <Heading level={4} className="text-5xl leading-10">
          Software designed for tomorrow&apos;s brands
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

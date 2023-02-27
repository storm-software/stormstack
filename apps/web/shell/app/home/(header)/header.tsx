import { SubscriptionModalForm } from "@open-system/contact-ui-feature-form";
import { Card, Heading } from "@open-system/design-system-components";
import { ModalReference } from "@open-system/shared-ui-components";
import { BoxLogo } from "@open-system/shared-ui-components/box-logo";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import PdfResumeDownload from "../../(components)/pdf-resume-download.client";
import HeaderBackground from "./header-background";

export default function Header() {
  const ref = useRef<HTMLElement | null>(null);

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    ref.current?.addEventListener("mousemove", e => {
      setMousePosition(
        ref.current
          ? {
              x: (ref.current.clientWidth / 2 - e.clientX) / 10,
              y: (ref.current.clientHeight / 2 - e.clientY) / 10,
            }
          : { x: 0, y: 0 }
      );
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
      className="relative flex min-h-[120vh] flex-col gap-12 overflow-hidden pb-10">
      <motion.div
        style={{ translateX: mousePosition.x, translateY: mousePosition.y }}
        className="absolute top-0 -left-24 z-10 h-full w-full">
        <HeaderBackground className="h-full w-[115%] origin-center rotate-180" />
      </motion.div>
      <div className="z-30 flex w-full flex-row items-center justify-center gap-2 pt-[6rem]">
        <h1 className="whitespace-pre text-[7rem] font-header-1 leading-none text-primary">
          Pat Sullivan
          <br />
          <span className="bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-clip-text text-transparent">
            Development
          </span>
        </h1>
        <BoxLogo className="h-[400px]" />
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

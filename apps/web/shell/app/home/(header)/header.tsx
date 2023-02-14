import { SubscriptionModalForm } from "@open-system/contact-ui-feature-form";
import { Card } from "@open-system/design-system-components";
import { ModalReference } from "@open-system/shared-ui-components";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useCallback, useRef } from "react";
import PdfResumeDownload from "../../(components)/pdf-resume-download.client";
import { default as Logo } from "../../../../../../assets/box-logo-gradient.svg";
import BackgroundPattern from "./background-pattern";

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [0, 360]);
}

export default function Header() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const titleRotateZ: any = useTransform(scrollYProgress, [0, 1], [0, -560]);
  const logoRotateZ: any = useTransform(scrollYProgress, [0, 1], [0, 560]);

  const modalRef = useRef<ModalReference>(null);
  const handleOpen = useCallback(
    () => modalRef && modalRef?.current && modalRef?.current?.open?.(),
    []
  );

  return (
    <header className="relative flex snap-center snap-always flex-col gap-12 overflow-hidden bg-bg-title bg-[length:100%_60%] bg-fixed bg-no-repeat bg-origin-border py-20 pt-[2rem]">
      <div className="flex flex-row justify-center">
        <div className="relative h-[34rem] w-[54rem]">
          <motion.div
            style={{ rotateZ: titleRotateZ }}
            className="absolute bottom-0 left-0 z-30 origin-bottom-left">
            <div className="flex flex-col gap-5">
              <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_40%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]">
                <h1 className="font-app-title-1 text-8xl leading-[4.5rem] text-primary shadow-white text-shadow-lg">
                  Pat Sullivan
                </h1>
              </span>
              <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_40%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]">
                <h1 className="font-app-title-1 text-8xl leading-[4.5rem] text-primary shadow-white text-shadow-lg">
                  Development
                </h1>
              </span>
            </div>
          </motion.div>
          <motion.div
            style={{ rotateZ: logoRotateZ }}
            className="absolute top-0 right-0 z-30 origin-bottom-right">
            <Logo alt="box-logo" height={360} />
          </motion.div>
        </div>
      </div>

      <div className="flex flex-row justify-center">
        <div className="z-scroll flex w-[52rem] flex-row justify-between gap-8">
          <motion.div
            onClick={handleOpen}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            style={{ x: titleRotateZ * 10 }}>
            <Card
              className="hover:cursor-pointer"
              title="Subscribe"
              details="Receive email notifications on future updates"
            />
          </motion.div>

          <SubscriptionModalForm ref={modalRef} />

          <PdfResumeDownload>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 1,
                ease: [0, 0.71, 0.2, 1.01],
              }}
              style={{ x: logoRotateZ * 10 }}>
              <Card
                title="Resume Download"
                details="Download a copy of my resume"
              />
            </motion.div>
          </PdfResumeDownload>
        </div>
      </div>

      <div className="absolute left-0 top-8">
        {/*<BackgroundSpiral width={475} strokeWidth={10} /> <HeaderLinks />*/}
      </div>
      <motion.div
        style={{ rotateZ: titleRotateZ }}
        className="absolute -bottom-2.5 left-0">
        <BackgroundPattern />
      </motion.div>
      <motion.div
        style={{ rotateZ: logoRotateZ }}
        className="absolute -bottom-2.5 right-0">
        <BackgroundPattern isInverse={true} />
      </motion.div>
    </header>
  );
}

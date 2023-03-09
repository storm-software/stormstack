import { Card, Heading } from "@open-system/design-system-components";
import { ModalReference } from "@open-system/shared-ui-components";
import { BoxLogo } from "@open-system/shared-ui-components/box-logo";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import PdfResumeDownload from "../../(components)/pdf-resume-download.client";
import SubscriptionModalForm from "../../(components)/subscription-modal-form.client";

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
      {/*<motion.div
        style={{ translateX: bgX, translateY: bgY }}
        className="absolute top-0 -left-24 z-10 h-full w-full">
        <HeaderBackground className="h-full w-[115%] origin-center rotate-180" />
  </motion.div>*/}
      <div className="absolute top-0 left-0 right-0 z-0 h-[28rem] w-full">
        <svg className="h-full" viewBox="0 0 1440 320">
          <path
            fill="#523188"
            fill-opacity="1"
            d="M0,256L80,224C160,192,320,128,480,138.7C640,149,800,235,960,245.3C1120,256,1280,192,1360,160L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
        </svg>
      </div>

      <div className="z-30 flex w-full flex-row items-center justify-center gap-2 pt-[6rem]">
        <div className="relative h-fit">
          {/*<div className="absolute -top-20 -left-20 z-0">
            <svg className="h-96 w-96" viewBox="0 0 102 108" fill="none">
              <path
                d="M27.7998 86L31.8998 90.2"
                stroke="#9D9D9D"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M13.5996 71.7998L21.1996 79.4998"
                stroke="#9D9D9D"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M26.4004 72.7998L55.1004 101.4"
                stroke="#9D9D9D"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M11.7998 58.2002L17.6998 64.0002"
                stroke="#9D9D9D"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M47 81.3999L72.2 106.6"
                stroke="currentColor"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M47 81.3999L72.2 106.6"
                stroke="currentColor"
                stroke-opacity="0.2"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M9 43.3999L35.9 70.1999"
                stroke="currentColor"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M9 43.3999L35.9 70.1999"
                stroke="currentColor"
                stroke-opacity="0.2"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M30.0996 52.5L74.4996 96.9"
                stroke="#9D9D9D"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M11.7002 34.1001L21.1002 43.5001"
                stroke="#9D9D9D"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M66.7998 77.2002L77.3998 87.9002"
                stroke="#9D9D9D"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M1 11.5L55.5 66"
                stroke="#9D9D9D"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M44.7002 43.2002L98.0002 96.5002"
                stroke="currentColor"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M44.7002 43.2002L98.0002 96.5002"
                stroke="currentColor"
                stroke-opacity="0.2"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M21.2002 19.7002L33.6002 32.1002"
                stroke="currentColor"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M21.2002 19.7002L33.6002 32.1002"
                stroke="currentColor"
                stroke-opacity="0.2"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M55.0996 41.6001L89.4996 76.0001"
                stroke="#9D9D9D"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M20 6.5L45.4 31.9"
                stroke="#9D9D9D"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M83.4004 58L101.4 76"
                stroke="currentColor"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M83.4004 58L101.4 76"
                stroke="currentColor"
                stroke-opacity="0.2"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M35.5 10.0996L70.4 44.8996"
                stroke="currentColor"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M35.5 10.0996L70.4 44.8996"
                stroke="currentColor"
                stroke-opacity="0.2"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M66 28.5996L90.3 52.8996"
                stroke="#9D9D9D"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M38.4004 1L56.5004 19.1"
                stroke="#9D9D9D"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M87.5996 38.2002L96.9996 47.7002"
                stroke="currentColor"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M87.5996 38.2002L96.9996 47.7002"
                stroke="currentColor"
                stroke-opacity="0.2"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M52.9004 3.5L76.8004 27.5"
                stroke="currentColor"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M52.9004 3.5L76.8004 27.5"
                stroke="currentColor"
                stroke-opacity="0.2"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M82.7002 21.4004L88.5002 27.2004"
                stroke="#9D9D9D"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M72.5 11.2002L76.5 15.2002"
                stroke="#9D9D9D"
                stroke-width="1.1533"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
            </svg>
</div>*/}
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

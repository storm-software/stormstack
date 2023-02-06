import ArrowDownTrayIcon from "@heroicons/react/24/outline/ArrowDownTrayIcon";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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

  return (
    <header className="relative flex snap-center snap-always justify-center overflow-hidden bg-bg-title bg-[length:100%_60%] bg-fixed bg-no-repeat bg-origin-border py-20 pt-[5.5rem]">
      <div className="absolute top-12 left-32 z-scroll flex flex-col gap-5">
        <PdfResumeDownload>
          <motion.h2
            className="group cursor-pointer font-link-title-1 text-6xl"
            whileInView={{ y: -20, opacity: 1 }}
            initial={{ y: 0, opacity: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0 }}>
            <span className="flex w-fit flex-row bg-gradient-to-r from-pink-400 to-fuchsia-900 bg-[length:100%_16px] bg-bottom bg-no-repeat px-1 transition group-hover:from-primary group-hover:to-primary">
              <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent transition group-hover:from-pink-400 group-hover:to-fuchsia-900">
                Resume
              </span>{" "}
              <ArrowDownTrayIcon
                className="stroke-primary group-hover:stroke-fuchsia-900"
                height={65}
                width={50}
              />
            </span>
          </motion.h2>
        </PdfResumeDownload>
        <motion.h2
          className="group cursor-pointer font-link-title-1 text-6xl"
          whileInView={{ y: -20, opacity: 1 }}
          initial={{ y: 0, opacity: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}>
          <span className="bg-gradient-to-r from-pink-400 to-fuchsia-900 bg-[length:100%_16px] bg-bottom bg-no-repeat px-1 transition group-hover:from-primary group-hover:to-primary">
            <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent transition group-hover:from-pink-400 group-hover:to-fuchsia-900">
              Projects
            </span>
          </span>
        </motion.h2>
        <motion.h2
          className="group cursor-pointer font-link-title-1 text-6xl"
          whileInView={{ y: -20, opacity: 1 }}
          initial={{ y: 0, opacity: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}>
          <span className="bg-gradient-to-r from-pink-400 to-fuchsia-900 bg-[length:100%_16px] bg-bottom bg-no-repeat px-1 transition group-hover:from-primary group-hover:to-primary">
            <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent transition group-hover:from-pink-400 group-hover:to-fuchsia-900">
              Articles
            </span>
          </span>
        </motion.h2>
        <motion.h2
          className="group cursor-pointer font-link-title-1 text-6xl"
          whileInView={{ y: -20, opacity: 1 }}
          initial={{ y: 0, opacity: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.5 }}>
          <span className="bg-gradient-to-r from-pink-400 to-fuchsia-900 bg-[length:100%_16px] bg-bottom bg-no-repeat px-1 transition group-hover:from-primary group-hover:to-primary">
            <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent transition group-hover:from-pink-400 group-hover:to-fuchsia-900">
              Open System
            </span>
          </span>
        </motion.h2>
      </div>
      <div className="relative h-[36.5rem] w-[54rem]">
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
          <Logo alt="box-logo" height={400} />
        </motion.div>
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

"use client";

import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Logo from "../../../../assets/box-logo-gradient.svg";
import Aside from "./Aside";
import Introduction from "./Introduction";
import Stack from "./Stack";
import Title from "./Title";

const SCROLL_Y_THRESHOLD = 1000;

export default function Client() {
  const ref = useRef<HTMLDivElement>(null);

  const [viewportHeight, setViewportHeight] = useState(0);
  const onResize = useCallback((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      setViewportHeight(entry.contentRect.width);
    }
  }, []);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => onResize(entries)
    );
    ref.current && resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onResize]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [hideScrollArrow, setHideScrollArrow] = useState(false);
  useLayoutEffect(() => {
    const unsubscribe = scrollYProgress.onChange((scrollY: number) => {
      if (
        !hideScrollArrow &&
        viewportHeight &&
        scrollY >= viewportHeight - SCROLL_Y_THRESHOLD
      ) {
        setHideScrollArrow(true);
      } else if (
        hideScrollArrow &&
        viewportHeight &&
        scrollY < viewportHeight - SCROLL_Y_THRESHOLD
      ) {
        setHideScrollArrow(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [hideScrollArrow, scrollYProgress, viewportHeight]);

  return (
    <div ref={ref}>
      <div className="fixed top-0 left-0 right-0 z-progress">
        <motion.div className="h-2 bg-highlight-1" style={{ scaleX }} />
      </div>

      <AnimatePresence>
        {!hideScrollArrow && (
          <motion.div
            className="fixed -left-16 -bottom-16 h-52 w-52 rounded-full border-4 border-secondary"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 1,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}>
            <div className="z-scroll flex h-full w-full items-center justify-center">
              <ArrowDownIcon className="h-12 w-12 animate-bounce fill-secondary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex snap-both snap-mandatory flex-col scroll-smooth">
        <div className="mb-60">
          <Title />
        </div>

        <Aside />

        <div className="mb-60">
          <Stack />
        </div>
        <Introduction />

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
      </div>

      <div className="space-y-10 text-white"></div>
    </div>
  );
}

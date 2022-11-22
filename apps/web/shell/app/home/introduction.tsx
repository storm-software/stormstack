"use client";

import {
  motion,
  useSpring,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Logo from "../../../../../assets/box-logo-gradient.svg";

export default function Introduction() {
  const scrollRef = useRef(null);
  const ghostRef = useRef(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [viewportW, setViewportW] = useState(0);

  useLayoutEffect(() => {
    scrollRef && setScrollRange(scrollRef.current.scrollWidth);
  }, [scrollRef]);

  const onResize = useCallback(entries => {
    for (const entry of entries) {
      setViewportW(entry.contentRect.width);
    }
  }, []);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(entries => onResize(entries));
    resizeObserver.observe(ghostRef.current);
    return () => resizeObserver.disconnect();
  }, [onResize]);

  const { scrollYProgress } = useViewportScroll();
  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -scrollRange + viewportW]
  );
  const physics = { damping: 15, mass: 0.27, stiffness: 55 };
  const spring = useSpring(transform, physics);

  return (
    <div className="relative h-[200vh] w-full snap-center snap-always">
      <div className="sticky top-10 left-0 right-0 ">
        <motion.section
          ref={scrollRef}
          style={{ x: spring }}
          className="relative flex w-fit flex-row gap-60 px-[500rem]">
          <div className="relative mx-[500rem] h-[40rem] w-screen">
            <div className="absolute bottom-0 left-0">
              <div className="flex flex-col">
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Patrick
                </h1>
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Sullivan
                </h1>
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Development
                </h1>
              </div>
            </div>

            <div className="absolute top-0 right-0">
              <Logo alt="box-logo" />
            </div>
          </div>

          <div className="relative mx-[500rem] h-[40rem] w-screen">
            <div className="absolute bottom-0 left-0">
              <div className="flex flex-col">
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Patrick
                </h1>
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Sullivan
                </h1>
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Development
                </h1>
              </div>
            </div>

            <div className="absolute top-0 right-0">
              <Logo alt="box-logo" />
            </div>
          </div>

          <div className="relative mx-[500rem] h-[40rem] w-screen">
            <div className="absolute bottom-0 left-0">
              <div className="flex flex-col">
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Patrick
                </h1>
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Sullivan
                </h1>
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Development
                </h1>
              </div>
            </div>

            <div className="absolute top-0 right-0 mx-[500rem]">
              <Logo alt="box-logo" />
            </div>
          </div>

          <div className="relative mx-[500rem] h-[40rem] w-screen">
            <div className="absolute bottom-0 left-0">
              <div className="flex flex-col">
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Patrick
                </h1>
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Sullivan
                </h1>
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Development
                </h1>
              </div>
            </div>

            <div className="absolute top-0 right-0">
              <Logo alt="box-logo" />
            </div>
          </div>

          <div className="relative mx-[500rem] h-[40rem] w-screen">
            <div className="absolute bottom-0 left-0">
              <div className="flex flex-col">
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Patrick
                </h1>
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Sullivan
                </h1>
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Development
                </h1>
              </div>
            </div>

            <div className="absolute top-0 right-0">
              <Logo alt="box-logo" />
            </div>
          </div>

          <div className="relative mx-[500rem] h-[40rem] w-screen">
            <div className="absolute bottom-0 left-0">
              <div className="flex flex-col">
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Patrick
                </h1>
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Sullivan
                </h1>
                <h1 className="font-barrio text-7xl text-primary shadow-sm">
                  Development
                </h1>
              </div>
            </div>

            <div className="absolute top-0 right-0">
              <Logo alt="box-logo" />
            </div>
          </div>
        </motion.section>
      </div>
      <div ref={ghostRef} style={{ height: scrollRange }} className="hidden" />
    </div>
  );
}

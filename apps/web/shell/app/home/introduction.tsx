"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
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

  const { scrollYProgress } = useScroll();
  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -scrollRange + viewportW]
  );
  const spring = useSpring(transform);

  return (
    <div className="relative h-[350vh] w-full snap-center">
      <div className="sticky top-10 left-0 right-0 overflow-hidden">
        <motion.section
          ref={scrollRef}
          style={{ x: spring }}
          className="relative flex w-fit flex-row gap-[70rem] pl-[600rem] pr-[500rem]">
          <div className="relative h-[40rem] w-[70rem]">
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

          <div className="relative h-[40rem] w-[70rem] shrink-0 snap-mandatory snap-center snap-always scroll-m-[70rem]">
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

          <div className="relative h-[40rem] w-[70rem] shrink-0 snap-mandatory snap-center snap-always scroll-m-[70rem]">
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

          <div className="relative h-[40rem] w-[70rem] shrink-0 snap-mandatory snap-center snap-always scroll-m-[70rem]">
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

          <div className="relative h-[40rem] w-[70rem] shrink-0 snap-mandatory snap-center snap-always scroll-m-[70rem]">
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

          <div className="relative h-[40rem] w-[70rem] shrink-0 snap-mandatory snap-center snap-always scroll-m-[70rem]">
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

"use client";

import { Heading } from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import StackLayer from "./stack-layer";

const list = { hidden: { opacity: 1 } };

export default function Stack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="z-content flex w-full snap-center snap-always flex-col items-center justify-center gap-20 overflow-hidden">
      <div className="flex h-[75rem] w-fit flex-col gap-20 px-10">
        <div className="flex w-fit max-w-[65rem] flex-col gap-20">
          <div className="flex flex-col gap-5">
            <Heading level={2}>Full Stack Development</Heading>

            <p className="font-body-1 text-body-1">
              I feel nowadays the phrase{" "}
              <Link
                href="https://www.geeksforgeeks.org/what-is-full-stack-development/"
                inNewTab={true}>
                full stack developer
              </Link>{" "}
              is overwhelming used incorrectly; however, I am very comfortable
              working in all areas of modern software development (and some
              areas of hardware development). My experience ranges as far as
              developing a UI/UX design system for a React banking client, all
              the way to reading PCB schematics for commercial aeronautical
              applications.
            </p>
          </div>
        </div>
        <div ref={ref}>
          {isInView && (
            <motion.ul
              className="relative flex w-full flex-col pt-12"
              initial={{ opacity: 0 }}
              animate="hidden"
              variants={list}
              transition={{ duration: 1, delay: 1 }}>
              <StackLayer
                className="absolute top-[600px] left-[25%] z-10"
                header="Hardware"
                delay={0.4}
              />
              <StackLayer
                className="absolute top-[525px] left-[25%] z-20"
                header="Database"
                delay={0.3}
              />
              <StackLayer
                className="absolute top-[450px] left-[25%] z-30"
                header="Server-Side"
                delay={0.2}
              />
              <StackLayer
                className="absolute top-[375px] left-[25%] z-40"
                header="Client-Side"
                delay={0.1}
              />
              <StackLayer
                className="absolute top-[300px] left-[25%] z-50"
                header="Design System"
                delay={0}
              />
            </motion.ul>
          )}
        </div>
      </div>
    </section>
  );
}

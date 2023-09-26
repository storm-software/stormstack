"use client";

import { Link } from "@stormstack/core-client-components";
import { Heading } from "@stormstack/design-system-components";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import StackLayer from "./stack-layer";

const list = { hidden: { opacity: 1 } };

export default function Page() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="w-full gap-20 z-content flex snap-center snap-always flex-col items-center justify-center overflow-hidden">
      <div className="w-fit gap-20 px-10 flex h-[75rem] flex-col">
        <motion.div
          className="w-fit gap-20 flex max-w-[65rem] flex-col"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.75, duration: 1.5 }}>
          <div className="gap-5 flex flex-col">
            <Heading level={2}>Full Stack Development</Heading>

            <p className="text-body-1 font-body-1">
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
        </motion.div>
        <div ref={ref}>
          {isInView && (
            <motion.ul
              className="w-full pt-12 relative flex flex-col"
              initial={{ opacity: 0 }}
              animate="hidden"
              variants={list}
              transition={{ duration: 1, delay: 1 }}>
              <StackLayer
                className="z-10 absolute left-[25%] top-[600px]"
                header="Hardware"
                delay={0.4}
              />
              <StackLayer
                className="z-20 absolute left-[25%] top-[525px]"
                header="Database"
                delay={0.3}
              />
              <StackLayer
                className="z-30 absolute left-[25%] top-[450px]"
                header="Server-Side"
                delay={0.2}
              />
              <StackLayer
                className="z-40 absolute left-[25%] top-[375px]"
                header="Client-Side"
                delay={0.1}
              />
              <StackLayer
                className="z-50 absolute left-[25%] top-[300px]"
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

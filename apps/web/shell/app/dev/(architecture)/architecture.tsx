"use client";

import { Link } from "@open-system/core-components";
import { Heading } from "@open-system/design-system-components";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef } from "react";
import PuzzlePiece from "../../../public/static/images/puzzle-piece.svg";
import ApiGeneration from "./api-generation";
import LayeredDesign from "./layered-design";

const list = { hidden: { opacity: 1 } };

export default function Page() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="z-content flex w-full snap-center snap-always flex-col items-center gap-5 pb-20">
      <div className="relative w-full max-w-[65rem] flex-col justify-center">
        <AnimatePresence>
          {isInView && (
            <motion.div
              className="z-like sticky right-40 top-36 flex flex-row justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1,
                delay: 0.2,
              }}>
              <Heading level={2}>Architecture Style</Heading>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-row items-center gap-14">
          <div ref={ref} className="mb-32 mt-10 h-96 w-96">
            {isInView && (
              <motion.ul
                className="relative h-96 w-96"
                initial={{ opacity: 0 }}
                animate="hidden"
                variants={list}
                transition={{ duration: 1, delay: 1 }}>
                <motion.div
                  className="z-like absolute left-0 top-0"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 1,
                    delay: 0,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}>
                  <PuzzlePiece
                    alt="Puzzle Piece"
                    className="translate-x-16 translate-y-4 fill-highlight-1"
                    height={200}
                    width={200}
                  />
                </motion.div>
                <motion.div
                  className="z-like absolute right-0 top-0"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 1,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}>
                  <PuzzlePiece
                    alt="Puzzle Piece"
                    className="translate-x-10 translate-y-14 rotate-90 fill-quaternary"
                    height={200}
                    width={200}
                  />
                </motion.div>
                <motion.div
                  className="z-like absolute bottom-0 right-0"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 1,
                    delay: 1,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}>
                  <PuzzlePiece
                    alt="Puzzle Piece"
                    className="translate-y-8 rotate-180 fill-tertiary"
                    height={200}
                    width={200}
                  />
                </motion.div>
                <motion.div
                  className="z-like absolute bottom-0 left-0"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 1,
                    delay: 1.5,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}>
                  <PuzzlePiece
                    alt="Puzzle Piece"
                    className="-translate-y-2 translate-x-6 -rotate-90 fill-secondary"
                    height={200}
                    width={200}
                  />
                </motion.div>
              </motion.ul>
            )}
          </div>
          <Heading level={4} className="text-5xl leading-10">
            Paint the larger picture by combining smaller pieces
          </Heading>
        </div>
      </div>
      <div className="flex w-fit max-w-[65rem] flex-col gap-20">
        <div className="flex flex-col gap-5">
          <p className="font-body-1 text-body-1">
            I generally prefer to combine the power of{" "}
            <Link href="https://micro-frontends.org/" inNewTab={true}>
              micro-frontends
            </Link>{" "}
            and{" "}
            <Link href="https://microservices.io/" inNewTab={true}>
              micro-services
            </Link>{" "}
            to separate the code into smaller modules that can be developed in
            parallel, and later integrated with pre-defined contracts.
          </p>
        </div>
      </div>

      <ApiGeneration />

      <LayeredDesign />
    </section>
  );
}

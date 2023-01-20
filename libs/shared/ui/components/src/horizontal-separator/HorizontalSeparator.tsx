"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef } from "react";

export function HorizontalSeparator({ className }: BaseComponentProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className={clsx(
        "z-bg flex h-[80px] w-full flex-col items-center justify-center gap-4",
        className
      )}>
      <AnimatePresence>
        {isInView && (
          <div className="w-1/2">
            <svg
              width="800"
              viewBox="0 0 600 63"
              x="0px"
              y="0px"
              xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient
                  id="linear-gradient"
                  gradientUnits="userSpaceOnUse"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%">
                  <motion.stop
                    stopColor="#14b8a6"
                    animate={{
                      stopColor: ["#8b5cf6", "#0284c7", "#14b8a6"],
                    }}
                    transition={{
                      yoyo: Infinity,
                      ease: "linear",
                      duration: 6,
                      repeatType: "reverse",
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    offset="0%"
                  />
                  <motion.stop
                    stopColor="#8b5cf6"
                    animate={{
                      stopColor: ["#14b8a6", "#0284c7", "#8b5cf6"],
                    }}
                    transition={{
                      yoyo: Infinity,
                      ease: "linear",
                      duration: 8,
                      repeatType: "reverse",
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    offset="100%"
                  />
                </linearGradient>
              </defs>
              <motion.path
                d="M99 20 L 500 20"
                stroke="url(#linear-gradient)"
                strokeLinecap="round"
                strokeWidth={4}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M589 30 L11 30"
                stroke="url(#linear-gradient)"
                strokeLinecap="round"
                strokeWidth={4}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M99 40 L500 40"
                stroke="url(#linear-gradient)"
                strokeLinecap="round"
                strokeWidth={4}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />

              {/*<motion.path
                d="M249 10 L350 10"
                stroke="url(#linear-gradient)"
                strokeLinecap="round"
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M350 50 L249 50"
                stroke="url(#linear-gradient)"
                strokeLinecap="round"
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M199 10 L199 50"
                stroke="url(#linear-gradient)"
                strokeLinecap="round"
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M400 50 L400 10"
                stroke="url(#linear-gradient)"
                strokeLinecap="round"
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M300 60 L300 1"
                stroke="url(#linear-gradient)"
                strokeLinecap="round"
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                  />*/}
            </svg>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

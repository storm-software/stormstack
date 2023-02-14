"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PropsWithBase } from "../types";

export type SuccessIconProps = PropsWithBase<{
  /**
   * Should the background be animated
   */
  animateBackground?: boolean;

  /**
   * Should the border be animated
   */
  animateBorder?: boolean;
}>;

export function SuccessIcon({
  className,
  animateBackground = true,
  animateBorder = true,
  ...props
}: SuccessIconProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref}>
      <AnimatePresence>
        {isInView && (
          <svg className={clsx("fill-inverse", className)} viewBox="0 0 70 70">
            <motion.path
              initial={{ opacity: animateBackground ? 0 : 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3.5, ease: "easeInOut" }}
              d="M35,60 C21.1928813,60 10,48.8071187 10,35 C10,21.1928813 21.1928813,10 35,10 C48.8071187,10 60,21.1928813 60,35 C60,48.8071187 48.8071187,60 35,60 Z M23.6332378,33.2260427 L22.3667622,34.7739573 L34.1433655,44.40936 L47.776114,27.6305926 L46.223886,26.3694074 L33.8566345,41.59064 L23.6332378,33.2260427 Z"
            />
            <motion.circle
              cx="35"
              cy="35"
              r="24"
              className="stroke-success"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: animateBorder ? 0 : 1 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
            <motion.polyline
              className="stroke-success"
              strokeLinecap="round"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              points="25 36 34 43 47 27"
            />
          </svg>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { BaseComponentProps } from "@open-system/design-system-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

const SCROLL_Y_THRESHOLD = 1000;

export interface ScrollArrowIndicatorProps extends BaseComponentProps {
  viewportHeight: number;
  scrollYThreshold?: number;
  isHidden?: boolean;
}

export function ScrollArrowIndicator({
  viewportHeight,
  isHidden = false,
  scrollYThreshold = SCROLL_Y_THRESHOLD,
  ...props
}: ScrollArrowIndicatorProps) {
  const { scrollYProgress } = useScroll();
  const [hideScrollArrow, setHideScrollArrow] = useState(false);
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((scrollY: number) => {
      if (!isHidden) {
        if (
          !hideScrollArrow &&
          viewportHeight &&
          scrollY >= viewportHeight - scrollYThreshold
        ) {
          setHideScrollArrow(true);
        } else if (
          hideScrollArrow &&
          viewportHeight &&
          scrollY < viewportHeight - scrollYThreshold
        ) {
          setHideScrollArrow(false);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, [
    hideScrollArrow,
    isHidden,
    scrollYProgress,
    scrollYThreshold,
    viewportHeight,
  ]);

  return (
    <AnimatePresence>
      {(!hideScrollArrow || isHidden) && (
        <motion.div
          className="fixed -left-16 -bottom-16 z-scroll h-52 w-52 rounded-full border-4 border-secondary"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}>
          <div className="flex h-full w-full items-center justify-center">
            <ArrowDownIcon className="h-12 w-12 animate-bounce fill-secondary stroke-secondary" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

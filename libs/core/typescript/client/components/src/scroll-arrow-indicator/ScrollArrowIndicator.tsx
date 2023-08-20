"use client";

import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { BaseComponentProps } from "@open-system/design-system-components";
import { AnimatePresence, motion } from "framer-motion";

export interface ScrollArrowIndicatorProps extends BaseComponentProps {
  isHidden?: boolean;
}

export function ScrollArrowIndicator({
  isHidden = false,
  ...props
}: ScrollArrowIndicatorProps) {
  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.div
          {...props}
          className="fixed -bottom-16 -left-16 z-scroll h-52 w-52 rounded-full border-[6px] border-secondary"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}>
          <div className="flex h-full w-full items-center justify-center">
            <ArrowDownIcon
              className="h-16 w-12 animate-bounce fill-secondary stroke-secondary"
              strokeWidth={3}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

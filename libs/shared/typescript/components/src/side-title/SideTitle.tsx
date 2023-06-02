"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import { Link } from "@open-system/core-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

const variants = {
  shown: {
    opacity: 1,
    transition: {
      duration: 2,
      delay: 2,
      ease: [0, 0.71, 0.2, 1.01],
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: 1,
      delay: 0,
      ease: [0, 0.71, 0.2, 1.01],
    },
  },
};

export function SideTitle({ className, ...props }: BaseComponentProps) {
  const [isHidden, setIsHidden] = useState(true);

  const { scrollYProgress } = useScroll();
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (scrollY: number) => {
      if (!isHidden && !scrollY) {
        setIsHidden(true);
      } else if (isHidden && scrollY) {
        setIsHidden(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [isHidden, scrollYProgress]);

  return (
    <AnimatePresence>
      <motion.div
        className="sticky left-16 top-[21.6rem] z-content-mid-low h-0 w-0 whitespace-nowrap"
        variants={variants}
        initial={false}
        animate={isHidden ? "hidden" : "shown"}>
        <div className="flex -rotate-90 flex-col">
          <Link>
            <h1 className="font-app-title-1 text-6xl leading-none text-primary">
              Pat Sullivan
              <br />
              <span className="bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-clip-text text-transparent">
                Development
              </span>
            </h1>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

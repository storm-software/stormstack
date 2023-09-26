"use client";

import { BaseComponentProps } from "@stormstack/design-system-components";
import { Link } from "@stormstack/core-client-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

const variants = {
  shown: {
    opacity: 1,
    transition: {
      duration: 2,
      delay: 2,
      ease: [0, 0.71, 0.2, 1.01]
    }
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: 1,
      delay: 0,
      ease: [0, 0.71, 0.2, 1.01]
    }
  }
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
        className="left-16 h-0 w-0 sticky top-[21.6rem] z-content-mid-low whitespace-nowrap"
        variants={variants}
        initial={false}
        animate={isHidden ? "hidden" : "shown"}>
        <div className="-rotate-90 flex flex-col">
          <Link>
            <h1 className="text-6xl leading-none text-primary font-app-title-1">
              Pat Sullivan
              <br />
              <span className="bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from text-transparent bg-clip-text">
                Development
              </span>
            </h1>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

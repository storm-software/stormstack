"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

export function SideTitle({ className, ...props }: BaseComponentProps) {
  const [hide, setHide] = useState(true);

  const { scrollYProgress } = useScroll();
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((scrollY: number) => {
      if (!hide && !scrollY) {
        setHide(true);
      } else if (hide && scrollY) {
        setHide(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [hide, scrollYProgress]);

  return (
    <AnimatePresence>
      {!hide && (
        <motion.div
          className="sticky top-[22rem] left-16 z-0 h-0 w-0 whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 2,
            delay: 2,
            ease: [0, 0.71, 0.2, 1.01],
          }}>
          <div className="flex -rotate-90 flex-col">
            <Link>
              <h1 className="font-app-title-1 text-6xl leading-none text-primary shadow-white drop-shadow-2xl">
                Pat Sullivan
              </h1>
              <h1 className="font-app-title-1 text-6xl leading-none text-primary shadow-white drop-shadow-2xl">
                Development
              </h1>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

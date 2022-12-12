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
          className="sticky top-[26rem] left-16 z-0 h-0 w-0 whitespace-nowrap"
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
              <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_40%] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_6px]">
                <h1 className="font-app-title-1 text-6xl leading-none text-primary shadow-white drop-shadow-2xl">
                  Patrick Sullivan
                </h1>
              </span>
              <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_40%] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_6px]">
                <h1 className="font-app-title-1 text-6xl leading-none text-primary shadow-white drop-shadow-2xl">
                  Development
                </h1>
              </span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

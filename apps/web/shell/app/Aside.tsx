"use client";

import { SideTitle } from "@open-system/shared-ui-feat-layout";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useLayoutEffect, useState } from "react";

export default function Aside() {
  const [hide, setHide] = useState(true);

  const { scrollYProgress } = useScroll();
  useLayoutEffect(() => {
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
          <SideTitle />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

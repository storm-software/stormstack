"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";
import { motion, useScroll, useTransform } from "framer-motion";
import { default as BackgroundImg } from "../../../../../../assets/backgrounds/bg-header.svg";

export interface BackgroundPatternProps extends BaseComponentProps {
  isInverse?: boolean;
}

export default function BackgroundPattern({
  isInverse = false,
}: BackgroundPatternProps) {
  /*const { scrollYProgress } = useScroll();
  const rotateX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });*/

  const { scrollYProgress } = useScroll();
  const y = useTransform(
    scrollYProgress,
    [0, 100],
    isInverse ? [0, -180] : [0, 180]
  );
  /*const rotateX = useSpring(transform, {
    stiffness: 1000,
    damping: 10,
    velocity: 50,
  });*/

  return (
    <motion.div
      style={{
        y: scrollYProgress,
      }}>
      <BackgroundImg
        className={clsx(
          { "flip-y -rotate-1": isInverse },
          { "rotate-1": !isInverse },
          "z-bg stroke-purple-700"
        )}
      />
    </motion.div>
  );
}

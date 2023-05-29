"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";
import { motion, Variants } from "framer-motion";
import { useIsAppHeaderDisplayed } from "../hooks/use-app-header-state";
import Wave from "../public/images/header-wave.svg";

const container: Variants = {
  opened: {
    y: 0,
    transition: {
      duration: 2,
      stiffness: 1000,
      velocity: -100,
    },
  },
  closed: {
    y: "150vh",
    transition: {
      duration: 1,
      stiffness: 1000,
    },
  },
};

export default function HeaderBottom({
  className,
  children,
  ...props
}: BaseComponentProps) {
  const isAppHeaderDisplayed = useIsAppHeaderDisplayed();

  return (
    <motion.div
      className={clsx(
        className,
        "absolute left-0 right-0 z-content flex h-[150vh] w-full flex-col"
      )}
      variants={container}
      initial={false}
      animate={isAppHeaderDisplayed ? "closed" : "opened"}>
      <div className="relative flex h-0 w-full">
        <Wave className="absolute -bottom-12 left-0 right-0 h-96 min-w-full fill-bg-1 stroke-gray-700 stroke-2" />
      </div>
      <div className="relative flex h-full min-h-fit w-full flex-row items-end justify-center bg-bg-1 px-20">
        {children}
      </div>
    </motion.div>
  );
}

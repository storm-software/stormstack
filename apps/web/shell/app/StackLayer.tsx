"use client";

import { OsHeader } from "@open-system/design-system-components/react";
import clsx from "clsx";
import { motion, Variants } from "framer-motion";
import { useCallback, useState } from "react";

export interface StackLayerProps {
  className?: string;
  header: string;
}

const container: Variants = {
  opened: {
    zIndex: 101,
    transition: {
      duration: 1.5,
      stiffness: 1000,
      velocity: -100,
    },
  },
};

const top: Variants = {
  opened: {
    rotate: "0deg",
    skewX: "0deg",
    x: "-15rem",
    y: "-15rem",
    scaleY: 2,
    scaleX: 3,
    transition: {
      duration: 1.5,
      stiffness: 1000,
      velocity: -100,
    },
  },
  closed: {
    rotate: "210deg",
    skewX: "-30deg",
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      stiffness: 1000,
    },
  },
};

const leftSide: Variants = {
  opened: {
    rotate: "-360deg",
    skewX: "0deg",
    x: "-15rem",
    y: "-15rem",
    opacity: 0,
    scaleY: 2,
    scaleX: 3,
    transition: {
      duration: 0.5,
      stiffness: 1000,
      velocity: -100,
    },
  },
  closed: {
    rotate: "-30deg",
    skewX: "-30deg",
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      stiffness: 1000,
    },
  },
};

const rightSide: Variants = {
  opened: {
    rotate: "-360deg",
    skewX: "0deg",
    x: "-15rem",
    y: "-15rem",
    opacity: 0,
    scaleY: 2,
    scaleX: 3,
    transition: {
      duration: 0.5,
      stiffness: 1000,
      velocity: -100,
    },
  },
  closed: {
    rotate: "90deg",
    skewX: "-30deg",
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      stiffness: 1000,
    },
  },
};

export default function StackLayer({
  header,
  className,
  ...props
}: StackLayerProps) {
  const [opened, setOpened] = useState(false);
  const handleOpen = useCallback(() => !opened && setOpened(true), [opened]);
  const handleClose = useCallback(() => setOpened(false), []);

  return (
    <motion.div
      className={clsx(className, "h-0 w-0")}
      variants={container}
      initial={false}
      animate={opened ? "opened" : "closed"}>
      <motion.div
        onClick={handleOpen}
        variants={rightSide}
        className={clsx(
          "z-20 h-[300px] w-[46px] origin-[0%_0%] border-2 border-slate-900 bg-teal-500",
          { "cursor-pointer": !opened }
        )}
      />
      <motion.div
        onClick={handleOpen}
        variants={leftSide}
        className={clsx(
          "relative bottom-[300px] z-20 h-[40px] w-[350px] origin-[0%_0%] border-2 border-slate-900 bg-teal-600",
          { "cursor-pointer": !opened }
        )}
      />
      <div className="relative bottom-[320px] z-10 h-[0px] w-[550px] origin-[0%_0%] -rotate-[30deg] -skew-x-[30deg] scale-y-[0.864]">
        <div className="absolute -right-36 w-full rotate-[26deg] skew-x-[26deg] text-2xl">
          <div
            onClick={handleOpen}
            className="flex h-16 cursor-pointer items-center justify-end bg-gradient-to-l from-teal-500 via-teal-500/25 to-transparent pr-8 font-label-2 text-3xl text-primary transition-all hover:scale-x-150 hover:scale-y-105 hover:text-4xl hover:text-active-yellow">
            <label className="cursor-pointer">{header}</label>
          </div>
        </div>
      </div>
      <motion.div
        onClick={handleOpen}
        variants={top}
        className={clsx(
          "relative bottom-[340px] z-20 h-[300px] w-[350px] origin-[0%_0%] border-2 border-slate-900 bg-teal-400 p-2",
          { "cursor-pointer": !opened }
        )}>
        <div
          onClick={handleClose}
          className="absolute top-1 right-1 z-30 cursor-pointer rounded-full py-0.5 px-2 font-semibold text-slate-600 transition-colors hover:bg-slate-300 hover:text-slate-900">
          <label className="cursor-pointer">X</label>
        </div>
        <div className="flex flex-col gap-2">
          <OsHeader level={3}>{header}</OsHeader>
          <p className="font-body-1 text-sm text-body-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

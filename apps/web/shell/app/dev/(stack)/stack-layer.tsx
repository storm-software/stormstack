"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { Heading } from "@stormstack/design-system-components";
import clsx from "clsx";
import { motion, Variants } from "framer-motion";
import { useCallback, useState } from "react";

export interface StackLayerProps {
  className?: string;
  header: string;
  delay?: number;
}

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
      velocity: -100
    }
  },
  closed: {
    rotate: "210deg",
    skewX: "-30deg",
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      stiffness: 1000
    }
  }
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
      velocity: -100
    }
  },
  closed: {
    rotate: "-30deg",
    skewX: "-30deg",
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      stiffness: 1000
    }
  }
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
      velocity: -100
    }
  },
  closed: {
    rotate: "90deg",
    skewX: "-30deg",
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      stiffness: 1000
    }
  }
};

export default function StackLayer({
  header,
  className,
  delay = 0,
  ...props
}: StackLayerProps) {
  const [opened, setOpened] = useState(false);
  const handleOpen = useCallback(() => !opened && setOpened(true), [opened]);
  const handleClose = useCallback(() => opened && setOpened(false), [opened]);

  // const ref = useClickOutside(handleClose);

  const container: Variants = {
    initial: { y: -20, opacity: 1, transition: { duration: 1, delay } },
    opened: {
      zIndex: 101,
      opacity: 1,
      y: -20,
      transition: {
        duration: 1.5,
        stiffness: 1000,
        velocity: -100
      }
    }
  };

  return (
    <motion.div
      className={clsx(className, "h-0 w-0")}
      variants={container}
      whileInView="initial"
      initial={{ y: 0, opacity: 0 }}
      viewport={{ once: true }}
      animate={opened ? "opened" : "closed"}>
      <motion.div
        onClick={handleOpen}
        variants={rightSide}
        initial={false}
        className={clsx(
          "border-2 border-slate-900 bg-teal-500 z-[114] h-[300px] w-[46px] origin-[0%_0%]",
          { "cursor-pointer": !opened }
        )}
      />
      <motion.div
        onClick={handleOpen}
        variants={leftSide}
        initial={false}
        className={clsx(
          "border-2 border-slate-900 bg-teal-600 relative bottom-[300px] z-[115] h-[40px] w-[350px] origin-[0%_0%]",
          { "cursor-pointer": !opened }
        )}
      />
      <div className="z-10 relative bottom-[320px] h-[0px] w-[550px] origin-[0%_0%] -rotate-[30deg] -skew-x-[30deg] scale-y-[0.864]">
        <div className="-right-36 w-full text-2xl absolute rotate-[26deg] skew-x-[26deg]">
          <div
            onClick={handleOpen}
            className="h-16 cursor-pointer bg-gradient-to-l from-teal-500 via-teal-500/25 to-transparent pr-8 text-3xl text-primary transition-all hover:scale-x-150 hover:text-4xl hover:text-active-yellow flex items-center justify-end font-label-2">
            <p className="cursor-pointer">{header}</p>
          </div>
        </div>
      </div>
      <motion.div
        onClick={handleOpen}
        variants={top}
        initial={false}
        className={clsx(
          "border-2 border-slate-900 bg-teal-400 p-2 relative bottom-[340px] z-modal h-[300px] w-[350px] origin-[0%_0%]",
          { "cursor-pointer": !opened }
        )}>
        <div
          onClick={handleClose}
          className="right-1 top-1 m-1 cursor-pointer border-slate-900 hover:border-slate-500 rounded-full p-1 font-semibold text-slate-900 transition-colors hover:text-slate-500 absolute z-modal border-[1px]">
          <XMarkIcon className="h-3 w-3 cursor-pointer" />
        </div>
        <div className="gap-3 flex flex-col">
          <Heading level={3}>{header}</Heading>
          <p className="text-sm text-slate-800 font-body-1">
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

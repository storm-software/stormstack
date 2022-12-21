"use client";

import { Heading, PropsWithBase } from "@open-system/design-system-components";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type TechnologyGroupProps = PropsWithBase<{
  name: string;
}>;

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

export default function TechnologyGroup({
  name,
  children,
}: TechnologyGroupProps) {
  const listRef = useRef(null);
  const { scrollXProgress } = useScroll({ target: listRef });
  const x = useParallax(scrollXProgress, 1000);

  return (
    <>
      <motion.div className="w-fit" style={{ x }}>
        <Heading level={4} className="mx-10 w-fit whitespace-nowrap text-5xl">
          {name}
        </Heading>
      </motion.div>
      <div
        ref={listRef}
        className="relative flex h-[45rem] w-fit flex-col justify-center gap-10">
        <div className="flex flex-row items-center justify-center gap-10">
          {children}
        </div>
      </div>
    </>
  );
}

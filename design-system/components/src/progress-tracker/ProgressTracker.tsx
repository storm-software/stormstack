"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { PropsWithBase } from "../types";
import {
  ProgressTrackerItemStatus,
  ProgressTrackerItemType,
} from "./ProgressTracker.types";
import { ProgressTrackerItem } from "./ProgressTrackerItem";

export type ProgressTrackerProps = PropsWithBase<{
  /**
   * The variant style of the link
   */
  name?: string;

  items?: ProgressTrackerItemType[];
}>;

/**
 * The base Link component used by the Open System repository
 */
export const ProgressTracker = ({
  className,
  items = [],
  ...props
}: ProgressTrackerProps) => {
  const active = items.findIndex(
    (item: ProgressTrackerItemType) =>
      item.status === ProgressTrackerItemStatus.ACTIVE
  );

  return (
    <div className="relative flex h-full w-full flex-col justify-center">
      {items.map((item: ProgressTrackerItemType, i: number) => {
        return (
          <div
            key={i}
            className={clsx("relative flex-1", {
              "pb-8": i < items.length - 1,
            })}>
            <div className="relative z-20">
              <ProgressTrackerItem
                name={item.name}
                label={item.label}
                status={item.status}
                onClick={item.onClick}
                animateBackground={
                  active > 0 && (i === active - 1 || i === active)
                }
              />
            </div>
            {i < items.length - 1 && (
              <div className="absolute right-7 top-5 -bottom-3 z-10 flex flex-col justify-center">
                <motion.div
                  initial={{
                    backgroundColor:
                      item.status === ProgressTrackerItemStatus.COMPLETE &&
                      (active < 0 || i < active - 1)
                        ? "#039555"
                        : item.status === ProgressTrackerItemStatus.COMPLETE &&
                          (active < 0 || i === active - 1)
                        ? "#FAF9F6"
                        : "#989899",
                  }}
                  animate={{
                    backgroundColor:
                      item.status === ProgressTrackerItemStatus.COMPLETE
                        ? "#039555"
                        : item.status === ProgressTrackerItemStatus.ACTIVE
                        ? "#FAF9F6"
                        : "#989899",
                  }}
                  transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
                  className={clsx("flex h-full w-3 justify-center")}>
                  <div className="flex h-full w-1.5 bg-inverse"></div>
                </motion.div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

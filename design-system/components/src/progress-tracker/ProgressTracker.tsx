"use client";

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
    <div className="relative flex h-full w-fit flex-col justify-center gap-2.5">
      {items.map((item: ProgressTrackerItemType, i: number) => {
        return (
          <div
            key={`${item.label}-${item.status}`}
            className="flex w-full flex-1 flex-col gap-2.5">
            {i > 0 && (
              <div className="flex w-full flex-1 grow flex-row-reverse pr-[1.08rem]">
                <motion.div
                  initial={{
                    backgroundColor:
                      item.status === ProgressTrackerItemStatus.COMPLETE &&
                      (active < 0 || i < active)
                        ? "#22c55e"
                        : item.status === ProgressTrackerItemStatus.COMPLETE &&
                          (active < 0 || i === active)
                        ? "#FAF9F6"
                        : "#6b7280",
                    width:
                      item.status === ProgressTrackerItemStatus.COMPLETE &&
                      (active < 0 || i < active)
                        ? "6px"
                        : item.status === ProgressTrackerItemStatus.COMPLETE &&
                          (active < 0 || i === active)
                        ? "6px"
                        : "6px",
                    boxShadow:
                      item.status === ProgressTrackerItemStatus.COMPLETE &&
                      (active < 0 || i < active)
                        ? "0 0 15px 5px rgba(75,188,100,0.4)"
                        : item.status === ProgressTrackerItemStatus.COMPLETE &&
                          (active < 0 || i === active)
                        ? "0 0 15px 5px rgba(256,256,256,0.4)"
                        : "none",
                  }}
                  animate={{
                    backgroundColor:
                      item.status === ProgressTrackerItemStatus.COMPLETE
                        ? "#22c55e"
                        : item.status === ProgressTrackerItemStatus.ACTIVE
                        ? "#FAF9F6"
                        : "#6b7280",
                    width:
                      item.status === ProgressTrackerItemStatus.COMPLETE
                        ? "6px"
                        : item.status === ProgressTrackerItemStatus.ACTIVE
                        ? "6px"
                        : "6px",
                    boxShadow:
                      item.status === ProgressTrackerItemStatus.COMPLETE
                        ? "0 0 25px 5px rgba(75,188,100,0.5)"
                        : item.status === ProgressTrackerItemStatus.ACTIVE
                        ? "0 0 25px 5px rgba(256,256,256,0.5)"
                        : "none",
                  }}
                  transition={{ duration: 1, delay: 1.5, ease: "easeInOut" }}
                  className="h-12 rounded-full border-[1px] border-slate-900"></motion.div>
              </div>
            )}
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
        );
      })}
    </div>
  );
};

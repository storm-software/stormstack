"use client";

import clsx from "clsx";
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
  return (
    <div className="relative flex h-full w-full flex-col justify-center">
      {items.map((item: ProgressTrackerItemType, i: number) => (
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
            />
          </div>
          {i < items.length - 1 && (
            <div className="absolute right-7 top-5 -bottom-3 z-10 flex flex-col justify-center">
              <div
                className={clsx(
                  "flex h-full w-3 justify-center",
                  {
                    "bg-primary":
                      item.status === ProgressTrackerItemStatus.ACTIVE,
                  },
                  {
                    "bg-secondary":
                      item.status === ProgressTrackerItemStatus.COMPLETE,
                  },
                  {
                    "bg-disabled":
                      item.status === ProgressTrackerItemStatus.PENDING,
                  }
                )}>
                <div className="flex h-full w-1.5 bg-inverse"></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

"use client";

import clsx from "clsx";
import { PropsWithBase } from "../types";

export type SkeletonProps = PropsWithBase<{
  /**
   * Is the skeleton outline a cicle
   */
  isCircle?: boolean;
}>;

/**
 * A component used to display a loading skeleton outline
 */
export const Skeleton = ({
  className,
  isCircle = false,
  ...props
}: SkeletonProps) => {
  return (
    <div
      className={clsx(
        "min-h-[1.5rem] min-w-[1.5rem] animate-pulse bg-slate-400",
        { "rounded-md w-full": !isCircle },
        { "rounded-full": isCircle },
        className
      )}
    />
  );
};

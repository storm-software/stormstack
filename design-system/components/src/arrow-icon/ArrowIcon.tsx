"use client";

import clsx from "clsx";
import { PropsWithBase } from "../types";

export type ArrowIconProps = PropsWithBase<{
  isReverse?: boolean;
}>;

export function ArrowIcon({ className, isReverse = false, ...props }: ArrowIconProps) {
  return (
    <div className={clsx("relative h-5 w-[1.9rem] overflow-hidden pt-[0rem]", {"rotate-180": isReverse})}>
      <svg
        className={clsx("h-5 w-10 group-hover:animate-arrow", className)}
        viewBox="0 0 25 25">
        <path
          className="stroke-[2.5]"
          d="m17.5 5.999-.707.707 5.293 5.293H1v1h21.086l-5.294 5.295.707.707L24 12.499l-6.5-6.5z"
        />
      </svg>
    </div>
  );
}

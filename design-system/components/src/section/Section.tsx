"use client";

import clsx from "clsx";
import { ForwardedRef, forwardRef } from "react";
import { PropsWithBase } from "../types";

export type SectionProps = PropsWithBase<{
  /**
   * One or multiple tailwindcss height utility class(es)
   */
  height?: string;

  /**
   * One or multiple tailwindcss width utility class(es)
   */
  width?: string;

  /**
   * The section header string
   */
  header?: string;
}>;

/**
 * The base Section component used by the Open System repository
 */
export const Section = forwardRef<HTMLDivElement, SectionProps>(
  (
    {
      className,
      children,
      height = "min-h-[50rem]",
      width = "max-w-[65rem] md:w-3/4 lg:w-2/3",
      header,
    }: SectionProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <section
        ref={ref}
        className={clsx(
          "flex w-full snap-center snap-always justify-center",
          className
        )}>
        <div className={clsx(height, width, "flex flex-col gap-1")}>
          {header && (
            <div className="font-header-1 text-primary flex text-3xl">
              <h3>{header}</h3>
            </div>
          )}
          <div className="font-body-1 text-body-1 flex">{children}</div>
        </div>
      </section>
    );
  }
);

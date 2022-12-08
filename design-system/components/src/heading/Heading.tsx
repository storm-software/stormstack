"use client";

/* eslint-disable react/jsx-no-useless-fragment */
import clsx from "clsx";
import { ForwardedRef, forwardRef } from "react";
import { PropsWithBase } from "../types";

export type HeadingProps = PropsWithBase<{
  /**
   * The level of the Heading
   *
   * @example h1, h2, h3, h4
   */
  level: 1 | 2 | 3 | 4;
}>;

/**
 * The base Heading component used by the Open System repository
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    { className, children, level = 2 }: HeadingProps,
    ref: ForwardedRef<HTMLHeadingElement>
  ) => {
    return (
      <>
        {level === 1 ? (
          <span className="from-gradient-to via-gradient-via to-gradient-from w-fit bg-gradient-to-r bg-[length:100%_40%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]">
            <h1
              ref={ref}
              className={clsx(
                "text-shadow-lg font-header-1 text-primary text-6xl leading-[3rem] shadow-white",
                className
              )}>
              {children}
            </h1>
          </span>
        ) : level === 2 ? (
          <span className="from-gradient-to via-gradient-via to-gradient-from w-fit bg-gradient-to-r bg-[length:100%_50%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]">
            <h2
              className={clsx(
                "text-shadow-lg font-header-2 text-primary text-6xl leading-[3.5rem] shadow-white",
                className
              )}>
              {children}
            </h2>
          </span>
        ) : level === 3 ? (
          <span className="from-gradient-to via-gradient-via to-gradient-from w-fit bg-gradient-to-r bg-[length:100%_50%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_5px]">
            <h3
              className={clsx(
                "text-shadow-lg font-header-3 text-primary text-4xl leading-[2rem] shadow-white",
                className
              )}>
              {children}
            </h3>
          </span>
        ) : (
          <h4
            className={clsx(
              "text-shadow-lg font-header-4 text-primary text-2xl leading-[1rem] shadow-white",
              className
            )}>
            {children}
          </h4>
        )}
      </>
    );
  }
);

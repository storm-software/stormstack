"use client";

import clsx from "clsx";
import { PropsWithBase } from "../types";
import { LinkVariants } from "./Link.types";

export type LinkProps = PropsWithBase<{
  /**
   * The variant style of the link
   */
  variant?: LinkVariants;
}>;

/**
 * The base Link component used by the Open System repository
 */
export const Link = ({
  className,
  children,
  variant = LinkVariants.SECONDARY,
}: LinkProps) => {
  return (
    <label
      className={clsx(
        "font-body-1 underline transition-colors duration-150 hover:cursor-pointer",
        {
          "text-link-1 hover:text-hover-link-1":
            variant === LinkVariants.PRIMARY,
        },
        {
          "text-link-2 hover:text-hover-link-2":
            variant === LinkVariants.SECONDARY,
        },
        {
          "text-link-3 hover:text-hover-link-3":
            variant === LinkVariants.TERTIARY,
        },
        className
      )}>
      {children}
    </label>
  );
};

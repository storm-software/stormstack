"use client";

/* eslint-disable react/jsx-no-useless-fragment */
import clsx from "clsx";
import { PropsWithBase } from "../types";
import {
  DividerDirections,
  DividerSizes,
  DividerVariants,
} from "./Divider.types";

export type DividerProps = PropsWithBase<{
  /**
   * The variant style of the divider
   */
  variant?: DividerVariants | string;

  /**
   * The direction of the divider
   */
  direction?: DividerDirections | string;

  /**
   * The size of the divider (width of the divider line)
   */
  size?: DividerSizes | string;
}>;

/**
 * The base Divider component used by the Open System repository
 */
export const Divider = ({
  className,
  variant = DividerVariants.PRIMARY,
  direction = DividerDirections.HORIZONTAL,
  size = DividerSizes.MEDIUM,
}: DividerProps) => {
  return (
    <>
      {direction === DividerDirections.HORIZONTAL ? (
        <div
          className={clsx(
            {
              "bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from":
                variant === DividerVariants.GRADIENT,
            },
            { "bg-primary": variant === DividerVariants.PRIMARY },
            { "bg-secondary": variant === DividerVariants.SECONDARY },
            { "bg-tertiary": variant === DividerVariants.TERTIARY },
            { "bg-light-1": variant === DividerVariants.LIGHT },
            { "h-px": size === DividerSizes.SMALL },
            { "h-0.5": size === DividerSizes.MEDIUM },
            { "h-1": size === DividerSizes.LARGE },
            "w-full",
            className
          )}></div>
      ) : (
        <div
          className={clsx(
            {
              "bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from":
                variant === DividerVariants.GRADIENT,
            },
            { "bg-primary": variant === DividerVariants.PRIMARY },
            { "bg-secondary": variant === DividerVariants.SECONDARY },
            { "bg-tertiary": variant === DividerVariants.TERTIARY },
            { "bg-light-1": variant === DividerVariants.LIGHT },
            { "w-px": size === DividerSizes.SMALL },
            { "w-0.5": size === DividerSizes.MEDIUM },
            { "w-1": size === DividerSizes.LARGE },
            "h-full",
            className
          )}></div>
      )}
    </>
  );
};

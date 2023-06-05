"use client";

import clsx from "clsx";
import { MouseEventHandler, useRef } from "react";
import { PropsWithBase } from "../types";
import { useRipple } from "../utilities";
import { isFunction } from "@open-system/core-utilities"
import { BadgeVariants, BadgeBorderThickness } from "./Badge.types";
import "../../styles/components.css";

export type BadgeProps = PropsWithBase<{
  /**
   * The variant style of the Badge
   */
  variant?: BadgeVariants | string;

  /**
   * Event handler for Badge click event
   */
  onClick?: MouseEventHandler;

  /**
   * The thickness of the border around the badge
   */
  borderThickness?: BadgeBorderThickness | string;

   /**
   * The CSS/Tailwind utility class name to override to color the border
   */
   borderColorClassName?: string;
}>;

/**
 * The base Badge component used by the Open System repository
 */
export const Badge = ({
  className,
  children,
  borderColorClassName,
  variant = BadgeVariants.SECONDARY,
  borderThickness = BadgeBorderThickness.NORMAL,
  onClick,
}: BadgeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useRipple(ref);

  return (
    <div className={clsx({"group badge": isFunction(onClick)},
    "relative overflow-hidden h-fit w-fit rounded-full")}>
    <div
      ref={ref}
      onClick={onClick}
      className={clsx({"badge-inner group-active:scale-95": isFunction(onClick)},
      {"border-[0px]": borderThickness === BadgeBorderThickness.NONE},
      {"border-[1px]": borderThickness === BadgeBorderThickness.THIN},
      {"border-[3px]": borderThickness === BadgeBorderThickness.NORMAL},
      {"border-[4px]": borderThickness === BadgeBorderThickness.THICK},
        "h-fit w-fit rounded-full pt-0.5 pb-1 px-5 overflow-hidden duration-100 transition-all",
        {
          "border-primary": variant === BadgeVariants.PRIMARY,
        },
        {
          "border-secondary": variant === BadgeVariants.SECONDARY,
        },
        {
          "border-tertiary": variant === BadgeVariants.TERTIARY,
        },
        {
          "border-secondary": variant === BadgeVariants.QUATERNARY,
        },
        {
          "border-inverse": variant === BadgeVariants.INVERSE,
        },
        {
          "border-warning": variant === BadgeVariants.WARNING,
        },
        {
          "border-error": variant === BadgeVariants.ERROR,
        },
        {
          "border-info": variant === BadgeVariants.INFO,
        },
        {
          "border-success": variant === BadgeVariants.SUCCESS,
        },
        {
          "border-gradient": variant === BadgeVariants.GRADIENT,
        },
        borderColorClassName
      )}>
      {children ? (
        typeof children === "string" ? (
          <label
            className={clsx(
              "font-label-3 text-md font-bold",
              {
                "text-primary": variant === BadgeVariants.PRIMARY,
              },
              {
                "text-secondary": variant === BadgeVariants.SECONDARY,
              },
              {
                "text-tertiary": variant === BadgeVariants.TERTIARY,
              },
              {
                "text-secondary": variant === BadgeVariants.QUATERNARY,
              },
              {
                "text-inverse": variant === BadgeVariants.INVERSE,
              },
              {
                "text-warning": variant === BadgeVariants.WARNING,
              },
              {
                "text-error": variant === BadgeVariants.ERROR,
              },
              {
                "text-info": variant === BadgeVariants.INFO,
              },
              {
                "text-success": variant === BadgeVariants.SUCCESS,
              },
              {
                "text-gradient": variant === BadgeVariants.GRADIENT,
              }
            )}>
            {children}
          </label>
        ) : (
          children
        )
      ) : (
        ""
      )}
    </div>
    </div>
  );
};

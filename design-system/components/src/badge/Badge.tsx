"use client";

import { isFunction } from "@stormstack/core-shared-utilities";
import clsx from "clsx";
import { MouseEventHandler, useRef } from "react";
import { PropsWithBase } from "../types";
import { useRipple } from "../utilities";
import { BadgeBorderThickness, BadgeVariants } from "./Badge.types";

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
   * Should the input glow when focused
   */
  glow?: boolean;

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
  glow = false,
  variant = BadgeVariants.SECONDARY,
  borderThickness = BadgeBorderThickness.NORMAL,
  onClick
}: BadgeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useRipple(ref);

  return (
    <div
      className={clsx(
        { "group": isFunction(onClick) },
        { "transition-shadow shadow-[0_0_8px_2px_rgba(0,0,0,0.01)]": glow },
        {
          "shadow-primary": variant === BadgeVariants.PRIMARY && glow
        },
        {
          "shadow-secondary": variant === BadgeVariants.SECONDARY && glow
        },
        {
          "shadow-tertiary": variant === BadgeVariants.TERTIARY && glow
        },
        {
          "shadow-quaternary": variant === BadgeVariants.QUATERNARY && glow
        },
        {
          "shadow-inverse": variant === BadgeVariants.INVERSE && glow
        },
        {
          "shadow-warning": variant === BadgeVariants.WARNING && glow
        },
        {
          "shadow-error": variant === BadgeVariants.ERROR && glow
        },
        {
          "shadow-info": variant === BadgeVariants.INFO && glow
        },
        {
          "shadow-success": variant === BadgeVariants.SUCCESS && glow
        },
        "h-fit w-fit rounded-full relative overflow-hidden",
        className
      )}>
      <div
        ref={ref}
        onClick={onClick}
        className={clsx(
          {
            "ripple-container active:scale-95 relative overflow-hidden":
              isFunction(onClick)
          },
          { "border-[0px]": borderThickness === BadgeBorderThickness.NONE },
          { "border-[1px]": borderThickness === BadgeBorderThickness.THIN },
          { "border-[3px]": borderThickness === BadgeBorderThickness.NORMAL },
          { "border-[4px]": borderThickness === BadgeBorderThickness.THICK },
          "h-fit w-fit rounded-full px-5 pb-1 pt-0.5 transition-all duration-100",
          {
            "border-primary": variant === BadgeVariants.PRIMARY
          },
          {
            "border-secondary": variant === BadgeVariants.SECONDARY
          },
          {
            "border-tertiary": variant === BadgeVariants.TERTIARY
          },
          {
            "border-quaternary": variant === BadgeVariants.QUATERNARY
          },
          {
            "border-inverse": variant === BadgeVariants.INVERSE
          },
          {
            "border-warning": variant === BadgeVariants.WARNING
          },
          {
            "border-error": variant === BadgeVariants.ERROR
          },
          {
            "border-info": variant === BadgeVariants.INFO
          },
          {
            "border-success": variant === BadgeVariants.SUCCESS
          },
          borderColorClassName
        )}>
        <div className="ripple-inner h-fit w-fit overflow-hidden">
          {children ? (
            typeof children === "string" ? (
              <p
                className={clsx(
                  "text-md font-bold font-label-3",
                  {
                    "text-primary": variant === BadgeVariants.PRIMARY
                  },
                  {
                    "text-secondary": variant === BadgeVariants.SECONDARY
                  },
                  {
                    "text-tertiary": variant === BadgeVariants.TERTIARY
                  },
                  {
                    "text-quaternary": variant === BadgeVariants.QUATERNARY
                  },
                  {
                    "text-inverse": variant === BadgeVariants.INVERSE
                  },
                  {
                    "text-warning": variant === BadgeVariants.WARNING
                  },
                  {
                    "text-error": variant === BadgeVariants.ERROR
                  },
                  {
                    "text-info": variant === BadgeVariants.INFO
                  },
                  {
                    "text-success": variant === BadgeVariants.SUCCESS
                  }
                )}>
                {children}
              </p>
            ) : (
              children
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

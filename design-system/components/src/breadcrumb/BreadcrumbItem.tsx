/* eslint-disable react/jsx-no-useless-fragment */
"use client";

import clsx from "clsx";
import { useCallback } from "react";
import { PropsWithBase } from "../types";
import { BreadcrumbVariants } from "./Breadcrumb.types";

export type BreadcrumbItemProps = PropsWithBase<{
  /**
   * The name used to identify the item
   */
  name: string;

  /**
   * The text displayed in the center of the item
   */
  label: string | JSX.Element;

  /**
   * Callback invoked when the item is clicked by the user
   */
  onClick?: (name: string) => void;

  /**
   * An indicator specifying if this item is the current/last breadcrumb
   */
  isCurrent?: boolean;

  /**
   * The variant style of the Breadcrumbs
   */
  variant?: BreadcrumbVariants | string;

    /**
   * Is the color scheme inversed on the component
   */
    inverse?: boolean;
}>;

/**
 * The base Link component used by the Open System repository
 */
export const BreadcrumbItem = ({
  className,
  variant,
  inverse = false,
  name,
  label,
  isCurrent,
  children,
  onClick,
  ...props
}: BreadcrumbItemProps) => {
  const handleClick = useCallback(() => {
    !isCurrent && onClick?.(name);
  }, [isCurrent, name, onClick]);

  return (
    <div
      className={clsx("group ", {
        "hover:cursor-pointer": !isCurrent && onClick,
      })}
      onClick={handleClick}>
      <label
        className={clsx(
          "font-label-4 text-lg transition",
          {
            "text-breadcrumb-primary-1":
            variant === BreadcrumbVariants.PRIMARY && isCurrent && !inverse,
          },
          {
            "text-breadcrumb-primary-2":
            variant === BreadcrumbVariants.PRIMARY && isCurrent && inverse,
          },
          {
            "text-breadcrumb-primary-2":
            variant === BreadcrumbVariants.PRIMARY && !isCurrent && !inverse,
          },
          {
            "text-breadcrumb-primary-1":
            variant === BreadcrumbVariants.PRIMARY && !isCurrent && inverse,
          },
          {
            "text-breadcrumb-secondary-1":
            variant === BreadcrumbVariants.SECONDARY && isCurrent && !inverse,
          },
          {
            "text-breadcrumb-secondary-2":
            variant === BreadcrumbVariants.SECONDARY && isCurrent && inverse,
          },
          {
            "text-breadcrumb-secondary-2":
            variant === BreadcrumbVariants.SECONDARY && !isCurrent && !inverse,
          },
          {
            "text-breadcrumb-secondary-1":
            variant === BreadcrumbVariants.SECONDARY && !isCurrent && inverse,
          },
          {
            "group-hover:cursor-pointer group-hover:text-hover-link-3":
              !isCurrent && onClick,
          }
        )}>
        {label}
      </label>
    </div>
  );
};

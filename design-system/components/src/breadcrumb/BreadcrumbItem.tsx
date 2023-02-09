/* eslint-disable react/jsx-no-useless-fragment */
"use client";

import clsx from "clsx";
import { useCallback } from "react";
import { PropsWithBase } from "../types";

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
}>;

/**
 * The base Link component used by the Open System repository
 */
export const BreadcrumbItem = ({
  className,
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
          { "text-primary": isCurrent },
          { "text-secondary": !isCurrent },
          {
            "no-underline group-hover:cursor-pointer group-hover:text-hover-link-2 group-hover:underline":
              !isCurrent && onClick,
          }
        )}>
        {label}
      </label>
    </div>
  );
};

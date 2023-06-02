"use client";

import { PropsWithBase } from "@open-system/design-system-components";
import { Link, LinkProps } from "@open-system/core-components";
import clsx from "clsx";
import { useSelectedLayoutSegment } from "next/navigation";

export type NavigationMenuItemProps = PropsWithBase<
  { selected?: boolean; label: string } & LinkProps
>;

/**
 * A component to facilitate application navigation. It is rendered with
 * a fixed position at the top of the page.
 */
export function NavigationMenuItem({
  label,
  selected = false,
  href,
  ...props
}: NavigationMenuItemProps) {
  const isSelected = useSelectedLayoutSegment() === href || !!selected;

  return (
    <Link href={href} {...props}>
      <div className="relative block w-full px-16">
        <div className={clsx(
                { "text-secondary": !isSelected },
                { "text-tertiary": isSelected },
                "relative text-[4.25rem] uppercase leading-tight")}>
          <div className="before:rounded-drawn group relative h-[4.25rem] text-transparent before:absolute before:left-0 before:right-0 before:top-[50%] before:z-[1] before:mt-1 before:block before:h-[8px] before:scale-0 before:bg-primary before:transition-transform before:duration-700 before:ease-[cubic-bezier(.16,1.08,.38,.98)] before:content-[''] hover:before:scale-105">
            <div
              className={clsx(
                { "text-primary": !isSelected },
                { "text-tertiary": isSelected },
                "absolute left-[40%] top-0 block h-[75%] overflow-hidden ease-[cubic-bezier(.16,1.08,.38,.98)] group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:skew-x-12 group-hover:text-secondary group-hover:transition-transform group-hover:duration-300"
              )}>
              <div className="block antialiased">{label}</div>
            </div>
            <div
              className={clsx(
                { "text-primary": !isSelected },
                { "text-tertiary": isSelected },
                "absolute left-[40%] top-[62%] block h-[50%] overflow-hidden text-primary ease-[cubic-bezier(.16,1.08,.38,.98)] group-hover:-translate-x-2 group-hover:skew-x-12 group-hover:text-secondary group-hover:transition-transform group-hover:duration-700"
              )}>
              <div className="block -translate-y-[50%] antialiased">
                {label}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

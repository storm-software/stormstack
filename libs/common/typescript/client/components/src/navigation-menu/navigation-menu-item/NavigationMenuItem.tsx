"use client";

import { Link, LinkProps } from "@stormstack/core-client-components";
import { PropsWithBase } from "@stormstack/design-system-components";
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
      <div className="w-full px-16 relative block">
        <div
          className={clsx(
            { "text-secondary": !isSelected },
            { "text-tertiary": isSelected },
            "leading-tight relative text-[4.25rem] uppercase"
          )}>
          <div className="before:rounded-drawn text-transparent before:left-0 before:right-0 before:mt-1 before:scale-0 before:bg-primary before:transition-transform before:duration-700 hover:before:scale-105 group relative h-[4.25rem] before:absolute before:top-[50%] before:z-[1] before:block before:h-[8px] before:ease-[cubic-bezier(.16,1.08,.38,.98)] before:content-['']">
            <div
              className={clsx(
                { "text-primary": !isSelected },
                { "text-tertiary": isSelected },
                "top-0 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:skew-x-12 group-hover:text-secondary group-hover:transition-transform group-hover:duration-300 absolute left-[40%] block h-[75%] overflow-hidden ease-[cubic-bezier(.16,1.08,.38,.98)]"
              )}>
              <div className="block antialiased">{label}</div>
            </div>
            <div
              className={clsx(
                { "text-primary": !isSelected },
                { "text-tertiary": isSelected },
                "text-primary group-hover:-translate-x-2 group-hover:skew-x-12 group-hover:text-secondary group-hover:transition-transform group-hover:duration-700 absolute left-[40%] top-[62%] block h-[50%] overflow-hidden ease-[cubic-bezier(.16,1.08,.38,.98)]"
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

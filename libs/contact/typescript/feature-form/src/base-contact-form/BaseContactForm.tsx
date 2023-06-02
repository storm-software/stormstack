"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";

export type BaseContactFormProps = BaseComponentProps & {
  title: string;
  description: string;
  sideContent?: JSX.Element;
  isWide?: boolean;
};

export function BaseContactForm({
  className,
  children,
  title,
  description,
  sideContent,
  isWide = false,
  ...props
}: BaseContactFormProps) {
  return (
    <div
      className={clsx(
        "flex flex-row items-center justify-between gap-20",
        className
      )}>
      <div className="flex flex-row items-center gap-8">
        <div
          className={clsx(
            "flex flex-col gap-2",
            { "basis-3/5": !isWide },
            { "basis-1/2": isWide }
          )}>
          <label className="font-header-4 text-2xl text-violet-500">
            {title}
          </label>
          <h2 className="font-label-4 text-4xl text-primary">{description}</h2>
          {sideContent}
        </div>
        <div
          className={clsx(
            "flex flex-col justify-center",
            { "basis-2/5": !isWide },
            { "basis-1/2": isWide }
          )}>
          {children}
        </div>
      </div>
    </div>
  );
}

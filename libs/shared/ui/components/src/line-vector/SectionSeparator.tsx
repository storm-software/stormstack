"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";
import { useRef } from "react";
import { SectionSeparatorLine } from "./LineVector";

export interface SectionSeparatorProps extends BaseComponentProps {
  isHorizontal?: boolean;
}

export function SectionSeparator({
  isHorizontal = false,
}: SectionSeparatorProps) {
  const lines = [];
  const ref = useRef(null);

  for (
    let index = 0;
    (isHorizontal && index <= 2) || (!isHorizontal && index < 35);
    index++
  ) {
    lines.push(
      <>
        <div
          className={clsx(
            { "h-[12px] w-[800px]": isHorizontal },
            { "h-[15px] w-[15px]": !isHorizontal },
            "relative"
          )}>
          <SectionSeparatorLine
            containerRef={ref}
            className="absolute top-0"
            isHorizontal={isHorizontal}
            width={isHorizontal ? 800 : 50}
            strokeWidth={1}
          />
        </div>
        <div
          className={clsx(
            { "h-[12px] w-[800px]": isHorizontal },
            { "h-[15px] w-[15px]": !isHorizontal },
            "relative"
          )}>
          <SectionSeparatorLine
            containerRef={ref}
            className="absolute top-0"
            isHorizontal={isHorizontal}
            width={isHorizontal ? 800 : 50}
            strokeWidth={1}
            inverseAnimation={true}
          />
        </div>
      </>
    );
  }

  return (
    <div
      ref={ref}
      className={clsx(
        { "flex-col": isHorizontal },
        { "flex-row": !isHorizontal },
        "z-bg flex w-full items-center justify-center"
      )}>
      {lines.map(line => line)}
    </div>
  );
}

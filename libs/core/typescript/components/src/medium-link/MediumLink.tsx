"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";
import { Link } from "../link";

export function MediumLink({ className, ...props }: BaseComponentProps) {
  return (
    <Link
      className={clsx("h-[5rem] w-[5rem]", className)}
      inNewTab={true}
      href="https://github.com/sullivanpj">
      <svg
        className="h-[5rem] w-[5rem] fill-primary opacity-100 transition-all hover:translate-y-0.5 hover:scale-110 hover:fill-highlight-1"
        viewBox="0 0 100 100"
        width="100px"
        height="100px">
        <g>
          <path d="M 52 48 C 52 61.253906 41.253906 72 28 72 C 14.746094 72 4 61.253906 4 48 C 4 34.746094 14.746094 24 28 24 C 41.253906 24 52 34.746094 52 48 Z M 52 48 " />
          <path d="M 80 48 C 80 60.148438 74.628906 70 68 70 C 61.371094 70 56 60.148438 56 48 C 56 35.851562 61.371094 26 68 26 C 74.628906 26 80 35.851562 80 48 Z M 80 48 " />
          <path d="M 92 48 C 92 59.046875 90.210938 68 88 68 C 85.789062 68 84 59.046875 84 48 C 84 36.953125 85.789062 28 88 28 C 90.210938 28 92 36.953125 92 48 Z M 92 48 " />
        </g>
      </svg>
    </Link>
  );
}

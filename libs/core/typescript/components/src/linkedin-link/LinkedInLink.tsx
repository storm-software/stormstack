"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";
import { Link } from "../link";

export function LinkedInLink({ className, ...props }: BaseComponentProps) {
  return (
    <Link
      className={clsx("h-[5rem] w-[5rem]", className)}
      inNewTab={true}
      href="https://www.linkedin.com/in/patrick-sullivan-865526b0">
      <svg
        className="h-[6rem] w-[6rem] fill-primary opacity-100 transition-all hover:translate-y-0.5 hover:scale-110 hover:fill-highlight-1"
        viewBox="0 0 100 100"
        width="100px"
        height="100px">
        <g>
          <path d="M 72 12 L 18 12 C 14.683594 12 12 14.683594 12 18 L 12 72 C 12 75.316406 14.683594 78 18 78 L 72 78 C 75.316406 78 78 75.316406 78 72 L 78 18 C 78 14.683594 75.316406 12 72 12 Z M 32.863281 66 L 24.011719 66 L 24.011719 37.523438 L 32.863281 37.523438 Z M 28.347656 33.453125 C 25.492188 33.453125 23.1875 31.140625 23.1875 28.292969 C 23.1875 25.445312 25.496094 23.136719 28.347656 23.136719 C 31.191406 23.136719 33.503906 25.449219 33.503906 28.292969 C 33.503906 31.140625 31.191406 33.453125 28.347656 33.453125 Z M 66.011719 66 L 57.167969 66 L 57.167969 52.152344 C 57.167969 48.847656 57.109375 44.601562 52.570312 44.601562 C 47.964844 44.601562 47.257812 48.199219 47.257812 51.910156 L 47.257812 66 L 38.410156 66 L 38.410156 37.523438 L 46.902344 37.523438 L 46.902344 41.414062 L 47.023438 41.414062 C 48.203125 39.175781 51.089844 36.816406 55.394531 36.816406 C 64.355469 36.816406 66.011719 42.714844 66.011719 50.382812 Z M 66.011719 66 " />
        </g>
      </svg>
    </Link>
  );
}

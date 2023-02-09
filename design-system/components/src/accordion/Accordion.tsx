"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Divider, DividerDirections, DividerSizes } from "../divider";
import { PropsWithBase } from "../types";

export type AccordionProps = PropsWithBase<{
  /**
   * The summary displayed in the header section
   */
  summary?: JSX.Element | string;

  /**
   * The details text displayed to the right of the summary text (in a smaller style) in the header section
   */
  details?: JSX.Element | string;

  /**
   * An indicator specifying whether the accordion is open or closed
   *
   * @defaultValue `true`
   */
  opened?: boolean;

  /**
   * An indicator specifying whether the accordion should contain a divider down at the bottom of the content area when opened
   *
   * @defaultValue `true`
   */
  showBottomDivider?: boolean;
}>;

/**
 * The base Divider component used by the Open System repository
 */
export const Accordion = ({
  children,
  opened = true,
  showBottomDivider = true,
  summary,
  details,
  className,
}: AccordionProps) => {
  const [isOpened, setIsOpened] = useState<boolean>(opened);

  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    ref.current?.addEventListener("toggle", (event: Event) => {
      event.preventDefault();

      if (ref.current.open) {
        setIsOpened(true);
      } else {
        setIsOpened(false);
      }
    });
  }, []);

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <details ref={ref}>
        <summary className="group flex flex-col gap-2 py-3 hover:cursor-pointer">
          <div className="flex flex-row items-center justify-between gap-2">
            {typeof summary === "string" ? (
              <div className="flex flex-row items-end gap-2">
                <h2 className="text-xl font-header-1 text-primary transition-colors group-hover:text-hover-link-2">
                  {summary}
                </h2>
                {details && (
                  <label className="text-md mb-0.5 font-label-3 text-slate-400 transition-colors group-hover:text-hover-link-2">
                    {details}
                  </label>
                )}
              </div>
            ) : (
              <div>{summary}</div>
            )}
            {isOpened ? (
              <MinusIcon className="h-6 w-6 fill-primary transition-colors group-hover:fill-hover-link-2" />
            ) : (
              <PlusIcon className="h-6 w-6 fill-primary transition-colors group-hover:fill-hover-link-2" />
            )}
          </div>
          <Divider
            direction={DividerDirections.HORIZONTAL}
            size={DividerSizes.MEDIUM}
          />
        </summary>
        <motion.div layout style={{ height: isOpened ? "100%" : "0px" }}>
          <AnimatePresence>
            {isOpened && (
              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                {children}

                {showBottomDivider && (
                  <Divider
                    direction={DividerDirections.HORIZONTAL}
                    size={DividerSizes.MEDIUM}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </details>
    </div>
  );
};

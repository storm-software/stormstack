"use client";

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
  opened,
  showBottomDivider = true,
  summary,
  details,
  className,
}: AccordionProps) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (ref?.current) {
      opened && setIsOpened(opened);
      ref?.current?.addEventListener("toggle", (event: Event) => {
        event.preventDefault();

        if (ref?.current?.open) {
          setIsOpened(true);
        } else {
          setIsOpened(false);
        }
      });
    }
  }, []);

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <details ref={ref} open={isOpened}>
        <summary className="group flex flex-col gap-2 py-3 hover:cursor-pointer">
          <div className="flex flex-row items-center justify-between gap-2">
            {typeof summary === "string" ? (
              <div className="flex flex-row items-end gap-2">
                <h2 className="text-xl font-header-1 text-primary transition-colors group-hover:text-hover-link-2">
                  {summary}
                </h2>
                {details && (
                  <h2 className="text-md mb-0.5 font-label-3 text-slate-400 transition-colors hover:cursor-pointer group-hover:text-hover-link-2">
                    {details}
                  </h2>
                )}
              </div>
            ) : (
              <div>{summary}</div>
            )}
            <motion.div
              className="h-6 w-6"
              initial={false}
              animate={isOpened ? "opened" : "closed"}
              variants={{
                opened: { rotate: "0deg" },
                closed: { rotate: "-180deg" },
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}>
              <svg width="24" height="24" viewBox="0 0 8 8">
                <motion.path
                  className="fill-transparent stroke-primary transition-colors group-hover:stroke-hover-link-2"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  variants={{
                    opened: { d: "M 1 4 L 7 4" },
                    closed: { d: "M 4 1 L 4 7" },
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <path
                  className="fill-transparent stroke-primary transition-colors group-hover:stroke-hover-link-2"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  d="M 1 4 L 7 4"
                />
              </svg>
            </motion.div>
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

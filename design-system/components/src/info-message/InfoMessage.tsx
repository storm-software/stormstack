"use client";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { PropsWithBase } from "../types";
import { getSvgFillStyle } from "../utilities/svg-style-utils";
import { getTextStyle } from "../utilities/text-style-utils";
import { InfoMessageVariants } from "./InfoMessage.types";

export type InfoMessageProps = PropsWithBase<{
  /**
   * The variant style of the info message
   */
  variant?: InfoMessageVariants;

  /**
   * Should the message be displayed without the user triggering (click, hover, etc.) the icon
   */
  opened?: boolean;
}>;

/**
 * A small, inline component used to display a tip or informational message to a user
 */
export const InfoMessage = ({
  className,
  children,
  opened = false,
  variant = InfoMessageVariants.PRIMARY,
}: InfoMessageProps) => {
  const [isOpened, setIsOpened] = useState<boolean>(opened);
  const handleToggleIsOpened = useCallback(() => {
    setIsOpened(!isOpened);
  }, [isOpened]);

  return (
    <div
      className={clsx(
        "relative flex w-fit flex-row items-center gap-2",
        className
      )}>
      {(variant === InfoMessageVariants.PRIMARY ||
        variant === InfoMessageVariants.INFO) && (
        <InformationCircleIcon
          className={clsx(
            "h-8 w-8 stroke-inverse transition-colors hover:cursor-pointer hover:fill-hover-link-2",
            getSvgFillStyle(
              false,
              false,
              variant === InfoMessageVariants.INFO,
              false
            )
          )}
          onClick={handleToggleIsOpened}
        />
      )}
      {(variant === InfoMessageVariants.ERROR ||
        variant === InfoMessageVariants.WARNING) && (
        <ExclamationCircleIcon
          className={clsx(
            "h-8 w-8 stroke-inverse transition-colors hover:cursor-pointer hover:fill-hover-link-2",
            getSvgFillStyle(
              variant === InfoMessageVariants.ERROR,
              variant === InfoMessageVariants.WARNING,
              false,
              false
            )
          )}
          onClick={handleToggleIsOpened}
        />
      )}
      {variant === InfoMessageVariants.SUCCESS && (
        <CheckCircleIcon
          className={clsx(
            "h-8 w-8 stroke-inverse transition-colors hover:cursor-pointer hover:fill-hover-link-2",
            getSvgFillStyle(false, false, false, true)
          )}
          onClick={handleToggleIsOpened}
        />
      )}
      <AnimatePresence>
        {isOpened && (
          <motion.div
            className="overflow-x-hidden whitespace-nowrap"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            exit={{ width: 0 }}
            transition={{ duration: 1 }}>
            {typeof children === "string" ? (
              <p
                className={clsx(
                  "text-md font-body-1",
                  getTextStyle(
                    variant === InfoMessageVariants.ERROR,
                    variant === InfoMessageVariants.WARNING,
                    variant === InfoMessageVariants.INFO,
                    variant === InfoMessageVariants.SUCCESS
                  )
                )}>
                {children}
              </p>
            ) : (
              children
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

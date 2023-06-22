"use client";

/* eslint-disable react/jsx-no-useless-fragment */
import {
  CheckIcon,
  LockClosedIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useCallback, useMemo } from "react";
import { PropsWithBase } from "../types";
import { ProgressTrackerItemStatus } from "./ProgressTracker.types";

export type ProgressTrackerItemProps = PropsWithBase<{
  /**
   * The name used to identify the item
   */
  name: string;

  /**
   * The text displayed in the center of the item
   */
  label: string;

  /**
   * The current state of the item
   */
  status: ProgressTrackerItemStatus;

  /**
   * Callback invoked when the item is clicked by the user
   */
  onClick?: (name: string) => void;

  /**
   * Should the background be animated
   */
  animateBackground?: boolean;
}>;

/**
 * The base Link component used by the Open System repository
 */
export const ProgressTrackerItem = ({
  className,
  name,
  label,
  status,
  children,
  onClick,
  animateBackground = false,
  ...props
}: ProgressTrackerItemProps) => {
  const handleClick = useCallback(() => {
    status === ProgressTrackerItemStatus.COMPLETE && onClick?.(name);
  }, [name, onClick, status]);

  const labelVariants = useMemo(
    () => ({
      displayed: {
        color:
          status === ProgressTrackerItemStatus.COMPLETE
            ? "#22c55e"
            : status === ProgressTrackerItemStatus.ACTIVE
            ? "#FAF9F6"
            : "#6b7280",
        textShadow:
          status === ProgressTrackerItemStatus.COMPLETE
            ? "0 0 15px rgba(75,188,100,0.5)"
            : status === ProgressTrackerItemStatus.ACTIVE
            ? "0 0 15px rgba(256,256,256,0.5)"
            : "none",
        transition: { duration: 1, delay: 1.5, ease: "easeInOut" },
      },
      hover:
        status === ProgressTrackerItemStatus.COMPLETE && onClick
          ? {
              color: "#6366F1",
              textShadow: "0 0 15px rgba(107, 114, 128,0.5)",
              transition: { duration: 0.05, delay: 0, ease: "linear" },
            }
          : {},
    }),
    [onClick, status]
  );
  const pathVariants = useMemo(
    () => ({
      displayed: {
        backgroundColor:
          status === ProgressTrackerItemStatus.COMPLETE
            ? "#22c55e"
            : status === ProgressTrackerItemStatus.ACTIVE
            ? "#FAF9F6"
            : "#6b7280",
        boxShadow:
          status === ProgressTrackerItemStatus.COMPLETE
            ? "0 0 10px 4px rgba(75,188,100,0.4)"
            : status === ProgressTrackerItemStatus.ACTIVE
            ? "0 0 10px 4px rgba(256,256,256,0.4)"
            : "none",
        transition: { duration: 1, delay: 1.5, ease: "easeInOut" },
      },
      hover:
        status === ProgressTrackerItemStatus.COMPLETE && onClick
          ? {
              backgroundColor: "#6366F1",
              boxShadow: "0 0 10px 4px rgba(107, 114, 128,0.4)",
              transition: { duration: 0.05, delay: 0, ease: "linear" },
            }
          : {},
    }),
    [onClick, status]
  );

  return (
    <motion.div
      className={clsx(
        "group flex h-fit w-full flex-row items-center justify-between gap-3",
        {
          "hover:cursor-pointer":
            status === ProgressTrackerItemStatus.COMPLETE && onClick,
        }
      )}
      whileHover="hover"
      animate="displayed"
      onClick={handleClick}>
      <div className="flex flex-1 grow flex-row justify-center">
        <motion.label
          initial={{
            color:
              status === ProgressTrackerItemStatus.COMPLETE &&
              !animateBackground
                ? "#22c55e"
                : (status === ProgressTrackerItemStatus.COMPLETE &&
                    animateBackground) ||
                  (status === ProgressTrackerItemStatus.ACTIVE &&
                    !animateBackground)
                ? "#FAF9F6"
                : "#6b7280",
            textShadow:
              status === ProgressTrackerItemStatus.COMPLETE &&
              !animateBackground
                ? "0 0 15px rgba(75,188,100,0.5)"
                : (status === ProgressTrackerItemStatus.COMPLETE &&
                    animateBackground) ||
                  (status === ProgressTrackerItemStatus.ACTIVE &&
                    !animateBackground)
                ? "0 0 15px rgba(256,256,256,0.5)"
                : "none",
          }}
          variants={labelVariants}
          className={clsx("text-center font-label-4 transition", {
            "cursor-pointer group-hover:underline":
              status === ProgressTrackerItemStatus.COMPLETE && onClick,
          })}>
          {label}
        </motion.label>
      </div>
      <motion.div
        initial={{
          backgroundColor:
            status === ProgressTrackerItemStatus.COMPLETE && !animateBackground
              ? "#22c55e"
              : (status === ProgressTrackerItemStatus.COMPLETE &&
                  animateBackground) ||
                (status === ProgressTrackerItemStatus.ACTIVE &&
                  !animateBackground)
              ? "#FAF9F6"
              : "#6b7280",
        }}
        className={clsx(
          "relative flex h-[40px] w-[40px] shrink items-center justify-center rounded-full border-[2px] border-slate-800",
          {
            "cursor-pointer": status === ProgressTrackerItemStatus.COMPLETE,
          }
        )}
        variants={pathVariants}>
        {status === ProgressTrackerItemStatus.COMPLETE ? (
          <CheckIcon className="z-40 h-6 w-6 fill-inverse stroke-inverse stroke-[3]" />
        ) : (
          <>
            {status === ProgressTrackerItemStatus.ACTIVE ? (
              <PencilIcon
                height={20}
                width={20}
                className="z-40 fill-inverse"
              />
            ) : (
              <LockClosedIcon
                height={20}
                width={22}
                className="z-40 mb-0.5 fill-inverse stroke-inverse"
              />
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

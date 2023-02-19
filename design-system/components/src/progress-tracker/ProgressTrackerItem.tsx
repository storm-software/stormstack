/* eslint-disable react/jsx-no-useless-fragment */
"use client";

import {
  CheckCircleIcon,
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
            ? "#00DC82"
            : status === ProgressTrackerItemStatus.ACTIVE
            ? "#FAF9F6"
            : "#989899",
        transition: { duration: 1, delay: 1, ease: "easeInOut" },
      },
      hover:
        status === ProgressTrackerItemStatus.COMPLETE && onClick
          ? {
              color: "#A36DE9",
              textDecoration: "underline",
              transition: { duration: 0.5, delay: 0, ease: "linear" },
            }
          : {},
    }),
    [onClick, status]
  );
  const pathVariants = useMemo(
    () => ({
      displayed: {
        fill:
          status === ProgressTrackerItemStatus.COMPLETE
            ? "#00DC82"
            : status === ProgressTrackerItemStatus.ACTIVE
            ? "#FAF9F6"
            : "#989899",
        transition: { duration: 1, delay: 1, ease: "easeInOut" },
      },
      hover:
        status === ProgressTrackerItemStatus.COMPLETE && onClick
          ? {
              fill: "#A36DE9",
              transition: { duration: 0.5, delay: 0, ease: "linear" },
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
                ? "#00DC82"
                : (status === ProgressTrackerItemStatus.COMPLETE &&
                    animateBackground) ||
                  (status === ProgressTrackerItemStatus.ACTIVE &&
                    !animateBackground)
                ? "#FAF9F6"
                : "#989899",
          }}
          variants={labelVariants}
          className={clsx("font-label-4 transition", {
            "hover:cursor-pointer hover:underline":
              status === ProgressTrackerItemStatus.COMPLETE && onClick,
          })}>
          {label}
        </motion.label>
      </div>
      <div className="relative flex h-[70px] w-[70px] shrink items-center justify-center">
        <div className="absolute top-0 left-0 right-0 z-10 h-[70px] w-[70px]">
          <svg viewBox="0 0 1024 1024" height="70" width="70" x="0px" y="0px">
            <motion.path
              initial={{
                fill:
                  status === ProgressTrackerItemStatus.COMPLETE &&
                  !animateBackground
                    ? "#00DC82"
                    : (status === ProgressTrackerItemStatus.COMPLETE &&
                        animateBackground) ||
                      (status === ProgressTrackerItemStatus.ACTIVE &&
                        !animateBackground)
                    ? "#FAF9F6"
                    : "#989899",
              }}
              variants={pathVariants}
              d="M896 704C896 720.213333 887.04 734.293333 873.386667 741.546667L536.32 930.986667C529.493333 936.106667 520.96 938.666667 512 938.666667 503.04 938.666667 494.506667 936.106667 487.68 930.986667L150.613333 741.546667C136.96 734.293333 128 720.213333 128 704L128 320C128 303.786667 136.96 289.706667 150.613333 282.453333L487.68 93.013333C494.506667 87.893333 503.04 85.333333 512 85.333333 520.96 85.333333 529.493333 87.893333 536.32 93.013333L873.386667 282.453333C887.04 289.706667 896 303.786667 896 320L896 704Z"
            />
          </svg>
        </div>
        <div className="relative z-20 flex h-[60px] w-[60px] items-center justify-center">
          <div className="absolute top-0 left-0 right-0 h-[60px] w-[60px]">
            <svg
              viewBox="0 0 1024 1024"
              height="60"
              width="60"
              x="0px"
              y="0px"
              className="fill-inverse"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M896 704C896 720.213333 887.04 734.293333 873.386667 741.546667L536.32 930.986667C529.493333 936.106667 520.96 938.666667 512 938.666667 503.04 938.666667 494.506667 936.106667 487.68 930.986667L150.613333 741.546667C136.96 734.293333 128 720.213333 128 704L128 320C128 303.786667 136.96 289.706667 150.613333 282.453333L487.68 93.013333C494.506667 87.893333 503.04 85.333333 512 85.333333 520.96 85.333333 529.493333 87.893333 536.32 93.013333L873.386667 282.453333C887.04 289.706667 896 303.786667 896 320L896 704Z" />
            </svg>
          </div>
          <div className="relative z-30 flex h-[50px] w-[50px] items-center justify-center">
            <div
              className={clsx(
                "absolute top-0 left-0 right-0 h-[50px] w-[50px] rounded-full transition",
                {
                  "shadow-active-glow":
                    status === ProgressTrackerItemStatus.ACTIVE,
                }
              )}>
              <svg
                viewBox="0 0 1024 1024"
                height="50"
                width="50"
                x="0px"
                y="0px"
                xmlns="http://www.w3.org/2000/svg">
                <motion.path
                  initial={{
                    fill:
                      status === ProgressTrackerItemStatus.COMPLETE &&
                      !animateBackground
                        ? "#00DC82"
                        : (status === ProgressTrackerItemStatus.COMPLETE &&
                            animateBackground) ||
                          (status === ProgressTrackerItemStatus.ACTIVE &&
                            !animateBackground)
                        ? "#FAF9F6"
                        : "#989899",
                  }}
                  variants={pathVariants}
                  d="M896 704C896 720.213333 887.04 734.293333 873.386667 741.546667L536.32 930.986667C529.493333 936.106667 520.96 938.666667 512 938.666667 503.04 938.666667 494.506667 936.106667 487.68 930.986667L150.613333 741.546667C136.96 734.293333 128 720.213333 128 704L128 320C128 303.786667 136.96 289.706667 150.613333 282.453333L487.68 93.013333C494.506667 87.893333 503.04 85.333333 512 85.333333 520.96 85.333333 529.493333 87.893333 536.32 93.013333L873.386667 282.453333C887.04 289.706667 896 303.786667 896 320L896 704Z"
                />
              </svg>
            </div>
            {status === ProgressTrackerItemStatus.COMPLETE ? (
              <CheckCircleIcon className="z-40 h-6 w-6 fill-inverse" />
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
                    width={20}
                    className="z-40 fill-inverse"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

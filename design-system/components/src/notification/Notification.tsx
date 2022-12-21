"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { Heading } from "../heading";
import { ModalReference, ModalVariants } from "../modal/Modal.types";
import { PropsWithBase } from "../types";
import { getSvgFillStyle } from "../utilities/svg-style-utils";
import { NotificationVariants } from "./Notification.types";
import {
  getBackgroundStyle,
  getBorderStyle,
  getCloseButtonStyle,
  getDefaultTitle,
  getTextStyle,
} from "./Notification.utils";

export type NotificationProps = PropsWithBase<{
  /**
   * The variant style of the modal
   */
  variant?: NotificationVariants;

  /**
   * The text title displayed at the top of the modal
   */
  notification: string;

  /**
   * The initial value for the `opened` state when the modal is first rendered
   */
  initialOpened?: boolean;
}>;

/**
 * The base Notification component used by the Open System repository
 */
export const Notification = forwardRef<ModalReference, NotificationProps>(
  (
    {
      className,
      children,
      notification,
      initialOpened = false,
      variant = NotificationVariants.INFO,
    }: NotificationProps,
    ref: ForwardedRef<ModalReference>
  ) => {
    const [opened, setOpened] = useState(initialOpened);
    const handleOpen = useCallback(() => !opened && setOpened(true), [opened]);
    const handleClose = useCallback(() => opened && setOpened(false), [opened]);

    useImperativeHandle<ModalReference, ModalReference>(
      ref,
      () => ({
        opened,
        close: handleClose,
        open: handleOpen,
      }),
      [handleClose, handleOpen, opened]
    );

    return (
      <AnimatePresence>
        {opened && (
          <motion.div
            className={clsx(
              "relative z-20 h-fit w-[50rem] min-w-fit border-4 p-4 shadow-xl backdrop-blur-sm backdrop-brightness-0",
              getTextStyle(variant),
              getBorderStyle(variant),
              getBackgroundStyle(variant),
              className
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              ease: [0, 0.71, 0.2, 1.01],
            }}>
            <div className="flex h-full flex-row items-center gap-5">
              <span className="inline-block h-fit">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4035 5.59644 25 12.5 25C19.4035 25 25 19.4035 25 12.5C25 5.59644 19.4035 0 12.5 0ZM13.6364 6.81818C13.6364 6.19059 13.1276 5.68182 12.5 5.68182C11.8724 5.68182 11.3636 6.19059 11.3636 6.81818V13.6364C11.3636 14.264 11.8724 14.7727 12.5 14.7727C13.1276 14.7727 13.6364 14.264 13.6364 13.6364V6.81818ZM13.6364 17.6136C13.6364 16.986 13.1276 16.4773 12.5 16.4773C11.8724 16.4773 11.3636 16.986 11.3636 17.6136V18.1818C11.3636 18.8094 11.8724 19.3182 12.5 19.3182C13.1276 19.3182 13.6364 18.8094 13.6364 18.1818V17.6136Z"
                    className={getSvgFillStyle(
                      variant === ModalVariants.ERROR,
                      variant === ModalVariants.WARNING,
                      variant === ModalVariants.INFO,
                      variant === ModalVariants.SUCCESS
                    )}
                  />
                </svg>
              </span>
              <div className="flex h-full flex-1 flex-row items-center gap-3">
                <Heading
                  level={6}
                  className={clsx(
                    "whitespace-nowrap text-xl",
                    getTextStyle(variant)
                  )}>
                  {getDefaultTitle(variant)}
                </Heading>
                <div className="flex-1 font-header-6 text-xl font-bold text-primary">
                  {notification}
                </div>
              </div>
              <div
                onClick={handleClose}
                className={clsx(
                  "cursor-pointer rounded-full border-2 p-3 font-semibold transition-colors",
                  getCloseButtonStyle(variant)
                )}>
                <XMarkIcon className="h-6 w-6 cursor-pointer" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

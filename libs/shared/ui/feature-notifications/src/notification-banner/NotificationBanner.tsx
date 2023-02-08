"use client";

import {
  MessageBar,
  MessageBarVariants,
  PropsWithBase,
} from "@open-system/design-system-components";
import { ModalReference } from "@open-system/shared-ui-components";
import {
  NotificationTypes,
  removeNotification,
} from "@open-system/shared-ui-data-access";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { useDispatch } from "react-redux";

export type NotificationBannerProps = PropsWithBase<{
  /**
   * Identifier of the notification in the store
   */
  id: string;

  /**
   * The type of the notification
   */
  type?: NotificationTypes;

  /**
   * The text message displayed at the top of the modal
   */
  message: string;

  /**
   * The initial value for the `opened` state when the modal is first rendered
   */
  initialOpened?: boolean;
}>;

/**
 * The base NotificationBanner component used by the Open System repository
 */
export const NotificationBanner = forwardRef<
  ModalReference,
  NotificationBannerProps
>(
  (
    {
      id,
      className,
      message,
      initialOpened = true,
      type = NotificationTypes.INFO,
    }: NotificationBannerProps,
    ref: ForwardedRef<ModalReference>
  ) => {
    const [opened, setOpened] = useState(initialOpened);

    const dispatch = useDispatch();

    const handleOpen = useCallback(() => !opened && setOpened(true), [opened]);
    const handleClose = useCallback(() => {
      opened && setOpened(false);
      dispatch(removeNotification(id));
    }, [dispatch, id, opened]);

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
            layout={true}
            className={clsx("inset-0 mx-auto shadow-xl", className)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}>
            <MessageBar
              variant={type as MessageBarVariants}
              message={message}
              onClose={handleClose}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

"use client";

import { ModalReference } from "@open-system/core-components";
import { useSetToastMessages } from "@open-system/core-data-access";
import {
  Toast as OsToast,
  ToastVariants,
  PropsWithBase,
} from "@open-system/design-system-components";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";

export type ToastProps = PropsWithBase<{
  /**
   * Identifier of the notification in the store
   */
  id: string;

  /**
   * The initial value for the `opened` state when the modal is first rendered
   */
  initialOpened?: boolean;

  /**
   * Message to display
   */
  summary: string;

  /**
   * Type of alert to display
   */
  type: ToastTypes;
}>;

/**
 * The base Toast component used by the Open System repository
 */
export const Toast = forwardRef<ModalReference, ToastProps>(
  (
    { id, className, summary, type, initialOpened = true }: ToastProps,
    ref: ForwardedRef<ModalReference>
  ) => {
    const [opened, setOpened] = useState(initialOpened);
    const { remove } = useSetToastMessages();

    const handleOpen = useCallback(() => !opened && setOpened(true), [opened]);
    const handleClose = useCallback(() => {
      opened && setOpened(false);
      remove(id);
    }, [remove, id, opened]);

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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{
              duration: 1.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}>
            <OsToast
              variant={type as ToastVariants}
              summary={summary ?? ""}
              onClose={handleClose}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

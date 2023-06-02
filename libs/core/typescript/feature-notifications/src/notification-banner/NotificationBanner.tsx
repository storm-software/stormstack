"use client";

import { ModalReference } from "@open-system/core-components";
import { AlertMolecule, useSetAlerts } from "@open-system/core-data-access";
import {
  MessageBar,
  MessageBarVariants,
  PropsWithBase,
} from "@open-system/design-system-components";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useMolecule } from "jotai-molecules";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";

export type NotificationBannerProps = PropsWithBase<{
  /**
   * Identifier of the notification in the store
   */
  id: string;

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
    { id, className, initialOpened = true }: NotificationBannerProps,
    ref: ForwardedRef<ModalReference>
  ) => {
    const [opened, setOpened] = useState(initialOpened);

    const alertAtom = useMolecule(AlertMolecule);
    const alert = useAtomValue(alertAtom);
    const type = useAtomValue<string>(alert.typeAtom);
    const summary = useAtomValue<string>(alert.summaryAtom);

    // const details = useAtomValue(alert.detailsAtom);

    const { remove } = useSetAlerts();

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
            <MessageBar
              variant={type as MessageBarVariants}
              message={summary ?? ""}
              onClose={handleClose}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

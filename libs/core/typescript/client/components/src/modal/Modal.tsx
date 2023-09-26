"use client";

import {
  Modal as DesignComponentModal,
  ModalProps as DesignComponentModalProps
} from "@stormstack/design-system-components";
import { AnimatePresence, motion } from "framer-motion";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { ModalReference } from "../types";

export type ModalProps = DesignComponentModalProps & {
  /**
   * The initial value for the `opened` state when the modal is first rendered
   */
  initialOpened?: boolean;
};

/**
 * A component to handle NextJS/application specific logic for the Model design component.
 */
export const Modal = forwardRef<ModalReference, ModalProps>(
  (
    { children, initialOpened, ...props }: ModalProps,
    ref: ForwardedRef<ModalReference>
  ) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const portalRef = useRef<Element | null>(null);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      portalRef.current = document?.querySelector?.("#root-portal");
      setMounted(true);
    }, []);

    const [opened, setOpened] = useState(!!initialOpened);
    const handleOpen = useCallback(() => !opened && setOpened(true), [opened]);
    const handleClose = useCallback(() => opened && setOpened(false), [opened]);

    useImperativeHandle<ModalReference, ModalReference>(
      ref,
      () => ({
        opened,
        close: handleClose,
        open: handleOpen
      }),
      [handleClose, handleOpen, opened]
    );

    useEffect(() => {
      const overlay = overlayRef.current;

      const handleClick = (event: Event) => {
        if (!modalRef?.current?.contains?.(event.target as Node)) {
          handleClose();
          event.stopPropagation();
        }
      };

      overlay && overlay.addEventListener("click", handleClick, true);
      return () => {
        overlay && overlay.removeEventListener("click", handleClick, true);
      };
    }, [handleClose, opened]);

    return mounted && portalRef.current
      ? createPortal(
          <AnimatePresence>
            {opened && (
              <div
                ref={overlayRef}
                className="h-full w-full bg-black/50 backdrop-blur-sm fixed z-modal flex items-center">
                <motion.div
                  ref={modalRef}
                  className="m-auto z-20 h-fit w-fit relative flex justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    duration: 0.5,
                    ease: [0, 0.71, 0.2, 1.01]
                  }}>
                  <DesignComponentModal {...props} onClose={handleClose}>
                    {children}
                  </DesignComponentModal>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          portalRef.current
        )
      : null;
  }
);

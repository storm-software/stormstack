"use client";

import {
  Modal as DesignComponentModal,
  ModalProps as DesignComponentModalProps,
  ModalReference,
} from "@open-system/design-system-components";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "../hooks/use-click-outside";

export type ModalProps = DesignComponentModalProps;

/**
 * A component to handle NextJS/application specific logic for the Model design component.
 */
export const Modal = forwardRef<ModalReference, ModalProps>(
  ({ children, ...props }: ModalProps, ref: ForwardedRef<ModalReference>) => {
    const innerRef = useRef<ModalReference>(null);
    const portalRef = useRef<Element | null>(null);

    const handleOpen = useCallback(() => innerRef.current?.open?.(), []);
    const handleClose = useCallback(() => innerRef.current?.close?.(), []);

    useImperativeHandle<ModalReference, ModalReference>(
      ref,
      () => ({
        opened: !!innerRef.current?.opened,
        open: handleOpen,
        close: handleClose,
      }),
      [handleClose, handleOpen]
    );

    const containerRef = useClickOutside(handleClose);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      portalRef.current = document.querySelector<HTMLElement>("#portal");
      setMounted(true);
    }, []);

    return mounted && portalRef.current
      ? createPortal(
          <div ref={containerRef} className="h-fit w-fit">
            <DesignComponentModal {...props} ref={innerRef}>
              {children}
            </DesignComponentModal>
          </div>,
          portalRef.current
        )
      : null;
  }
);

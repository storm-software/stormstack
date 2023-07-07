"use client";

import { useSetContactFormProgress } from "@open-system/contact-client-data-access";
import {
  Modal,
  ModalProps,
  ModalReference,
} from "@open-system/core-client-components";
import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonTypes,
  ButtonVariants,
  ModalVariants,
} from "@open-system/design-system-components";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ForwardedRef, MutableRefObject, forwardRef, useCallback } from "react";

export type ContactResetModalProps = Omit<ModalProps, "title">;

export const ContactResetModal = forwardRef<
  ModalReference,
  ContactResetModalProps
>(
  (
    { className, ...props }: ContactResetModalProps,
    ref: ForwardedRef<ModalReference>
  ) => {
    const handleClose = useCallback(
      () =>
        (ref as MutableRefObject<ModalReference>)?.current &&
        (ref as MutableRefObject<ModalReference>).current.close(),

      [ref]
    );

    const router = useRouter();
    const { reset } = useSetContactFormProgress();

    const handleReset = useCallback(() => {
      reset();
      (ref as MutableRefObject<ModalReference>)?.current &&
        (ref as MutableRefObject<ModalReference>).current.close();
    }, [reset, router]);

    return (
      <Modal
        className={clsx("h-fit min-h-fit w-[45rem]", className)}
        {...props}
        ref={ref}
        initialOpened={false}
        variant={ModalVariants.WARNING}
        title="Reset Contact Information"
        onClose={handleClose}>
        <div className="flex flex-col gap-10">
          <div className="flex flex-1 grow">
            <div className="flex flex-col gap-2">
              <p className="whitespace-pre-wrap text-xl font-label-1 text-primary">
                Are you sure you want to remove all of your previously entered
                input?
              </p>
              <p className="whitespace-pre-wrap text-lg font-body-1 text-body-1">
                Selecting &quot;Reset&quot; below will start the contact process
                from the beginning.
              </p>
            </div>
          </div>
          <div className="shink flex flex-row-reverse gap-8">
            <Button
              variant={ButtonVariants.PRIMARY}
              type={ButtonTypes.RESET}
              onClick={handleReset}
              rounding={ButtonCornerRoundingTypes.NONE}
              transitionDirection={ButtonTransitionDirections.NONE}
              inverse={true}
              hoverText="Confirm">
              Reset
            </Button>
            <Button
              variant={ButtonVariants.PRIMARY}
              onClick={handleClose}
              rounding={ButtonCornerRoundingTypes.NONE}
              transitionDirection={ButtonTransitionDirections.NONE}
              hoverText="Cancel">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);

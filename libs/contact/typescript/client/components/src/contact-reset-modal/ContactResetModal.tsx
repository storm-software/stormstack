"use client";

import { useSetContactFormProgress } from "@stormstack/contact-client-data-access";
import {
  Modal,
  ModalProps,
  ModalReference
} from "@stormstack/core-client-components";
import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonTypes,
  ButtonVariants,
  ModalVariants
} from "@stormstack/design-system-components";
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
        <div className="gap-10 flex flex-col">
          <div className="flex-1 grow flex">
            <div className="gap-2 flex flex-col">
              <p className="text-xl text-primary whitespace-pre-wrap font-label-1">
                Are you sure you want to remove all of your previously entered
                input?
              </p>
              <p className="text-lg text-body-1 whitespace-pre-wrap font-body-1">
                Selecting &quot;Reset&quot; below will start the contact process
                from the beginning.
              </p>
            </div>
          </div>
          <div className="shink gap-8 flex flex-row-reverse">
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

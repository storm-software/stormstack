"use client";

import {
  ContactFormValues,
  useAddContactMutation,
} from "@open-system/contact-ui-data-access";
import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
} from "@open-system/design-system-components";
import { Link, ModalReference } from "@open-system/shared-ui-components";
import { Modal, ModalProps } from "@open-system/shared-ui-components/modal";
import { addSuccessNotification } from "@open-system/shared-ui-data-access";
import {
  EmailInput,
  Form,
  SubmitButton,
} from "@open-system/shared-ui-feature-form";
import clsx from "clsx";
import { ForwardedRef, forwardRef, MutableRefObject, useCallback } from "react";
import { useDispatch } from "react-redux";

export type SubscriptionModalFormProps = Omit<ModalProps, "title">;

export const SubscriptionModalForm = forwardRef<
  ModalReference,
  SubscriptionModalFormProps
>(
  (
    { className, ...props }: SubscriptionModalFormProps,
    ref: ForwardedRef<ModalReference>
  ) => {
    const dispatch = useDispatch();

    /*const modalRef = useRef<ModalReference | null>(null);


    const handleOpen = useCallback(() => modalRef.current?.open?.(), []);
    const handleClose = useCallback(() => modalRef.current?.c?.(), []);
    useImperativeHandle<ModalReference, ModalReference>(
      ref,
      () => ({
        opened: modalRef.current.opened,
        close: modalRef.current.close,
        open: modalRef.current?.open,
      }),
      []
    );*/

    const handleClose = useCallback(
      () =>
        (ref as MutableRefObject<ModalReference>)?.current &&
        (ref as MutableRefObject<ModalReference>).current.close(),

      [ref]
    );

    const [addContact] = useAddContactMutation();
    const handleSubmit = useCallback(
      async (values: ContactFormValues) => {
        console.log(values);

        /*const payload = await addContact({
          userId: "PSUL",
          body: values,
        }).unwrap();*/

        (ref as MutableRefObject<ModalReference>)?.current &&
          (ref as MutableRefObject<ModalReference>).current.close();

        dispatch(
          addSuccessNotification(
            "You've successfully subscribed to future email notifications"
          )
        );
      },
      [addContact, dispatch, ref]
    );

    return (
      <Modal
        {...props}
        ref={ref}
        title="Notification Sign-Up"
        className={clsx("h-fit min-h-fit w-[50rem]", className)}>
        <Form<ContactFormValues>
          className="flex flex-col gap-3"
          onSubmit={handleSubmit}
          defaultValues={{
            email: "",
            isSubscribed: true,
            reason: "other",
          }}>
          <div className="flex flex-col gap-6">
            <p className="font-body-1 text-primary">
              Once subscribed, you will receive email notifications outlining
              exciting future updates, interesting projects, and general
              announcements from this developer.{" "}
              <b>Your data will never be shared with a third party.</b> For more
              information, please see the{" "}
              <Link href="/about" inNewTab={true}>
                email policy
              </Link>
              .
            </p>
            <EmailInput name="email" required={true} />

            <div className="flex flex-row-reverse gap-6">
              <SubmitButton
                inverse={true}
                transitionDirection={ButtonTransitionDirections.RIGHT}
                rounding={ButtonCornerRoundingTypes.PARTIAL}>
                Subscribe
              </SubmitButton>
              <Button
                onClick={handleClose}
                transitionDirection={ButtonTransitionDirections.LEFT}
                rounding={ButtonCornerRoundingTypes.PARTIAL}
                hoverText="Close">
                Close
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }
);

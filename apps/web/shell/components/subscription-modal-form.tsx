/* eslint-disable react/display-name */
"use client";

import { Contact } from "@open-system/contact-client-data-access";
import {
  Link,
  Modal,
  ModalProps,
  ModalReference,
} from "@open-system/core-client-components";
import {
  MessageTypes,
  useForm,
  useSetNotifications,
} from "@open-system/core-client-data-access";
import {
  EmailInput,
  FormProvider,
  SubmitButton,
} from "@open-system/core-client-form";
import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonVariants,
} from "@open-system/design-system-components";
import clsx from "clsx";
import { ForwardedRef, MutableRefObject, forwardRef, useCallback } from "react";
import { subscribe } from "../actions/contact";

export type SubscriptionModalFormProps = Omit<ModalProps, "title">;

export const SubscriptionModalForm = forwardRef<
  ModalReference,
  SubscriptionModalFormProps
>(
  (
    { className, ...props }: SubscriptionModalFormProps,
    ref: ForwardedRef<ModalReference>
  ) => {
    const handleClose = useCallback(
      () =>
        (ref as MutableRefObject<ModalReference>)?.current &&
        (ref as MutableRefObject<ModalReference>).current.close(),

      [ref]
    );

    const { add: addNotification } = useSetNotifications();
    const handleSuccess = useCallback(() => {
      addNotification({
        type: MessageTypes.SUCCESS,
        message: "You've successfully subscribed to email notifications!",
        link: { text: "Details", href: "/about" },
      });
    }, [addNotification]);

    const { withSubmit, context } = useForm<Contact>({
      defaultValues: {
        email: "",
        isSubscribed: true,
        reason: "subscription",
      },
      onSuccess: handleSuccess,
      onSettled: handleClose,
    });

    return (
      <Modal
        {...props}
        ref={ref}
        title="Notification Sign-Up"
        className={clsx("h-fit min-h-fit w-[50rem]", className)}>
        <FormProvider<Contact> {...context}>
          <form
            className="flex flex-col gap-3"
            {...context.props}
            action={withSubmit(subscribe)}>
            <div className="flex flex-col gap-6">
              <p className="font-body-1 text-body-1">
                Once subscribed, you will receive email notifications outlining
                exciting future updates, interesting projects, and general
                announcements from this developer.{" "}
                <b>Your data will never be shared with a third party.</b> For
                more information, please see the{" "}
                <Link href="/about" inNewTab={true}>
                  email policy
                </Link>
                .
              </p>
              <div className="w-full pr-8">
                <EmailInput name="email" required={true} />
              </div>

              <div className="flex flex-row-reverse gap-6">
                <SubmitButton
                  variant={ButtonVariants.SECONDARY}
                  rounding={ButtonCornerRoundingTypes.PARTIAL}>
                  Subscribe
                </SubmitButton>
                <Button
                  onClick={handleClose}
                  transitionDirection={ButtonTransitionDirections.NONE}
                  rounding={ButtonCornerRoundingTypes.PARTIAL}
                  hoverText="Close">
                  Close
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </Modal>
    );
  }
);

"use client";

import { Contact } from "@open-system/contact-data-access";
import { SubscriptionCheckbox } from "@open-system/contact-feature-form";
import {
  MessageTypes,
  useForm,
  useSetNotifications,
} from "@open-system/core-data-access";
import {
  EmailInput,
  FormProvider,
  SubmitButton,
  Textarea,
} from "@open-system/core-feature-form";
import {
  BaseComponentProps,
  ButtonCornerRoundingTypes,
} from "@open-system/design-system-components";
import clsx from "clsx";
import { useCallback } from "react";
import { subscribe } from "../actions/contact";

export function ContactFooterForm({ className, ...props }: BaseComponentProps) {
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
      details: "",
      isSubscribed: true,
      reason: "subscription",
    },
    onSuccess: handleSuccess,
  });

  return (
    <div className={clsx("flex flex-1 grow flex-col", className)}>
      <h1 className="ml-3 text-7xl font-header-1 text-primary">
        Let&apos;s work{" "}
        <span className="bg-gradient-to-r from-primary to-primary bg-[length:100%_8px] bg-bottom bg-no-repeat px-1 pb-1">
          <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
            together
          </span>
        </span>
        !
      </h1>

      <FormProvider<Contact> {...context}>
        <form
          className="flex flex-col gap-3"
          {...context.props}
          action={withSubmit(subscribe)}>
          <div className="flex flex-col">
            <EmailInput name="email" required={true} glow={false} />
            <Textarea
              name="comment"
              label="Message"
              placeholder="I am interested in working with you on a future project."
              glow={false}
            />
            <SubscriptionCheckbox glow={false} />
          </div>
          <div className="flex flex-row-reverse">
            <SubmitButton rounding={ButtonCornerRoundingTypes.PARTIAL}>
              Submit
            </SubmitButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

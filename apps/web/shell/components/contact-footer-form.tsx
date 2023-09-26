"use client";

import { SubscriptionCheckbox } from "@stormstack/contact-client-components";
import { Contact } from "@stormstack/contact-shared-data-access";
import {
  MessageTypes,
  useForm,
  useSetNotifications
} from "@stormstack/core-client-data-access";
import {
  EmailInput,
  FormProvider,
  SubmitButton,
  Textarea
} from "@stormstack/core-client-form";
import {
  BaseComponentProps,
  ButtonCornerRoundingTypes
} from "@stormstack/design-system-components";
import clsx from "clsx";
import { useCallback } from "react";
import { subscribe } from "../actions/contact";

export function ContactFooterForm({ className, ...props }: BaseComponentProps) {
  const { add: addNotification } = useSetNotifications();
  const handleSuccess = useCallback(() => {
    addNotification({
      type: MessageTypes.SUCCESS,
      message: "You've successfully subscribed to email notifications!",
      link: { text: "Details", href: "/about" }
    });
  }, [addNotification]);

  const { withSubmit, context } = useForm<Contact>({
    defaultValues: {
      email: "",
      details: "",
      isSubscribed: true,
      reason: "subscription"
    },
    onSuccess: handleSuccess
  });

  return (
    <div className={clsx("flex-1 grow flex flex-col", className)}>
      <h1 className="ml-3 text-7xl text-primary font-header-1">
        Let&apos;s work{" "}
        <span className="bg-gradient-to-r from-primary to-primary bg-bottom px-1 pb-1 bg-[length:100%_8px] bg-no-repeat">
          <span className="bg-gradient-to-r from-purple-600 to-teal-500 text-transparent bg-clip-text">
            together
          </span>
        </span>
        !
      </h1>

      <FormProvider<Contact> {...context}>
        <form
          className="gap-3 flex flex-col"
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

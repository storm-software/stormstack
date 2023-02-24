"use client";

import { ContactFormValues } from "@open-system/contact-ui-data-access";
import { useCreateContactMutation } from "@open-system/contact-ui-data-access/apis";
import {
  BaseComponentProps,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
} from "@open-system/design-system-components";
import { addSuccessNotification } from "@open-system/shared-ui-data-access";
import {
  EmailInput,
  Form,
  SubmitButton,
  Textarea,
} from "@open-system/shared-ui-feature-form";
import clsx from "clsx";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { SubscriptionCheckbox } from "../subscription-checkbox";

export function ContactFooterForm({ className, ...props }: BaseComponentProps) {
  const [createContact] = useCreateContactMutation();
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    async (values: ContactFormValues) => {
      console.log(values);

      await createContact({
        body: {
          ...values,
        },
      }).unwrap();

      dispatch(
        addSuccessNotification("You're now subscribed to email notifications")
      );
    },
    [createContact, dispatch]
  );

  return (
    <div className={clsx("flex flex-1 grow flex-col", className)}>
      <h1 className="ml-3 text-7xl font-header-1 text-primary">
        Let's work{" "}
        <span className="bg-gradient-to-r from-primary to-primary bg-[length:100%_8px] bg-bottom bg-no-repeat px-1 pb-1">
          <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
            together
          </span>
        </span>
        !
      </h1>

      <Form<ContactFormValues>
        className="flex flex-col gap-3"
        onSubmit={handleSubmit}
        defaultValues={{
          email: "",
          details: "",
          isSubscribed: true,
          reason: "subscription",
        }}>
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
          <SubmitButton
            transitionDirection={ButtonTransitionDirections.RIGHT}
            rounding={ButtonCornerRoundingTypes.PARTIAL}>
            Send
          </SubmitButton>
        </div>
      </Form>
    </div>
  );
}

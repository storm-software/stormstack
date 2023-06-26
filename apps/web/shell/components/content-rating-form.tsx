"use client";

import {
  MessageTypes,
  useForm,
  useSetNotifications,
} from "@open-system/core-data-access";
import { FormProvider } from "@open-system/core-feature-form";
import { BaseComponentProps } from "@open-system/design-system-components";
import { Rate } from "@open-system/engagement-data-access";
import { useCallback } from "react";
import { giveRating } from "../actions/engagement";

export interface ContentRatingProps extends BaseComponentProps {
  contentId: string;
  rate?: number;
}

export function ContentRatingForm({
  contentId,
  rate,
  children,
}: ContentRatingProps) {
  const { add: addNotification } = useSetNotifications();
  const handleSuccess = useCallback(() => {
    addNotification({
      type: MessageTypes.SUCCESS,
      message: "You've successfully subscribed to email notifications!",
      link: { text: "Details", href: "/about" },
    });
  }, [addNotification]);

  const { withSubmit, context } = useForm<Rate>({
    initialValues: {
      contentId,
      rate,
    },
    onSuccess: handleSuccess,
  });

  return (
    <FormProvider<Rate> {...context}>
      <form
        className="flex flex-col gap-3"
        {...context.props}
        action={withSubmit(giveRating)}>
        {children}
      </form>
    </FormProvider>
  );
}

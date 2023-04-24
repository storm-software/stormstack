"use client";

import {
  SubscriptionModalForm,
  SubscriptionModalFormProps,
} from "@open-system/contact-ui-feature-form";
import { ModalReference } from "@open-system/shared-ui-components";
import { ForwardedRef, forwardRef } from "react";

// eslint-disable-next-line react/display-name
const SubscriptionModalFormClient = forwardRef<
  ModalReference,
  SubscriptionModalFormProps
>((props: SubscriptionModalFormProps, ref: ForwardedRef<ModalReference>) => {
  return <SubscriptionModalForm {...props} ref={ref} />;
});

export default SubscriptionModalFormClient;

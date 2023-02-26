"use client";

import {
  selectContactFormCreatedDateTime,
  selectContactFormValues,
} from "@open-system/contact-ui-data-access";
import {
  ContactFormSegments,
  ContactTypeForm,
} from "@open-system/contact-ui-feature-form";
import { isEmpty } from "@open-system/core-typescript-utilities";
import { addInfoNotification } from "@open-system/shared-ui-data-access";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContactForm from "./contact-form";

export default function Page() {
  const createdDateTime = useSelector(selectContactFormCreatedDateTime);

  const router = useRouter();

  const formValues = useSelector(selectContactFormValues);

  const dispatch = useDispatch();
  useEffect(() => {
    if (
      !isEmpty(createdDateTime) &&
      createdDateTime?.getDuration().minutes &&
      router &&
      formValues?.reason
    ) {
      dispatch(
        addInfoNotification(
          `Reloaded details previously added on ${createdDateTime
            ?.getPlainDate()
            .toLocaleString()} at ${createdDateTime
            ?.getPlainTime()
            .toLocaleString(undefined, { timeStyle: "short" })}`
        )
      );

      if (formValues.reason) {
        if (formValues.email && formValues.firstName && formValues.lastName) {
          router.replace(
            `/contact/${formValues.reason}/${ContactFormSegments.DETAILS}`
          );
        } else {
          router.replace(
            `/contact/${formValues.reason}/${ContactFormSegments.PERSONAL_INFO}`
          );
        }
      }
    }
  }, [createdDateTime?.toString()]);

  return (
    <ContactForm
      nextPathname={`/contact/${formValues?.reason ?? "business"}/${
        ContactFormSegments.PERSONAL_INFO
      }`}>
      <ContactTypeForm />
    </ContactForm>
  );
}

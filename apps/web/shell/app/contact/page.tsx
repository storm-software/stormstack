"use client";

import { useContactValue } from "@open-system/contact-data-access";
import {
  ContactFormSegments,
  ContactTypeForm,
} from "@open-system/contact-feature-form";
import { MessageTypes, useSetToastMessages } from "@open-system/core-data-access";
import { DateTime, isEmpty } from "@open-system/core-utilities";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ContactForm from "./contact-form";

export default function Page() {
  const contact = useContactValue();
  const { add } = useSetToastMessages();

  const router = useRouter();
  useEffect(() => {
    if (
      contact &&
      !isEmpty(contact.draftSavedDateTime) &&
      DateTime.isValid(contact.draftSavedDateTime) &&
      DateTime.getDuration(DateTime.current, contact.draftSavedDateTime).seconds > 10 &&
      router &&
      contact.reason
    ) {
      if (contact.email && contact.firstName && contact.lastName) {
        router.replace(
          `/contact/${contact.reason}/${ContactFormSegments.DETAILS}` as any
        );
      } else {
        router.replace(
          `/contact/${contact.reason}/${ContactFormSegments.PERSONAL_INFO}` as any
        );
      }

      add({
        type: MessageTypes.INFO,
        summary: `We've reloaded the contact details you previously added on ${contact.draftSavedDateTime
          ?.getPlainDate()
          .toLocaleString()} at ${contact.draftSavedDateTime
          ?.getPlainTime()
          .toLocaleString(undefined, { timeStyle: "short" })}`,
        isExtendable: false,
      });
    }
  }, [
    add,
    contact,
    contact.draftSavedDateTime,
    contact.email,
    contact.firstName,
    contact.lastName,
    contact.reason,
    router,
  ]);

  return (
    <ContactForm
      nextPathname={`/contact/${contact.reason ?? "business"}/${
        ContactFormSegments.PERSONAL_INFO
      }`}>
      <ContactTypeForm />
    </ContactForm>
  );
}

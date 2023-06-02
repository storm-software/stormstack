"use client";

import { useContactValue } from "@open-system/contact-data-access";
import {
  ContactFormSegments,
  ContactTypeForm,
} from "@open-system/contact-feature-form";
import { MessageTypes, useSetAlerts } from "@open-system/core-data-access";
import { DateTime, isEmpty } from "@open-system/core-utilities";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ContactForm from "./contact-form";

export default function Page() {
  const contact = useContactValue();
  const { add } = useSetAlerts();

  const router = useRouter();
  useEffect(() => {
    if (
      contact &&
      !isEmpty(contact.draftSavedDateTime) &&
      DateTime.isValid(contact.draftSavedDateTime) &&
      router &&
      contact.reason
    ) {
      add({
        id: "234234234242",
        type: MessageTypes.INFO,
        summary: `Reloaded details previously added on ${contact.draftSavedDateTime
          ?.getPlainDate()
          .toLocaleString()} at ${contact.draftSavedDateTime
          ?.getPlainTime()
          .toLocaleString(undefined, { timeStyle: "short" })}`,
        isExtendable: false,
      });

      if (contact.reason) {
        if (contact.email && contact.firstName && contact.lastName) {
          router.replace(
            `/contact/${contact.reason}/${ContactFormSegments.DETAILS}` as any
          );
        } else {
          router.replace(
            `/contact/${contact.reason}/${ContactFormSegments.PERSONAL_INFO}` as any
          );
        }
      }
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

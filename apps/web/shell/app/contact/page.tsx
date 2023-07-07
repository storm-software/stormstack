"use client";

import { ContactTypeForm } from "@open-system/contact-client-components";
import {
  ContactFormSegments,
  useContactValue,
  useSetContactFormProgress,
} from "@open-system/contact-client-data-access";
import {
  MessageTypes,
  useSetToastMessages,
} from "@open-system/core-client-data-access";
import { DateTime, isEmpty } from "@open-system/core-shared-utilities";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { reset, goToStep } = useSetContactFormProgress();
  const { add } = useSetToastMessages();
  const contact = useContactValue();

  const router = useRouter();
  useEffect(() => {
    if (
      contact &&
      !isEmpty(contact.draftSavedDateTime) &&
      DateTime.isValid(contact.draftSavedDateTime) &&
      DateTime.getDuration(DateTime.current, contact.draftSavedDateTime)
        .seconds > 10 &&
      router &&
      contact.reason
    ) {
      reset(contact.reason);
      if (contact.email && contact.firstName && contact.lastName) {
        goToStep(2, false);
        router.replace(
          `/contact/${contact.reason}/${ContactFormSegments.DETAILS}`
        );
      } else {
        goToStep(1, false);
        router.replace(
          `/contact/${contact.reason}/${ContactFormSegments.PERSONAL_INFO}`
        );
      }

      add({
        type: MessageTypes.INFO,
        summary: `The contact details you previously added on ${contact.draftSavedDateTime
          ?.getPlainDate()
          .toLocaleString()} at ${contact.draftSavedDateTime
          ?.getPlainTime()
          .toLocaleString(undefined, { timeStyle: "short" })} were reloaded`,
        isExtendable: false,
      });
    }
  }, [
    contact,
    contact.draftSavedDateTime,
    contact.email,
    contact.firstName,
    contact.lastName,
    contact.reason,
  ]);

  return <ContactTypeForm />;
}

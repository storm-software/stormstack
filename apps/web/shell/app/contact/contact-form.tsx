"use client";

import {
  Contact,
  useContactValue,
  useResetContact,
} from "@open-system/contact-data-access";
import { Form } from "@open-system/core-feature-form";
import { BaseComponentProps } from "@open-system/design-system-components";
import { useRouter } from "next/navigation";
import {
  experimental_useEffectEvent as useEffectEvent,
  useTransition,
} from "react";

export default function ContactForm({
  children,
  className,
  ...props
}: BaseComponentProps) {
  const router = useRouter();

  const resetContact = useResetContact();
  const contact = useContactValue();

  const [, startTransition] = useTransition();

  const handleSuccess = useEffectEvent((response: any) => {
    startTransition(() => {
      resetContact();
      router.replace("/contact/success");
    });
  });

  return (
    <Form<Contact>
      className="flex flex-row"
      encType="multipart/form-data"
      method="post"
      action="/api/contact"
      onSuccess={handleSuccess}
      initialValues={contact}>
      {children}
    </Form>
  );
}

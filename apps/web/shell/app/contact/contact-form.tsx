"use client";

import {
  Contact,
  useContactValue,
  useResetContact,
} from "@open-system/contact-data-access";
import { Form } from "@open-system/core-feature-form";
import { BaseComponentProps } from "@open-system/design-system-components";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";

export interface ContactFormProps extends BaseComponentProps {
  onSubmit: (contact: Contact) => Promise<void>;
}

export default function ContactForm({
  children,
  className,
  onSubmit,
  ...props
}: ContactFormProps) {
  const router = useRouter();

  const resetContact = useResetContact();
  const contact = useContactValue();
  const [, startTransition] = useTransition();

  const handleSubmit = useCallback(
    async (formData: Contact) => {
      startTransition(() => {
        onSubmit(formData);
        resetContact();

        router.push("/contact/success");
      });
    },
    [onSubmit, resetContact, router]
  );

  return (
    <Form<Contact>
      className="flex flex-row"
      onSubmit={handleSubmit}
      initialValues={contact}>
      {children}
    </Form>
  );
}

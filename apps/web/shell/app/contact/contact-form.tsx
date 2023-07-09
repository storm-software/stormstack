"use client";

import { useContactValue } from "@open-system/contact-client-data-access";
import { Contact } from "@open-system/contact-shared-data-access";
import { useForm } from "@open-system/core-client-data-access";
import { FormProvider } from "@open-system/core-client-form";
import { FormProps } from "@open-system/core-shared-data-access";
import { useRouter } from "next/navigation";
import {
  experimental_useEffectEvent as useEffectEvent,
  useTransition,
} from "react";
import { addContact } from "../../actions/contact";

export default function ContactForm({ children }: FormProps<Contact>) {
  const router = useRouter();

  // const resetContact = useResetContact();
  const contact = useContactValue();

  const [, startTransition] = useTransition();
  const handleSuccess = useEffectEvent((response: any) => {
    startTransition(() => {
      router.replace("/contact/success");
    });
  });

  const { withSubmit, context } = useForm<Contact>({
    initialValues: contact,
    onSuccess: handleSuccess,
  });

  return (
    <FormProvider<Contact> {...context}>
      <form
        className="flex flex-row"
        {...context.props}
        action={withSubmit(addContact)}>
        {children}
      </form>
    </FormProvider>
  );
}

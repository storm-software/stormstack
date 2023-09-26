"use client";

import { useContactValue } from "@stormstack/contact-client-data-access";
import { Contact } from "@stormstack/contact-shared-data-access";
import { useForm } from "@stormstack/core-client-data-access";
import { FormProvider } from "@stormstack/core-client-form";
import { FormProps } from "@stormstack/core-shared-data-access";
import { useRouter } from "next/navigation";
import {
  experimental_useEffectEvent as useEffectEvent,
  useTransition
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
    onSuccess: handleSuccess
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

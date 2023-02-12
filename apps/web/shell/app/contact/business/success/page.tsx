"use client";

import { SuccessContactForm } from "@open-system/contact-ui-feature-form";
import ContactForm from "../../contact-form";

export default function Page() {
  return (
    <ContactForm>
      <SuccessContactForm
        title="I've received your message"
        note="Thank you so much for reaching out. I will respond back as soon as possible. Hopefully we can work together soon!"
      />
    </ContactForm>
  );
}

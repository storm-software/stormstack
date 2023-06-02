"use client";

import { ContactBusinessPersonalInfoForm } from "@open-system/contact-feature-form";
import ContactForm from "../../contact-form";

export default function Page() {
  return (
    <ContactForm nextPathname="/contact/business/details">
      <ContactBusinessPersonalInfoForm />
    </ContactForm>
  );
}

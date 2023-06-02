"use client";

import { ContactBusinessDetailsForm } from "@open-system/contact-feature-form";
import ContactForm from "../../contact-form";

export default function Page() {
  return (
    <ContactForm
      nextPathname="/contact/business/review"
      previousPathname="/contact/business/personal-info">
      <ContactBusinessDetailsForm />
    </ContactForm>
  );
}

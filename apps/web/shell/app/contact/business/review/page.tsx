"use client";

import { ContactBusinessReviewForm } from "@open-system/contact-feature-form";
import ContactForm from "../../contact-form";

export default function Page() {
  return (
    <ContactForm
      nextPathname="/contact/business/success"
      previousPathname="/contact/business/details">
      <ContactBusinessReviewForm />
    </ContactForm>
  );
}

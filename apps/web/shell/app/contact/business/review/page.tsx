"use client";

import {
  ContactBusinessReviewForm,
  ContactFormSegments,
} from "@open-system/contact-ui-feature-form";
import ContactForm from "../../contact-form";

export default function Page() {
  return (
    <ContactForm
      nextPathname={`/contact/business/${ContactFormSegments.SUCCESS}`}
      previousPathname={`/contact/business/${ContactFormSegments.DETAILS}`}>
      <ContactBusinessReviewForm />
    </ContactForm>
  );
}

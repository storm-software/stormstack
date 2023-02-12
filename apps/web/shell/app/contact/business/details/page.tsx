"use client";

import {
  ContactBusinessDetailsForm,
  ContactFormSegments,
} from "@open-system/contact-ui-feature-form";
import ContactForm from "../../contact-form";

export default function Page() {
  return (
    <ContactForm
      nextPathname={`/contact/business/${ContactFormSegments.REVIEW}`}
      previousPathname={`/contact/business/${ContactFormSegments.PERSONAL_INFO}`}>
      <ContactBusinessDetailsForm />
    </ContactForm>
  );
}

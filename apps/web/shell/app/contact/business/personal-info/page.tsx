"use client";

import {
  ContactBusinessPersonalInfoForm,
  ContactFormSegments,
} from "@open-system/contact-ui-feature-form";
import ContactForm from "../../contact-form";

export default function Page() {
  return (
    <ContactForm
      nextPathname={`/contact/business/${ContactFormSegments.DETAILS}`}>
      <ContactBusinessPersonalInfoForm />
    </ContactForm>
  );
}

"use client";

import { ContactBusinessPersonalInfoForm } from "@open-system/contact-ui-feature-form";
import PersistGate from "../../(components)/persist-gate";

export default function Page() {
  return (
    <PersistGate>
      <ContactBusinessPersonalInfoForm />
    </PersistGate>
  );
}

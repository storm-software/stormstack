"use client";

import {
  AddressInputFields,
  FirstNameInput,
  LastNameInput
} from "@stormstack/common-client-address";
import { Link } from "@stormstack/core-client-components";
import { useFormValues } from "@stormstack/core-client-data-access";
import { EmailInput, PhoneNumberInput } from "@stormstack/core-client-form";
import {
  Accordion,
  BaseComponentProps
} from "@stormstack/design-system-components";
import { BaseContactForm } from "../base-contact-form";
import { SubscriptionCheckbox } from "../subscription-checkbox";

export function ContactBusinessPersonalInfoForm({
  className,
  children,
  ...props
}: BaseComponentProps) {
  const values = useFormValues();

  return (
    <BaseContactForm
      title="Personal Information"
      description="Please tell me more about you or your business.">
      <FirstNameInput name="firstName" required={true} />
      <LastNameInput name="lastName" required={true} />
      <EmailInput name="email" required={true} />
      <SubscriptionCheckbox />
      <PhoneNumberInput
        name="phoneNumber"
        info={
          values.phoneNumber ? (
            <p>
              By providing a phone number, you are giving permission to contact
              you via text/call.{" "}
              <b>
                If you wish to revoke this permission later, you can always do
                so.
              </b>{" "}
              Additional information can be found in the site's{" "}
              <Link href="/about" inNewTab={true}>
                privacy policy
              </Link>
              .
            </p>
          ) : null
        }
      />

      <Accordion
        className="mt-4"
        summary="Address"
        details="(Optional)"
        opened={
          values.countryCode ||
          values.addressLine1 ||
          values.city ||
          values.state ||
          values.postalCode
        }
        showBottomDivider={false}>
        <AddressInputFields />
      </Accordion>
    </BaseContactForm>
  );
}

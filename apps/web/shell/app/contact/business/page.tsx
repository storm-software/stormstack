"use client";

import { useContactValue } from "@open-system/contact-data-access";
import { BaseContactForm } from "@open-system/contact-feature-form";

export default function Page() {
  const values = useContactValue(); //useFormValues();

  return (
    <BaseContactForm
      title="Personal Information"
      description="Please tell me more about you or your business.">
      {/*<FirstNameInput name="firstName" required={true} />
      <LastNameInput name="lastName" required={true} />
      <EmailInput name="email" required={true} />*/}
      {/*<SubscriptionCheckbox />
      <PhoneNumberInput
        name="phoneNumber"
        info={
          values.phoneNumber ? (
            <label>
              By providing a phone number, you are giving permission to contact
              you via text/call.{" "}
              <b>
                If you wish to revoke this permission later, you can always do
                so.
              </b>{" "}
              Additional information can be found in the site&apos;s{" "}
              <Link href="/about" inNewTab={true}>
                privacy policy
              </Link>
              .
            </label>
          ) : null
        }
      />

      <Accordion
        className="mt-4"
        summary="Address"
        details="(Optional)"
        opened={
          !!values.countryCode ||
          !!values.addressLine1 ||
          !!values.city ||
          !!values.state ||
          !!values.postalCode
        }
        showBottomDivider={false}>
        <AddressInputFields />
      </Accordion>*/}
    </BaseContactForm>
  );
}

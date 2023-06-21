"use client";

import { Contact, ContactFormSegments } from "@open-system/contact-data-access";
import { Link, PhoneNumberText } from "@open-system/core-components";
import { useFormValues } from "@open-system/core-data-access";
import { formatBoolean } from "@open-system/core-utilities";
import {
  BaseComponentProps,
  FieldText,
  LinkVariants,
} from "@open-system/design-system-components";
import { AddressText } from "@open-system/shared-feature-address";
import { BaseContactReviewForm } from "../base-contact-review-form";
import { ContactFormStepReview } from "../contact-form-step-review";

export function ContactBusinessReviewForm({
  className,
  children,
  ...props
}: BaseComponentProps) {
  const values = useFormValues<Contact>();

  return (
    <BaseContactReviewForm
      title="Business Opportunity Submit"
      sideContent={
        <>
          <ContactFormStepReview
            name={ContactFormSegments.PERSONAL_INFO}
            label="Personal Information">
            <div className="grid grid-cols-2 gap-3">
              <FieldText name="First name">{values.firstName}</FieldText>
              <FieldText name="Last name">{values.lastName}</FieldText>
              <FieldText name="Email address">{values.email}</FieldText>
              <FieldText name="Receive emails with future updates from this developer?">
                {formatBoolean(values.isSubscribed)}
              </FieldText>
              <PhoneNumberText
                name="Phone number"
                className="text-primary"
                phoneNumber={values.phoneNumber}
                placeholder="N/A"
              />
              <AddressText
                name="Address"
                className="text-primary"
                address={values}
                placeholder="N/A"
              />
            </div>
          </ContactFormStepReview>

          <ContactFormStepReview
            name={ContactFormSegments.DETAILS}
            label="Business Opportunity Details">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                {values.companyName && (
                  <FieldText name="Organization name">
                    {values.companyName}
                  </FieldText>
                )}
                {values.title && (
                  <FieldText name="Job position/title">
                    {values.title}
                  </FieldText>
                )}
                {values.url && (
                  <FieldText name="Related URL">
                    <Link
                      variant={LinkVariants.QUATERNARY}
                      href={values.url}
                      inNewTab={true}>
                      {values.url}
                    </Link>
                  </FieldText>
                )}
              </div>
              <FieldText name="Description">{values.details}</FieldText>
            </div>
          </ContactFormStepReview>
        </>
      }>
      {values && (
        <>
          <p className="text-slate-900">
            I'm reaching out to you
            {values.companyName ? ` on behalf of ${values.companyName}` : ""}
            {values.title
              ? ` regarding a ${values.title} job opening`
              : " about a business/employment opportunity"}
            .
          </p>
          {values.details && <p className="text-slate-900">{values.details}</p>}
          {values.url && (
            <p className="text-slate-900">
              More information can be found at the following URL:
              <br />{" "}
              <Link
                variant={LinkVariants.QUATERNARY}
                href={values.url}
                inNewTab={true}>
                {values.url}
              </Link>
            </p>
          )}
        </>
      )}
    </BaseContactReviewForm>
  );
}

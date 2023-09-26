"use client";

import { AddressText } from "@stormstack/common-client-address";
import { ContactFormSegments } from "@stormstack/contact-client-data-access";
import { Contact } from "@stormstack/contact-shared-data-access";
import { PhoneNumberText } from "@stormstack/core-client-components";
import { useFormValues } from "@stormstack/core-client-data-access";
import { DateTime } from "@stormstack/core-shared-utilities";
import { Accordion, FieldText } from "@stormstack/design-system-components";
import Envelope from "../../assets/envelope.svg";
import { BaseContactForm, BaseContactFormProps } from "../base-contact-form";
import { ContactFormStepReview } from "../contact-form-step-review";

export type BaseContactReviewFormProps = Omit<
  BaseContactFormProps,
  "description"
> &
  Partial<Pick<BaseContactFormProps, "description">>;

export function BaseContactReviewForm({
  title,
  description = "Please review your input and submit the contact request.",
  className,
  children,
  sideContent,
  ...props
}: BaseContactReviewFormProps) {
  const values = useFormValues<Contact>();

  return (
    <BaseContactForm
      isWide={true}
      title={title}
      description={description}
      sideContent={
        <Accordion
          className="mt-4 min-w-[32rem]"
          summary="Your Input"
          opened={true}
          showBottomDivider={true}>
          <div className="gap-4 flex flex-col">
            <ContactFormStepReview
              className="mt-3"
              name={ContactFormSegments.REASON}
              label="Contact Reason">
              <FieldText name="Reason">
                I have a business/employment opportunity
              </FieldText>
            </ContactFormStepReview>
            {sideContent}
          </div>
        </Accordion>
      }>
      <div className="pb-32 relative flex">
        <output className="text-md h-fit gap-2 border-4 border-black bg-slate-100 px-6 py-8 text-slate-800 flex min-h-[34rem] flex-col hyphens-auto font-body-1">
          <div className="grow gap-1 flex flex-col break-all">
            <div className="gap-2 flex flex-row justify-between">
              <p>Hey Pat,</p>
              <p>{DateTime.current?.getPlainDate().toLocaleString()}</p>
            </div>
            {children}
          </div>

          <div className="mb-3 flex flex-row-reverse">
            <div className="gap-0 flex flex-col">
              <p>Regards,</p>
              {(values.firstName || values.lastName) && (
                <p className="text-lg font-bold">
                  {values.firstName ? values.firstName : ""}
                  {values.lastName
                    ? values.firstName
                      ? ` ${values.lastName}`
                      : values.lastName
                    : ""}
                </p>
              )}
              <p>{values.email}</p>
              {values.phoneNumber && (
                <PhoneNumberText
                  className="text-slate-800"
                  phoneNumber={values.phoneNumber}
                />
              )}
              <AddressText
                className="text-slate-800"
                address={values}
                hideWhenEmpty={true}
              />
            </div>
          </div>
        </output>
        <Envelope
          className="-bottom-3 left-0 rotate-12 absolute"
          height={180}
          width={450}
        />
      </div>
    </BaseContactForm>
  );
}

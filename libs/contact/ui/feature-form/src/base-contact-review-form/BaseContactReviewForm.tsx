"use client";

import { ContactFormValues } from "@open-system/contact-ui-data-access";
import { DateTime } from "@open-system/core-typescript-utilities";
import { Accordion, FieldText } from "@open-system/design-system-components";
import {
  AddressText,
  PhoneNumberText,
} from "@open-system/shared-ui-components";
import { useFormValues } from "@open-system/shared-ui-feature-form/hooks";
import Envelope from "../../assets/envelope.svg";
import { BaseContactForm, BaseContactFormProps } from "../base-contact-form";
import { ContactFormSegments } from "../constants";
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
  const values = useFormValues<ContactFormValues>();

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
          <div className="flex flex-col gap-4">
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
      <div className="relative flex pb-32">
        <output className="text-md flex h-fit min-h-[34rem] flex-col gap-2 border-4 border-black bg-slate-100 px-6 py-8 font-body-1 text-slate-800">
          <div className="flex grow flex-col gap-1 break-all">
            <div className="flex flex-row justify-between gap-2">
              <p>Hey Pat,</p>
              <p>{DateTime.current?.getPlainDate().toLocaleString()}</p>
            </div>
            {children}
          </div>

          <div className="mb-3 flex flex-row-reverse">
            <div className="flex flex-col gap-0">
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
              <AddressText className="text-slate-800" address={values} />
            </div>
          </div>
        </output>
        <Envelope
          className="absolute -bottom-3 left-0 rotate-12"
          height={180}
          width={450}
        />
      </div>
    </BaseContactForm>
  );
}

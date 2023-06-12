"use client";

import { Input, Textarea, UrlInput, FileUpload } from "@open-system/core-feature-form";
import {
  BaseComponentProps,
  InputAutoCompleteTypes,
  TextareaSizes,
} from "@open-system/design-system-components";
import { BaseContactForm } from "../base-contact-form";
import {
  MAX_ATTACHMENT_SIZE,
  MAX_ATTACHMENTS_COUNT,
} from "@open-system/contact-data-access";


export function ContactBusinessDetailsForm({
  className,
  children,
  ...props
}: BaseComponentProps) {
  return (
    <BaseContactForm
      title="Business Opportunity Details"
      description="Please describe the business or employment opportunity you would
    like to discuss.">
      <Input
        name="companyName"
        label="Organization name"
        autoComplete={InputAutoCompleteTypes.ORG}
        maxLength={50}
        required={false}
      />
      <Input
        name="title"
        label="Job position/title"
        autoComplete={InputAutoCompleteTypes.ORG_TITLE}
        maxLength={50}
        required={false}
      />
      <UrlInput name="url" label="Related URL" required={false} />
      <Textarea
        name="details"
        label="Description"
        size={TextareaSizes.LARGE}
        maxLength={2000}
        required={true}
      />
      <FileUpload className="h-40" name="attachments" label="Attachments" multiple={true} maxSize={MAX_ATTACHMENT_SIZE} maxFiles={MAX_ATTACHMENTS_COUNT} />
    </BaseContactForm>
  );
}

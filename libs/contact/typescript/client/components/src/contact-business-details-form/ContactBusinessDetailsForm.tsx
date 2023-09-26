"use client";

import {
  MAX_ATTACHMENTS_COUNT,
  MAX_ATTACHMENT_SIZE
} from "@stormstack/contact-shared-data-access";
import {
  FileUpload,
  Input,
  Textarea,
  UrlInput
} from "@stormstack/core-client-form";
import {
  BaseComponentProps,
  InputAutoCompleteTypes,
  TextareaSizes
} from "@stormstack/design-system-components";
import { BaseContactForm } from "../base-contact-form";

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
      <FileUpload
        className="h-40"
        name="attachments"
        label="Attachments"
        multiple={true}
        maxSizeInBytes={MAX_ATTACHMENT_SIZE}
        maxFiles={MAX_ATTACHMENTS_COUNT}
      />
    </BaseContactForm>
  );
}

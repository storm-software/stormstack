"use client";

import { Radio } from "@open-system/core-feature-form";
import { BaseComponentProps } from "@open-system/design-system-components";
import { BaseContactForm } from "../base-contact-form";

export function ContactTypeForm({
  className,
  children,
  ...props
}: BaseComponentProps) {
  return (
    <BaseContactForm
      title="Contact Reason"
      description="What do you want to talk about?"
      sideContent={
        <label className="text-lg font-body-1 text-slate-400">
          I generally try to respond back to all requests within 1 or 2 business
          days.
        </label>
      }>
      <Radio
        name="reason"
        label={null}
        required={true}
        isVertical={true}
        options={[
          {
            name: "I have a business/employment opportunity",
            value: "business",
          },
          {
            name: "I would like help on an upcoming open source project",
            value: "project",
          },
          { name: "I have a question to ask", value: "question" },
          {
            name: "I'm interested in learning more about Pat Sullivan",
            value: "interest",
          },
          { name: "Other", value: "other" },
        ]}
      />
    </BaseContactForm>
  );
}

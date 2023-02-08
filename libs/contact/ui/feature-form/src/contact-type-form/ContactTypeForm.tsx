"use client";

import { ContactDetail } from "@open-system/contact-ui-data-access";
import { BaseComponentProps } from "@open-system/design-system-components";
import { Radio } from "@open-system/shared-ui-feature-form";
import clsx from "clsx";

export type ContactTypeFormValues = Pick<ContactDetail, "reason">;

export function ContactTypeForm({
  className,
  children,
  ...props
}: BaseComponentProps) {
  return (
    <div
      className={clsx(
        "flex flex-row items-center justify-between gap-20",
        className
      )}>
      <div className="flex flex-row items-center gap-8">
        <div className="flex shrink flex-col gap-2">
          <label className="font-header-4 text-2xl text-violet-500">
            Contact Reason
          </label>
          <h2 className="font-label-4 text-4xl text-primary">
            What do you want to talk about?
          </h2>
        </div>
        <div className="flex-2 flex grow flex-col justify-center">
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
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-8">{children}</div>
    </div>
  );
}

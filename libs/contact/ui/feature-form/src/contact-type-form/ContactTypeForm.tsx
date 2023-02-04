"use client";

import {
  BaseComponentProps,
  Button,
  ButtonCornerRoundingTypes,
  ButtonTypes,
  ButtonVariants,
  Radio,
} from "@open-system/design-system-components";
import clsx from "clsx";

export function ContactTypeForm({ className, ...props }: BaseComponentProps) {
  return (
    <div className={clsx("flex flex-1 grow flex-col", className)}>
      <div className="flex flex-col gap-8">
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
              name: "I would like your help on an upcoming open source project",
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
        <div className="flex flex-row-reverse">
          <Button
            type={ButtonTypes.SUBMIT}
            variant={ButtonVariants.SECONDARY}
            rounding={ButtonCornerRoundingTypes.FULL}
            hoverText="Continue">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

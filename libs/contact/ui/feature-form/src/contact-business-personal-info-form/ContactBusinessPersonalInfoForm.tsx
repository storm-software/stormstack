"use client";

import {
  BaseComponentProps,
  InputAutoCompleteTypes
} from "@open-system/design-system-components";
import {
  AddressInputFields, EmailInput,
  FirstNameInput,
  Input,
  LastNameInput,
  PhoneNumberInput
} from "@open-system/shared-ui-feature-form";
import clsx from "clsx";
import { SubscriptionCheckbox } from "../subscription-checkbox";

export function ContactBusinessPersonalInfoForm({
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
            Personal Information
          </label>
          <h2 className="font-label-4 text-4xl text-primary">
            Please tell me more about you or your business.
          </h2>
        </div>
        <div className="flex-2 flex grow flex-col justify-center">
          <EmailInput name="email" required={true} />
          <SubscriptionCheckbox
          />

          <PhoneNumberInput name="phoneNumber" />

          <FirstNameInput name="firstName" />
          <LastNameInput name="lastName" />

          <Input
            name="title"
            label="Title"
            autoComplete={InputAutoCompleteTypes.ORG_TITLE}
            required={false}
          />
          <Input
            name="companyName"
            label="Company name"
            autoComplete={InputAutoCompleteTypes.ORG}
            required={false}
          />

          <AddressInputFields required={false} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-8">{children}</div>
    </div>
  );
}

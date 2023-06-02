"use client";

import { Link } from "@open-system/core-components";
import { Checkbox } from "@open-system/core-feature-form";
import { CheckboxProps } from "@open-system/design-system-components";

export type SubscriptionCheckboxProps = Partial<CheckboxProps>;

export function SubscriptionCheckbox(props: SubscriptionCheckboxProps) {
  return (
    <Checkbox
      name="isSubscribed"
      label={
        <>
          I want to receive emails with future updates from this developer.
          Please see our{" "}
          <Link href="/about" inNewTab={true}>
            email policy
          </Link>
          .
        </>
      }
      {...props}
    />
  );
}

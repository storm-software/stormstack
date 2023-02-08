"use client";

import { CheckboxProps } from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";
import { Checkbox } from "@open-system/shared-ui-feature-form";

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

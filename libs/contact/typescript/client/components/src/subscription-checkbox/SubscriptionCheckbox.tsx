"use client";

import { Link } from "@stormstack/core-client-components";
import { Checkbox } from "@stormstack/core-client-form";
import { CheckboxProps } from "@stormstack/design-system-components";

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

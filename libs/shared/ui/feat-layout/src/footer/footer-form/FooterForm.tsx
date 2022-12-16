"use client";

import {
  BaseComponentProps,
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonTypes,
  Checkbox,
  Heading,
  Input,
  Textarea
} from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";
import clsx from "clsx";

export function FooterForm({ className, ...props }: BaseComponentProps) {
  return (
    <div className={clsx("flex flex-1 grow flex-col", className)}>
      <Heading className="ml-3 whitespace-nowrap" level={2}>
        Let's work together!
      </Heading>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <Input
            name="email"
            label="Email"
            required={true}
            placeholder="mike.smith@example.com"
          />
          <Textarea
            name="comment"
            label="Message"
            placeholder="I am interested in working with you on a future project."
          />
          <Checkbox
            name="subscribe"
            label={
              <>
                I want to receive emails with future updates from this
                developer. Please see our{" "}
                <Link href="/about" target="_blank">
                  email policy
                </Link>
                .
              </>
            }
          />
        </div>
        <div className="flex flex-row-reverse">
          <Button
            type={ButtonTypes.SUBMIT}
            transitionDirection={ButtonTransitionDirections.RIGHT}
            rounding={ButtonCornerRoundingTypes.PARTIAL}
            hoverText="Submit">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

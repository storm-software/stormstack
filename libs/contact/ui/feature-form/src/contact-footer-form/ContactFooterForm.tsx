"use client";

import {
  BaseComponentProps,
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonTypes,
  Checkbox,
  Input,
  Textarea,
} from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";
import clsx from "clsx";

export function ContactFooterForm({ className, ...props }: BaseComponentProps) {
  return (
    <div className={clsx("flex flex-1 grow flex-col", className)}>
      <h1 className="ml-3 text-7xl font-header-1 text-primary">
        Let's work{" "}
        <span className="bg-gradient-to-r from-primary to-primary bg-[length:100%_8px] bg-bottom bg-no-repeat px-1 pb-1">
          <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
            together
          </span>
        </span>
        !
      </h1>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <Input
            name="email"
            label="Email"
            required={true}
            placeholder="mike.smith@example.com"
            glow={false}
          />
          <Textarea
            name="comment"
            label="Message"
            placeholder="I am interested in working with you on a future project."
            glow={false}
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
            glow={false}
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

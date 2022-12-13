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
  Textarea,
} from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";
import Logo from "../../../../../../assets/box-logo-white.svg";

export function Footer({ className, ...props }: BaseComponentProps) {
  return (
    <div className="mt-28 w-full bg-gradient-to-b from-bg-footer/100 via-bg-footer/100 to-bg-footer/25 bg-[length:100%_50%] bg-bottom bg-no-repeat px-20 pt-28">
      <div className="z-footer flex h-[36rem] w-full flex-col rounded-t-lg border border-black bg-footer shadow-md">
        <div className="flex w-full flex-1 flex-col gap-6 py-6 px-20">
          <div className="flex flex-row gap-2">
            <div className="flex flex-1 grow flex-col">
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
                        I want to receive emails outlining future updates from
                        this developer. Please see our{" "}
                        <Link href="/about" target="_blank">
                          email policy
                        </Link>
                        .
                      </>
                    }
                  />
                </div>
                <Button
                  className="ml-3.5"
                  type={ButtonTypes.SUBMIT}
                  transitionDirection={ButtonTransitionDirections.RIGHT}
                  rounding={ButtonCornerRoundingTypes.PARTIAL}
                  hoverText="Submit">
                  Send
                </Button>
              </div>
            </div>
            <div className="flex flex-row justify-center">
              <Link>
                <Logo className="h-[16rem] w-[24rem]" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row justify-center p-2">
          <p className="font-body-1 text-body-1">
            Patrick Sullivan Development © 2023
          </p>
        </div>
      </div>
    </div>
  );
}

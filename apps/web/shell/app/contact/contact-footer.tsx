"use client";

import { ContactResetModal } from "@stormstack/contact-client-components";
import {
  ContactFormProgressStep,
  ContactFormSegments,
  contactFormProgressAtom,
  useSetContactFormProgress
} from "@stormstack/contact-client-data-access";
import { Link, ModalReference } from "@stormstack/core-client-components";
import { useFieldValue, useIsValid } from "@stormstack/core-client-data-access";
import { SubmitButton } from "@stormstack/core-client-form";
import {
  ArrowIcon,
  BaseComponentProps,
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonVariants,
  getButtonSvgStrokeStyle
} from "@stormstack/design-system-components";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ContactFooter(props: BaseComponentProps) {
  const { previous, next } = useSetContactFormProgress();
  const modalRef = useRef<ModalReference>(null);
  const handleResetOpen = useCallback(() => {
    modalRef.current?.open();
  }, []);

  const isError = !useIsValid(false);

  const items = useAtomValue(contactFormProgressAtom);
  const pathname = usePathname();

  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex(
      items.length > 0
        ? items.findIndex(
            (item: ContactFormProgressStep) => item.pathname === pathname
          )
        : 0
    );
  }, [items, pathname]);

  const router = useRouter();
  const reason = useFieldValue("reason");
  const handleContinue = useCallback(() => {
    if (reason) {
      router.replace(`/contact/${reason}/${ContactFormSegments.PERSONAL_INFO}`);
    }
  }, [reason, router]);

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between">
        <div className="gap-6 flex flex-row-reverse">
          {index > 0 && index < items.length && (
            <Button
              variant={ButtonVariants.QUARTERNARY}
              onClick={handleResetOpen}
              rounding={ButtonCornerRoundingTypes.PARTIAL}
              transitionDirection={ButtonTransitionDirections.TOP}
              hoverText="Clear">
              Reset
            </Button>
          )}
          {index > 1 && (
            <Button
              variant={ButtonVariants.TERTIARY}
              onClick={previous}
              rounding={ButtonCornerRoundingTypes.PARTIAL}
              transitionDirection={ButtonTransitionDirections.NONE}
              hoverText="Back">
              <div className="gap-1 flex flex-row items-center">
                <ArrowIcon
                  className={clsx(
                    "stroke-[2.5]",
                    getButtonSvgStrokeStyle(false, ButtonVariants.TERTIARY)
                  )}
                  isReverse={true}
                />
                <div className="flex-1 flex">Previous</div>
              </div>
            </Button>
          )}
        </div>

        {!index && (
          <Button
            variant={ButtonVariants.SECONDARY}
            onClick={handleContinue}
            disabled={isError}
            rounding={ButtonCornerRoundingTypes.PARTIAL}
            transitionDirection={ButtonTransitionDirections.NONE}
            hoverText="Next">
            <div className="gap-1 flex flex-row items-center">
              <div className="flex-1 flex">Continue</div>
              <ArrowIcon
                className={clsx(
                  "stroke-[2.5]",
                  getButtonSvgStrokeStyle(isError, ButtonVariants.SECONDARY)
                )}
              />
            </div>
          </Button>
        )}
        {index > 0 && index < items.length - 1 && (
          <Button
            variant={ButtonVariants.SECONDARY}
            onClick={next}
            disabled={isError}
            rounding={ButtonCornerRoundingTypes.PARTIAL}
            transitionDirection={ButtonTransitionDirections.NONE}
            hoverText="Next">
            <div className="gap-1 flex flex-row items-center">
              <div className="flex-1 flex">Continue</div>
              <ArrowIcon
                className={clsx(
                  "stroke-[2.5]",
                  getButtonSvgStrokeStyle(isError, ButtonVariants.SECONDARY)
                )}
              />
            </div>
          </Button>
        )}
        {index > 0 && index === items.length - 1 && (
          <SubmitButton
            variant={ButtonVariants.SECONDARY}
            rounding={ButtonCornerRoundingTypes.PARTIAL}
            transitionDirection={ButtonTransitionDirections.TOP}
            hoverText="Send">
            Submit
          </SubmitButton>
        )}
        {index > 0 && index === items.length && (
          <Link>
            <Button
              variant={ButtonVariants.SECONDARY}
              rounding={ButtonCornerRoundingTypes.PARTIAL}
              transitionDirection={ButtonTransitionDirections.TOP}>
              Home
            </Button>
          </Link>
        )}
      </div>
      <ContactResetModal ref={modalRef} />
    </>
  );
}

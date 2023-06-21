"use client";

import {
  ContactFormProgressStep,
  ContactFormSegments,
  contactFormProgressAtom,
  useSetContactFormProgress,
} from "@open-system/contact-data-access";
import { ContactResetModal } from "@open-system/contact-feature-form";
import { Link, ModalReference } from "@open-system/core-components";
import { useFieldValue, useIsValid } from "@open-system/core-data-access";
import { SubmitButton } from "@open-system/core-feature-form";
import {
  ArrowIcon,
  BaseComponentProps,
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonVariants,
  getButtonSvgStrokeStyle,
} from "@open-system/design-system-components";
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
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row-reverse gap-6">
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
              <div className="flex flex-row items-center gap-1">
                <ArrowIcon
                  className={clsx(
                    "stroke-[2.5]",
                    getButtonSvgStrokeStyle(false, ButtonVariants.TERTIARY)
                  )}
                  isReverse={true}
                />
                <div className="flex flex-1">Previous</div>
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
            <div className="flex flex-row items-center gap-1">
              <div className="flex flex-1">Continue</div>
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
            <div className="flex flex-row items-center gap-1">
              <div className="flex flex-1">Continue</div>
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

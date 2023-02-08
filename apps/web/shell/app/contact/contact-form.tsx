"use client";

import {
  ContactDetail,
  resetFormState,
  saveFormState,
  selectContactFormValues,
} from "@open-system/contact-ui-data-access";
import {
  BaseComponentProps,
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonTypes,
  ButtonVariants,
  ProgressTracker,
  ProgressTrackerItemStatus,
} from "@open-system/design-system-components";
import { Form, SubmitButton } from "@open-system/shared-ui-feature-form";
import clsx from "clsx";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ContactForm({
  children,
  className,
  ...props
}: BaseComponentProps) {
  const segments = useSelectedLayoutSegments();
  const router = useRouter();

  const formValues = useSelector(selectContactFormValues);

  const dispatch = useDispatch();
  const handleSubmit = useCallback(
    (values: Partial<ContactDetail>) => {
      dispatch(saveFormState(values));
      if (values.reason) {
        if (values.email) {
          router.push(`/contact/${values.reason}/details`);
        } else {
          router.push(`/contact/${values.reason}`);
        }
      }
    },
    [dispatch, router]
  );

  const handleReset = useCallback(() => {
    dispatch(resetFormState());
    router.push("/contact");
  }, [dispatch, router]);

  return (
    <Form<ContactDetail>
      className="flex flex-col gap-8"
      onSubmit={handleSubmit}
      defaultValues={formValues}>
      <div
        className={clsx(
          "flex flex-row items-center justify-between gap-20",
          className
        )}>
        {children}
        <div className="flex flex-1 flex-col gap-8">
          <ProgressTracker
            items={[
              {
                name: "reason",
                label: "Reason",
                status: !segments.length
                  ? ProgressTrackerItemStatus.ACTIVE
                  : ProgressTrackerItemStatus.COMPLETE,
              },
              {
                name: "personal-info",
                label: "Personal Info.",
                status: !segments.length
                  ? ProgressTrackerItemStatus.PENDING
                  : segments.length === 1
                  ? ProgressTrackerItemStatus.ACTIVE
                  : ProgressTrackerItemStatus.COMPLETE,
              },
              {
                name: "details",
                label: "Details",
                status:
                  segments.length < 2
                    ? ProgressTrackerItemStatus.PENDING
                    : segments.length === 2
                    ? ProgressTrackerItemStatus.ACTIVE
                    : ProgressTrackerItemStatus.COMPLETE,
              },
              {
                name: "summary",
                label: "Summary",
                status:
                  segments.length < 3
                    ? ProgressTrackerItemStatus.PENDING
                    : segments.length === 3
                    ? ProgressTrackerItemStatus.ACTIVE
                    : ProgressTrackerItemStatus.COMPLETE,
              },
            ]}
          />
        </div>
      </div>
      <div className="flex flex-row-reverse justify-between">
        <SubmitButton
          variant={ButtonVariants.SECONDARY}
          rounding={ButtonCornerRoundingTypes.PARTIAL}
          transitionDirection={ButtonTransitionDirections.TOP}
          hoverText="Next">
          Continue
        </SubmitButton>
        <Button
          variant={ButtonVariants.TERTIARY}
          type={ButtonTypes.RESET}
          onClick={handleReset}
          rounding={ButtonCornerRoundingTypes.PARTIAL}
          transitionDirection={ButtonTransitionDirections.TOP}
          hoverText="Clear">
          Reset
        </Button>
      </div>
    </Form>
  );
}

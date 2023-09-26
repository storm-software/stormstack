"use client";

import {
  ArrowIcon,
  BaseComponentProps,
  ButtonVariants,
  Spinner,
  SuccessIcon,
  getButtonSvgFillStyle,
  getButtonSvgStrokeStyle
} from "@stormstack/design-system-components";
import clsx from "clsx";

export interface SubmitButtonIconProps extends BaseComponentProps {
  inverse: boolean;
  isSubmitting: boolean;
  isValidating: boolean;
  isSubmitSuccessful: boolean;
  isError: boolean;
  isDisabled: boolean;
  variant?: ButtonVariants | string;
}

export function SubmitButtonIcon({
  inverse,
  isSubmitting,
  isValidating,
  isSubmitSuccessful,
  isError,
  isDisabled,
  variant
}: SubmitButtonIconProps) {
  if ((isSubmitting || isValidating) && !isError) {
    return (
      <Spinner
        className={getButtonSvgFillStyle(isDisabled, variant)}
        srText={`${isValidating ? "Validating" : "Submitting"}...`}
      />
    );
  } else if (isSubmitSuccessful && !isError) {
    return <SuccessIcon />;
  } else {
    return (
      <div className="mb-0.5">
        <ArrowIcon
          className={clsx(
            "stroke-[2.5]",
            getButtonSvgStrokeStyle(isDisabled, variant)
          )}
        />
      </div>
    );
  }
}

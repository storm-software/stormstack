"use client";

import {
  BaseComponentProps,
  ButtonVariants,
  SuccessIcon,
  getButtonSvgFillStyle,
  getButtonSvgStrokeStyle,
  Spinner
} from "@open-system/design-system-components";
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
  variant,
}: SubmitButtonIconProps) {
  if (isSubmitting || isValidating) {
    return (
    

        <Spinner className={getButtonSvgFillStyle(isDisabled, variant)} srText={`${isValidating ? "Validating" : "Submitting"}...`} />
 
    );
  } else if (isSubmitSuccessful) {
    return <SuccessIcon />;
  } else if (isError) {
    return (
      <svg className="ml-1 mt-[0.1rem] h-5" viewBox="0 0 25 25" fill="none">
        <path
          className="fill-error"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4035 5.59644 25 12.5 25C19.4035 25 25 19.4035 25 12.5C25 5.59644 19.4035 0 12.5 0ZM13.6364 6.81818C13.6364 6.19059 13.1276 5.68182 12.5 5.68182C11.8724 5.68182 11.3636 6.19059 11.3636 6.81818V13.6364C11.3636 14.264 11.8724 14.7727 12.5 14.7727C13.1276 14.7727 13.6364 14.264 13.6364 13.6364V6.81818ZM13.6364 17.6136C13.6364 16.986 13.1276 16.4773 12.5 16.4773C11.8724 16.4773 11.3636 16.986 11.3636 17.6136V18.1818C11.3636 18.8094 11.8724 19.3182 12.5 19.3182C13.1276 19.3182 13.6364 18.8094 13.6364 18.1818V17.6136Z"
        />
      </svg>
    );
  } else {
    return (
      <div className="relative h-5 w-[1.9rem] overflow-hidden pt-[0.08rem]">
        <svg className="h-5 w-10 group-hover:animate-arrow" viewBox="0 0 25 25">
          <path
            className={clsx(
              "stroke-[2.5]",
              getButtonSvgStrokeStyle(isDisabled, variant)
            )}
            d="m17.5 5.999-.707.707 5.293 5.293H1v1h21.086l-5.294 5.295.707.707L24 12.499l-6.5-6.5z"
          />
        </svg>
      </div>
    );
  }
}

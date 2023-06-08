"use client";

import {
  BaseComponentProps,
  ButtonVariants,
  SuccessIcon,
  getButtonSvgFillStyle,
  getButtonSvgStrokeStyle,
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
      <div role="status" className="pointer-events-none">
        <svg
          aria-hidden="true"
          className={clsx(
            "h-5 w-5 animate-spin ease-in-out",
            { "fill-inverse text-primary": !inverse },
            { "fill-primary text-inverse": inverse },
            getButtonSvgFillStyle(isDisabled, variant)
          )}
          viewBox="0 0 100 101"
          fill="none">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">
          {isValidating ? "Validating" : "Submitting"}...
        </span>
      </div>
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

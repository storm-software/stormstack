"use client";

import clsx from "clsx";
import { PropsWithBase } from "../types";
import { getTextStyle } from "../utilities/field-style-utils";
import {
  getBorderStyle,
  getInputMessage,
  getIsBorderDisplayed,
  getSvgFillStyle,
} from "./FieldWrapper.utils";

export type FieldWrapperProps = PropsWithBase<{
  /**
   * The name of the input field
   */
  name: string;

  /**
   * The text label displayed above the input field
   */
  label: string;

  /**
   * Decides if input is disabled
   */
  disabled: boolean;

  /**
   * Decides if input is focused by the user
   */
  focused: boolean;

  /**
   * An info message displayed under the input
   */
  info?: string | null;

  /**
   * An error message displayed under the input
   */
  error?: string | null;

  /**
   * An warning message displayed under the input
   */
  warning?: string | null;

  /**
   * Decides if input field required
   */
  required: boolean;

  /**
   * Should the border displayed on the left side of the input field remain hidden
   */
  noBorder: boolean;
}>;

/**
 * The base FieldWrapper component used by the Open System repository.
 * This component is used to wrap all the form input field elements.
 */
export const FieldWrapper = ({
  className,
  children,
  name,
  label = "",
  info = null,
  error = null,
  warning = null,
  focused = false,
  disabled = false,
  required = false,
  noBorder = false,
}: FieldWrapperProps) => {
  const isBorderDisplayed = getIsBorderDisplayed(
    error,
    warning,
    info,
    focused,
    noBorder
  );

  return (
    <div
      className={clsx(
        "duration-600 h-input-h w-input-w pl-xs pt-xs flex flex-1 flex-row transition ease-in-out",
        { "border-l-4": isBorderDisplayed },
        isBorderDisplayed && getBorderStyle(error, warning, info, focused),
        className
      )}>
      <div className="gap-xxs flex h-fit w-full flex-col self-start">
        <div className="flex flex-row">
          <div className="gap-xxxs pl-xxxs flex flex-1 grow flex-row">
            <label
              className={clsx(
                getTextStyle(error, warning, info, focused),
                "font-label-1 text-label-1 leading-label-1 antialiased"
              )}
              htmlFor={name}>
              {label}
            </label>
            {required && (
              <label className="font-extrabold text-red-500" htmlFor={name}>
                *
              </label>
            )}
          </div>
          {error ||
            warning ||
            (info && (
              <div className="pr-xxxs">
                <span className="inline-block h-fit animate-bounce">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4035 5.59644 25 12.5 25C19.4035 25 25 19.4035 25 12.5C25 5.59644 19.4035 0 12.5 0ZM13.6364 6.81818C13.6364 6.19059 13.1276 5.68182 12.5 5.68182C11.8724 5.68182 11.3636 6.19059 11.3636 6.81818V13.6364C11.3636 14.264 11.8724 14.7727 12.5 14.7727C13.1276 14.7727 13.6364 14.264 13.6364 13.6364V6.81818ZM13.6364 17.6136C13.6364 16.986 13.1276 16.4773 12.5 16.4773C11.8724 16.4773 11.3636 16.986 11.3636 17.6136V18.1818C11.3636 18.8094 11.8724 19.3182 12.5 19.3182C13.1276 19.3182 13.6364 18.8094 13.6364 18.1818V17.6136Z"
                      className={getSvgFillStyle(error, warning, info)}
                    />
                  </svg>
                </span>
              </div>
            ))}
        </div>

        <div className="relative">
          {children}

          {disabled && (
            <div className="absolute top-1/4 right-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_52_274)">
                  <path
                    d="M22.3214 10.9375H20.9821V7.42188C20.9821 3.33008 17.1763 0 12.5 0C7.82366 0 4.01786 3.33008 4.01786 7.42188V10.9375H2.67857C1.19978 10.9375 0 11.9873 0 13.2812V22.6562C0 23.9502 1.19978 25 2.67857 25H22.3214C23.8002 25 25 23.9502 25 22.6562V13.2812C25 11.9873 23.8002 10.9375 22.3214 10.9375ZM16.5179 10.9375H8.48214V7.42188C8.48214 5.4834 10.2846 3.90625 12.5 3.90625C14.7154 3.90625 16.5179 5.4834 16.5179 7.42188V10.9375Z"
                    fill="#989899"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_52_274">
                    <rect width="25" height="25" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          )}
        </div>
        <div className="pl-xxxs">
          <label
            className={clsx(
              getTextStyle(error, warning, info, focused),
              "font-message-1 text-message-1 leading-message-1 flex italic antialiased"
            )}
            htmlFor={name}>
            {getInputMessage(error, warning, info) ?? " "}
          </label>
        </div>
      </div>
    </div>
  );
};

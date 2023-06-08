/* eslint-disable react/jsx-no-useless-fragment */
"use client";

import { isEmptyObject } from "@open-system/core-utilities";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import "../../styles/components.css";
import { PropsWithBase } from "../types";
import { getFieldTextStyle } from "../utilities/field-style-utils";
import { getSvgFillStyle } from "../utilities/svg-style-utils";
import { useRipple } from "../utilities/use-ripple";
import { FieldLabelPlacementTypes } from "./FieldWrapper.types";
import {
  getBorderStyle,
  getIsBorderDisplayed,
  getPulseBackgroundStyle,
} from "./FieldWrapper.utils";
import { FieldWrapperLabel } from "./field-wrapper-label";

export type FieldWrapperProps = PropsWithBase<{
  /**
   * The name of the input field
   */
  name: string;

  /**
   * The text label displayed above the input field
   */
  label?: string | JSX.Element | null;

  /**
   * Decides if input is disabled
   */
  disabled: boolean;

  /**
   * Decides if input is focused by the user
   */
  focused: boolean;

  /**
   * An error messages displayed under the input
   *
   * @remarks Potentially multiple errors can be returned at once. The structure is a the dictionary with error type as the key and error message as the value.
   */
  errors?: Record<string, string> | null;

  /**
   * An warning message displayed under the input
   */
  warning?: string | JSX.Element | null;

  /**
   * An info message displayed under the input
   */
  info?: string | JSX.Element | null;

  /**
   * Decides if input field required
   */
  required: boolean;

  /**
   * Should the border displayed on the left side of the input field remain hidden
   */
  noBorder: boolean;

  /**
   * The direction the label should be placed relative to the input field
   */
  labelPlacement?: FieldLabelPlacementTypes;

  /**
   * Should a lock icon be displayed in the input field when it is disabled
   */
  noDisabledIcon?: boolean;

  /**
   * The class name for height of the component
   */
  heightClassName?: string | null;

  ripple?: boolean;
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
  labelPlacement = FieldLabelPlacementTypes.TOP,
  info = null,
  errors = null,
  warning = null,
  focused = false,
  disabled = false,
  required = false,
  noBorder = false,
  ripple = true,
  noDisabledIcon = false,
  heightClassName = "h-fit",
}: FieldWrapperProps) => {
  const isBorderDisplayed = getIsBorderDisplayed(
    !isEmptyObject(errors),
    !!warning,
    !!info,
    focused,
    noBorder
  );

  const innerRef = useRef<HTMLDivElement>(null);
  useRipple(innerRef);

  return (
    <div
      className={clsx(
        "duration-600 min-h-input-h relative flex flex-1 flex-row items-center gap-xs pl-5 pt-1 transition ease-in-out",
        {
          "py-1.5":
            labelPlacement === FieldLabelPlacementTypes.LEFT ||
            labelPlacement === FieldLabelPlacementTypes.RIGHT,
        },
        className,
        heightClassName
      )}>
      <motion.div
        className={clsx(
          "absolute bottom-0 left-0 top-0 flex w-[5px] flex-row items-center overflow-y-hidden"
        )}
        initial={false}
        animate={isBorderDisplayed ? "opened" : "closed"}
        tabIndex={-1}>
        <svg viewBox="0 0 2 500" tabIndex={-1}>
          <motion.path
            className={clsx(
              "fill-transparent transition-colors",
              getBorderStyle(!isEmptyObject(errors), !!warning, !!info, focused)
            )}
            strokeWidth={2}
            variants={{
              opened: { d: "M 1 260 L 1 0" },
              closed: { d: "M 1 250 L 1 250" },
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <motion.path
            className={clsx(
              "fill-transparent transition-colors",
              getBorderStyle(!isEmptyObject(errors), !!warning, !!info, focused)
            )}
            strokeWidth={2}
            variants={{
              opened: { d: "M 1 240 L 1 500" },
              closed: { d: "M 1 250 L 1 250" },
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      <div className="flex w-full flex-row items-center gap-3">
        {labelPlacement === FieldLabelPlacementTypes.LEFT && (
          <FieldWrapperLabel
            name={name}
            label={label}
            info={info}
            errors={errors}
            warning={warning}
            focused={focused}
            required={required}
          />
        )}

        <div className="flex h-fit grow flex-col gap-xxs self-start pt-0.5">
          <div className="flex flex-row">
            <>
              {labelPlacement === FieldLabelPlacementTypes.TOP && (
                <>
                  <FieldWrapperLabel
                    name={name}
                    label={label}
                    info={info}
                    errors={errors}
                    warning={warning}
                    focused={focused}
                    required={required}
                  />

                  {(!isEmptyObject(errors) || warning || info) && (
                    <div className="relative flex h-5 w-5 pr-xxxs">
                      <span
                        className={clsx(
                          "absolute z-20 inline-flex h-full w-full animate-ping rounded-full opacity-75",
                          getPulseBackgroundStyle(
                            !isEmptyObject(errors),
                            !!warning,
                            !!info
                          )
                        )}
                      />
                      <span className="z-30 inline-flex h-fit">
                        <svg
                          className="inline-flex h-5 w-5"
                          viewBox="0 0 25 25"
                          tabIndex={-1}>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4035 5.59644 25 12.5 25C19.4035 25 25 19.4035 25 12.5C25 5.59644 19.4035 0 12.5 0ZM13.6364 6.81818C13.6364 6.19059 13.1276 5.68182 12.5 5.68182C11.8724 5.68182 11.3636 6.19059 11.3636 6.81818V13.6364C11.3636 14.264 11.8724 14.7727 12.5 14.7727C13.1276 14.7727 13.6364 14.264 13.6364 13.6364V6.81818ZM13.6364 17.6136C13.6364 16.986 13.1276 16.4773 12.5 16.4773C11.8724 16.4773 11.3636 16.986 11.3636 17.6136V18.1818C11.3636 18.8094 11.8724 19.3182 12.5 19.3182C13.1276 19.3182 13.6364 18.8094 13.6364 18.1818V17.6136Z"
                            className={clsx(
                              getSvgFillStyle(
                                !isEmptyObject(errors),
                                !!warning,
                                !!info
                              )
                            )}
                          />
                        </svg>
                      </span>
                    </div>
                  )}
                </>
              )}
            </>
          </div>

          <div className="relative flex flex-1">
            {ripple ? (
              <div className="ripple-container-dark relative h-full w-full overflow-hidden rounded-xl">
                <div
                  ref={innerRef}
                  className="ripple-inner relative h-full w-full rounded-xl">
                  {children}
                </div>
              </div>
            ) : (
              children
            )}

            {disabled && !noDisabledIcon && (
              <div className="absolute right-3 top-1/4">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 25 25"
                  fill="none"
                  tabIndex={-1}>
                  <g clipRule="url(#clip0_52_274)">
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
          <div className="flex flex-row gap-0.5 pl-xxxs">
            <AnimatePresence>
              {isEmptyObject(errors) ? (
                <>
                  {(warning || info) && (
                    <motion.label
                      role="alert"
                      className={clsx(
                        getFieldTextStyle(
                          !isEmptyObject(errors),
                          !!warning,
                          !!info,
                          focused
                        ),
                        "flex h-fit text-message-1 font-message-1 italic antialiased"
                      )}
                      htmlFor={name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}>
                      {warning ?? info ?? " "}
                    </motion.label>
                  )}
                </>
              ) : (
                <>
                  {errors !== null && (
                    <>
                      {Object.entries(errors)
                        .filter(([type, error]) => !!type)
                        .map(([type, error]: [string, string], i: number) => (
                          <motion.label
                            key={type}
                            role="alert"
                            className={clsx(
                              getFieldTextStyle(true, false, false, focused),
                              "flex text-message-1 font-message-1 italic leading-message-1 antialiased"
                            )}
                            htmlFor={name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.5 }}>
                            {error}
                          </motion.label>
                        ))}
                    </>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        {labelPlacement === FieldLabelPlacementTypes.RIGHT && (
          <>
            <FieldWrapperLabel
              name={name}
              label={label}
              info={info}
              errors={errors}
              warning={warning}
              focused={focused}
              required={required}
            />

            {(!isEmptyObject(errors) || warning || info) && (
              <div className="pr-xxxs">
                <span className="inline-block h-fit animate-bounce">
                  <svg width="20" height="20" viewBox="0 0 25 25" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4035 5.59644 25 12.5 25C19.4035 25 25 19.4035 25 12.5C25 5.59644 19.4035 0 12.5 0ZM13.6364 6.81818C13.6364 6.19059 13.1276 5.68182 12.5 5.68182C11.8724 5.68182 11.3636 6.19059 11.3636 6.81818V13.6364C11.3636 14.264 11.8724 14.7727 12.5 14.7727C13.1276 14.7727 13.6364 14.264 13.6364 13.6364V6.81818ZM13.6364 17.6136C13.6364 16.986 13.1276 16.4773 12.5 16.4773C11.8724 16.4773 11.3636 16.986 11.3636 17.6136V18.1818C11.3636 18.8094 11.8724 19.3182 12.5 19.3182C13.1276 19.3182 13.6364 18.8094 13.6364 18.1818V17.6136Z"
                      className={getSvgFillStyle(
                        !isEmptyObject(errors),
                        !!warning,
                        !!info
                      )}
                    />
                  </svg>
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

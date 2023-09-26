"use client";

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty } from "@stormstack/core-shared-utilities";
import clsx from "clsx";
import {
  ChangeEvent,
  FocusEvent,
  ForwardedRef,
  MouseEvent,
  forwardRef,
  useCallback,
  useRef
} from "react";
import { BaseFieldProps } from "../types";
import { useRipple } from "../utilities";
import { useRatingContext } from "./use-rating-context";

/**
 * The base Input component used by the Open System repository
 */
export const RatingOption = forwardRef<HTMLInputElement, BaseFieldProps>(
  (
    {
      className,
      name,
      value,
      info = null,
      errors,
      warning,
      disabled = false,
      required = false,
      noBorder = false,
      glow = true,
      label,
      placeholder,
      tabIndex,
      autoFocus = false,
      onChange,
      onFocus,
      onBlur,
      ...props
    }: BaseFieldProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const context = useRatingContext();
    const displayValue: number =
      (!isEmpty(context.value) ? context.value : context.placeholder) ?? 1;

    const innerRef = useRef<HTMLDivElement>(null);
    useRipple(innerRef, false);

    const handleFocus = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        event.stopPropagation();

        context.onFocus?.(event);
        onFocus?.();
      },
      [context, onFocus]
    );

    const handleBlur = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();

        context.onBlur?.(event);
        onBlur?.(event);
      },
      [context, onBlur]
    );

    const handleMouseEnter = useCallback(
      (event: MouseEvent<HTMLInputElement>) => {
        event.stopPropagation();
        if (!disabled && !context.disabled) {
          context.setCurrent(value);
        }
      },
      [context, value, disabled]
    );
    const handleMouseLeave = useCallback(
      (event: MouseEvent<HTMLInputElement>) => {
        event.stopPropagation();

        if (!disabled && !context.disabled && context.current === value) {
          context.setCurrent(-1);
        }
      },
      [context, value, disabled]
    );

    return (
      <div className="h-10 w-10 cursor-pointer relative">
        <div
          ref={innerRef}
          className="ripple-container h-full w-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          {context.current >= value && (
            <div className="left-1/4 top-1/4 h-5 w-5 rounded-full absolute" />
          )}
          <label
            className="ripple-inner h-full w-full relative"
            htmlFor={value}>
            <svg
              aria-hidden="true"
              className={clsx(
                "transition-all",
                {
                  "hover:stroke-primary hover:rotate-[20deg] hover:scale-[1.60] hover:stroke-[0.8] active:scale-[2.0]":
                    !disabled && !context.disabled
                },
                {
                  "scale-75 fill-slate-700 stroke-slate-400 stroke-[0.8]":
                    (!displayValue || displayValue <= value - 1) &&
                    context.current < value
                },
                {
                  "scale-125 fill-yellow-600 stroke-[0.1]":
                    (displayValue >= value ||
                      (displayValue > value - 1 && displayValue < value)) &&
                    context.current < value
                },
                {
                  "fill-yellow-500 stroke-primary scale-[1.40] stroke-[0.5]":
                    context.current >= value
                },
                {
                  "opacity-75": disabled || context.disabled
                }
              )}
              viewBox="0 0 20 20">
              <title>{value > 1 ? `${value} stars` : `${value} star`}</title>
              {displayValue > value - 1 &&
              displayValue < value &&
              context.current < value ? (
                <>
                  <defs>
                    <linearGradient id="rating-option-fill">
                      <stop stopColor="#ca8a04" stopOpacity="1" offset={0} />
                      <stop
                        stopColor="#ca8a04"
                        stopOpacity="1"
                        offset={1 + displayValue - value}
                      />
                      <stop
                        stopColor="#334155"
                        stopOpacity="1"
                        offset={1 + displayValue - value + 0.01}
                      />
                      <stop stopColor="#334155" stopOpacity="1" offset={1} />
                    </linearGradient>
                    <linearGradient id="rating-option-stroke">
                      <stop stopColor="#ca8a04" stopOpacity="1" offset={0} />
                      <stop
                        stopColor="#ca8a04"
                        stopOpacity="1"
                        offset={1 + displayValue - value}
                      />
                      <stop
                        stopColor="#94a3b8"
                        stopOpacity="1"
                        offset={1 + displayValue - value + 0.01}
                      />
                      <stop stopColor="#94a3b8" stopOpacity="1" offset={1} />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#rating-option-fill)"
                    stroke="url(#rating-option-stroke)"
                    strokeWidth="0.4"
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </>
              ) : (
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              )}
            </svg>
          </label>
          <input
            type="radio"
            id={value}
            name={context.name}
            ref={ref}
            value={value}
            className="absolute hidden"
            disabled={disabled || context.disabled}
            tabIndex={tabIndex}
            autoFocus={autoFocus}
            aria-disabled={disabled || context.disabled}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>
    );
  }
);

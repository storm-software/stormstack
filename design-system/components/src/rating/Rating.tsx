"use client";

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import {
  ChangeEvent,
  FocusEvent,
  MouseEvent,
  useCallback,
  useState,
} from "react";
import { FieldWrapper } from "../field-wrapper";
import { BaseFieldProps } from "../types";
import { RatingContextProvider } from "./Rating.context";

export type RatingProps = BaseFieldProps & {
  /**
   * An indicator specifying if the Rating options should be displayed vertically (default is horizontally)
   */
  isVertical?: boolean;
};

/**
 * The base Input component used by the Open System repository
 */
export const Rating = ({
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
  isVertical = false,
  onChange,
  onFocus,
  onBlur,
  children,
  ...props
}: RatingProps) => {
  const [current, setCurrent] = useState<number>(-1);

  const [focused, setFocused] = useState<boolean>(false);
  const handleFocus = useCallback(
    (event?: FocusEvent<any>) => {
      event && event.stopPropagation();

      if (!disabled) {
        setFocused(true);
        onFocus?.();
      }
    },
    [disabled, onFocus]
  );

  const handleBlur = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();

      setFocused(false);
      onBlur?.(event);
    },
    [onBlur]
  );

  const handleMouseLeave = useCallback(
    (event: MouseEvent<any>) => {
      event.stopPropagation();

      if (current) {
        setCurrent(-1);
      }
    },
    [current]
  );

  return (
    <FieldWrapper
      className={clsx(
        className,
        { "h-[85px]": !isVertical },
        { "h-fit": isVertical }
      )}
      name={name}
      ripple={false}
      info={info}
      errors={errors}
      warning={warning}
      required={required}
      focused={focused}
      disabled={disabled}
      noDisabledIcon={true}
      noBorder={true}>
      <div
        onMouseLeave={handleMouseLeave}
        className={clsx(
          "flex w-fit gap-3 pl-[3px]",
          { "flex-row": !isVertical },
          { "flex-col": isVertical },
          { "pt-4": label }
        )}>
        <RatingContextProvider
          value={{
            value,
            onFocus: handleFocus,
            onBlur: handleBlur,
            name,
            disabled,
            isVertical,
            focused,
            glow,
            current,
            setCurrent,
          }}>
          {children}
        </RatingContextProvider>
      </div>
    </FieldWrapper>
  );
};

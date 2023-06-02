"use client";

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { ChangeEvent, FocusEvent, useCallback, useState } from "react";
import { FieldWrapper } from "../field-wrapper";
import { BaseFieldProps } from "../types";
import { RadioContextProvider } from "./Radio.context";

export type RadioProps = BaseFieldProps & {
  /**
   * An indicator specifying if the radio options should be displayed vertically (default is horizontally)
   */
  isVertical?: boolean;
};

/**
 * The base Input component used by the Open System repository
 */
export const Radio = ({
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
}: RadioProps) => {
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

  return (
    <FieldWrapper
      className={clsx(
        className,
        { "h-[85px]": !isVertical },
        { "h-fit": isVertical }
      )}
      name={name}
      label={label}
      info={info}
      errors={errors}
      warning={warning}
      focused={focused}
      handleFocused={handleFocus}
      disabled={disabled}
      required={required}
      noBorder={noBorder}>
      <div
        className={clsx(
          "flex gap-6 pl-[3px]",
          { "flex-row": !isVertical },
          { "flex-col": isVertical },
          { "pt-4": label }
        )}>
        <RadioContextProvider
          value={{
            value,
            onFocus: handleFocus,
            onBlur: handleBlur,
            name,
            disabled,
            isVertical,
            focused,
            glow,
          }}>
          {children}
        </RadioContextProvider>
      </div>
    </FieldWrapper>
  );
};

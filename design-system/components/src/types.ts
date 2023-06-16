/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { HTMLAttributes, RefObject } from "react";

export type BaseComponentProps = React.PropsWithChildren<
  Partial<
    Pick<
      HTMLAttributes<any>,
      | "className"
      | "id"
      | "lang"
      | "translate"
      | "slot"
      | "role"
      | "suppressContentEditableWarning"
      | "suppressHydrationWarning"
    > & { key?: React.Key }
  >
>;

export type PropsWithBase<
  P extends Record<string, any> = Record<string, never>
> = P & BaseComponentProps;

export type BaseRefComponentProps = React.PropsWithRef<BaseComponentProps>;

export type PropsWithBaseRef<
  P extends Record<string, any> = Record<string, never>
> = P & BaseRefComponentProps;

export type BaseFieldProps = PropsWithBaseRef<{
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
  disabled?: boolean;

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
   * Placeholder text when the field value is empty
   */
  placeholder?: string | number | null;

  /**
   * Decides if input field required
   */
  required?: boolean;

  /**
   * Should the border displayed on the left side of the input field remain hidden
   */
  noBorder?: boolean;

  /**
   * Should the input glow when focused
   */
  glow?: boolean;

  /**
   * Global attribute valid for all elements, including all the input types, an integer
   * attribute indicating if the element can take input focus (is focusable),
   * if it should participate to sequential keyboard navigation. As all input types
   * except for input of type hidden are focusable, this attribute should not be used
   * on form controls, because doing so would require the management of the focus order
   * for all elements within the document with the risk of harming usability and
   * accessibility if done incorrectly.
   */
  tabIndex?: number;

  /**
   * An attribute that HTML5 lets web developers place emphasis on the inputs users
   * should interact with first
   */
  autoFocus?: boolean;

  /**
   * Event handler for input value changed event
   */
  onChange?: (event: any) => any;

  /**
   * Event handler for input focused event
   */
  onFocus?: () => void;

  /**
   * Event handler for input blur event
   */
  onBlur?: (event: any) => any;

  /**
   * The value of the input field
   */
  value?: any;
}>;

export type PropsWithBaseField<
  P extends Record<string, any> = Record<string, never>
> = P & BaseFieldProps;

export type FieldReference<TValue = string> = {
  error: string | null;
  setError: (error: string | null) => void;
  warning: string | null;
  setWarning: (warning: string | null) => void;
  value: TValue | null;
  setValue: (value: TValue | null) => void;
  focus: () => void;
  selectText: () => void;
};

export type ChangeHandler = (event: {
  target: any;
  type?: any;
}) => Promise<void | boolean>;

export type ValidationValue = boolean | number | string | RegExp;

export type ValidationRule<
  TValidationValue extends ValidationValue = ValidationValue
> = TValidationValue | ValidationValueMessage<TValidationValue>;

export type ValidationValueMessage<
  TValidationValue extends ValidationValue = ValidationValue
> = {
  value: TValidationValue;
  message: string;
};

export type FieldProxyConfig<
  TValue = any,
  TRef extends HTMLInputElement = HTMLInputElement
> = {
  ref: RefObject<TRef>;
  noLabel?: boolean;
  value: TValue | null;
  setValue: (value: TValue | null) => void;
  label: string | JSX.Element | null;
  setLabel: (label: string | JSX.Element | null) => void;
  error?: string | null;
  setError: (error?: string | null) => void;
  warning?: string | null;
  setWarning: (warning?: string | null) => void;
  info?: string | null;
  setInfo: (info?: string | null) => void;
  disabled: boolean;
  setDisabled: (disabled: boolean) => void;
  focused: boolean;
  setFocused: (focused: boolean) => void;
  required: boolean;
  setRequired: (required: boolean) => void;
  dirty: boolean;
  setDirty: (dirty: boolean) => void;
};

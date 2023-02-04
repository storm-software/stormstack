/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export type BaseComponentProps = React.PropsWithChildren<
  Partial<
    Pick<
      React.HTMLAttributes<any>,
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
   * An info message displayed under the input
   */
  info?: string | null;

  /**
   * Placeholder text when the field value is empty
   */
  placeholder?: string;

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
  onChanged?: (nextValue: any) => void;

  /**
   * Event handler for input focused event
   */
  onFocus?: () => void;

  /**
   * Event handler for input blur event
   */
  onBlur?: () => void;
}>;

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

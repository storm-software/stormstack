import { ChangeEvent, FocusEvent } from "react";

export interface RadioContextState {
  value?: string | null;

  /**
   * 	The name of the overall radio button group
   */
  name: string;

  /**
   * Event handler for input focused event
   */
  onFocus: (event: FocusEvent<HTMLInputElement>) => void;

  /**
   * Event handler for input blur event
   */
  onBlur: (event: ChangeEvent<HTMLInputElement>) => void;

  /**
   * Decides if input is disabled
   */
  disabled: boolean;

  /**
   * Decides if input group is currently focused
   */
  focused: boolean;

  /**
   * Should the input glow when focused
   */
  glow: boolean;

  /**
   * An error messages displayed under the input
   *
   * @remarks Potentially multiple errors can be returned at once. The structure is a the dictionary with error type as the key and error message as the value.
   */
  errors?: Record<string, string> | null;

  /**
   * An warning message displayed under the input
   */
  warning?: string | null;

  /**
   * An info message displayed under the input
   */
  info?: string | null;

  /**
   * Indicator specifying if the radio button's are displayed vertically
   */
  isVertical?: boolean;
}

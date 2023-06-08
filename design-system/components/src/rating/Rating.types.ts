import { ChangeEvent, FocusEvent } from "react";

export interface RatingContextState {
  /**
   * The value of the input field
   */
  value?: number | null;

  /**
   * Placeholder text when the field value is empty
   */
  placeholder?: number | null;

  /**
   * 	The name of the overall Rating button group
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
   * Indicator specifying if the Rating button's are displayed vertically
   */
  isVertical?: boolean;

    /**
   * The current rating value that the user selected/is hovering over
   */
    current: number;

     /**
   * The current rating value that the user selected/is hovering over
   */
     setCurrent: (next: number) => void;
}

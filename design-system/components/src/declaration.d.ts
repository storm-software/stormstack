declare interface SelectOption {
  /**
   * 	The string value to display in the field
   */
  name: string;

  /**
   * The value stored behind the scenes when selected
   */
  value: string;

  /**
   * Is the option value valid for selection in the dropdown
   */
  disabled: boolean;

  /**
   * Sets or retrieves whether the option in the list box is the default item.
   */
  selected: boolean;
}

declare enum ButtonVariants {
  GRADIENT = "gradient",
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TERTIARY = "tertiary",
}

declare enum ButtonTransitionDirections {
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom",
}

declare enum ButtonTypes {
  /**
   * 	The button is a submit button (submits form-data)
   */
  SUBMIT = "submit",

  /**
   * The button is a reset button (resets the form-data to its initial values)
   */
  RESET = "reset",

  /**
   * The button is a clickable button
   */
  BUTTON = "button",
}

export type ButtonVariants = "gradient" | "primary" | "secondary" | "tertiary";
export const ButtonVariants = {
  GRADIENT: "gradient" as ButtonVariants,
  PRIMARY: "primary" as ButtonVariants,
  SECONDARY: "secondary" as ButtonVariants,
  TERTIARY: "tertiary" as ButtonVariants,
};

export type ButtonTransitionDirections = "left" | "right" | "top" | "bottom";
export const ButtonTransitionDirections = {
  LEFT: "left" as ButtonTransitionDirections,
  RIGHT: "right" as ButtonTransitionDirections,
  TOP: "top" as ButtonTransitionDirections,
  BOTTOM: "bottom" as ButtonTransitionDirections,
};

export type ButtonTypes = "submit" | "right" | "reset" | "button";
export const ButtonTypes = {
  /**
   * 	The button is a submit button (submits form-data)
   */
  SUBMIT: "submit" as ButtonTypes,

  /**
   * The button is a reset button (resets the form-data to its initial values)
   */
  RESET: "reset" as ButtonTypes,

  /**
   * The button is a clickable button
   */
  BUTTON: "button" as ButtonTypes,
};

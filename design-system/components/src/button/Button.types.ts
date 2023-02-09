export type ButtonVariants =
  | "gradient"
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary";
export const ButtonVariants = {
  GRADIENT: "gradient" as ButtonVariants,
  PRIMARY: "primary" as ButtonVariants,
  SECONDARY: "secondary" as ButtonVariants,
  TERTIARY: "tertiary" as ButtonVariants,
  QUARTERNARY: "quaternary" as ButtonVariants,
};

export type ButtonTransitionDirections =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "none";
export const ButtonTransitionDirections = {
  LEFT: "left" as ButtonTransitionDirections,
  RIGHT: "right" as ButtonTransitionDirections,
  TOP: "top" as ButtonTransitionDirections,
  BOTTOM: "bottom" as ButtonTransitionDirections,
  NONE: "none" as ButtonTransitionDirections,
};

export type ButtonTypes = "submit" | "reset" | "button";
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

export type ButtonGlowTypes = "always" | "never" | "hover";
export const ButtonGlowTypes = {
  /**
   * The button should always emit a bright glow around it
   */
  ALWAYS: "always" as ButtonGlowTypes,

  /**
   * The button should never emit a bright glow around it
   */
  NEVER: "never" as ButtonGlowTypes,

  /**
   * The button should emit a bright glow around it when
   * the user hovers over it (default)
   */
  HOVER: "hover" as ButtonGlowTypes,
};

export type ButtonCornerRoundingTypes = "none" | "partial" | "full";
export const ButtonCornerRoundingTypes = {
  /**
   * The button's corners will **not** be rounded (the button is square shaped)
   */
  NONE: "none" as ButtonCornerRoundingTypes,

  /**
   * The button's corners will be slightly rounded (the button is {@link https://en.wikipedia.org/wiki/Squircle#:~:text=A%20squircle%20is%20a%20shape,is%20based%20on%20the%20superellipse. squircle } shaped)
   */
  PARTIAL: "partial" as ButtonCornerRoundingTypes,

  /**
   * The button's corners will be rounded (the button is pill shaped)
   */
  FULL: "full" as ButtonCornerRoundingTypes,
};

export type DividerVariants =
  | "gradient"
  | "primary"
  | "secondary"
  | "tertiary"
  | "light"
  | "none";
export const DividerVariants = {
  GRADIENT: "gradient" as DividerVariants,
  PRIMARY: "primary" as DividerVariants,
  SECONDARY: "secondary" as DividerVariants,
  TERTIARY: "tertiary" as DividerVariants,
  LIGHT: "light" as DividerVariants,
  /**
   * If none is selected, a bg-{color} className must be provided
   */
  NONE: "none" as DividerVariants,
};

export type DividerDirections = "horizontal" | "vertical";
export const DividerDirections = {
  HORIZONTAL: "horizontal" as DividerDirections,
  VERTICAL: "vertical" as DividerDirections,
};

export type DividerSizes = "lg" | "md" | "sm";
export const DividerSizes = {
  LARGE: "lg" as DividerSizes,
  MEDIUM: "md" as DividerSizes,
  SMALL: "sm" as DividerSizes,
};

export type BadgeVariants =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "inverse"
  | "warning"
  | "error"
  | "info"
  | "success"
  | "gradient";
export const BadgeVariants = {
  PRIMARY: "primary" as BadgeVariants,
  SECONDARY: "secondary" as BadgeVariants,
  TERTIARY: "tertiary" as BadgeVariants,
  QUATERNARY: "quaternary" as BadgeVariants,
  INVERSE: "inverse" as BadgeVariants,
  WARNING: "warning" as BadgeVariants,
  ERROR: "error" as BadgeVariants,
  INFO: "info" as BadgeVariants,
  SUCCESS: "success" as BadgeVariants,
  GRADIENT: "gradient" as BadgeVariants,
};

export type BadgeBorderThickness = "none" | "thin" | "normal" | "thick";
export const BadgeBorderThickness = {
  NONE: "none" as BadgeBorderThickness,
  THIN: "thin" as BadgeBorderThickness,
  NORMAL: "normal" as BadgeBorderThickness,
  THICK: "thick" as BadgeBorderThickness,
};

export type BreadcrumbVariants = "primary" | "secondary";
export const BreadcrumbVariants = {
  PRIMARY: "primary" as BreadcrumbVariants,
  SECONDARY: "secondary" as BreadcrumbVariants,
};

export type BreadcrumbItemType = {
  /**
   * The name used to identify the item
   */
  name: string;

  /**
   * The text displayed to the left of the item
   */
  label: string | JSX.Element;

  /**
   * Callback invoked when the item is clicked by the user
   */
  onClick?: (name: string) => void;
};

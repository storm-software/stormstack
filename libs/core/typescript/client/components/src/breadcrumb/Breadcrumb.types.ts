import { BreadcrumbItemType as OsBreadcrumbItemType } from "@stormstack/design-system-components";

export type BreadcrumbItemType = Omit<OsBreadcrumbItemType, "name"> & {
  /**
   * The pathname used to navigate to the item
   */
  pathname: string;
};

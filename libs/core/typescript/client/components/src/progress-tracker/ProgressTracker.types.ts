import { ProgressTrackerItemType as OsProgressTrackerItemType } from "@stormstack/design-system-components";

export type ProgressTrackerItemType =
  | (Omit<OsProgressTrackerItemType, "onClick"> &
      Partial<Pick<OsProgressTrackerItemType, "onClick">> & {
        /**
         * The pathname used to navigate to the item
         */
        pathname: string;
      })
  | (OsProgressTrackerItemType & {
      /**
       * The pathname used to navigate to the item
       */
      pathname?: string;
    });

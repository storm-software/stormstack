export type ProgressTrackerItemStatus = "pending" | "active" | "complete";
export const ProgressTrackerItemStatus = {
  PENDING: "pending" as ProgressTrackerItemStatus,
  ACTIVE: "active" as ProgressTrackerItemStatus,
  COMPLETE: "complete" as ProgressTrackerItemStatus,
};

export type ProgressTrackerItemType = {
  /**
   * The name used to identify the item
   */
  name: string;

  /**
   * The text displayed to the left of the item
   */
  label: string;

  /**
   * The current state of the item
   */
  status: ProgressTrackerItemStatus;

  /**
   * Callback invoked when the item is clicked by the user
   */
  onClick?: (name: string) => void;
};

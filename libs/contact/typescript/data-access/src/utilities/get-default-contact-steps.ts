import { ProgressTrackerItemType } from "@open-system/core-components";
import { DEFAULT_BUSINESS_CONTACT_STEPS } from "../types";



export const getDefaultContactSteps = (reason?: string): ProgressTrackerItemType[] => {
  switch (reason) {
    case "business":
      return DEFAULT_BUSINESS_CONTACT_STEPS;
    default:
      return [];

  }
}

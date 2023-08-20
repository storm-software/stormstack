import { ProgressTrackerItemStatus } from "@open-system/design-system-components";

export const ContactFormSegments = {
  REASON: "reason",
  PERSONAL_INFO: "personal-info",
  DETAILS: "details",
  REVIEW: "review",
  SUCCESS: "success",
};

export const DEFAULT_BUSINESS_CONTACT_STEPS = [
  {
    name: ContactFormSegments.REASON,
    label: "Reason",
    status: ProgressTrackerItemStatus.COMPLETE,
    pathname: "/contact",
  },
  {
    name: ContactFormSegments.PERSONAL_INFO,
    label: "Personal Info.",
    status: ProgressTrackerItemStatus.ACTIVE,
    pathname: `/contact/business/${ContactFormSegments.PERSONAL_INFO}`,
  },
  {
    name: ContactFormSegments.DETAILS,
    label: "Details",
    status: ProgressTrackerItemStatus.PENDING,
    pathname: `/contact/business/${ContactFormSegments.DETAILS}`,
  },
  {
    name: ContactFormSegments.REVIEW,
    label: "Submit",
    status: ProgressTrackerItemStatus.PENDING,
    pathname: `/contact/business/${ContactFormSegments.REVIEW}`,
  },
];

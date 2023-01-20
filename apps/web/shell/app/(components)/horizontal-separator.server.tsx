"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import { HorizontalSeparator as HorizontalSeparatorClient } from "@open-system/shared-ui-components/horizontal-separator";

export default function HorizontalSeparator({ ...props }: BaseComponentProps) {
  return <HorizontalSeparatorClient {...props} />;
}

"use client";

import { BaseComponentProps } from "@open-system/shared-ui-components";

export function Footer({ className, ...props }: BaseComponentProps) {
  return (
    <div className="flex-col-reversed flex h-96 w-full px-24 pt-24">
      <div className="bg-bg-footer h-80 w-full"></div>
    </div>
  );
}

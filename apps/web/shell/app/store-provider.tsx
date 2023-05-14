"use client";

import { BaseComponentProps } from "@open-system/design-system-components";

export default function RootProvider({
  children,
  ...props
}: BaseComponentProps) {
  return { children };
}

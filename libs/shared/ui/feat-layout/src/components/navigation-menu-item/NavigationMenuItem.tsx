"use client";

import { OsLink } from "@open-system/design-system-components-react";
import {
  Link,
  LinkProps,
  PropsWithBase,
} from "@open-system/shared-ui-components";
import { useSelectedLayoutSegment } from "next/navigation";

export type NavigationMenuItemProps = PropsWithBase<
  { selected?: boolean; label: string } & LinkProps
>;

/**
 * A component to facilitate application navigation. It is rendered with
 * a fixed position at the top of the page.
 */
export function NavigationMenuItem({
  label,
  selected = false,
  href,
  ...props
}: NavigationMenuItemProps) {
  const segment = useSelectedLayoutSegment();

  return (
    <Link href={href} {...props}>
      <OsLink selected={!!selected || segment === href} label={label} />
    </Link>
  );
}

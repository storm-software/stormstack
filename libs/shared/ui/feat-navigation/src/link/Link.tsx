"use client";

import { OsLink } from "@open-system/design-system-components/react";
import { PropsWithBase } from "@open-system/shared-ui-components";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export type LinkProps = PropsWithBase<{ selected?: boolean } & NextLinkProps>;

/**
 * A component to facilitate application navigation. It is rendered with
 * a fixed position at the top of the page.
 */
export function Link({
  children,
  selected = false,
  href,
  ...props
}: LinkProps) {
  const segment = useSelectedLayoutSegment();

  return (
    <NextLink href={href} {...props}>
      <OsLink
        selected={!!selected || segment === href}
        label={children as string}
      />
    </NextLink>
  );
}

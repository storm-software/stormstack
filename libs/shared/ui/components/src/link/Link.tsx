import {
  Link as DesignComponentLink,
  LinkProps as DesignComponentLinkProps,
  PropsWithBase,
} from "@open-system/design-system-components";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

import { HTMLAttributeAnchorTarget } from "react";

export type LinkProps = PropsWithBase<
  Omit<NextLinkProps, "href"> &
    Partial<Pick<NextLinkProps, "href">> & {
      target?: HTMLAttributeAnchorTarget;
    } & Pick<DesignComponentLinkProps, "variant">
>;

/**
 * A component to facilitate application navigation. This is essentially a wrapper
 * around the NextJS Link component.
 */
export function Link({ children, href = "/", ...props }: LinkProps) {
  return (
    <NextLink href={href} {...props}>
      {typeof children === "string" ? (
        <DesignComponentLink {...props}>{children}</DesignComponentLink>
      ) : (
        children
      )}
    </NextLink>
  );
}

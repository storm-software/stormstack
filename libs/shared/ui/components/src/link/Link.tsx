import {
  Link as DesignComponentLink,
  LinkProps as DesignComponentLinkProps,
  LinkVariants,
  PropsWithBase,
} from "@open-system/design-system-components";
import clsx from "clsx";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

import { HTMLAttributeAnchorTarget } from "react";

export type LinkProps = PropsWithBase<
  Omit<NextLinkProps, "href"> &
    Partial<Pick<NextLinkProps, "href">> & {
      target?: HTMLAttributeAnchorTarget;

      /**
       * Indicator specifying if the URL should be opened in a new browser tab (while the current tab remains open).
       */
      inNewTab?: boolean;
    } & DesignComponentLinkProps
>;

/**
 * A component to facilitate application navigation. This is essentially a wrapper
 * around the NextJS Link component.
 */
export function Link({
  children,
  className,
  variant,
  target,
  inNewTab = false,
  href = "/",
  ...props
}: LinkProps) {
  return (
    <NextLink
      href={href}
      className={className}
      target={inNewTab ? "_blank" : target}
      {...props}>
      {typeof children === "string" ? (
        <DesignComponentLink
          {...props}
          variant={variant}
          className={clsx(
            {
              "text-link-2 hover:text-hover-link-2":
                variant === LinkVariants.SECONDARY,
            },
            className
          )}>
          {children}
        </DesignComponentLink>
      ) : (
        children
      )}
    </NextLink>
  );
}

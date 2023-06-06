"use client";

/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Breadcrumb as OsBreadcrumb,
  BreadcrumbProps as OsBreadcrumbProps,
  LinkVariants,
} from "@open-system/design-system-components";
import { usePathname } from "next/navigation";
import { Link } from "../link";
import { BreadcrumbItemType } from "./Breadcrumb.types";

export type BreadcrumbProps = Omit<
  OsBreadcrumbProps,
  "items" | "onNavigateHome"
> & {
  items?: BreadcrumbItemType[];
};

/**
 * The base Link component used by the Open System repository
 */
export const Breadcrumb = ({
  className,
  items = [],
  ...props
}: BreadcrumbProps) => {
  const segments = usePathname()?.split("/") ?? [];

  const itemsList = segments.reduce(
    (ret: BreadcrumbItemType[], segment: string) => {
      const breadcrumbItem = items.find((item: BreadcrumbItemType) => {
        const paths = item.pathname.split("/");

        return paths?.length && paths.at(-1) === segment;
      });
      breadcrumbItem && ret.push(breadcrumbItem);

      return ret;
    },
    []
  );

  return (
    <OsBreadcrumb
      {...props}
      items={itemsList.map((item: BreadcrumbItemType, i: number) => ({
        onClick: () => {},
        ...item,
        name: item.pathname,
        label:
          i < itemsList.length - 1 ? (
            <Link
              className="transition hover:cursor-pointer"
              href={item.pathname}
              inNewTab={false}
              replace={true}
              variant={LinkVariants.PLAIN}>
              {item.label}
            </Link>
          ) : (
            item.label
          ),
      }))}
    />
  );
};

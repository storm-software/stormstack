"use client";

import { ChevronDoubleRightIcon, HomeIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { PropsWithBase } from "../types";
import { BreadcrumbItemType, BreadcrumbVariants } from "./Breadcrumb.types";
import { BreadcrumbItem } from "./BreadcrumbItem";

export type BreadcrumbProps = PropsWithBase<{
  /**
   * The variant style of the Breadcrumbs
   */
  variant?: BreadcrumbVariants | string;

  /**
   * Is the color scheme inversed on the component
   */
  inverse?: boolean;

  /**
   * The list of breadcrumb items to render
   */
  items?: BreadcrumbItemType[];

  /**
   * An event handler invoked when the home icon is clicked
   */
  onNavigateHome?: () => void;
}>;

/**
 * The base Link component used by the Open System repository
 */
export const Breadcrumb = ({
  className,
  variant = BreadcrumbVariants.PRIMARY,
  inverse = false,
  items = [],
  onNavigateHome,
  ...props
}: BreadcrumbProps) => {
  return (
    <div className="flex w-fit flex-row items-center gap-0">
      <div className="relative h-16 w-fit">
        <div
          className={clsx(
            {
              "bg-breadcrumb-primary-1 after:border-l-breadcrumb-primary-1":
              variant === BreadcrumbVariants.PRIMARY && !inverse,
            },
            {
              "bg-breadcrumb-primary-2 after:border-l-breadcrumb-primary-2":
              variant === BreadcrumbVariants.PRIMARY && inverse,
            },
            {
              "bg-breadcrumb-secondary-1 after:border-l-breadcrumb-secondary-1":
              variant === BreadcrumbVariants.SECONDARY && !inverse,
            },
            {
              "bg-breadcrumb-secondary-2 after:border-l-breadcrumb-secondary-2":
              variant === BreadcrumbVariants.SECONDARY && inverse,
            },
            "flex h-full w-fit flex-row items-center gap-6 px-6 py-4 after:absolute after:left-[100%] after:z-20 after:h-0 after:w-0 after:border-y-[32px] after:border-l-[50px] after:border-y-transparent after:content-['']"
          )}>
          <div className="h-10">
            <HomeIcon
              className={clsx(
                {
                  "fill-breadcrumb-primary-2":
                  variant === BreadcrumbVariants.PRIMARY && !inverse,
                },
                {
                  "fill-breadcrumb-primary-1":
                  variant === BreadcrumbVariants.PRIMARY && inverse,
                },
                {
                  "fill-breadcrumb-secondary-2":
                  variant === BreadcrumbVariants.SECONDARY && !inverse,
                },
                {
                  "fill-breadcrumb-secondary-1":
                  variant === BreadcrumbVariants.SECONDARY && inverse,
                },
                "transition-colors hover:cursor-pointer hover:fill-hover-link-3"
              )}
              height={35}
              onClick={onNavigateHome}
            />
          </div>

          {items.length > 1 && (
            <>
              <ChevronDoubleRightIcon
                className={clsx(
                  {
                    "fill-breadcrumb-primary-2":
                    variant === BreadcrumbVariants.PRIMARY && !inverse,
                  },
                  {
                    "fill-breadcrumb-primary-1":
                    variant === BreadcrumbVariants.PRIMARY && inverse,
                  },
                  {
                    "fill-breadcrumb-secondary-2":
                    variant === BreadcrumbVariants.SECONDARY && !inverse,
                  },
                  {
                    "fill-breadcrumb-secondary-1":
                    variant === BreadcrumbVariants.SECONDARY && inverse,
                  }
                )}
                height={30}
              />
              {items
                .slice(0, -1)
                .map(
                  (
                    item: BreadcrumbItemType,
                    i: number,
                    array: BreadcrumbItemType[]
                  ) => (
                    <div key={i} className="flex flex-row items-center gap-6">
                      <BreadcrumbItem
                        name={item.name}
                        variant={variant}
                        inverse={inverse}
                        label={item.label}
                        isCurrent={false}
                        onClick={item.onClick}
                      />
                      {i < array.length - 1 && (
                        <ChevronDoubleRightIcon
                          className={clsx(
                            {
                              "fill-breadcrumb-primary-2":
                              variant === BreadcrumbVariants.PRIMARY && !inverse,
                            },
                            {
                              "fill-breadcrumb-primary-1":
                              variant === BreadcrumbVariants.PRIMARY && inverse,
                            },
                            {
                              "fill-breadcrumb-secondary-2":
                              variant === BreadcrumbVariants.SECONDARY && !inverse,
                            },
                            {
                              "fill-breadcrumb-secondary-1":
                              variant === BreadcrumbVariants.SECONDARY && inverse,
                            }
                          )}
                          height={30}
                        />
                      )}
                    </div>
                  )
                )}
            </>
          )}
        </div>
      </div>
      {items.length && (
        <div className="relative h-16 w-fit">
          <div
            className={clsx(
              {
                "bg-breadcrumb-primary-2 after:border-l-breadcrumb-primary-2":
                variant === BreadcrumbVariants.PRIMARY && !inverse,
              },
              {
                "bg-breadcrumb-primary-1 after:border-l-breadcrumb-primary-1":
                variant === BreadcrumbVariants.PRIMARY && inverse,
              },
              {
                "bg-breadcrumb-secondary-2 after:border-l-breadcrumb-secondary-2":
                variant === BreadcrumbVariants.SECONDARY && !inverse,
              },
              {
                "bg-breadcrumb-secondary-1 after:border-l-breadcrumb-secondary-1":
                variant === BreadcrumbVariants.SECONDARY && inverse,
              },
              "z-10 flex h-full w-fit items-center gap-6 px-6 py-4 pl-20 after:absolute after:left-[100%] after:h-0 after:w-0 after:border-y-[32px] after:border-l-[50px] after:border-y-transparent after:content-['']"
            )}>
            <BreadcrumbItem
              name={items[items.length - 1].name}
              variant={variant}
              inverse={inverse}
              label={items[items.length - 1].label}
              isCurrent={true}
              onClick={items[items.length - 1].onClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

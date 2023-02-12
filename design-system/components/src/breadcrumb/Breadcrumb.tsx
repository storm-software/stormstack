"use client";

import { ChevronDoubleRightIcon, HomeIcon } from "@heroicons/react/24/solid";
import { PropsWithBase } from "../types";
import { BreadcrumbItemType } from "./Breadcrumb.types";
import { BreadcrumbItem } from "./BreadcrumbItem";

export type BreadcrumbProps = PropsWithBase<{
  /**
   * The variant style of the link
   */
  name?: string;

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
  items = [],
  onNavigateHome,
  ...props
}: BreadcrumbProps) => {
  return (
    <div className="flex w-fit flex-row items-center gap-0">
      <div className="relative h-16 w-fit">
        <div className="bg-breadcrumb-fill-1 after:border-l-breadcrumb-fill-1 flex h-full w-fit flex-row items-center gap-6 px-6 py-4 after:absolute after:left-[100%] after:z-20 after:h-0 after:w-0 after:border-y-[32px] after:border-l-[50px] after:border-y-transparent after:content-['']">
          <div className="h-10">
            <HomeIcon
              className="fill-breadcrumb-fill-2 transition-colors hover:cursor-pointer hover:fill-hover-link-2"
              height={35}
              onClick={onNavigateHome}
            />
          </div>

          {items.length > 1 && (
            <>
              <ChevronDoubleRightIcon
                className="fill-breadcrumb-fill-2"
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
                        label={item.label}
                        isCurrent={false}
                        onClick={item.onClick}
                      />
                      {i < array.length - 1 && (
                        <ChevronDoubleRightIcon
                          className="fill-breadcrumb-fill-2"
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
          <div className="bg-breadcrumb-fill-2 after:border-l-breadcrumb-fill-2 z-10 flex h-full w-fit items-center gap-6 px-6 py-4 pl-20 after:absolute after:left-[100%] after:h-0 after:w-0 after:border-y-[32px] after:border-l-[50px] after:border-y-transparent after:content-['']">
            <BreadcrumbItem
              name={items[items.length - 1].name}
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

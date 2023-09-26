"use client";

import {
  ProgressTracker as OsProgressTracker,
  ProgressTrackerProps as OsProgressTrackerProps
} from "@stormstack/design-system-components";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { ProgressTrackerItemType } from "./ProgressTracker.types";

export type ProgressTrackerProps = Omit<OsProgressTrackerProps, "items"> & {
  items?: ProgressTrackerItemType[];
};

/**
 * The base ProgressTracker component used by the Open System repository
 */
export const ProgressTracker = ({
  className,
  items = [],
  ...props
}: ProgressTrackerProps) => {
  const router = useRouter();

  useEffect(() => {
    items.forEach(
      (item: ProgressTrackerItemType) =>
        item.pathname && router.prefetch(item.pathname)
    );
  }, [items, router]);

  const handleClick = useCallback(
    (pathname: string) => router.replace(pathname),
    [router]
  );

  return (
    <OsProgressTracker
      {...props}
      items={items.map((item: ProgressTrackerItemType) => ({
        onClick: () => item.pathname && handleClick(item.pathname),
        ...item
      }))}
    />
  );
};

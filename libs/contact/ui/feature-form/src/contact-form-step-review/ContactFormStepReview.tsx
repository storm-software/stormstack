"use client";

import {
  BaseComponentProps,
  Divider,
  DividerDirections,
  DividerSizes,
} from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { ContactFormSegments } from "../constants";

export type ContactFormStepReviewProps = BaseComponentProps & {
  name: string;
  label: string;
};

export function ContactFormStepReview({
  name,
  label,
  className,
  children,
  ...props
}: ContactFormStepReviewProps) {
  const pathname = usePathname();

  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      <div className="flex flex-row justify-between gap-4">
        <h3 className="text-md font-label-4 font-bold text-violet-500">
          {label}
        </h3>
        {pathname && (
          <Link
            href={
              name === ContactFormSegments.REASON
                ? "/contact"
                : `${pathname.substring(0, pathname.lastIndexOf("/"))}/${name}`
            }
            inNewTab={false}
            replace={true}>
            Edit
          </Link>
        )}
      </div>
      <Divider
        direction={DividerDirections.HORIZONTAL}
        size={DividerSizes.MEDIUM}
      />
      {children}
    </div>
  );
}

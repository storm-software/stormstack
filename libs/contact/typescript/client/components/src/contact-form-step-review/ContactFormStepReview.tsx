"use client";

import { ContactFormSegments } from "@stormstack/contact-client-data-access";
import { Link } from "@stormstack/core-client-components";
import {
  BaseComponentProps,
  Divider,
  DividerDirections,
  DividerSizes,
  LinkVariants
} from "@stormstack/design-system-components";
import clsx from "clsx";
import { usePathname } from "next/navigation";

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
    <div className={clsx("gap-1 flex flex-col", className)}>
      <div className="gap-4 flex flex-row justify-between">
        <h3 className="text-md font-bold text-violet-500 font-label-4">
          {label}
        </h3>
        {pathname && (
          <Link
            variant={LinkVariants.SECONDARY}
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

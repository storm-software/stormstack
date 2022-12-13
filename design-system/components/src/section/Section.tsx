import clsx from "clsx";
import { Heading, HeadingProps } from "../heading";
import { PropsWithBase } from "../types";

export type SectionProps = PropsWithBase<
  {
    /**
     * One or multiple tailwindcss height utility class(es)
     */
    height?: string;

    /**
     * One or multiple tailwindcss width utility class(es)
     */
    width?: string;

    /**
     * The section header string
     */
    header?: string;
  } & Pick<HeadingProps, "level">
>;

/**
 * The base Section component used by the Open System repository
 */
export const Section = ({
  className,
  children,
  height = "min-h-[50rem]",
  width = "max-w-[65rem] md:w-3/4 lg:w-2/3",
  level = 2,
  header,
}: SectionProps) => {
  return (
    <section
      className={clsx(
        "flex w-full snap-center snap-always justify-center",
        className
      )}>
      <div className={clsx(height, width, "flex flex-col gap-1")}>
        {header && (
          <div className="flex">
            <Heading level={level}>{header}</Heading>
          </div>
        )}
        <div className="flex font-body-1 text-body-1">{children}</div>
      </div>
    </section>
  );
};

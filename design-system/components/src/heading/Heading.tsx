/* eslint-disable react/jsx-no-useless-fragment */
import clsx from "clsx";
import { PropsWithBase } from "../types";

export type HeadingProps = PropsWithBase<{
  /**
   * The level of the Heading
   *
   * @example h1, h2, h3, h4, h5, h6
   */
  level: 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * The CSS/Tailwind utility class name to use to color the text
   *
   * @default "text-primary"
   */
  colorClassName?: string;
}>;

/**
 * The base Heading component used by the Open System repository
 */
export const Heading = ({
  className,
  children,
  level = 2,
  colorClassName = "text-primary",
}: HeadingProps) => {
  return (
    <>
      {level === 1 ? (
        <span
          className={clsx(
            "w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_40%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]",
            className
          )}>
          <h1
            className={clsx(
              "text-6xl font-header-1 leading-[3rem] shadow-white text-shadow-lg",
              colorClassName
            )}>
            {children}
          </h1>
        </span>
      ) : level === 2 ? (
        <span
          className={clsx(
            "w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_50%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]",
            className
          )}>
          <h2
            className={clsx(
              "font-header-2 text-6xl leading-[3.5rem] shadow-white text-shadow-lg",
              colorClassName
            )}>
            {children}
          </h2>
        </span>
      ) : level === 3 ? (
        <span
          className={clsx(
            "w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_50%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_5px]",
            className
          )}>
          <h3
            className={clsx(
              "font-header-3 text-4xl leading-[2rem] shadow-white text-shadow-lg",
              colorClassName
            )}>
            {children}
          </h3>
        </span>
      ) : level === 4 ? (
        <h4
          className={clsx(
            "font-header-4 text-3xl leading-[1rem] shadow-white text-shadow-lg",
            className
          )}>
          {children}
        </h4>
      ) : level === 5 ? (
        <h5
          className={clsx(
            "font-header-5 text-xl leading-[1rem] shadow-white text-shadow-lg",
            colorClassName,
            className
          )}>
          {children}
        </h5>
      ) : (
        <h6
          className={clsx(
            "font-header-6 text-2xl font-extrabold shadow-white text-shadow-lg",
            colorClassName,
            className
          )}>
          {children}
        </h6>
      )}
    </>
  );
};

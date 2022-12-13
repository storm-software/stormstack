/* eslint-disable react/jsx-no-useless-fragment */
import clsx from "clsx";
import { PropsWithBase } from "../types";

export type HeadingProps = PropsWithBase<{
  /**
   * The level of the Heading
   *
   * @example h1, h2, h3, h4
   */
  level: 1 | 2 | 3 | 4;
}>;

/**
 * The base Heading component used by the Open System repository
 */
export const Heading = ({ className, children, level = 2 }: HeadingProps) => {
  return (
    <>
      {level === 1 ? (
        <span
          className={clsx(
            "w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_40%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]",
            className
          )}>
          <h1 className="text-6xl font-header-1 leading-[3rem] text-primary shadow-white text-shadow-lg">
            {children}
          </h1>
        </span>
      ) : level === 2 ? (
        <span
          className={clsx(
            "w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_50%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]",
            className
          )}>
          <h2 className="font-header-2 text-6xl leading-[3.5rem] text-primary shadow-white text-shadow-lg">
            {children}
          </h2>
        </span>
      ) : level === 3 ? (
        <span
          className={clsx(
            "w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_50%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_5px]",
            className
          )}>
          <h3 className="font-header-3 text-4xl leading-[2rem] text-primary shadow-white text-shadow-lg">
            {children}
          </h3>
        </span>
      ) : (
        <h4
          className={clsx(
            "font-header-4 text-2xl leading-[1rem] text-primary shadow-white text-shadow-lg",
            className
          )}>
          {children}
        </h4>
      )}
    </>
  );
};

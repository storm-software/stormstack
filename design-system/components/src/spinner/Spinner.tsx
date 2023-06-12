/* eslint-disable react/jsx-no-useless-fragment */
"use client";

import clsx from "clsx";
import { PropsWithBase } from "../types";
import { SpinnerVariants } from "./Spinner.types";

export type SpinnerProps = PropsWithBase<{
  /**
   * Is the Spinner filled by default
   */
  inverse?: boolean;

  /**
   * The variant style of the spinner
   */
  variant?: SpinnerVariants | string;

  /**
   * Screen reader text
   */
  srText?: string;
}>;

/**
 * A component used to display a loading spinner
 */
export const Spinner = ({
  className,
  variant = SpinnerVariants.PRIMARY,
  inverse = false,
  srText = "Loading...",
  ...props
}: SpinnerProps) => {
  return (
    <div
      role="status"
      className={clsx("pointer-events-none h-6 w-6", className)}>
      {variant === SpinnerVariants.SECONDARY ? (
        <svg
          aria-hidden="true"
          className={clsx(
            "animate-spin-half",
            { "fill-inverse text-transparent": inverse },
            { "fill-primary text-transparent": !inverse },
            className
          )}
          viewBox="0 0 1792 1792">
          <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
        </svg>
      ) : (
        <>
          {variant === SpinnerVariants.TERTIARY ? (
            <div
              className={clsx(
                "animate-spin rounded-full border-b-2 border-t-2 ease-in-out",
                { "border-inverse": inverse },
                { "border-primary": !inverse },
                className
              )}
            />
          ) : (
            <>
              {variant === SpinnerVariants.QUARTERNARY ? (
                <svg
                  className={clsx(
                    "animate-spin-fast",
                    { "fill-primary text-inverse": inverse },
                    { "fill-inverse text-primary": !inverse },
                    className
                  )}
                  viewBox="0 0 63 63">
                      <path d="M63 31.4C63 14 48.9 -6.1633e-07 31.6 -1.37254e-06C14.2 -2.13312e-06 0.199981 14.1 0.19998 31.4C0.19998 48.7 14.3 62.8 31.6 62.8C48.9 62.8 63 48.8 63 31.4ZM13.4 41.1C13.4 31 21.6 22.9 31.6 22.9C41.6 22.9 49.8 31.1 49.8 41.1C49.8 51.2 41.6 59.3 31.6 59.3C21.6 59.3 13.4 51.2 13.4 41.1Z" fill="currentColor"></path>
                      <path className={clsx(
                    { "fill-primary text-inverse": !inverse },
                    { "fill-inverse text-primary": inverse },
                  )} d="M63 31.4C63 14 48.9 -6.1633e-07 31.6 -1.37254e-06C14.2 -2.13312e-06 0.199981 14.1 0.19998 31.4C0.19998 48.7 14.3 62.8 31.6 62.8C48.9 62.8 63 48.8 63 31.4ZM13.4 41.1C13.4 31 21.6 22.9 31.6 22.9C41.6 22.9 49.8 31.1 49.8 41.1C49.8 51.2 41.6 59.3 31.6 59.3C21.6 59.3 13.4 51.2 13.4 41.1Z"></path>
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  className={clsx(
                    "animate-spin",
                    { "fill-inverse text-primary": inverse },
                    { "fill-primary text-inverse": !inverse },
                    className
                  )}
                  viewBox="0 0 100 101"
                  fill="none">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              )}
            </>
          )}
        </>
      )}
      <span className="sr-only">{srText}</span>
    </div>
  );
};

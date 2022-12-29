"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Heading } from "../heading";
import { PropsWithBase } from "../types";
import { getSvgFillStyle } from "../utilities/svg-style-utils";
import { ModalVariants } from "./Modal.types";
import {
  getBackgroundStyle,
  getBorderStyle,
  getCloseButtonStyle,
  getDefaultTitle,
  getTextStyle,
} from "./Modal.utils";

export type ModalProps = PropsWithBase<{
  /**
   * The variant style of the modal
   */
  variant?: ModalVariants;

  /**
   * The text title displayed at the top of the modal
   */
  title: string | JSX.Element;

  /**
   * An indicator specifying if the "close icon" is displayed (allowing the user to manually close the message bar)
   */
  showCloseIcon?: boolean;

  /**
   * An event handler called when the "close icon" is clicked by the user
   *
   * @remarks Please note: If no `onClose` prop is provided, the "close icon" will not be displayed
   */
  onClose?: () => void;
}>;

/**
 * The base Modal component used by the Open System repository
 */
export const Modal = ({
  className,
  children,
  title,
  showCloseIcon = true,
  onClose,
  variant = ModalVariants.PRIMARY,
}: ModalProps) => {
  return (
    <div
      className={clsx(
        "relative z-20 h-fit min-h-[30rem] w-fit min-w-[45rem] max-w-[85%] border-4 bg-gradient-to-bl bg-bottom bg-no-repeat p-6 shadow-xl drop-shadow-2xl",
        getTextStyle(variant),
        getBorderStyle(variant),
        getBackgroundStyle(variant),
        className
      )}>
      {showCloseIcon && onClose && (
        <div
          onClick={onClose}
          className={clsx(
            "absolute top-1 right-1 z-30 my-2 mx-2.5 cursor-pointer rounded-full border-2 p-3 font-semibold transition-colors",
            getCloseButtonStyle(variant)
          )}>
          <XMarkIcon className="h-6 w-6 cursor-pointer" />
        </div>
      )}
      <div className="flex h-full flex-col gap-5">
        <div className="flex flex-row items-center gap-5">
          {!title || typeof title === "string" ? (
            <>
              {(variant === ModalVariants.ERROR ||
                variant === ModalVariants.WARNING ||
                variant === ModalVariants.INFO ||
                variant === ModalVariants.SUCCESS) && (
                <div className="pr-xxxs">
                  <span className="inline-block h-fit">
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4035 5.59644 25 12.5 25C19.4035 25 25 19.4035 25 12.5C25 5.59644 19.4035 0 12.5 0ZM13.6364 6.81818C13.6364 6.19059 13.1276 5.68182 12.5 5.68182C11.8724 5.68182 11.3636 6.19059 11.3636 6.81818V13.6364C11.3636 14.264 11.8724 14.7727 12.5 14.7727C13.1276 14.7727 13.6364 14.264 13.6364 13.6364V6.81818ZM13.6364 17.6136C13.6364 16.986 13.1276 16.4773 12.5 16.4773C11.8724 16.4773 11.3636 16.986 11.3636 17.6136V18.1818C11.3636 18.8094 11.8724 19.3182 12.5 19.3182C13.1276 19.3182 13.6364 18.8094 13.6364 18.1818V17.6136Z"
                        className={getSvgFillStyle(
                          variant === ModalVariants.ERROR,
                          variant === ModalVariants.WARNING,
                          variant === ModalVariants.INFO,
                          variant === ModalVariants.SUCCESS
                        )}
                      />
                    </svg>
                  </span>
                </div>
              )}
              <Heading
                level={6}
                className={clsx("whitespace-nowrap text-4xl text-primary")}>
                {title ? title : getDefaultTitle(variant)}
              </Heading>
            </>
          ) : (
            title
          )}
        </div>
        {typeof children === "string" ? (
          <div className="font-body-1 font-bold text-primary">{children}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

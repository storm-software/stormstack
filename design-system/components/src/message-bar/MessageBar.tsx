"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Heading } from "../heading";
import { SuccessIcon } from "../success-icon";
import { PropsWithBase } from "../types";
import { getSvgFillStyle } from "../utilities/svg-style-utils";
import { MessageBarVariants } from "./MessageBar.types";
import {
  getBackgroundStyle,
  getBorderStyle,
  getCloseButtonStyle,
  getDefaultTitle,
  getTextStyle,
} from "./MessageBar.utils";

export type MessageBarProps = PropsWithBase<{
  /**
   * The variant style of the modal
   */
  variant?: MessageBarVariants;

  /**
   * The text message displayed at the top of the modal
   */
  message: string;

  /**
   * The text message displayed in an expandable section of the message bar
   */
  details?: string;

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
 * The base MessageBar component used by the Open System repository
 */
export const MessageBar = ({
  className,
  onClose,
  message,
  details,
  showCloseIcon = true,
  variant = MessageBarVariants.INFO,
}: MessageBarProps) => {
  return (
    <div
      role="alert"
      className="h-fit w-full min-w-fit max-w-[65rem] bg-black/80">
      <div
        className={clsx(
          "relative h-fit w-full min-w-fit border-4",
          getTextStyle(variant),
          getBorderStyle(variant),
          getBackgroundStyle(variant),
          { "p-4": variant !== MessageBarVariants.SUCCESS },
          { "p-2 pr-4": variant === MessageBarVariants.SUCCESS },
          className
        )}>
        <div className="flex h-full flex-row items-center gap-5">
          <span className="inline-block h-fit">
            {variant === MessageBarVariants.SUCCESS ? (
              <SuccessIcon
                className={clsx("h-[4.5rem] w-[4.5rem] fill-success/5")}
              />
            ) : (
              <svg width="45" height="45" viewBox="0 0 25 25" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4035 5.59644 25 12.5 25C19.4035 25 25 19.4035 25 12.5C25 5.59644 19.4035 0 12.5 0ZM13.6364 6.81818C13.6364 6.19059 13.1276 5.68182 12.5 5.68182C11.8724 5.68182 11.3636 6.19059 11.3636 6.81818V13.6364C11.3636 14.264 11.8724 14.7727 12.5 14.7727C13.1276 14.7727 13.6364 14.264 13.6364 13.6364V6.81818ZM13.6364 17.6136C13.6364 16.986 13.1276 16.4773 12.5 16.4773C11.8724 16.4773 11.3636 16.986 11.3636 17.6136V18.1818C11.3636 18.8094 11.8724 19.3182 12.5 19.3182C13.1276 19.3182 13.6364 18.8094 13.6364 18.1818V17.6136Z"
                  className={getSvgFillStyle(
                    variant === MessageBarVariants.ERROR,
                    variant === MessageBarVariants.WARNING,
                    variant === MessageBarVariants.INFO,
                    false
                  )}
                />
              </svg>
            )}
          </span>
          <div className="flex h-full flex-1 flex-row items-center">
            <div className="flex h-fit flex-row items-center gap-2 leading-none">
              <Heading
                level={6}
                className={clsx(getTextStyle(variant), "text-2xl")}>
                {`${getDefaultTitle(variant)}:`}
              </Heading>
              <p className="flex-1 font-header-6 text-lg font-bold text-primary">
                {message}
              </p>
              {details && <p className="font-body-1 text-body-1">{details}</p>}
            </div>
          </div>
          {showCloseIcon && onClose && (
            <div
              onClick={onClose}
              className={clsx(
                "cursor-pointer rounded-full border-2 p-3 font-semibold transition-colors",
                getCloseButtonStyle(variant)
              )}>
              <XMarkIcon className="h-6 w-6 cursor-pointer" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

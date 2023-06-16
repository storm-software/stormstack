"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import "../../styles/components.css";
import { Heading } from "../heading";
import { SuccessIcon } from "../success-icon";
import { PropsWithBase } from "../types";
import { getSvgFillStyle } from "../utilities/svg-style-utils";
import { NotificationVariants } from "./Notification.types";
import {
  getBackgroundStyle,
  getBorderStyle,
  getCloseButtonStyle,
  getDefaultTitle,
  getTextStyle,
} from "./Notification.utils";

export type NotificationProps = PropsWithBase<{
  /**
   * The variant style of the modal
   */
  variant?: NotificationVariants;

  /**
   * The title text displayed above the content section
   */
  title?: string | JSX.Element;

  /**
   * The text message or node content displayed in the middle of the Notification
   */
  body: string | JSX.Element;

  /**
   * React nodes that are displayed towards the bottom of the Notification.
   *
   * @remarks This section usually displays some kind of action button or link
   */
  actions?: JSX.Element;

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
 * The base Notification component used by the Open System repository
 */
export const Notification = ({
  className,
  onClose,
  title,
  body,
  actions,
  showCloseIcon = true,
  variant = NotificationVariants.INFO,
}: NotificationProps) => {
  return (
    <div
      role="alert"
      className="h-30 relative min-h-fit w-96 rounded-md bg-bg-1">
      <div
        className={clsx(
          "relative h-full w-full rounded-md border-b-[1px] border-l-[10px] border-r-[1px] border-t-[1px] border-b-slate-600 border-r-slate-600 border-t-slate-600",
          getTextStyle(variant),
          getBorderStyle(variant),
          getBackgroundStyle(variant),
          { "p-4": variant !== NotificationVariants.SUCCESS },
          { "p-2 pr-4": variant === NotificationVariants.SUCCESS },
          className
        )}>
        <div className="flex h-full flex-row items-start gap-3">
          <span className="inline-block h-fit">
            {variant === NotificationVariants.SUCCESS ? (
              <SuccessIcon
                className={clsx("h-[3rem] w-[3rem] fill-success/5")}
              />
            ) : (
              <svg width="30" height="30" viewBox="0 0 25 25" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4035 5.59644 25 12.5 25C19.4035 25 25 19.4035 25 12.5C25 5.59644 19.4035 0 12.5 0ZM13.6364 6.81818C13.6364 6.19059 13.1276 5.68182 12.5 5.68182C11.8724 5.68182 11.3636 6.19059 11.3636 6.81818V13.6364C11.3636 14.264 11.8724 14.7727 12.5 14.7727C13.1276 14.7727 13.6364 14.264 13.6364 13.6364V6.81818ZM13.6364 17.6136C13.6364 16.986 13.1276 16.4773 12.5 16.4773C11.8724 16.4773 11.3636 16.986 11.3636 17.6136V18.1818C11.3636 18.8094 11.8724 19.3182 12.5 19.3182C13.1276 19.3182 13.6364 18.8094 13.6364 18.1818V17.6136Z"
                  className={getSvgFillStyle(
                    variant === NotificationVariants.ERROR,
                    variant === NotificationVariants.WARNING,
                    variant === NotificationVariants.INFO,
                    false
                  )}
                />
              </svg>
            )}
          </span>
          <div
            className={clsx(
              "flex h-full flex-1 flex-row items-start pb-3 pr-2",
              { "pt-2.5": variant === NotificationVariants.SUCCESS },
              { "pt-1": variant !== NotificationVariants.SUCCESS }
            )}>
            <div className="flex h-fit flex-col items-start gap-1 leading-none">
              <Heading level={6} className="text-lg font-bold leading-[1.1rem]">
                {title ?? getDefaultTitle(variant)}
              </Heading>
              {body && (
                <>
                  {typeof body === "string" ? (
                    <label className="flex-1 text-lg font-body-1 font-semibold leading-[1.5rem] text-body-1">
                      {body}
                    </label>
                  ) : (
                    body
                  )}
                </>
              )}

              {actions && actions}
            </div>
          </div>
        </div>
        {showCloseIcon && onClose && (
          <div
            onClick={onClose}
            className={clsx(
              "absolute right-2 top-1 cursor-pointer rounded-full p-2 font-black transition-colors",
              getCloseButtonStyle(variant)
            )}>
            <XMarkIcon className="h-6 w-6 cursor-pointer" />
          </div>
        )}
      </div>
    </div>
  );
};

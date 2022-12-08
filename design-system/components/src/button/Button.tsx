"use client";

import clsx from "clsx";
import {
  ButtonHTMLAttributes,
  ForwardedRef,
  forwardRef,
  MouseEvent,
  MouseEventHandler,
  useCallback,
} from "react";
import { PropsWithBase } from "../types";
import {
  ButtonGlowTypes,
  ButtonTransitionDirections,
  ButtonTypes,
  ButtonVariants,
} from "./Button.types";
import {
  getBackgroundColor,
  getDefaultText,
  getTextColor,
} from "./Button.utils";

export type ButtonProps = PropsWithBase<
  {
    /**
     * The variant style of the button
     */
    variant?: ButtonVariants;

    /**
     * The direction the hover animation will start on
     */
    transitionDirection?: ButtonTransitionDirections;

    /**
     * Is the button filled by default
     */
    inverse?: boolean;

    /**
     * Is the button filled by default
     */
    type?: ButtonTypes;

    /**
     * Control how the bright glow around the button is emitted
     *
     * @defaultValue "hover"
     */
    glowType?: ButtonGlowTypes;

    /**
     * Is the button filled when hovered (the hover-text slot will not be used when set to false)
     */
    hoverFill?: boolean;

    /**
     * Text displayed when the button filled when hovered (the hover-text slot will
     * not be used when set to false)
     */
    hoverText?: string;

    /**
     * Event handler for button click event
     */
    onClick?: (event: MouseEvent) => void;

    /**
     * Event handler for button double click event
     */
    onDoubleClick?: (event: MouseEvent) => void;
  } & ButtonHTMLAttributes<HTMLButtonElement>
>;

/**
 * The base Button component used by the Open System repository
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      type = ButtonTypes.BUTTON,
      variant = ButtonVariants.PRIMARY,
      glowType = ButtonGlowTypes.HOVER,
      transitionDirection = ButtonTransitionDirections.RIGHT,
      disabled = false,
      inverse = false,
      hoverFill = true,
      hoverText,
      onClick,
      onDoubleClick,
      ...props
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
      (event: MouseEvent) => {
        if (!disabled) {
          onClick?.(event);
        }
      },
      [disabled, onClick]
    );

    const handleDoubleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
      (event: MouseEvent) => {
        if (!disabled) {
          onDoubleClick?.(event);
        }
      },
      [disabled, onDoubleClick]
    );

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={clsx(
          getBackgroundColor(disabled, variant),
          {
            "active:translate-y-0.5 active:scale-95": !disabled,
          },
          {
            "hover:shadow-active-glow":
              !disabled && glowType !== ButtonGlowTypes.NEVER,
          },
          {
            "shadow-active-glow":
              !disabled && glowType === ButtonGlowTypes.ALWAYS,
          },
          "m-w-bnt-m-w relative overflow-hidden rounded-full p-0.5 transition-shadow duration-300 ease-in-out",
          className
        )}
        {...props}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}>
        <div
          className={clsx(
            getTextColor(disabled, variant),
            "bg-bg-1 font-btn-label-1 text-btn-label-1 rounded-full px-8 py-3"
          )}>
          {inverse && hoverFill
            ? hoverText ?? getDefaultText(type)
            : children ?? getDefaultText(type)}
          <div className="absolute top-0 left-0 h-full w-full overflow-hidden rounded-full bg-transparent p-1.5">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-transparent">
              <div
                className={clsx(
                  {
                    "h-full w-[200%] translate-x-[-50%]":
                      (transitionDirection ===
                        ButtonTransitionDirections.LEFT &&
                        !inverse) ||
                      (transitionDirection ===
                        ButtonTransitionDirections.RIGHT &&
                        inverse),
                  },
                  {
                    "h-full w-[200%]":
                      (transitionDirection ===
                        ButtonTransitionDirections.RIGHT &&
                        !inverse) ||
                      (transitionDirection ===
                        ButtonTransitionDirections.LEFT &&
                        inverse),
                  },
                  {
                    "h-[200%] w-full translate-y-[-50%]":
                      (transitionDirection === ButtonTransitionDirections.TOP &&
                        !inverse) ||
                      (transitionDirection ===
                        ButtonTransitionDirections.BOTTOM &&
                        inverse),
                  },
                  {
                    "h-[200%] w-full":
                      (transitionDirection ===
                        ButtonTransitionDirections.BOTTOM &&
                        !inverse) ||
                      (transitionDirection === ButtonTransitionDirections.TOP &&
                        inverse),
                  },
                  {
                    "hover:translate-x-0":
                      !disabled &&
                      ((transitionDirection ===
                        ButtonTransitionDirections.LEFT &&
                        !inverse) ||
                        (transitionDirection ===
                          ButtonTransitionDirections.RIGHT &&
                          inverse)),
                  },
                  {
                    "hover:translate-x-[-50%]":
                      !disabled &&
                      ((transitionDirection ===
                        ButtonTransitionDirections.RIGHT &&
                        !inverse) ||
                        (transitionDirection ===
                          ButtonTransitionDirections.LEFT &&
                          inverse)),
                  },
                  {
                    "hover:translate-y-0":
                      !disabled &&
                      ((transitionDirection ===
                        ButtonTransitionDirections.TOP &&
                        !inverse) ||
                        (transitionDirection ===
                          ButtonTransitionDirections.BOTTOM &&
                          inverse)),
                  },
                  {
                    "hover:translate-y-[-50%]":
                      !disabled &&
                      ((transitionDirection ===
                        ButtonTransitionDirections.BOTTOM &&
                        !inverse) ||
                        (transitionDirection ===
                          ButtonTransitionDirections.TOP &&
                          inverse)),
                  },
                  "absolute top-0 left-0 bg-transparent transition duration-300 ease-in-out"
                )}>
                {hoverFill && (
                  <div
                    className={clsx(
                      {
                        "flex-row":
                          transitionDirection ===
                          ButtonTransitionDirections.LEFT,
                      },
                      {
                        "flex-row-reverse":
                          transitionDirection ===
                          ButtonTransitionDirections.RIGHT,
                      },
                      {
                        "flex-col":
                          transitionDirection ===
                          ButtonTransitionDirections.TOP,
                      },
                      {
                        "flex-col-reverse":
                          transitionDirection ===
                          ButtonTransitionDirections.BOTTOM,
                      },
                      "flex h-full w-full"
                    )}>
                    <div
                      className={clsx(
                        getBackgroundColor(disabled, variant),
                        {
                          "h-full w-1/2":
                            transitionDirection ===
                              ButtonTransitionDirections.LEFT ||
                            transitionDirection ===
                              ButtonTransitionDirections.RIGHT,
                        },
                        {
                          "h-1/2 w-full":
                            transitionDirection ===
                              ButtonTransitionDirections.TOP ||
                            transitionDirection ===
                              ButtonTransitionDirections.BOTTOM,
                        }
                      )}>
                      <div
                        className={clsx(
                          {
                            "text-primary":
                              variant === ButtonVariants.GRADIENT && !disabled,
                          },
                          {
                            "text-inverse":
                              variant !== ButtonVariants.GRADIENT || disabled,
                          },
                          "font-btn-label-1 text-btn-label-1 flex h-full w-full items-center justify-center text-center"
                        )}>
                        {inverse
                          ? children ?? getDefaultText(type)
                          : getDefaultText(type) ?? hoverText}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  }
);

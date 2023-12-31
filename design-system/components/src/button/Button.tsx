/* eslint-disable react/jsx-no-useless-fragment */
"use client";

import clsx from "clsx";
import {
  ButtonHTMLAttributes,
  ForwardedRef,
  forwardRef,
  MouseEvent,
  MouseEventHandler,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { PropsWithBase } from "../types";
import { useRipple } from "../utilities/use-ripple";
import {
  ButtonCornerRoundingTypes,
  ButtonGlowTypes,
  ButtonTransitionDirections,
  ButtonTypes,
  ButtonVariants,
} from "./Button.types";
import {
  getBackgroundColor,
  getBorderRadius,
  getCursor,
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
     * Is the buttons background transparent
     */
    transparent?: boolean;

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
     * Control how the button's corners are rounded (driven by the {@link https://tailwindcss.com/docs/border-radius Border Radius} CSS property)
     *
     * @defaultValue "partial"
     */
    rounding?: ButtonCornerRoundingTypes;

    /**
     * Control how the bright glow around the button is emitted
     *
     * @defaultValue "hover"
     */
    glowType?: ButtonGlowTypes;

    /**
     * Text displayed when the button filled when hovered (the hover-text slot will
     * not be used when set to false)
     */
    hoverText?: string;

    /**
     * Is padding applied in the button
     */
    noPadding?: boolean;

    /**
     * Event handler for button click event
     */
    onClick?: (event: MouseEvent) => void;

    /**
     * Event handler for button double click event
     */
    onDoubleClick?: (event: MouseEvent) => void;

    /**
     * Event handler for button start event
     */
    onHoverStart?: (event?: MouseEvent) => void;

    /**
     * Event handler for button hover end event
     */
    onHoverEnd?: (event?: MouseEvent) => void;
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
      rounding = ButtonCornerRoundingTypes.PARTIAL,
      glowType = ButtonGlowTypes.HOVER,
      transitionDirection = ButtonTransitionDirections.RIGHT,
      disabled = false,
      inverse = false,
      transparent = false,
      noPadding = false,
      hoverText,
      onClick,
      onDoubleClick,
      onHoverStart,
      onHoverEnd,
      ...props
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const innerRef = useRef<HTMLButtonElement>(null);

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

    const handleHoverStart = useCallback(
      (event?: any) => {
        onHoverStart?.(event);
      },
      [onHoverStart]
    );
    const handleHoverEnd = useCallback(
      (event?: any) => {
        onHoverEnd?.(event);
      },
      [onHoverEnd]
    );

    useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement, []);
    useRipple(innerRef);

    return (
      <button
        ref={innerRef}
        type={type}
        disabled={disabled}
        className={clsx(
          getCursor(disabled),
          getBackgroundColor(disabled, variant),
          getBorderRadius(rounding),
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
          "min-w-bnt-m-w group relative h-[58px] w-fit overflow-hidden overflow-y-hidden p-0.5 transition-shadow duration-300 ease-in-out",
          className,
          "btn"
        )}
        {...props}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}>
        <div
          className={clsx(
            getTextColor(disabled, variant),
            getBorderRadius(rounding),
            { "px-3": noPadding },
            { "px-12": !noPadding },
            "h-full min-w-fit bg-bg-1 py-3 text-btn-label-1 font-btn-label-1"
          )}>
          {inverse
            ? hoverText ?? getDefaultText(type)
            : children ?? getDefaultText(type)}
          <div
            className={clsx(
              getBorderRadius(rounding),
              "absolute left-0 top-0 h-full w-full overflow-hidden bg-transparent p-1.5"
            )}>
            <div
              className={clsx(
                getBorderRadius(rounding, true),
                "relative h-full w-full overflow-hidden"
              )}>
              <div
                className={clsx(
                  {
                    "h-full w-full":
                      transitionDirection === ButtonTransitionDirections.NONE &&
                      inverse,
                  },
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
                    "group-hover:translate-x-0":
                      !disabled &&
                      ((transitionDirection ===
                        ButtonTransitionDirections.LEFT &&
                        !inverse) ||
                        (transitionDirection ===
                          ButtonTransitionDirections.RIGHT &&
                          inverse)),
                  },
                  {
                    "group-hover:translate-x-[-50%]":
                      !disabled &&
                      ((transitionDirection ===
                        ButtonTransitionDirections.RIGHT &&
                        !inverse) ||
                        (transitionDirection ===
                          ButtonTransitionDirections.LEFT &&
                          inverse)),
                  },
                  {
                    "group-hover:translate-y-0":
                      !disabled &&
                      ((transitionDirection ===
                        ButtonTransitionDirections.TOP &&
                        !inverse) ||
                        (transitionDirection ===
                          ButtonTransitionDirections.BOTTOM &&
                          inverse)),
                  },
                  {
                    "group-hover:translate-y-[-50%]":
                      !disabled &&
                      ((transitionDirection ===
                        ButtonTransitionDirections.BOTTOM &&
                        !inverse) ||
                        (transitionDirection ===
                          ButtonTransitionDirections.TOP &&
                          inverse)),
                  },
                  "absolute left-0 top-0 bg-transparent transition duration-700 ease-in-out"
                )}>
                {(transitionDirection !== ButtonTransitionDirections.NONE ||
                  inverse) && (
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
                        },
                        {
                          "w-full":
                            transitionDirection ===
                            ButtonTransitionDirections.NONE,
                        },
                        {
                          "h-full": inverse,
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
                          "flex h-full w-full items-center justify-center text-center text-btn-label-1 font-btn-label-1"
                        )}>
                        {inverse
                          ? children ?? getDefaultText(type)
                          : hoverText ?? children ?? getDefaultText(type)}
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

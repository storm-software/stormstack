import {
  Component,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Prop,
} from "@stencil/core";
import clsx from "clsx";

@Component({
  tag: "os-button",
  styleUrl: "os-button.css",
  shadow: true,
})
export class OsButton {
  /**
   * The variant style of the button
   */
  @Prop() variant: ButtonVariants = ButtonVariants.PRIMARY;

  /**
   * The direction the hover animation will start on
   */
  @Prop() transitionDirection: ButtonTransitionDirections =
    ButtonTransitionDirections.LEFT;

  /**
   * Is the button filled by default
   */
  @Prop() inverse = false;

  /**
   * Is the button filled by default
   */
  @Prop() type: ButtonTypes = ButtonTypes.BUTTON;

  /**
   * Is the button read-only (cannot be clicked by user)
   */
  @Prop() disabled = false;

  /**
   * Event emitted when the user clicks into the button
   */
  @Event({
    eventName: "osClick",
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  click: EventEmitter<MouseEvent>;

  /**
   * Handle a user click event
   */
  @Listen("click")
  onClick(event: MouseEvent) {
    event.stopPropagation();

    if (!this.disabled) {
      this.click?.emit?.(event);
    }
  }

  getBackgroundColor() {
    return this.disabled
      ? "bg-disabled"
      : this.variant === ButtonVariants.GRADIENT
      ? "bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to"
      : this.variant === ButtonVariants.SECONDARY
      ? "bg-secondary"
      : this.variant === ButtonVariants.TERTIARY
      ? "bg-tertiary"
      : "bg-primary";
  }

  getTextColor() {
    return this.disabled
      ? "text-disabled"
      : this.variant === ButtonVariants.GRADIENT
      ? "text-primary"
      : this.variant === ButtonVariants.SECONDARY
      ? "text-secondary"
      : this.variant === ButtonVariants.TERTIARY
      ? "text-tertiary"
      : "text-primary";
  }

  getHoverTextColor() {
    return this.variant === ButtonVariants.GRADIENT
      ? "text-primary"
      : "text-inverse";
  }

  getHoverTransition() {
    return this.transitionDirection === ButtonTransitionDirections.LEFT
      ? "w-[200%] translate-x-[-50%] hover:translate-x-0"
      : "text-inverse";
  }

  getDefaultText() {
    return this.type === ButtonTypes.RESET
      ? "Reset"
      : this.type === ButtonTypes.SUBMIT
      ? "Submit"
      : "View";
  }

  render() {
    return (
      <Host>
        <button
          type={this.type}
          disabled={this.disabled}
          class={clsx(
            this.getBackgroundColor(),
            {
              "hover:shadow-active-glow active:translate-y-0.5 active:scale-95":
                !this.disabled,
            },
            "m-w-bnt-m-w relative overflow-hidden rounded-full p-0.5 shadow-sm transition-shadow duration-300 ease-in-out"
          )}
          onClick={this.onClick}>
          <div
            class={clsx(
              this.getTextColor(),
              "rounded-full bg-bg-1 px-8 py-3 font-btn-label-1  text-btn-label-1"
            )}>
            {this.inverse ? (
              <slot name="hover-text">{this.getDefaultText()}</slot>
            ) : (
              <slot>{this.getDefaultText()}</slot>
            )}
            <div class="absolute top-0 left-0 h-full w-full overflow-hidden rounded-full bg-transparent p-1.5">
              <div class="relative h-full w-full overflow-hidden rounded-full bg-transparent">
                <div
                  class={clsx(
                    {
                      "h-full w-[200%] translate-x-[-50%]":
                        (this.transitionDirection ===
                          ButtonTransitionDirections.LEFT &&
                          !this.inverse) ||
                        (this.transitionDirection ===
                          ButtonTransitionDirections.RIGHT &&
                          this.inverse),
                    },
                    {
                      "h-full w-[200%]":
                        (this.transitionDirection ===
                          ButtonTransitionDirections.RIGHT &&
                          !this.inverse) ||
                        (this.transitionDirection ===
                          ButtonTransitionDirections.LEFT &&
                          this.inverse),
                    },
                    {
                      "h-[200%] w-full translate-y-[-50%]":
                        (this.transitionDirection ===
                          ButtonTransitionDirections.TOP &&
                          !this.inverse) ||
                        (this.transitionDirection ===
                          ButtonTransitionDirections.BOTTOM &&
                          this.inverse),
                    },
                    {
                      "h-[200%] w-full":
                        (this.transitionDirection ===
                          ButtonTransitionDirections.BOTTOM &&
                          !this.inverse) ||
                        (this.transitionDirection ===
                          ButtonTransitionDirections.TOP &&
                          this.inverse),
                    },
                    {
                      "hover:translate-x-0":
                        !this.disabled &&
                        ((this.transitionDirection ===
                          ButtonTransitionDirections.LEFT &&
                          !this.inverse) ||
                          (this.transitionDirection ===
                            ButtonTransitionDirections.RIGHT &&
                            this.inverse)),
                    },
                    {
                      "hover:translate-x-[-50%]":
                        !this.disabled &&
                        ((this.transitionDirection ===
                          ButtonTransitionDirections.RIGHT &&
                          !this.inverse) ||
                          (this.transitionDirection ===
                            ButtonTransitionDirections.LEFT &&
                            this.inverse)),
                    },
                    {
                      "hover:translate-y-0":
                        !this.disabled &&
                        ((this.transitionDirection ===
                          ButtonTransitionDirections.TOP &&
                          !this.inverse) ||
                          (this.transitionDirection ===
                            ButtonTransitionDirections.BOTTOM &&
                            this.inverse)),
                    },
                    {
                      "hover:translate-y-[-50%]":
                        !this.disabled &&
                        ((this.transitionDirection ===
                          ButtonTransitionDirections.BOTTOM &&
                          !this.inverse) ||
                          (this.transitionDirection ===
                            ButtonTransitionDirections.TOP &&
                            this.inverse)),
                    },
                    "absolute top-0 left-0 bg-transparent transition duration-300 ease-in-out"
                  )}>
                  <div
                    class={clsx(
                      {
                        "flex-row":
                          this.transitionDirection ===
                          ButtonTransitionDirections.LEFT,
                      },
                      {
                        "flex-row-reverse":
                          this.transitionDirection ===
                          ButtonTransitionDirections.RIGHT,
                      },
                      {
                        "flex-col":
                          this.transitionDirection ===
                          ButtonTransitionDirections.TOP,
                      },
                      {
                        "flex-col-reverse":
                          this.transitionDirection ===
                          ButtonTransitionDirections.BOTTOM,
                      },
                      "flex h-full w-full"
                    )}>
                    <div
                      class={clsx(
                        this.getBackgroundColor(),
                        {
                          "h-full w-1/2":
                            this.transitionDirection ===
                              ButtonTransitionDirections.LEFT ||
                            this.transitionDirection ===
                              ButtonTransitionDirections.RIGHT,
                        },
                        {
                          "h-1/2 w-full":
                            this.transitionDirection ===
                              ButtonTransitionDirections.TOP ||
                            this.transitionDirection ===
                              ButtonTransitionDirections.BOTTOM,
                        }
                      )}>
                      <div
                        class={clsx(
                          {
                            "text-primary":
                              this.variant === ButtonVariants.GRADIENT &&
                              !this.disabled,
                          },
                          {
                            "text-inverse":
                              this.variant !== ButtonVariants.GRADIENT ||
                              this.disabled,
                          },
                          "flex h-full w-full items-center justify-center text-center font-btn-label-1 text-btn-label-1"
                        )}>
                        {this.inverse ? (
                          <slot>{this.getDefaultText()}</slot>
                        ) : (
                          <slot name="hover-text">{this.getDefaultText()}</slot>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>
      </Host>
    );
  }
}

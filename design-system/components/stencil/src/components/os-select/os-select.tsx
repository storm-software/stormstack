import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from "@stencil/core";
import clsx from "clsx";
import { SelectOption } from "./os-select.types";

@Component({
  tag: "os-select",
  styleUrl: "os-select.css",
  shadow: true,
})
export class OsSelect {
  /**
   * A reference to the input element being rendered
   */
  nativeElement: HTMLSelectElement;

  /**
   * 2. Reference to host HTML element.
   * Inlined decorator
   */
  @Element() element: HTMLElement;

  /**
   * The current error value of the input
   */
  @State() error?: string;

  /**
   * The current warning value of the input
   */
  @State() warning?: string;

  /**
   * The current value of the input
   */
  @State() value?: any;

  /**
   * Show if input is focused
   */
  @State() focused = false;

  /**
   * Show if input is touched
   */
  @State() touched = false;

  /**
   * Apply @Watch() for the component's `touched` member.
   *
   * @param newValue New `touched` value
   * @param oldValue Previous `touched` value
   */
  @Watch("touched")
  watchPropHandler(newValue: boolean, oldValue: boolean) {
    console.log("The old value of activated is: ", oldValue);
    console.log("The new value of activated is: ", newValue);
  }

  /**
   * Type of input
   *  */
  @Prop() options: SelectOption[] = [];

  /**
   * The name of the input field
   */
  @Prop() name: string;

  /**
   * The text label displayed above the input field
   */
  @Prop() label: string;

  /**
   * Decides if input is disabled
   */
  @Prop() disabled = false;

  /**
   * An info message displayed under the input
   */
  @Prop() info?: string;

  /**
   * Placeholder text when the field value is empty
   */
  @Prop() placeholder?: string;

  /**
   * Decides if input field required
   */
  @Prop() required = false;

  /**
   * The minimum allowed input length value of the field
   */
  @Prop() minLength?: number;

  /**
   * The maximum allowed input length value of the field
   */
  @Prop() maxLength?: number;

  /**
   * The minimum input value allowed
   */
  @Prop() min?: number;

  /**
   * The maximum input value allowed
   */
  @Prop() max?: number;

  /**
   * A regular expression pattern, such as [A-Z]+ for one or more uppercase characters
   */
  @Prop() pattern?: string;

  /**
   * Should the border displayed on the left side of the input field remain hidden
   */
  @Prop() noBorder = false;

  /**
   * Event emitted during a value in change the input field
   */
  @Event({
    eventName: "osChange",
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  change: EventEmitter<InputEvent>;

  /**
   * Event emitted during a value in change the input field
   */
  @Event({
    eventName: "osInput",
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  input: EventEmitter<InputEvent>;

  /**
   * Event emitted when the user clicks into the input field
   */
  @Event({
    eventName: "osFocus",
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  focus: EventEmitter<FocusEvent>;

  /**
   * Event emitted when the user clicks out of the input field
   */
  @Event({
    eventName: "osBlur",
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  blur: EventEmitter<FocusEvent>;

  /**
   * Handle a value in change the input field
   */
  @Listen("change")
  onChange(event: InputEvent) {
    event.stopPropagation();
    this.value = (event.target as HTMLInputElement)?.value;
    console.log(event);
    this.change?.emit?.(event);
  }

  /**
   * Handle a value in change the input field
   */
  @Listen("input")
  onInput(event: InputEvent) {
    event.stopPropagation();
    this.value = (event.target as HTMLInputElement)?.value;
    console.log(event);
    this.input?.emit?.(event);
  }

  /**
   * Handle when the user clicks into the input field
   */
  @Listen("focus")
  onFocus(event: FocusEvent) {
    if (!this.touched) {
      this.touched = true;
    }

    this.focused = true;
    this.focus?.emit?.(event);
  }

  /**
   * Handle when the user clicks out of the input field
   */
  @Listen("blur")
  onBlur(event: FocusEvent) {
    this.focused = false;
    this.blur?.emit?.(event);
  }

  /**
   * Input focus method
   */
  @Method()
  async setFocus() {
    this.getNativeElement().focus();
  }

  /**
   * Input error method
   */
  @Method()
  async setError(error: string) {
    this.error = error;
  }

  /**
   * Input warning method
   */
  @Method()
  async setWarning(warning: string) {
    this.warning = warning;
  }

  getNativeElement() {
    return this.nativeElement;
  }

  getTextStyle() {
    return this.error
      ? "text-error"
      : this.warning
      ? "text-warning"
      : this.info
      ? "text-info"
      : this.focused
      ? "text-active"
      : "text-input-label";
  }

  getInputTextStyle() {
    return this.disabled
      ? "text-input-fill"
      : this.value
      ? "text-active"
      : this.getTextStyle();
  }

  getBorderStyle() {
    return this.error
      ? "border-l-error"
      : this.warning
      ? "border-l-warning"
      : this.info
      ? "border-l-info"
      : this.focused
      ? "border-l-active"
      : "border-l-input-label";
  }

  getInputFillColor() {
    return this.disabled ? "bg-disabled-fill" : "bg-input-fill";
  }

  getStrokeStyle() {
    return this.error
      ? "border-error focus:border-error"
      : this.warning
      ? "border-warning focus:border-warning"
      : this.info
      ? "border-info focus:border-info"
      : this.focused
      ? "border-active focus:border-active"
      : this.disabled
      ? "border-disabled focus:border-disabled"
      : "border-input-label focus:border-input-label";
  }

  isBorderDisplayed() {
    return (
      !this.noBorder &&
      (this.error || this.warning || this.info || this.focused)
    );
  }

  getSvgFillStyle() {
    return this.error
      ? "fill-error"
      : this.warning
      ? "fill-warning"
      : this.info
      ? "fill-info"
      : null;
  }

  getInputMessage() {
    return this.error
      ? this.error
      : this.warning
      ? this.warning
      : this.info
      ? this.info
      : null;
  }

  render() {
    return (
      <Host>
        <div
          class={clsx(
            "duration-600 flex h-input-h w-input-w flex-1 flex-row pl-xs pt-xs transition ease-in-out",
            { "border-l-0": this.isBorderDisplayed() },
            { "border-l-4": this.isBorderDisplayed() },
            this.isBorderDisplayed() && this.getBorderStyle()
          )}>
          <div class="flex h-fit w-full flex-col gap-xxs self-start">
            <div class="flex flex-row">
              <div class="flex flex-1 grow flex-row gap-xxxs pl-xxxs">
                <label
                  class={clsx(
                    this.getTextStyle(),
                    "font-label-1 text-label-1 leading-label-1 antialiased"
                  )}
                  htmlFor={this.name}>
                  {this.label}
                </label>
                {this.required && (
                  <label
                    class="font-extrabold text-red-500"
                    htmlFor={this.name}>
                    *
                  </label>
                )}
              </div>
              {this.error ||
                this.warning ||
                (this.info && (
                  <div class="pr-xxxs">
                    <span class="inline-block h-fit animate-bounce">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4035 5.59644 25 12.5 25C19.4035 25 25 19.4035 25 12.5C25 5.59644 19.4035 0 12.5 0ZM13.6364 6.81818C13.6364 6.19059 13.1276 5.68182 12.5 5.68182C11.8724 5.68182 11.3636 6.19059 11.3636 6.81818V13.6364C11.3636 14.264 11.8724 14.7727 12.5 14.7727C13.1276 14.7727 13.6364 14.264 13.6364 13.6364V6.81818ZM13.6364 17.6136C13.6364 16.986 13.1276 16.4773 12.5 16.4773C11.8724 16.4773 11.3636 16.986 11.3636 17.6136V18.1818C11.3636 18.8094 11.8724 19.3182 12.5 19.3182C13.1276 19.3182 13.6364 18.8094 13.6364 18.1818V17.6136Z"
                          class={this.getSvgFillStyle()}
                        />
                      </svg>
                    </span>
                  </div>
                ))}
            </div>

            <div class="relative">
              <select
                id={this.name}
                name={this.name}
                ref={(element: HTMLSelectElement) =>
                  (this.nativeElement = element)
                }
                class={clsx(
                  this.getStrokeStyle(),
                  this.getInputFillColor(),
                  {
                    "ring-1 ring-active ring-offset-0 focus:shadow-active-glow":
                      this.focused,
                  },
                  "flex w-full cursor-pointer rounded-xl font-label-1 leading-label-1 transition-colors focus:ring-0 focus:ring-active focus:ring-offset-0 disabled:bg-disabled-fill",
                  this.getInputTextStyle(),
                  { "border-3": this.disabled },
                  {
                    "border-1 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-active-glow":
                      !this.disabled,
                  }
                )}
                disabled={this.disabled}
                required={this.required}
                aria-invalid={this.error}
                aria-required={this.required}
                aria-disabled={this.disabled}
                onInput={this.onInput}
                onChange={this.onChange}
                onFocus={this.onFocus}
                onBlur={this.onBlur}>
                {this.options?.map((option: SelectOption) => (
                  <option
                    label={option.name}
                    disabled={option.disabled}
                    value={option.value}
                    selected={option.selected}>
                    {option.name}
                  </option>
                ))}
              </select>

              {this.disabled && (
                <div class="absolute top-1/4 right-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_52_274)">
                      <path
                        d="M22.3214 10.9375H20.9821V7.42188C20.9821 3.33008 17.1763 0 12.5 0C7.82366 0 4.01786 3.33008 4.01786 7.42188V10.9375H2.67857C1.19978 10.9375 0 11.9873 0 13.2812V22.6562C0 23.9502 1.19978 25 2.67857 25H22.3214C23.8002 25 25 23.9502 25 22.6562V13.2812C25 11.9873 23.8002 10.9375 22.3214 10.9375ZM16.5179 10.9375H8.48214V7.42188C8.48214 5.4834 10.2846 3.90625 12.5 3.90625C14.7154 3.90625 16.5179 5.4834 16.5179 7.42188V10.9375Z"
                        fill="#989899"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_52_274">
                        <rect width="25" height="25" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              )}
            </div>
            <div class="pl-xxxs">
              <label
                class={clsx(
                  this.getTextStyle(),
                  "flex font-message-1 text-message-1 italic leading-message-1 antialiased"
                )}
                htmlFor={this.name}>
                {this.getInputMessage() ?? " "}
              </label>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

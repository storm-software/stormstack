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

/**
 * An input field used in forms to collect data from users
 */
@Component({
  tag: "os-input",
  styleUrl: "os-input.css",
  shadow: true,
})
export class OsInput {
  /**
   * A reference to the input element being rendered
   */
  nativeElement: HTMLInputElement;

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
  @Prop() type = "text";

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
  change: EventEmitter<CustomEvent<string>>;

  /**
   * Event emitted when the user clicks into the input field
   */
  @Event({
    eventName: "osFocus",
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  focus: EventEmitter<CustomEvent<void>>;

  /**
   * Event emitted when the user clicks out of the input field
   */
  @Event({
    eventName: "osBlur",
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  blur: EventEmitter<CustomEvent<void>>;

  /**
   * Handle a value in change the input field
   */
  @Listen("change")
  handleChange(event: CustomEvent<string>) {
    event.stopPropagation();
    this.value = event.detail;
    console.log(event);
    this.change.emit(event);
  }

  /**
   * Handle when the user clicks into the input field
   */
  @Listen("focus")
  handleFocus(event: CustomEvent<void>) {
    if (!this.touched) {
      this.touched = true;
    }

    this.focused = true;
    this.focus.emit(event);
  }

  /**
   * Handle when the user clicks out of the input field
   */
  @Listen("blur")
  onBlur(event: CustomEvent<void>) {
    this.focused = false;
    this.blur.emit(event);
  }

  /**
   * Input focus method
   */
  @Method()
  async setFocus() {
    this.getNativeElement().focus();
  }

  /**
   * Input select method
   */
  @Method()
  async selectText() {
    this.getNativeElement().select();
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
    return this.value ? "text-active" : this.getTextStyle();
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

  getFillColor() {
    return this.disabled ? "bg-disabled" : "bg-input-fill";
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
      : "border-input-label focus:border-input-label";
  }

  isBorderDisplayed() {
    return (
      !this.noBorder &&
      (this.error || this.warning || this.info || this.focused)
    );
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
            "pl-xs pt-xs w-input-w h-input-h duration-600 flex flex-1 flex-row transition ease-in-out",
            { "border-l-0": this.isBorderDisplayed() },
            { "border-l-4": this.isBorderDisplayed() },
            this.isBorderDisplayed() && this.getBorderStyle()
          )}>
          <div
            class={clsx(
              { "pl-5": !this.isBorderDisplayed() },
              "gap-xxs flex h-fit w-full flex-col self-start"
            )}>
            <label
              class={clsx(
                this.getTextStyle(),
                "font-label-1 text-label-1 leading-label-1 flex antialiased"
              )}
              htmlFor={this.name}>
              {this.label}
            </label>
            <input
              id={this.name}
              name={this.name}
              ref={(element: HTMLInputElement) =>
                (this.nativeElement = element)
              }
              class={clsx(
                this.getStrokeStyle(),
                this.getFillColor(),
                {
                  "focus:shadow-active-glow ring-1 ring-active ring-offset-0 transition-shadow duration-[3500] ease-in-out":
                    this.focused,
                },
                "font-label-1 text-label-1 leading-label-1 border-1 flex rounded-xl transition-colors focus:ring-0 focus:ring-active focus:ring-offset-0",
                this.getInputTextStyle()
              )}
              type={this.type}
              placeholder={this.placeholder}
              disabled={this.disabled}
              required={this.required}
              min={this.min}
              max={this.max}
              minLength={this.minLength}
              maxLength={this.maxLength}
              pattern={this.pattern}
              aria-role="textbox"
              aria-invalid={this.error}
              aria-required={this.required}
              aria-disabled={this.disabled}></input>
            <label
              class={clsx(
                this.getTextStyle(),
                "font-message-1 text-message-1 leading-message-1 flex italic antialiased"
              )}
              htmlFor={this.name}>
              {this.getInputMessage() ?? " "}
            </label>
          </div>
        </div>
      </Host>
    );
  }
}

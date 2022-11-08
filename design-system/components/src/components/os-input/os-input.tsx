import {
  Component,
  Event,
  EventEmitter,
  h,
  Host,
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
   * Input focus method
   */
  @Method()
  async setFocus() {
    this.getRef().focus();
  }

  /**
   * Input select method
   */
  @Method()
  async selectText() {
    this.getRef().select();
  }

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
   * Handle a value in change the input field
   */
  handleChange(event: CustomEvent<string>) {
    event.stopPropagation();
    this.value = event.detail;

    this.change.emit(event);
  }

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
   * Handle when the user clicks into the input field
   */
  handleFocus(event: CustomEvent<void>) {
    if (!this.touched) {
      this.touched = true;
    }

    this.focused = true;
    this.focus.emit(event);
  }

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
   * Handle when the user clicks out of the input field
   */
  handleBlur(event: CustomEvent<void>) {
    this.focused = false;
    this.blur.emit(event);
  }

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
   * A reference to the input element being rendered
   */
  ref: HTMLInputElement;

  getRef() {
    return this.ref;
  }

  render() {
    return (
      <Host>
        <div class="gap-xxxs flex w-80 flex-col">
          <label
            class={clsx(
              { "text-error": this.error },
              { "text-warning": this.warning && !this.error },
              { "text-info": this.info && !this.error && !this.warning },
              { "text-info": this.info && !this.error && !this.warning },
              { "text-info": this.info && !this.error && !this.warning },
              "fontFamily-body-1 fontWeight-body-1 fontSize-body-1 lineHeight-body-1"
            )}
            htmlFor={this.name}>
            {this.label}
          </label>
          <input
            id={this.name}
            name={this.name}
            ref={(element: HTMLInputElement) => (this.ref = element)}
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
            aria-disabled={this.disabled}
            onChange={this.handleChange}></input>
        </div>
      </Host>
    );
  }
}

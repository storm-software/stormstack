import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Method,
  Prop,
  State,
} from "@stencil/core";

@Component({
  tag: "os-number-input",
  styleUrl: "os-number-input.css",
  shadow: true,
})
export class OsNumberInput {
  /**
   * A reference to the input element being rendered
   */
  innerElement: HTMLOsInputElement;

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
  @State() value?: number;

  /**
   * Show if input is focused
   */
  @State() focused = false;

  /**
   * Show if input is touched
   */
  @State() touched = false;

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
   * Decides if input field required
   */
  @Prop() required = false;

  /**
   * The minimum input value allowed
   */
  @Prop() min?: number;

  /**
   * The maximum input value allowed
   */
  @Prop() max?: number;

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

    this.value = this.getNumberValue((event.target as HTMLInputElement)?.value);

    this.change?.emit?.(event);
  }

  /**
   * Handle a value in change the input field
   */
  @Listen("input")
  onInput(event: InputEvent) {
    event.stopPropagation();

    this.value = this.getNumberValue((event.target as HTMLInputElement)?.value);

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
    this.getInnerElement().setFocus();
  }

  /**
   * Input select method
   */
  @Method()
  async selectText() {
    this.getInnerElement().selectText();
  }

  /**
   * Input error method
   */
  @Method()
  async setError(error: string) {
    this.getInnerElement().setError(error);
  }

  /**
   * Input warning method
   */
  @Method()
  async setWarning(warning: string) {
    this.getInnerElement().setWarning(warning);
  }

  getInnerElement() {
    return this.innerElement;
  }

  getNumberValue(value?: string | number | null) {
    if (typeof value === "string" && value.length > 0) {
      return Number.isNaN(value) ? 0 : Number.parseFloat(value);
    } else if (typeof value === "number") {
      return value;
    }
  }

  render() {
    return (
      <os-input
        type="number"
        ref={(element: HTMLOsInputElement) => (this.innerElement = element)}
        name={this.name}
        label={this.label}
        max={this.max}
        min={this.min}
        disabled={this.disabled}
        info={this.info}
        required={this.required}
        noBorder={this.noBorder}></os-input>
    );
  }
}

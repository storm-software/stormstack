import {
  Component,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
} from "@stencil/core";
import { nanoid } from "nanoid";

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
   * The id prop of the inner input field
   */
  @Prop() inputId: string = nanoid(10);

  /**
   * The text label displayed above the input field
   */
  @Prop() label: string;

  /**
   * Show if input is touched
   */
  @Prop() touched = false;

  /**
   * Decides if input is disabled
   */
  @Prop() disabled = false;

  /**
   * Decides if input has an error
   */
  @Prop() error = false;

  /**
   * Decides if input has an error
   */
  @Prop() warning = false;

  /**
   * Decides if input field required
   */
  @Prop() required = false;

  /**
   * The current value of the input
   */
  @State() value?: string;

  /** Input focus method */
  @Method()
  async setFocus() {
    this.getNativeInput().focus();
  }
  /** Input select method */
  @Method()
  async selectText() {
    this.getNativeInput().select();
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
   * A reference to the input element being rendered
   */
  nativeInput: HTMLInputElement;

  getNativeInput() {
    return this.nativeInput;
  }

  render() {
    return (
      <Host class="col gap-xxxs flex">
        <label htmlFor={this.name}>{this.label}</label>
        <input
          id={this.inputId}
          ref={el => (this.nativeInput = el)}
          type={"text"}
          name={this.name}
          required={this.required}
          onChange={this.handleChange}></input>
      </Host>
    );
  }
}

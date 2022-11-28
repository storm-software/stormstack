import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: "os-checkbox",
  styleUrl: "os-checkbox.css",
  shadow: true,
})
export class OsCheckbox {
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
   * Should the border displayed on the left side of the input field remain hidden
   */
  @Prop() noBorder = false;

  render() {
    return (
      <os-input
        type="checkbox"
        name={this.name}
        label={this.label}
        disabled={this.disabled}
        info={this.info}
        required={this.required}
        noBorder={this.noBorder}></os-input>
    );
  }
}

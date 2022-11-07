import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: "os-input",
  styleUrl: "os-input.css",
  shadow: true,
})
export class OsInput {
  /**
   * The name of the input field
   */
  @Prop() name: string;

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

  render() {
    return (
      <div>
        <label htmlFor={this.name}>{this.label} + Extra</label>
        <input name={this.name}></input>
      </div>
    );
  }
}

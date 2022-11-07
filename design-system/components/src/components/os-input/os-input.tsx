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

  render() {
    return (
      <div>
        <label htmlFor={this.name}>{this.label} + Extra</label>
        <input name={this.name}></input>
      </div>
    );
  }
}

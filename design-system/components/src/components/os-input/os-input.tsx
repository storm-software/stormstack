import { Component, h, Prop } from "@stencil/core";
import { format } from "../../utils/utils";

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
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  private getText(): string {
    return format(this.first, this.middle, this.last);
  }

  render() {
    return (
      <div>
        <label htmlFor={this.name}>{this.label}</label>
        <input name={this.name}>Hello, World! I'm {this.getText()}</input>
      </div>
    );
  }
}

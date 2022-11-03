import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: "os-button",
  styleUrl: "os-button.css",
  shadow: true,
})
export class OsButton {
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
    return (
      (this.first || "") +
      (this.middle ? ` ${this.middle}` : "") +
      (this.last ? ` ${this.last}` : "")
    );
  }

  render() {
    return <div>Hello, World! I'm {this.getText()}</div>;
  }
}

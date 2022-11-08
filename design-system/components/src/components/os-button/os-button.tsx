import { Component, h, Host, Prop } from "@stencil/core";

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

  render() {
    return (
      <Host>
        <button class="text-teal-400">Don't Press Me</button>
      </Host>
    );
  }
}

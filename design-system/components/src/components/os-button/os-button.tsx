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
        <span class="inline-block animate-bounce rounded-full bg-teal-400 p-4 text-sm text-white">
          animate-bounce
          <svg
            class="mx-auto h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
            />
          </svg>
        </span>
      </Host>
    );
  }
}

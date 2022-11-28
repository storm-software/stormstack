import { Component, h, Host, Prop } from "@stencil/core";

@Component({
  tag: "os-title",
  styleUrl: "os-title.css",
  shadow: true,
})
export class OsTitle {
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
        <div class="group flex flex-col items-center">
          <div class="flex flex-row">
            <h1 class="first-name gap-1.5 font-title-1 text-header-1 transition duration-500 group-hover:text-secondary">
              patrick
            </h1>
            <div class="last-name grid grid-cols-1">
              <h1
                id="last-name-1"
                class="col-start-1 row-start-1 font-title-2 text-header-1 uppercase leading-none transition duration-500 group-hover:text-secondary">
                Sullivan
              </h1>
              <h1
                id="last-name-2"
                class="col-start-1 row-start-1 font-title-2 text-header-1 uppercase leading-none transition duration-500 group-hover:text-secondary">
                Sullivan
              </h1>
              <h1
                id="last-name-3"
                class="col-start-1 row-start-1 font-title-2 text-header-1 uppercase leading-none transition duration-500 group-hover:text-secondary">
                Sullivan
              </h1>
            </div>
          </div>
          <h1 class="development font-header-1 text-header-1 leading-none transition duration-500 group-hover:text-secondary">
            development
          </h1>
        </div>
      </Host>
    );
  }
}

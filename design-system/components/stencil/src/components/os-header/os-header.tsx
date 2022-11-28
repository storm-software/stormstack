import { Component, h, Host, Prop, State } from "@stencil/core";

@Component({
  tag: "os-header",
  styleUrl: "os-header.css",
  shadow: true,
})
export class OsHeader {
  /**
   * Show if input is isInitialized
   */
  @State() isInitialized = false;

  /**
   * The level of the header
   *
   * @example h1, h2, h3, h4, h5, h6, etc.
   */
  @Prop() level: number = 2;

  componentDidLoad() {
    this.isInitialized = true;
  }

  render() {
    return (
      <Host>
        {this.level === 1 ? (
          <span class="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_40%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]">
            <h1 class="text-shadow-lg font-header-1 text-6xl leading-[3rem] text-primary shadow-white">
              {this.isInitialized && <slot />}
            </h1>
          </span>
        ) : this.level === 2 ? (
          <span class="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_50%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]">
            <h2 class="text-shadow-lg font-header-2 text-6xl leading-[3.5rem] text-primary shadow-white">
              {this.isInitialized && <slot />}
            </h2>
          </span>
        ) : this.level === 3 ? (
          <span class="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_50%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_5px]">
            <h3 class="text-shadow-lg font-header-3 text-4xl leading-[2rem] text-primary shadow-white">
              {this.isInitialized && <slot />}
            </h3>
          </span>
        ) : (
          <h4 class="text-shadow-lg font-header-4 text-2xl leading-[1rem] text-primary shadow-white">
            {this.isInitialized && <slot />}
          </h4>
        )}
      </Host>
    );
  }
}

import { Component, h, Host, Prop } from "@stencil/core";
import clsx from "clsx";

@Component({
  tag: "os-section",
  styleUrl: "os-section.css",
  shadow: true,
})
/**
 * The base Section component used by the Open System repository
 */
export class OsSection {
  /**
   * One or multiple tailwindcss height utility class(es)
   */
  @Prop() height?: string = "min-h-[50rem]";

  /**
   * One or multiple tailwindcss width utility class(es)
   */
  @Prop() width?: string = "max-w-[65rem] md:w-3/4 lg:w-2/3";

  /**
   * The section header string
   */
  @Prop() header?: string;

  render() {
    return (
      <Host>
        <section class="flex w-full snap-center snap-always justify-center">
          <div class={clsx(this.height, this.width, "flex flex-col gap-1")}>
            {this.header && (
              <div class="flex font-header-1 text-3xl text-primary">
                <h3>{this.header}</h3>
              </div>
            )}
            <div class="flex font-body-1 text-body-1">
              <slot />
            </div>
          </div>
        </section>
      </Host>
    );
  }
}

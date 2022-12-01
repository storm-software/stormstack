import { Component, h, Host, Prop } from "@stencil/core";
import clsx from "clsx";

@Component({
  tag: "os-link",
  styleUrl: "os-link.css",
  shadow: true,
})
export class OsLink {
  /**
   * The string label to display inside the link
   */
  @Prop() label: string;

  /**
   * Is the link selected
   */
  @Prop() selected: boolean = false;

  render() {
    return (
      <Host>
        <div class="relative block w-full px-16">
          <div class="relative text-[4.25rem] uppercase leading-tight text-secondary">
            <div class="before:rounded-drawn group relative h-[4.25rem] text-transparent before:absolute before:left-0 before:right-0 before:top-[50%] before:z-[1] before:mt-1 before:block before:h-[8px] before:scale-0 before:bg-primary before:transition-transform before:duration-700 before:ease-[cubic-bezier(.16,1.08,.38,.98)] before:content-[''] hover:before:scale-105">
              <div
                class={clsx(
                  { "text-primary": !this.selected },
                  { "text-tertiary": this.selected },
                  "absolute left-[40%] top-0 block h-[75%] overflow-hidden ease-[cubic-bezier(.16,1.08,.38,.98)] group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:skew-x-12 group-hover:text-secondary group-hover:transition-transform group-hover:duration-300"
                )}>
                <div class="block antialiased">{this.label}</div>
              </div>
              <div
                class={clsx(
                  { "text-primary": !this.selected },
                  { "text-tertiary": this.selected },
                  "absolute left-[40%] top-[62%] block h-[50%] overflow-hidden text-primary ease-[cubic-bezier(.16,1.08,.38,.98)] group-hover:-translate-x-2 group-hover:skew-x-12 group-hover:text-secondary group-hover:transition-transform group-hover:duration-700"
                )}>
                <div class="block -translate-y-[50%] antialiased">
                  {this.label}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

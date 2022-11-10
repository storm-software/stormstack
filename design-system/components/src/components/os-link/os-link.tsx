import { Component, h, Host, Prop } from "@stencil/core";

@Component({
  tag: "os-link",
  styleUrl: "os-link.css",
  shadow: true,
})
export class OsLink {
  /**
   * The first name
   */
  @Prop() text: string;

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
        <div class="relative block w-full justify-center text-center align-middle">
          <div class="relative text-[4.25rem] uppercase leading-tight text-tertiary">
            <div class="group relative h-[4.25rem] text-transparent before:absolute before:-left-[10%] before:-right-[10%] before:top-[50%] before:z-[1] before:mt-1 before:block before:h-[4px] before:scale-0 before:rounded-lg before:bg-primary before:transition-transform before:duration-700 before:ease-[cubic-bezier(.16,1.08,.38,.98)] before:content-[''] hover:before:scale-105">
              <div class="absolute top-0 block h-[75%] overflow-hidden text-primary ease-[cubic-bezier(.16,1.08,.38,.98)] group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:skew-x-12 group-hover:text-tertiary group-hover:transition-transform group-hover:duration-300">
                <div class="block antialiased">{this.text}</div>
              </div>
              <div class="absolute top-[62%] block h-[50%] overflow-hidden text-primary ease-[cubic-bezier(.16,1.08,.38,.98)] group-hover:-translate-x-2 group-hover:skew-x-12 group-hover:text-tertiary group-hover:transition-transform group-hover:duration-700">
                <div class="block -translate-y-[50%] antialiased">
                  {this.text}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

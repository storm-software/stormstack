import { Component, h, Host, Prop } from "@stencil/core";

@Component({
  tag: "os-card",
  styleUrl: "os-card.css",
  shadow: true,
})
export class OsCard {
  /**
   * The first name
   */
  @Prop() header: string;

  /**
   * The last name
   */
  @Prop() summary: string;

  /**
   * The middle name
   */
  @Prop() imageSrc: string;

  render() {
    return (
      <Host>
        <div class="card group relative h-full w-full overflow-hidden">
          <img class="background h-full w-full" src={this.imageSrc} />
          <div class="absolute top-0 left-0 h-full w-full">
            <div class="h-full w-full bg-gradient-to-b from-black p-5">
              <div class="flex translate-y-16 flex-col items-center opacity-100 transition-transform group-hover:translate-y-2">
                <span class="font-header-1 text-2xl text-primary">
                  {this.header}
                </span>
                <span class="font-header-1 text-base text-secondary">
                  {this.summary}
                </span>
                <os-button class="mt-10 opacity-0 transition-opacity duration-500 ease-in group-hover:opacity-100">
                  See More
                </os-button>
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

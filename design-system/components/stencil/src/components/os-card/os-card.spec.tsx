import { newSpecPage } from "@stencil/core/testing";
import { OsCard } from "./os-card";

describe("os-card", () => {
  it("renders", async () => {
    const { root } = await newSpecPage({
      components: [OsCard],
      html: "<os-card></os-card>",
    });
    expect(root).toEqualHtml(`
      <os-card>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </os-card>
    `);
  });

  it("renders with values", async () => {
    const { root } = await newSpecPage({
      components: [OsCard],
      html: `<os-card
      header="Header Text"
      summary="Sub-title Text"
      imageSrc="https://lumiere-a.akamaihd.net/v1/images/sa_pixar_virtualbg_coco_16x9_9ccd7110.jpeg?region=0,0,1920,1080&width=960"
      class="h-10 w-20"
      style={{
        height: "200px",
        width: "400px",
      }}></os-card>`,
    });
    expect(root).toEqualHtml(`
      <os-card
      header="Header Text"
      summary="Sub-title Text"
      imageSrc="https://lumiere-a.akamaihd.net/v1/images/sa_pixar_virtualbg_coco_16x9_9ccd7110.jpeg?region=0,0,1920,1080&width=960"
      class="h-10 w-20"
      style={{
        height: "200px",
        width: "400px",
      }}
      >
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </os-card>
    `);
  });
});

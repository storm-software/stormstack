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
      html: `<os-card first="Stencil" last="'Don't call me a framework' JS"></os-card>`,
    });
    expect(root).toEqualHtml(`
      <os-card first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </os-card>
    `);
  });
});

import { newSpecPage } from "@stencil/core/testing";
import { OsHeader } from "./os-header";

describe("os-header", () => {
  it("renders", async () => {
    const { root } = await newSpecPage({
      components: [OsHeader],
      html: "<os-header></os-header>",
    });
    expect(root).toEqualHtml(`
      <os-header>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </os-header>
    `);
  });

  it("renders with values", async () => {
    const { root } = await newSpecPage({
      components: [OsHeader],
      html: `<os-header first="Stencil" last="'Don't call me a framework' JS"></os-header>`,
    });
    expect(root).toEqualHtml(`
      <os-header first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </os-header>
    `);
  });
});

import { newSpecPage } from "@stencil/core/testing";
import { OsTitle } from "./os-title";

describe("os-title", () => {
  it("renders", async () => {
    const { root } = await newSpecPage({
      components: [OsTitle],
      html: "<os-title></os-title>",
    });
    expect(root).toEqualHtml(`
      <os-title>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </os-title>
    `);
  });

  it("renders with values", async () => {
    const { root } = await newSpecPage({
      components: [OsTitle],
      html: `<os-title first="Stencil" last="'Don't call me a framework' JS"></os-title>`,
    });
    expect(root).toEqualHtml(`
      <os-title first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </os-title>
    `);
  });
});

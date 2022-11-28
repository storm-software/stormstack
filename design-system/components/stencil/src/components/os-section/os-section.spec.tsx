import { newSpecPage } from "@stencil/core/testing";
import { OsSection } from "./os-section";

describe("os-section", () => {
  it("renders", async () => {
    const { root } = await newSpecPage({
      components: [OsSection],
      html: "<os-section></os-section>",
    });
    expect(root).toEqualHtml(`
      <os-section>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </os-section>
    `);
  });

  it("renders with values", async () => {
    const { root } = await newSpecPage({
      components: [OsSection],
      html: `<os-section first="Stencil" last="'Don't call me a framework' JS"></os-section>`,
    });
    expect(root).toEqualHtml(`
      <os-section first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </os-section>
    `);
  });
});

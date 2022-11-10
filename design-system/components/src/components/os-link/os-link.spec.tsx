import { newSpecPage } from "@stencil/core/testing";
import { OsLink } from "./os-link";

describe("os-link", () => {
  it("renders", async () => {
    const { root } = await newSpecPage({
      components: [OsLink],
      html: "<os-link></os-link>",
    });
    expect(root).toEqualHtml(`
      <os-link>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </os-link>
    `);
  });

  it("renders with values", async () => {
    const { root } = await newSpecPage({
      components: [OsLink],
      html: `<os-link first="Stencil" last="'Don't call me a framework' JS"></os-link>`,
    });
    expect(root).toEqualHtml(`
      <os-link first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </os-link>
    `);
  });
});

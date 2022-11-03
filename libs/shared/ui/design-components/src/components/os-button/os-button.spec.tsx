import { newSpecPage } from "@stencil/core/testing";
import { OsButton } from "./os-button";

describe("os-button", () => {
  it("renders", async () => {
    const { root } = await newSpecPage({
      components: [OsButton],
      html: "<os-button></os-button>",
    });
    expect(root).toEqualHtml(`
      <os-button>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </os-button>
    `);
  });

  it("renders with values", async () => {
    const { root } = await newSpecPage({
      components: [OsButton],
      html: `<os-button first="Stencil" last="'Don't call me a framework' JS"></os-button>`,
    });
    expect(root).toEqualHtml(`
      <os-button first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </os-button>
    `);
  });
});

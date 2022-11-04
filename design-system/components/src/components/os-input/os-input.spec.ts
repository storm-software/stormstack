import { newSpecPage } from "@stencil/core/testing";
import { MyComponent } from "./os-input";

describe("os-input", () => {
  it("renders", async () => {
    const { root } = await newSpecPage({
      components: [MyComponent],
      html: "<os-input></os-input>",
    });
    expect(root).toEqualHtml(`
      <os-input>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </os-input>
    `);
  });

  it("renders with values", async () => {
    const { root } = await newSpecPage({
      components: [MyComponent],
      html: `<os-input first="Stencil" last="'Don't call me a framework' JS"></os-input>`,
    });
    expect(root).toEqualHtml(`
      <os-input first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </os-input>
    `);
  });
});


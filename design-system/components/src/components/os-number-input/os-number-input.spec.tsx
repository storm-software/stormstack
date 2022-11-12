import { newSpecPage } from "@stencil/core/testing";
import { OsNumberInput } from "./os-number-input";

describe("os-number-input", () => {
  it("renders", async () => {
    const { root } = await newSpecPage({
      components: [OsNumberInput],
      html: "<os-number-input></os-number-input>",
    });
    expect(root).toEqualHtml(`
      <os-number-input>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </os-number-input>
    `);
  });

  it("renders with values", async () => {
    const { root } = await newSpecPage({
      components: [OsNumberInput],
      html: `<os-number-input first="Stencil" last="'Don't call me a framework' JS"></os-number-input>`,
    });
    expect(root).toEqualHtml(`
      <os-number-input first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </os-number-input>
    `);
  });
});
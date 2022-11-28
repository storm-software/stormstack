import { newSpecPage } from "@stencil/core/testing";
import { OsSelect } from "./os-select";

describe("os-select", () => {
  it("renders", async () => {
    const { root } = await newSpecPage({
      components: [OsSelect],
      html: "<os-select></os-select>",
    });
    expect(root).toEqualHtml(`
      <os-select>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </os-select>
    `);
  });

  it("renders with values", async () => {
    const { root } = await newSpecPage({
      components: [OsSelect],
      html: `<os-select label="Sample Label" name="sample"></os-select>`,
    });
    expect(root).toEqualHtml(`
      <os-select label="Sample Label" name="sample">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </os-select>
    `);
  });
});

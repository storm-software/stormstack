import { render } from "@testing-library/react";

import { SideTitle } from "./SideTitle";

describe("SideTitle", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<SideTitle />);
    expect(baseElement).toBeTruthy();
  });
});

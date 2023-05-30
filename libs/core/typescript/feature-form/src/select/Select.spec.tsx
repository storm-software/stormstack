/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { Select } from "./Select";

describe("Select", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Select name="Test" />);
    expect(baseElement).toBeTruthy();
  });
});

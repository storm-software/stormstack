/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { Input } from "./Input";

describe("Input", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Input name="Test" />);
    expect(baseElement).toBeTruthy();
  });
});

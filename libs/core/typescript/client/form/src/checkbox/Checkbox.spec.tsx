/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Checkbox name="Test" />);
    expect(baseElement).toBeTruthy();
  });
});

/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { Radio } from "./Radio";

describe("Radio", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Radio name="Test" />);
    expect(baseElement).toBeTruthy();
  });
});

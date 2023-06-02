/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { FirstNameInput } from "./FirstNameInput";

describe("FirstNameInput", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<FirstNameInput name="Test" />);
    expect(baseElement).toBeTruthy();
  });
});

/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { LastNameInput } from "./LastNameInput";

describe("LastNameInput", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<LastNameInput name="Test" />);
    expect(baseElement).toBeTruthy();
  });
});

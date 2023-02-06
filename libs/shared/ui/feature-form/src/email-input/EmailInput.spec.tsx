/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { EmailInput } from "./EmailInput";

describe("EmailInput", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<EmailInput name="Test" />);
    expect(baseElement).toBeTruthy();
  });
});

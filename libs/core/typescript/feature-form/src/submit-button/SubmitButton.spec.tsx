/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { SubmitButton } from "./SubmitButton";

describe("SubmitButton", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<SubmitButton />);
    expect(baseElement).toBeTruthy();
  });
});

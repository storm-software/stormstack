/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { PhoneNumberInput } from "./PhoneNumberInput";

describe("PhoneNumberInput", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PhoneNumberInput name="Test" />);
    expect(baseElement).toBeTruthy();
  });
});

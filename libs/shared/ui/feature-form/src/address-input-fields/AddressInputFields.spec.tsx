/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { AddressInputFields } from "./AddressInputFields";

describe("AddressInputFields", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AddressInputFields />);
    expect(baseElement).toBeTruthy();
  });
});

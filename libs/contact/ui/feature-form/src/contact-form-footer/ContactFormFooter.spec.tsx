import { render } from "@testing-library/react";

import { ContactFormFooter } from "./ContactFormFooter";

describe("ContactFormFooter", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ContactFormFooter />);
    expect(baseElement).toBeTruthy();
  });
});

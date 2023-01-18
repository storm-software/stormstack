import { render } from "@testing-library/react";

import { FooterForm } from "./FooterForm";

describe("FooterForm", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<FooterForm />);
    expect(baseElement).toBeTruthy();
  });
});

import { render } from "@testing-library/react";

import { ContactFooterForm } from "./ContactFooterForm";

describe("ContactFooterForm", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ContactFooterForm />);
    expect(baseElement).toBeTruthy();
  });
});

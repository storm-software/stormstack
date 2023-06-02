import { render } from "@testing-library/react";

import { ContactBusinessDetailsForm } from "./ContactBusinessDetailsForm";

describe("ContactBusinessDetailsForm", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ContactBusinessDetailsForm />);
    expect(baseElement).toBeTruthy();
  });
});

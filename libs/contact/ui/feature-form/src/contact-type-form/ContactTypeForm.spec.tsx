import { render } from "@testing-library/react";

import { ContactTypeForm } from "./ContactTypeForm";

describe("ContactTypeForm", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ContactTypeForm />);
    expect(baseElement).toBeTruthy();
  });
});
